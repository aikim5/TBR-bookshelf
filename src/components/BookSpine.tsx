"use client";

import Link from "next/link";
import { Book } from "@/types/book";

interface BookSpineProps {
  book: Book;
  onSelect?: (book: Book) => void;
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

function getSpineHeight(pages: number, title: string, author: string, override?: number): number {
  if (override) return override;
  // Wider range of base heights for more visual variety on the shelf
  const base =
    pages < 150 ? 240 :
    pages < 200 ? 255 :
    pages < 250 ? 265 :
    pages < 310 ? 275 :
    pages < 370 ? 285 :
    pages < 450 ? 295 :
    305;
  // In writing-mode: vertical-rl, uppercase rotated Latin chars advance ~6.5px each (title at 9px)
  // and ~5.5px each (author at 8px). Add 55px for padding, status icon, and justify-between gaps.
  const minForContent = Math.ceil(title.length * 6.5 + author.length * 5.5 + 55);
  return Math.max(base, minForContent);
}

function getSpineWidth(pages: number): number {
  if (pages < 150) return 42;
  if (pages < 200) return 46;
  if (pages < 260) return 52;
  if (pages < 320) return 58;
  if (pages < 420) return 65;
  return 72;
}

function getSpineDecoration(id: string, light: boolean, w: number, h: number): React.ReactNode {
  const lo = light ? "rgba(0,0,0," : "rgba(255,255,255,";
  const gold = "rgba(212,175,55,";
  const silver = "rgba(192,192,210,";

  switch (id) {
    case "1": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={`${gold}0.9)`} />
            <stop offset="40%" stopColor={`${gold}0.4)`} />
            <stop offset="100%" stopColor={`${gold}0.05)`} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="3" height={h} fill="url(#g1)" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="6" y1={20 + i * (h - 40) / 11} x2={w - 4} y2={20 + i * (h - 40) / 11}
            stroke={`${lo}0.12)`} strokeWidth="0.5" />
        ))}
        <line x1="6" y1="18" x2={w - 4} y2="18" stroke={`${gold}0.35)`} strokeWidth="1" />
        <line x1="6" y1={h - 18} x2={w - 4} y2={h - 18} stroke={`${gold}0.35)`} strokeWidth="1" />
        <line x1={w / 2} y1="22" x2={w / 2} y2={h - 22} stroke={`${lo}0.07)`} strokeWidth="0.5" />
      </svg>
    );

    case "2": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <pattern id="weave2" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <line x1="0" y1="8" x2="8" y2="0" stroke={`${lo}0.10)`} strokeWidth="0.6" />
            <line x1="-2" y1="2" x2="2" y2="-2" stroke={`${lo}0.10)`} strokeWidth="0.6" />
            <line x1="6" y1="10" x2="10" y2="6" stroke={`${lo}0.10)`} strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#weave2)" />
        <rect x="5" y="5" width={w - 10} height={h - 10} fill="none" stroke={`${lo}0.20)`} strokeWidth="0.75" />
        <rect x="8" y="8" width={w - 16} height={h - 16} fill="none" stroke={`${lo}0.12)`} strokeWidth="0.5" />
        {[-1, 1].map((pos, i) => {
          const cy = pos === -1 ? 22 : h - 22;
          return (
            <polygon key={i}
              points={`${w / 2},${cy - 5} ${w / 2 + 5},${cy} ${w / 2},${cy + 5} ${w / 2 - 5},${cy}`}
              fill="none" stroke={`${lo}0.25)`} strokeWidth="0.75" />
          );
        })}
      </svg>
    );

    case "3": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`${silver}0.15)`} />
            <stop offset="50%" stopColor={`${silver}0.04)`} />
            <stop offset="100%" stopColor={`${silver}0.15)`} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#g3)" />
        {Array.from({ length: 8 }).map((_, i) => {
          const yBase = 20 + i * (h - 40) / 7;
          const amp = 3;
          const freq = (2 * Math.PI) / w;
          const points = Array.from({ length: w + 1 }, (__, x) =>
            `${x},${yBase + amp * Math.sin(freq * x * 2 + i * 0.8)}`
          ).join(" ");
          return (
            <polyline key={i} points={points}
              fill="none" stroke={`${silver}${i % 2 === 0 ? 0.18 : 0.10})`} strokeWidth="0.6" />
          );
        })}
        <rect x="4" y="4" width={w - 8} height={h - 8} fill="none" stroke={`${silver}0.25)`} strokeWidth="0.75" />
      </svg>
    );

    case "4": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <radialGradient id="g4" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
          </radialGradient>
        </defs>
        {[
          [w * 0.2, h * 0.15, 4], [w * 0.75, h * 0.12, 2.5], [w * 0.5, h * 0.25, 6],
          [w * 0.15, h * 0.45, 3], [w * 0.8, h * 0.4, 5], [w * 0.35, h * 0.65, 3.5],
          [w * 0.7, h * 0.7, 4], [w * 0.25, h * 0.82, 2.5], [w * 0.6, h * 0.88, 3],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={`${lo}0.12)`} strokeWidth="0.5" />
        ))}
        <rect x="5" y="5" width={w - 10} height={h - 10} fill="none" stroke={`${lo}0.18)`} strokeWidth="0.75" />
        <rect x="8" y="8" width={w - 16} height={h - 16} fill="none" stroke={`${lo}0.10)`} strokeWidth="0.5" />
        <rect x="0" y="0" width={w} height={h} fill="url(#g4)" />
      </svg>
    );

    case "5": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <pattern id="lattice5" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <line x1="6" y1="0" x2="0" y2="6" stroke={`${lo}0.10)`} strokeWidth="0.5" />
            <line x1="12" y1="6" x2="6" y2="12" stroke={`${lo}0.10)`} strokeWidth="0.5" />
            <line x1="6" y1="0" x2="12" y2="6" stroke={`${lo}0.10)`} strokeWidth="0.5" />
            <line x1="0" y1="6" x2="6" y2="12" stroke={`${lo}0.10)`} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#lattice5)" />
        <ellipse cx={w / 2} cy={h * 0.42} rx={w * 0.22} ry={h * 0.14}
          fill="none" stroke={`${gold}0.18)`} strokeWidth="0.75" />
        <rect x={w / 2 - w * 0.12} y={h * 0.42} width={w * 0.24} height={h * 0.16}
          fill="none" stroke={`${gold}0.18)`} strokeWidth="0.75" />
        <line x1={w * 0.15} y1={h / 2} x2={w * 0.85} y2={h / 2} stroke={`${gold}0.30)`} strokeWidth="0.75" />
        <rect x="4" y="4" width={w - 8} height={h - 8} fill="none" stroke={`${lo}0.14)`} strokeWidth="0.5" />
      </svg>
    );

    case "6": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <pattern id="dots6" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="0.6" fill={`${lo}0.18)`} />
          </pattern>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#dots6)" />
        <line x1="8" y1="16" x2={w - 8} y2="16" stroke={`${lo}0.18)`} strokeWidth="0.5" />
        <line x1="8" y1={h - 16} x2={w - 8} y2={h - 16} stroke={`${lo}0.18)`} strokeWidth="0.5" />
        {[[10, 10], [w - 10, 10], [10, h - 10], [w - 10, h - 10]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill={`${lo}0.20)`} />
        ))}
      </svg>
    );

    case "7": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <linearGradient id="g7" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(100,140,220,0.12)" />
            <stop offset="50%" stopColor="rgba(100,140,220,0.03)" />
            <stop offset="100%" stopColor="rgba(100,140,220,0.12)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#g7)" />
        {[
          [w*0.1,h*0.08,1], [w*0.7,h*0.05,0.8], [w*0.4,h*0.13,1.2], [w*0.85,h*0.18,0.7],
          [w*0.25,h*0.22,0.9], [w*0.6,h*0.28,1], [w*0.15,h*0.35,0.7], [w*0.8,h*0.38,1.1],
          [w*0.45,h*0.42,0.8], [w*0.3,h*0.5,1], [w*0.75,h*0.52,0.7], [w*0.55,h*0.6,0.9],
          [w*0.1,h*0.65,1.1], [w*0.9,h*0.68,0.8], [w*0.35,h*0.73,0.7], [w*0.65,h*0.78,1],
          [w*0.2,h*0.85,0.9], [w*0.8,h*0.88,1.1], [w*0.5,h*0.92,0.7], [w*0.4,h*0.97,0.8],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(200,220,255,0.7)" />
        ))}
        {Array.from({ length: 5 }).map((_, col) =>
          Array.from({ length: 9 }).map((_, row) => {
            const hx = 12; const hy = 10;
            const x = col * hx + (row % 2 === 0 ? 0 : hx / 2);
            const y = row * hy * 0.75;
            return (
              <polygon key={`${col}-${row}`}
                points={`${x},${y+3} ${x+4},${y} ${x+4},${y-3} ${x},${y-6} ${x-4},${y-3} ${x-4},${y}`}
                fill="none" stroke="rgba(100,140,220,0.10)" strokeWidth="0.4" />
            );
          })
        )}
      </svg>
    );

    case "8": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <pattern id="grid8" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={`${lo}0.10)`} strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#grid8)" />
        <line x1="6" y1={h * 0.28} x2={w - 6} y2={h * 0.28} stroke={`${gold}0.40)`} strokeWidth="0.75" />
        <line x1="6" y1={h * 0.72} x2={w - 6} y2={h * 0.72} stroke={`${gold}0.40)`} strokeWidth="0.75" />
        <rect x="5" y={h * 0.30} width={w - 10} height={h * 0.40}
          fill={`${lo}0.05)`} stroke={`${gold}0.20)`} strokeWidth="0.5" />
        {[[5, 5], [w - 5, 5], [5, h - 5], [w - 5, h - 5]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill={`${gold}0.35)`} />
        ))}
      </svg>
    );

    case "9": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <pattern id="dotgrid9" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="0.5" fill={`${lo}0.16)`} />
          </pattern>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#dotgrid9)" />
        <circle cx={w / 2} cy={h * 0.18} r={w * 0.14}
          fill="none" stroke={`${lo}0.22)`} strokeWidth="0.75" />
        <polygon
          points={`${w/2},${h*0.42} ${w/2+w*0.15},${h*0.55} ${w/2-w*0.15},${h*0.55}`}
          fill="none" stroke={`${lo}0.22)`} strokeWidth="0.75" />
        <rect x={w/2 - w*0.14} y={h*0.70} width={w*0.28} height={w*0.28}
          fill="none" stroke={`${lo}0.22)`} strokeWidth="0.75" />
        <rect x="5" y="5" width={w - 10} height={h - 10} fill="none" stroke={`${lo}0.14)`} strokeWidth="0.5" />
      </svg>
    );

    case "10": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <pattern id="diag10" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="10" y2="0" stroke={`${lo}0.09)`} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#diag10)" />
        <line x1="8" y1={h / 2} x2={w - 8} y2={h / 2} stroke={`${silver}0.35)`} strokeWidth="0.75" />
        {[
          [6, 6], [w - 6, 6], [6, h - 6], [w - 6, h - 6]
        ].map(([x, y], i) => {
          const size = 6;
          const rx = x < w / 2 ? 1 : -1;
          const ry = y < h / 2 ? 1 : -1;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + rx * size} y2={y} stroke={`${silver}0.40)`} strokeWidth="0.75" />
              <line x1={x} y1={y} x2={x} y2={y + ry * size} stroke={`${silver}0.40)`} strokeWidth="0.75" />
            </g>
          );
        })}
      </svg>
    );

    case "11": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <defs>
          <pattern id="iso11" x="0" y="0" width="14" height="8" patternUnits="userSpaceOnUse">
            <line x1="0" y1="4" x2="7" y2="0" stroke={`${lo}0.10)`} strokeWidth="0.4" />
            <line x1="7" y1="0" x2="14" y2="4" stroke={`${lo}0.10)`} strokeWidth="0.4" />
            <line x1="0" y1="4" x2="7" y2="8" stroke={`${lo}0.10)`} strokeWidth="0.4" />
            <line x1="7" y1="8" x2="14" y2="4" stroke={`${lo}0.10)`} strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={w} height={h} fill="url(#iso11)" />
        <polyline
          points={`${w/2 - 7},${h/2 + 4} ${w/2},${h/2 - 6} ${w/2 + 7},${h/2 + 4}`}
          fill="none" stroke={`${lo}0.28)`} strokeWidth="1" strokeLinejoin="round" />
        <rect x="5" y="5" width={w - 10} height={h - 10} fill="none" stroke={`${lo}0.16)`} strokeWidth="0.5" />
      </svg>
    );

    case "12": return (
      <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <line x1={w * 0.2} y1={h / 2} x2={w * 0.8} y2={h / 2}
          stroke={`${lo}0.22)`} strokeWidth="0.75" />
      </svg>
    );

    default: return null;
  }
}

export default function BookSpine({ book, onSelect }: BookSpineProps) {
  const height = getSpineHeight(book.pages, book.title, book.author, book.spineHeight);
  const width = book.spineWidth ?? getSpineWidth(book.pages);
  const light = isLightColor(book.coverColor);

  const textColor = light ? "rgba(28, 22, 16, 0.85)" : "rgba(255, 252, 248, 0.92)";
  const mutedColor = light ? "rgba(28, 22, 16, 0.40)" : "rgba(255, 252, 248, 0.45)";
  const accentBg = light ? "rgba(28, 22, 16, 0.07)" : "rgba(255, 252, 248, 0.08)";
  const dividerColor = light ? "rgba(28, 22, 16, 0.12)" : "rgba(255, 252, 248, 0.12)";

  const spineInner = (
    <>
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
          {/* Layer 2: Per-book SVG decoration */}
          <div className="absolute inset-0 z-[2]" style={{ pointerEvents: "none" }}>
            {getSpineDecoration(book.id, light, width, height)}
          </div>

          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
              opacity: light ? 0.6 : 0.4,
              mixBlendMode: "multiply",
            }}
          />

          <div
            className="absolute top-0 left-0 right-0 pointer-events-none z-20"
            style={{ height: "3px", backgroundColor: accentBg }}
          />

          <div
            className="absolute inset-0 flex flex-col items-center justify-between py-3 px-0.5 overflow-hidden z-30"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            <span
              className="font-semibold text-center leading-snug"
              style={{
                fontSize: "9px",
                color: textColor,
                letterSpacing: "0.06em",
                textShadow: light
                  ? "0 1px 2px rgba(255,255,255,0.3)"
                  : "0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {book.title.toUpperCase()}
            </span>

            <span
              className="font-light text-center"
              style={{
                fontSize: "8px",
                color: mutedColor,
                letterSpacing: "0.10em",
                flexShrink: 0,
              }}
            >
              {book.author.toUpperCase()}
            </span>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-20 flex items-center justify-center"
            style={{
              height: "16px",
              backgroundColor: accentBg,
              borderTop: `1px solid ${dividerColor}`,
            }}
          >
            {book.status === "reading" && (
              <div style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "rgba(196,130,80,0.9)",
                boxShadow: "0 0 4px rgba(196,130,80,0.5)",
              }} />
            )}
            {book.status === "finished" && (
              <div style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "rgba(196,158,50,0.85)",
                boxShadow: "0 0 4px rgba(196,158,50,0.45)",
              }} />
            )}
          </div>
        </div>

      </div>

      {/* Tooltip lives outside the animated div so transforms don't affect its stacking context */}
      <div
        className="absolute hidden group-hover:flex flex-col pointer-events-none z-50"
        style={{ bottom: "max(100%, 360px)", marginBottom: "10px", left: "8px" }}
      >
        <div className="bg-stone-900 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap shadow-xl">
          <p className="font-medium tracking-wide">{book.title}</p>
          <p className="text-stone-400 mt-0.5 tracking-wider text-[10px]">{book.author}</p>
          {book.rating && (
            <p className="text-amber-400 mt-1 text-[10px]">
              {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
            </p>
          )}
        </div>
        {/* Arrow offset so it points to the spine's horizontal center */}
        <div
          className="w-2 h-2 bg-stone-900 rotate-45 -mt-1"
          style={{ marginLeft: `${Math.max(Math.floor(width / 2) - 12, 4)}px` }}
        />
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(book)}
        className="group relative flex-shrink-0 hover:z-[100] bg-transparent border-0 p-0 text-left"
        style={{ width: `${width}px` }}
      >
        {spineInner}
      </button>
    );
  }

  return (
    <Link
      href={`/book/${book.id}`}
      className="group relative flex-shrink-0 hover:z-[100]"
      style={{ width: `${width}px` }}
    >
      {spineInner}
    </Link>
  );
}
