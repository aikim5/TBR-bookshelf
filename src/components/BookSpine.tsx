"use client";

import Link from "next/link";
import { Book } from "@/types/book";

interface BookSpineProps {
  book: Book;
}

// Light or dark text based on background luminance
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

// Height varies with page count
function getSpineHeight(pages: number): number {
  if (pages < 200) return 195;
  if (pages < 300) return 215;
  if (pages < 400) return 230;
  return 248;
}

// Flex-basis proportional to thickness (pages), so thicker books are wider
function getFlexBasis(pages: number): string {
  const basis = Math.max(38, Math.min(72, pages / 5.5));
  return `${basis}px`;
}

export default function BookSpine({ book }: BookSpineProps) {
  const height = getSpineHeight(book.pages);
  const flexBasis = getFlexBasis(book.pages);
  const light = isLightColor(book.coverColor);

  const textColor = light ? "rgba(28, 22, 16, 0.82)" : "rgba(255, 252, 248, 0.90)";
  const mutedColor = light ? "rgba(28, 22, 16, 0.40)" : "rgba(255, 252, 248, 0.45)";
  const accentBg = light ? "rgba(28, 22, 16, 0.07)" : "rgba(255, 252, 248, 0.08)";
  const dividerColor = light ? "rgba(28, 22, 16, 0.12)" : "rgba(255, 252, 248, 0.12)";

  return (
    <Link
      href={`/book/${book.id}`}
      className="group relative flex-1 min-w-0"
      style={{ flexBasis }}
    >
      <div
        className="relative cursor-pointer transition-all duration-200 ease-out group-hover:-translate-y-3 group-hover:shadow-2xl w-full"
        style={{ height: `${height}px` }}
      >
        <div
          className="h-full w-full rounded-[2px] flex flex-col select-none overflow-hidden relative"
          style={{
            backgroundColor: book.coverColor,
            boxShadow: `inset -5px 0 10px rgba(0,0,0,0.22), inset 2px 0 4px rgba(255,255,255,0.07), 1px 0 3px rgba(0,0,0,0.18)`,
          }}
        >
          {/* Linen grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
              opacity: light ? 0.6 : 0.4,
              mixBlendMode: "multiply",
            }}
          />

          {/* Top accent strip */}
          <div
            className="w-full flex-shrink-0"
            style={{ height: "3px", backgroundColor: accentBg }}
          />

          {/* Main content — rotated */}
          <div
            className="flex-1 flex flex-col items-center justify-between py-3 px-0.5 overflow-hidden"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {/* Status pip */}
            <div style={{ color: mutedColor, fontSize: "7px" }}>
              {book.status === "reading" && "●"}
              {book.status === "finished" && "✓"}
            </div>

            {/* Title */}
            <span
              className="font-semibold text-center leading-tight"
              style={{
                fontSize: "10px",
                color: textColor,
                letterSpacing: "0.1em",
                maxHeight: `${height - 80}px`,
                overflow: "hidden",
              }}
            >
              {book.title.toUpperCase()}
            </span>

            {/* Author */}
            <span
              className="font-light text-center"
              style={{
                fontSize: "8px",
                color: mutedColor,
                letterSpacing: "0.14em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: `${height - 70}px`,
                textOverflow: "ellipsis",
              }}
            >
              {book.author.toUpperCase()}
            </span>
          </div>

          {/* Bottom accent */}
          <div
            className="w-full flex-shrink-0"
            style={{
              height: "16px",
              backgroundColor: accentBg,
              borderTop: `1px solid ${dividerColor}`,
            }}
          />
        </div>

        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
          <div className="bg-stone-900 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap shadow-xl">
            <p className="font-medium tracking-wide">{book.title}</p>
            <p className="text-stone-400 mt-0.5 tracking-wider text-[10px]">{book.author}</p>
            {book.rating && (
              <p className="text-amber-400 mt-1 text-[10px]">
                {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
              </p>
            )}
          </div>
          <div className="w-2 h-2 bg-stone-900 rotate-45 -mt-1" />
        </div>
      </div>
    </Link>
  );
}
