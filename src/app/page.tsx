import { books } from "@/data/books";
import { ReadingStatus } from "@/types/book";
import BookSpine from "@/components/BookSpine";
import StatusFilter from "@/components/StatusFilter";

interface HomeProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_LABELS: Record<ReadingStatus | "all", string> = {
  all: "All Books",
  finished: "Finished",
  reading: "Currently Reading",
  "to-read": "To Read",
};

export default async function Home({ searchParams }: HomeProps) {
  const { status } = await searchParams;
  const activeStatus = (status as ReadingStatus | "all") || "all";

  const filtered =
    activeStatus === "all"
      ? books
      : books.filter((b) => b.status === activeStatus);

  const counts = {
    all: books.length,
    finished: books.filter((b) => b.status === "finished").length,
    reading: books.filter((b) => b.status === "reading").length,
    "to-read": books.filter((b) => b.status === "to-read").length,
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm uppercase tracking-widest text-amber-700 mb-1">
          My Reading List
        </p>
        <h1 className="text-4xl font-bold text-stone-800 mb-2">
          2026 Bookshelf
        </h1>
        <p className="text-stone-500 text-base">
          {counts.finished} finished · {counts.reading} in progress ·{" "}
          {counts["to-read"]} to read
        </p>
      </div>

      {/* Filter */}
      <StatusFilter activeStatus={activeStatus} counts={counts} />

      {/* Bookshelf */}
      <div className="mt-8">
        {/* Shelf label */}
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
          {STATUS_LABELS[activeStatus]} — {filtered.length}{" "}
          {filtered.length === 1 ? "book" : "books"}
        </p>

        {/* Books on shelf */}
        <div className="relative">
          {/* Shelf plank */}
          <div className="flex items-end gap-1 pb-2 flex-wrap">
            {filtered.map((book) => (
              <BookSpine key={book.id} book={book} />
            ))}
          </div>
          {/* Shelf edge */}
          <div className="h-3 bg-gradient-to-b from-amber-800 to-amber-900 rounded-sm shadow-md" />
          <div className="h-1 bg-amber-950 rounded-sm" />
        </div>

        {filtered.length === 0 && (
          <p className="text-stone-400 text-center py-16">
            No books in this category yet.
          </p>
        )}
      </div>
    </main>
  );
}
