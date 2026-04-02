"use client";

import Link from "next/link";
import { Book } from "@/types/book";

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

interface BookStackProps {
  books: Book[];
  align?: "left" | "right";
}

const STACK_WIDTH = 148;
const BOOK_HEIGHT = 21;

export default function BookStack({ books, align = "right" }: BookStackProps) {
  if (books.length === 0) return null;

  return (
    <div className="flex-shrink-0 self-end" style={{ width: `${STACK_WIDTH}px` }}>
      {[...books].reverse().map((book, i) => {
        const light = isLightColor(book.coverColor);
        const textColor = light ? "rgba(28,22,16,0.88)" : "rgba(255,252,248,0.92)";
        const subtleColor = light ? "rgba(28,22,16,0.40)" : "rgba(255,252,248,0.45)";
        const protrude = i * 3;
        const marginLeft = align === "right" ? 0 : protrude;
        const marginRight = align === "right" ? protrude : 0;
        const bookWidth = STACK_WIDTH - protrude;

        return (
          <Link key={book.id} href={`/book/${book.id}`} className="block group">
            <div
              className="relative transition-transform duration-150 group-hover:-translate-y-0.5"
              style={{
                width: `${bookWidth}px`,
                height: `${BOOK_HEIGHT}px`,
                marginLeft: `${marginLeft}px`,
                marginRight: `${marginRight}px`,
                marginBottom: "1px",
                backgroundColor: book.coverColor,
                borderRadius: "2px 2px 1px 1px",
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                overflow: "hidden",
              }}
            >
              {/* Linen noise */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
                  opacity: light ? 0.5 : 0.3,
                  mixBlendMode: "multiply",
                }}
              />
              <span
                style={{
                  fontSize: "7px",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  color: textColor,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                  textShadow: light
                    ? "0 1px 1px rgba(255,255,255,0.2)"
                    : "0 1px 2px rgba(0,0,0,0.4)",
                }}
              >
                {book.title.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: "6px",
                  letterSpacing: "0.06em",
                  color: subtleColor,
                  whiteSpace: "nowrap",
                  marginLeft: "6px",
                  flexShrink: 0,
                }}
              >
                {book.author.split(" ").pop()?.toUpperCase()}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
