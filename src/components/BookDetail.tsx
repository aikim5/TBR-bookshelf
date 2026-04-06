"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types/book";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Deterministic formatter — avoids server/client ICU differences with toLocaleDateString
function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

interface BookDetailProps {
  book: Book;
}

const STATUS_STYLES: Record<Book["status"], { label: string; className: string }> = {
  finished: { label: "Finished", className: "bg-emerald-100 text-emerald-800" },
  reading: { label: "Currently Reading", className: "bg-blue-100 text-blue-800" },
  "to-read": { label: "To Read", className: "bg-stone-100 text-stone-600" },
};

export default function BookDetail({ book }: BookDetailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const status = STATUS_STYLES[book.status];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700 transition-colors mb-8"
      >
        ← Back to shelf
      </Link>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Book cover */}
        <div className="flex-shrink-0">
          {book.coverImage && !coverError ? (
            <Image
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              width={120}
              height={180}
              unoptimized
              className="rounded object-contain"
              style={{
                width: "120px",
                height: "180px",
                boxShadow: "8px 8px 20px rgba(0,0,0,0.3)",
              }}
              onError={() => setCoverError(true)}
            />
          ) : (
            <div
              className="rounded"
              style={{
                width: "120px",
                height: "180px",
                backgroundColor: book.coverColor,
                boxShadow: "8px 8px 20px rgba(0,0,0,0.3), inset -4px 0 8px rgba(0,0,0,0.2)",
              }}
            />
          )}
        </div>

        {/* Book info */}
        <div className="flex-1 min-w-0">
          <span
            className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 ${status.className}`}
          >
            {status.label}
          </span>

          <h1 className="text-3xl font-bold text-stone-800 leading-tight mb-1">
            {book.title}
          </h1>
          <p className="text-lg text-stone-500 mb-4">by {book.author}</p>

          {book.rating && (
            <p className="text-amber-500 text-xl mb-4">
              {"★".repeat(book.rating)}
              <span className="text-stone-300">{"★".repeat(5 - book.rating)}</span>
            </p>
          )}

          <div className="flex gap-4 text-sm text-stone-400 mb-6">
            <span>{book.genre}</span>
            <span>·</span>
            <span>{book.pages} pages</span>
            {book.finishedDate && (
              <>
                <span>·</span>
                <span>
                  Finished {formatMonthYear(book.finishedDate)}
                </span>
              </>
            )}
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-2">
              About
            </h2>
            <p className="text-stone-600 leading-relaxed">{book.summary}</p>
          </div>

          {/* Open book / review section */}
          {book.status === "finished" && book.review && (
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors mb-4"
              >
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                  suppressHydrationWarning
                >
                  ▶
                </motion.span>
                {isOpen ? "Close my review" : "Open my review"}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className="rounded-lg p-5 border-l-4"
                      style={{
                        backgroundColor: `${book.coverColor}15`,
                        borderLeftColor: book.coverColor,
                      }}
                    >
                      <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-2">
                        My Review
                      </h3>
                      <p className="text-stone-700 leading-relaxed italic">
                        &ldquo;{book.review}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {book.status === "reading" && (
            <p className="text-sm text-stone-400 italic">
              Review coming soon — currently reading this one.
            </p>
          )}

          {book.status === "to-read" && (
            <p className="text-sm text-stone-400 italic">
              Haven&apos;t started this one yet — check back later for a review.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
