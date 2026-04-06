import { getBooks } from "@/lib/notion";
import BookShelfClient from "@/components/BookShelfClient";

export default async function Home() {
  const books = await getBooks();
  const counts = {
    finished: books.filter((b) => b.status === "finished").length,
    reading:  books.filter((b) => b.status === "reading").length,
    "to-read": books.filter((b) => b.status === "to-read").length,
  };

  return (
    <main className="max-w-screen-xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-400 mb-2 font-light">
          My Reading List
        </p>
        <h1 className="text-3xl font-light text-stone-700 mb-2 tracking-wide">
          2026 Bookshelf
        </h1>
        <p className="text-stone-400 text-sm font-light tracking-wide">
          {counts.finished} finished &nbsp;·&nbsp; {counts.reading} in progress &nbsp;·&nbsp;{" "}
          {counts["to-read"]} to read
        </p>
      </div>

      {/* Bookshelf */}
      <div className="mt-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-5 font-light">
          All Books — {books.length} books
        </p>
        <BookShelfClient books={books} />
      </div>
    </main>
  );
}
