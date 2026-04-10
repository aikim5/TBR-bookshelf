/**
 * Fetches Notion books, resolves local `public/covers/` (page id or title-author slug)
 * then Notion file URL,
 * runs Vibrant, and prints suggested `coverColor` lines for titles that do not already
 * set `coverColor` in `src/data/spine-overrides.ts`. Merge output by hand.
 *
 * Requires NOTION_TOKEN and NOTION_DATABASE_ID (loads `.env.local` if present).
 */
import { existsSync, readFileSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

import { Vibrant } from "node-vibrant/node";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const LOCAL_COVER_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// Keep in sync with src/lib/localCoverResolve.ts (id, hyphen slugs, compact title_author).
function compactSlugForCover(s) {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function slugForCoverSegment(s, maxLen) {
  const slug = s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  const truncated = slug.slice(0, Math.max(1, maxLen)).replace(/-+$/g, "");
  return truncated || "x";
}

function localCoverBasenames(book) {
  const basenames = [book.id];
  const title = book.title.trim();
  if (!title) return basenames;
  const titleSlug = slugForCoverSegment(title, 100);
  const author = book.author.trim();
  if (author) {
    basenames.push(`${titleSlug}-${slugForCoverSegment(author, 60)}`);
  } else {
    basenames.push(titleSlug);
  }

  const compactTitle = compactSlugForCover(book.title);
  const compactAuthor = compactSlugForCover(book.author);
  if (compactTitle) {
    if (compactAuthor) basenames.push(`${compactTitle}_${compactAuthor}`);
    else basenames.push(compactTitle);
  }

  return basenames;
}

function resolveLocalCoverForBook(book) {
  const dir = join(ROOT, "public", "covers");
  for (const base of localCoverBasenames(book)) {
    for (const ext of LOCAL_COVER_EXTENSIONS) {
      const filePath = join(dir, `${base}${ext}`);
      if (existsSync(filePath)) return `/covers/${base}${ext}`;
    }
  }
  return null;
}

function loadEnvLocal() {
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function text(prop) {
  if (!prop) return "";
  if (prop.type === "title") return prop.title[0]?.plain_text ?? "";
  if (prop.type === "rich_text") return prop.rich_text[0]?.plain_text ?? "";
  return "";
}

function fileUrl(prop) {
  if (!prop || prop.type !== "files") return undefined;
  const f = prop.files[0];
  if (!f) return undefined;
  return f.type === "file" ? f.file?.url : f.external?.url;
}

/** Inner `{ ... }` body for `title`'s entry in `spineOverrides`, or null if key absent. */
function getSpineEntryInner(src, title) {
  const escaped = title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const quotedKey = `"${escaped}":`;
  let keyEnd = src.indexOf(quotedKey);
  let afterKey = keyEnd === -1 ? -1 : keyEnd + quotedKey.length;

  if (afterKey === -1 && /^[A-Za-z_]\w*$/.test(title)) {
    const re = new RegExp(`(^|\\n)(\\s*)${title}\\s*:`, "m");
    const m = re.exec(src);
    if (m) afterKey = m.index + m[0].length;
  }
  if (afterKey === -1) return null;

  let pos = afterKey;
  while (pos < src.length && /\s/.test(src[pos])) pos++;
  if (src[pos] !== "{") return null;

  let depth = 0;
  for (let i = pos; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return src.slice(pos + 1, i);
    }
  }
  return null;
}

function hasManualCoverColor(spineSrc, title) {
  const inner = getSpineEntryInner(spineSrc, title);
  if (inner == null) return false;
  return /\bcoverColor\s*:/.test(inner);
}

async function dominantFromSrc(imageSrc) {
  const palette = imageSrc.startsWith("/")
    ? await Vibrant.from(
        await readFile(join(ROOT, "public", imageSrc.replace(/^\//, "")))
      ).getPalette()
    : await Vibrant.from(imageSrc).getPalette();
  const best = Object.values(palette)
    .filter((s) => s != null)
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))[0];
  return best?.hex ?? null;
}

async function main() {
  loadEnvLocal();
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!token || !dbId) {
    console.error("Set NOTION_TOKEN and NOTION_DATABASE_ID (e.g. in .env.local).");
    process.exit(1);
  }

  const spinePath = join(ROOT, "src", "data", "spine-overrides.ts");
  const spineSrc = readFileSync(spinePath, "utf8");

  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  if (!res.ok) {
    console.error("Notion API error:", res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();
  const pages = data.results ?? [];

  const suggestions = [];
  for (const page of pages) {
    const p = page.properties;
    const title = text(p["Title"] ?? p["Name"]);
    if (!title) continue;
    if (hasManualCoverColor(spineSrc, title)) continue;

    const id = page.id.replace(/-/g, "");
    const author = text(p["Author"]);
    const local = resolveLocalCoverForBook({ id, title, author });
    const notionCover = fileUrl(p["Cover"]);
    const imageSrc = local ?? notionCover;
    if (!imageSrc) continue;

    try {
      const hex = await dominantFromSrc(imageSrc);
      if (hex) suggestions.push({ title, hex });
    } catch {
      // skip failed extraction
    }
  }

  suggestions.sort((a, b) => a.title.localeCompare(b.title));

  if (suggestions.length === 0) {
    console.log("No suggested coverColor entries (all have overrides or no cover / extraction failed).");
    return;
  }

  console.log("// Paste into spineOverrides in src/data/spine-overrides.ts (merge with existing keys):\n");
  for (const { title, hex } of suggestions) {
    const key = /^[A-Za-z_]\w*$/.test(title) ? title : JSON.stringify(title);
    console.log(`  ${key}: { coverColor: ${JSON.stringify(hex)} },`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
