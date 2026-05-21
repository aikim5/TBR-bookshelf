import { readFile } from "fs/promises";
import { join } from "path";

import { Book, ReadingStatus } from "@/types/book";
import { spineOverrides, DEFAULT_COVER_COLOR } from "@/data/spine-overrides";
import { resolveLocalCoverForBook } from "@/lib/localCoverResolve";

import { Vibrant } from "node-vibrant/node";

export { resolveLocalCoverPath, resolveLocalCoverForBook } from "@/lib/localCoverResolve";

// ─── Notion API types (minimal) ────────────────────────────────────────────

interface NotionFile {
  type: "file" | "external";
  file?: { url: string };
  external?: { url: string };
}

interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
}

type NotionProperty =
  | { type: "title";     title:     { plain_text: string }[] }
  | { type: "rich_text"; rich_text: { plain_text: string }[] }
  | { type: "number";    number:    number | null }
  | { type: "select";    select:    { name: string } | null }
  | { type: "status";    status:    { name: string } | null }
  | { type: "files";     files:     NotionFile[] }
  | { type: "date";      date:      { start: string } | null };

// ─── Helpers ────────────────────────────────────────────────────────────────

function text(prop: NotionProperty | undefined): string {
  if (!prop) return "";
  if (prop.type === "title") {
    return prop.title.map((t) => t.plain_text).join("");
  }
  if (prop.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

function getProperty(
  properties: Record<string, NotionProperty>,
  ...names: string[]
): NotionProperty | undefined {
  for (const name of names) {
    if (properties[name]) return properties[name];
  }
  const byLower = new Map(
    Object.entries(properties).map(([k, v]) => [k.toLowerCase(), v])
  );
  for (const name of names) {
    const found = byLower.get(name.toLowerCase());
    if (found) return found;
  }
  return undefined;
}

function num(prop: NotionProperty | undefined): number {
  if (!prop || prop.type !== "number") return 0;
  return prop.number ?? 0;
}

function select(prop: NotionProperty | undefined): string {
  if (!prop || prop.type !== "select") return "";
  return prop.select?.name ?? "";
}

function statusName(prop: NotionProperty | undefined): string {
  if (!prop) return "";
  if (prop.type === "status") return prop.status?.name ?? "";
  if (prop.type === "select") return prop.select?.name ?? "";
  return "";
}

function fileUrl(prop: NotionProperty | undefined): string | undefined {
  if (!prop || prop.type !== "files") return undefined;
  const f = prop.files[0];
  if (!f) return undefined;
  return f.type === "file" ? f.file?.url : f.external?.url;
}

function dateStr(prop: NotionProperty | undefined): string | undefined {
  if (!prop || prop.type !== "date") return undefined;
  return prop.date?.start ?? undefined;
}

function mapStatus(raw: string): ReadingStatus {
  const s = raw.toLowerCase().trim();
  if (!s) return "to-read";
  if (s.includes("reading")) return "reading";
  if (s === "done" || s === "finished" || s === "completed") return "finished";
  return "to-read";
}

function pageToBook(page: NotionPage): Book {
  const p = page.properties;
  const title = text(getProperty(p, "Title", "Name"));
  const overrides = spineOverrides[title] ?? {};

  return {
    id:           page.id.replace(/-/g, ""),
    title,
    author:       text(getProperty(p, "Author")),
    genre:        select(getProperty(p, "Genre")) || text(getProperty(p, "Genre")),
    pages:        num(getProperty(p, "Pages")),
    status:       mapStatus(statusName(getProperty(p, "Status"))),
    summary:      text(
      getProperty(p, "Summary", "Plot summary", "Plot Summary", "Description", "Blurb")
    ),
    review:       text(getProperty(p, "Review")) || undefined,
    rating:       num(getProperty(p, "Rating")) || undefined,
    startedDate:  dateStr(getProperty(p, "Started Date", "StartedDate")),
    finishedDate: dateStr(getProperty(p, "Finished Date", "FinishedDate")),
    coverImage:   fileUrl(getProperty(p, "Cover")),
    coverColor:   overrides.coverColor ?? DEFAULT_COVER_COLOR,
    spineHeight:  overrides.spineHeight,
    spineWidth:   overrides.spineWidth,
  };
}

// ─── Color extraction ────────────────────────────────────────────────────────

async function extractDominantColor(imageSrc: string): Promise<string | null> {
  try {
    const palette = imageSrc.startsWith("/")
      ? await Vibrant.from(
          await readFile(join(process.cwd(), "public", imageSrc.replace(/^\//, "")))
        ).getPalette()
      : await Vibrant.from(imageSrc).getPalette();
    // Pick the swatch with the highest pixel population — this is the color
    // that occupies the most area on the actual cover, giving the closest
    // visual match to what you see on the physical book.
    const best = Object.values(palette)
      .filter((s): s is NonNullable<typeof s> => s != null)
      .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))[0];
    return best?.hex ?? null;
  } catch {
    return null;
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getBooks(): Promise<Book[]> {
  const token = process.env.NOTION_TOKEN;
  const dbId  = process.env.NOTION_DATABASE_ID;

  if (!token || !dbId) {
    console.error("NOTION_TOKEN or NOTION_DATABASE_ID is not set.");
    return [];
  }

  const res = await fetch(
    `https://api.notion.com/v1/databases/${dbId}/query`,
    {
      method: "POST",
      headers: {
        Authorization:  `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      // Notion file URLs expire after ~1 hour; revalidate just before that
      next: { revalidate: 3000 },
    }
  );

  if (!res.ok) {
    console.error("Notion API error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  const pages: NotionPage[] = data.results ?? [];

  // Map pages to books, prefer local `public/covers/` (see localCoverResolve), then extract colors.
  // Skip extraction for books with an explicit manual color override.
  const books = pages.map(pageToBook);
  for (const book of books) {
    const local = resolveLocalCoverForBook(book);
    if (local) book.coverImage = local;
  }
  await Promise.all(
    books.map(async (book) => {
      const hasColorOverride = (spineOverrides[book.title]?.coverColor) != null;
      if (book.coverImage && !hasColorOverride) {
        const extracted = await extractDominantColor(book.coverImage);
        if (extracted) book.coverColor = extracted;
      }
    })
  );

  return books;
}
