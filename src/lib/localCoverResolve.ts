import { existsSync } from "fs";
import { join } from "path";

import type { Book } from "@/types/book";

export const LOCAL_COVER_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

/**
 * Local cover files under `public/covers/`, tried in order per basename:
 * 1. `<notionPageIdNoDashes>.<ext>` (stable if titles change)
 * 2. `<titleSlug>-<authorSlug>.<ext>` — hyphen slug: lowercase, non [a-z0-9] → `-`, max segment lengths
 *    If author is empty: `<titleSlug>.<ext>` only for this second basename.
 * 3. `<compactTitle>_<compactAuthor>.<ext>` — words run together (no hyphens), e.g. `theobstacleistheway_ryanholiday.jpg`
 *    If author is empty: `<compactTitle>.<ext>`
 */
export function compactSlugForCover(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function slugForCoverSegment(s: string, maxLen: number): string {
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

export function localCoverBasenames(
  book: Pick<Book, "id" | "title" | "author">
): string[] {
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

function firstExistingSiteCover(
  basenames: string[],
  cwd: string
): string | null {
  const dir = join(cwd, "public", "covers");
  for (const base of basenames) {
    for (const ext of LOCAL_COVER_EXTENSIONS) {
      const filePath = join(dir, `${base}${ext}`);
      if (existsSync(filePath)) return `/covers/${base}${ext}`;
    }
  }
  return null;
}

export function resolveLocalCoverForBook(
  book: Pick<Book, "id" | "title" | "author">,
  cwd: string = process.cwd()
): string | null {
  return firstExistingSiteCover(localCoverBasenames(book), cwd);
}

/** Id-based basename only (same as first candidate in resolveLocalCoverForBook). */
export function resolveLocalCoverPath(
  pageIdNoDashes: string,
  cwd: string = process.cwd()
): string | null {
  return firstExistingSiteCover([pageIdNoDashes], cwd);
}
