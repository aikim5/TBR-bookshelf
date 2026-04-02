import { books } from "@/data/books";
import { ReadingStatus } from "@/types/book";
import BookSpine from "@/components/BookSpine";
import StatusFilter from "@/components/StatusFilter";
import Plant from "@/components/Plant";

interface HomeProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_LABELS: Record<ReadingStatus | "all", string> = {
  all: "All Books",
  finished: "Finished",
  reading: "Currently Reading",
  "to-read": "To Read",
};

function ShelfPlank() {
  return (
    // minWidth keeps the shelf at a fixed size regardless of viewport width
    <div className="relative" style={{ marginTop: "-1px", minWidth: "1000px" }}>
      {/* Plank surface */}
      <div
        className="relative overflow-hidden"
        style={{
          height: "26px",
          minWidth: "1000px",
          borderRadius: "8px 8px 0 0",
          background: "linear-gradient(to bottom, #D4AA74 0%, #C49850 35%, #B08844 70%, #9A7436 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.12) inset",
        }}
      >
        {/* SVG wood grain — fixed 1000 px so grain never stretches or reflows */}
        <svg
          className="absolute inset-0"
          width="1000" height="26"
          viewBox="0 0 1000 26"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            {/* Micro-texture noise */}
            <filter id="wf">
              <feTurbulence type="fractalNoise" baseFrequency="0.04 0.6" numOctaves="3" seed="12" result="n" />
              <feColorMatrix type="saturate" values="0" in="n" result="gn" />
              <feComposite in="gn" in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* Primary grain lines — long, slightly wavy */}
          <path d="M0,3 Q120,2.5 280,3.2 Q440,4 600,3 Q760,2 900,3.4 L1000,3.2"
            fill="none" stroke="rgba(80,45,10,0.22)" strokeWidth="0.6" />
          <path d="M0,5.5 Q200,5 350,6 Q500,7 700,5.5 Q850,4.5 1000,5.8"
            fill="none" stroke="rgba(80,45,10,0.16)" strokeWidth="0.5" />
          <path d="M0,8 Q180,7.5 320,8.5 Q520,9.5 680,8 Q820,7 1000,8.2"
            fill="none" stroke="rgba(255,220,150,0.14)" strokeWidth="0.4" />
          <path d="M0,10.5 Q150,10 300,11 Q500,12 720,10.5 Q880,9.5 1000,10.8"
            fill="none" stroke="rgba(80,45,10,0.20)" strokeWidth="0.7" />
          <path d="M0,13 Q250,12.5 420,13.5 Q580,14.5 740,13 Q900,12 1000,13.2"
            fill="none" stroke="rgba(80,45,10,0.14)" strokeWidth="0.5" />
          <path d="M0,15.5 Q100,15 280,16 Q480,17 650,15.5 Q820,14.5 1000,15.8"
            fill="none" stroke="rgba(255,220,150,0.12)" strokeWidth="0.4" />
          <path d="M0,18 Q200,17.5 380,18.5 Q560,19.5 760,18 Q920,17 1000,18.3"
            fill="none" stroke="rgba(80,45,10,0.18)" strokeWidth="0.6" />
          <path d="M0,20.5 Q160,20 340,21 Q540,22 700,20.5 Q860,19.5 1000,20.8"
            fill="none" stroke="rgba(80,45,10,0.12)" strokeWidth="0.4" />
          <path d="M0,23 Q220,22.5 400,23.5 Q600,24.5 800,23 Q940,22.2 1000,23.2"
            fill="none" stroke="rgba(80,45,10,0.10)" strokeWidth="0.4" />

          {/* Slightly heavier separation lines — medullary rays */}
          <path d="M0,6.8 Q300,6 600,7.2 Q800,8 1000,7"
            fill="none" stroke="rgba(60,30,5,0.26)" strokeWidth="0.9" />
          <path d="M0,16.8 Q280,16 560,17.5 Q780,18.5 1000,17"
            fill="none" stroke="rgba(60,30,5,0.22)" strokeWidth="0.8" />

          {/* Knot 1 — around x=230 */}
          <path d="M215,0 Q235,13 215,26" fill="none" stroke="rgba(50,25,5,0.22)" strokeWidth="2" />
          <path d="M222,0 Q248,13 222,26" fill="none" stroke="rgba(50,25,5,0.12)" strokeWidth="1" />
          <path d="M230,0 Q260,13 230,26" fill="none" stroke="rgba(50,25,5,0.07)" strokeWidth="0.7" />

          {/* Knot 2 — around x=720 */}
          <path d="M708,0 Q725,13 708,26" fill="none" stroke="rgba(50,25,5,0.18)" strokeWidth="1.8" />
          <path d="M716,0 Q738,13 716,26" fill="none" stroke="rgba(50,25,5,0.10)" strokeWidth="0.9" />

          {/* Fine cross-grain flecks (ray cells) */}
          {[60,140,310,440,530,650,790,870].map((x, i) => (
            <line key={i}
              x1={x} y1={6 + (i % 3) * 4}
              x2={x + 8} y2={7 + (i % 3) * 4}
              stroke="rgba(180,120,40,0.18)" strokeWidth="0.5" />
          ))}

          {/* Top-surface highlight */}
          <line x1="0" y1="0.5" x2="1000" y2="0.5" stroke="rgba(255,240,200,0.30)" strokeWidth="1" />
          <line x1="0" y1="1.5" x2="1000" y2="1.5" stroke="rgba(255,240,200,0.12)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Plank front edge — darker, with subtle grain */}
      <div
        style={{
          height: "6px",
          minWidth: "1000px",
          background: "linear-gradient(to bottom, #8A6030 0%, #6A4820 60%, #4A3010 100%)",
          borderRadius: "0 0 7px 7px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}

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
    <main className="max-w-5xl mx-auto px-8 py-14" style={{ overflowX: "clip" }}>
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

      {/* Filter */}
      <StatusFilter activeStatus={activeStatus} counts={counts} />

      {/* Bookshelf */}
      <div className="mt-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-5 font-light">
          {STATUS_LABELS[activeStatus]} &mdash; {filtered.length}{" "}
          {filtered.length === 1 ? "book" : "books"}
        </p>

        <div className="relative">
          <div className="flex items-end gap-1.5 pb-0" style={{ position: "relative", zIndex: 1 }}>
            {filtered.map((book) => (
              <BookSpine key={book.id} book={book} />
            ))}
            <Plant />
          </div>
          {/* Fixed-width shelf: marginLeft cancels px-8 padding so it
              extends beyond the content column; minWidth locks the size */}
          <div style={{ marginLeft: "-2rem", marginRight: "-2rem", minWidth: "1000px" }}>
            <ShelfPlank />
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="text-stone-400 text-center py-16 text-sm font-light tracking-wide">
            No books in this category yet.
          </p>
        )}
      </div>
    </main>
  );
}
