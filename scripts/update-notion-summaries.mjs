/**
 * Fills empty Summary fields in the Notion reading-list database.
 * Fetches descriptions from Open Library and trims to ~300 characters.
 *
 * Requires NOTION_TOKEN and NOTION_DATABASE_ID (.env.local).
 *
 *   npm run update-notion-summaries
 *   npm run update-notion-summaries -- --dry-run
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SUMMARY_MAX = 320;
const SUMMARY_PROPERTY = "Summary";

function loadEnvLocal() {
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
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
  if (prop.type === "title") return prop.title.map((t) => t.plain_text).join("");
  if (prop.type === "rich_text") return prop.rich_text.map((t) => t.plain_text).join("");
  return "";
}

function trimSummary(raw) {
  let s = raw.replace(/\s+/g, " ").trim();
  if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).trim();
  if (s.length <= SUMMARY_MAX) return s;
  const cut = s.slice(0, SUMMARY_MAX);
  const lastPeriod = cut.lastIndexOf(". ");
  if (lastPeriod > SUMMARY_MAX * 0.55) return cut.slice(0, lastPeriod + 1).trim();
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

async function openLibraryDescription(title, author) {
  const q = new URLSearchParams({ title, limit: "8" });
  if (author) q.set("author", author);
  const search = await fetch(`https://openlibrary.org/search.json?${q}`);
  if (!search.ok) return null;
  const data = await search.json();
  for (const doc of data.docs ?? []) {
    if (!doc.key) continue;
    const work = await fetch(`https://openlibrary.org${doc.key}.json`);
    if (!work.ok) continue;
    const w = await work.json();
    let desc = w.description;
    if (typeof desc === "object" && desc?.value) desc = desc.value;
    if (typeof desc === "string" && desc.trim()) return trimSummary(desc);
  }
  return null;
}

/** Hand-tuned when Open Library text is thin or too long-winded. */
const MANUAL_SUMMARIES = {
  "Thinking in Bets":
    "Former poker champion Annie Duke shows how thinking in bets — treating decisions as wagers on uncertain futures — leads to better choices in life and work. Drawing on poker, sports, and business, she offers practical tools for separating skill from luck and getting more comfortable with not knowing.",
};

async function notionFetch(path, options = {}) {
  const token = process.env.NOTION_TOKEN;
  return fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

async function patchSummary(pageId, summary, dryRun) {
  if (dryRun) return true;
  const res = await notionFetch(`/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        [SUMMARY_PROPERTY]: {
          rich_text: [{ type: "text", text: { content: summary } }],
        },
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`  Failed: ${res.status}`, body);
    if (res.status === 403) {
      console.error(
        "  Tip: Grant your Notion integration write access to this database, or run updates via the Notion MCP."
      );
    }
    return false;
  }
  return true;
}

async function main() {
  loadEnvLocal();
  const dryRun = process.argv.includes("--dry-run");
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!token || !dbId) {
    console.error("Set NOTION_TOKEN and NOTION_DATABASE_ID in .env.local");
    process.exit(1);
  }

  const dbRes = await notionFetch(`/databases/${dbId}`);
  const db = await dbRes.json();
  if (!dbRes.ok) {
    console.error("Database error:", db);
    process.exit(1);
  }
  if (!db.properties?.[SUMMARY_PROPERTY]) {
    console.error(`Database has no "${SUMMARY_PROPERTY}" rich_text property.`);
    process.exit(1);
  }

  const qRes = await notionFetch(`/databases/${dbId}/query`, {
    method: "POST",
    body: "{}",
  });
  const data = await qRes.json();
  if (!qRes.ok) {
    console.error("Query error:", data);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const page of data.results ?? []) {
    const p = page.properties;
    const title = text(p.Name ?? p.Title);
    const author = text(p.Author);
    const existing = text(p[SUMMARY_PROPERTY]);

    if (existing.trim()) {
      skipped++;
      continue;
    }

    let summary = MANUAL_SUMMARIES[title] ?? null;
    if (!summary) {
      console.log(`Fetching: ${title} — ${author}`);
      summary = await openLibraryDescription(title, author);
    }

    if (!summary) {
      console.warn(`  No summary found for "${title}"`);
      continue;
    }

    console.log(`${dryRun ? "[dry-run] " : ""}Updating: ${title}`);
    console.log(`  ${summary}\n`);
    if (await patchSummary(page.id, summary, dryRun)) updated++;
  }

  console.log(
    dryRun
      ? `Dry run: would update ${updated} book(s), ${skipped} already had summaries.`
      : `Updated ${updated} book(s), ${skipped} already had summaries.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
