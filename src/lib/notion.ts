import { Book, ReadingStatus } from "@/types/book";
import { spineOverrides, DEFAULT_COVER_COLOR } from "@/data/spine-overrides";

import { Vibrant } from "node-vibrant/node";

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
  | { type: "files";     files:     NotionFile[] }
  | { type: "date";      date:      { start: string } | null };

// ─── Helpers ────────────────────────────────────────────────────────────────

function text(prop: NotionProperty | undefined): string {
  if (!prop) return "";
  if (prop.type === "title")     return prop.title[0]?.plain_text     ?? "";
  if (prop.type === "rich_text") return prop.rich_text[0]?.plain_text ?? "";
  return "";
}

function num(prop: NotionProperty | undefined): number {
  if (!prop || prop.type !== "number") return 0;
  return prop.number ?? 0;
}

function select(prop: NotionProperty | undefined): string {
  if (!prop || prop.type !== "select") return "";
  return prop.select?.name ?? "";
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
  const s = raw.toLowerCase();
  if (s.includes("reading"))  return "reading";
  if (s.includes("finish") || s.includes("done") || s.includes("read")) {
    // "Not started" and "to read" fall through to to-read; only "finished"/"done" → finished
    if (s === "finished" || s === "done" || s === "completed") return "finished";
  }
  return "to-read";
}

function pageToBook(page: NotionPage): Book {
  const p = page.properties;
  const title = text(p["Title"] ?? p["Name"]);
  const overrides = spineOverrides[title] ?? {};

  return {
    id:           page.id.replace(/-/g, ""),
    title,
    author:       text(p["Author"]),
    genre:        select(p["Genre"]) || text(p["Genre"]),
    pages:        num(p["Pages"]),
    status:       mapStatus(select(p["Status"])),
    summary:      text(p["Summary"] ?? p["Plot summary"]),
    review:       text(p["Review"]) || undefined,
    rating:       num(p["Rating"]) || undefined,
    startedDate:  dateStr(p["Started Date"] ?? p["StartedDate"]),
    finishedDate: dateStr(p["Finished Date"] ?? p["FinishedDate"]),
    coverImage:   fileUrl(p["Cover"]),
    coverColor:   overrides.coverColor ?? DEFAULT_COVER_COLOR,
    spineHeight:  overrides.spineHeight,
    spineWidth:   overrides.spineWidth,
  };
}

// ─── Color extraction ────────────────────────────────────────────────────────

async function extractDominantColor(imageUrl: string): Promise<string | null> {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();
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

  // Map pages to books, then extract cover colors in parallel.
  // Skip extraction for books with an explicit manual color override.
  const books = pages.map(pageToBook);
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
