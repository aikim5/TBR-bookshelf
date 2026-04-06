"use client";

import { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Book } from "@/types/book";

/** One page: width × height (2:3); spread = 2× width */
const PAGE_W = 380;
const PAGE_H = Math.round((PAGE_W * 3) / 2);
const SPREAD_W = PAGE_W * 2;

/** Inside front cover (board) — must stay visible when the 3D cover is edge-on; contrasts with page paper */
const INSIDE_COVER_GRAY = "#7C8494";
const INSIDE_COVER_GRADIENT =
  "linear-gradient(165deg, rgba(255,255,255,0.12) 0%, transparent 38%), linear-gradient(to bottom, #9CA6B4 0%, #7C8494 42%, #6B7280 100%)";

const STATUS_LABELS: Record<Book["status"], string> = {
  finished: "Finished",
  reading: "Currently Reading",
  "to-read": "To Read",
};

interface Props {
  book: Book;
  onClose: () => void;
}

const COVER_EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const COVER_DELAY_S = 0.75;
const COVER_DURATION_S = 2;
const COVER_OPEN_DEG = -172;

const OVERLAY_BG = "rgba(20, 16, 12, 0.88)";

const BOOK_SHADOW =
  "0 40px 100px rgba(0,0,0,0.7), 0 12px 32px rgba(0,0,0,0.4)";

const R_OUT = 6;

const STATUS_PILL: Record<
  Book["status"],
  { bg: string; color: string }
> = {
  "to-read": { bg: "rgba(180, 170, 158, 0.35)", color: "#4A433C" },
  reading: { bg: "rgba(163, 186, 210, 0.4)", color: "#2F3D4D" },
  finished: { bg: "rgba(168, 196, 178, 0.4)", color: "#2D3D34" },
};

export default function BookOpenOverlay({ book, onClose }: Props) {
  const coverRotateY = useMotionValue(0);

  useEffect(() => {
    coverRotateY.set(0);
    const controls = animate(coverRotateY, COVER_OPEN_DEG, {
      delay: COVER_DELAY_S,
      duration: COVER_DURATION_S,
      ease: COVER_EASE,
    });
    return () => controls.stop();
  }, [book.id, coverRotateY]);

  return (
    /* Backdrop */
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: OVERLAY_BG,
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      {/* One motion layer: paper clipped inside; close button sits above (not clipped) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: `${SPREAD_W}px`,
          isolation: "isolate",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: `${SPREAD_W}px`,
            height: `${PAGE_H}px`,
            flexShrink: 0,
            overflow: "visible",
            position: "relative",
            zIndex: 0,
            backgroundColor: "transparent",
          }}
        >
          {/* Paper noise — recto (right) only so the verso can read as gray board, not one cream field */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: `${PAGE_W}px`,
              bottom: 0,
              zIndex: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              width: `${PAGE_W}px`,
              height: "100%",
              flex: "0 0 auto",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              position: "relative",
              width: `${PAGE_W}px`,
              height: "100%",
              flex: "0 0 auto",
              boxSizing: "border-box",
              zIndex: 1,
              backgroundColor: "#F8F5EE",
              borderRadius: `0 ${R_OUT}px ${R_OUT}px 0`,
              overflow: "hidden",
              boxShadow: BOOK_SHADOW,
            }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "36px 28px",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  maxHeight: "100%",
                  minHeight: 0,
                  overflowY: "auto",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    width: "100%",
                    minWidth: 0,
                    flexShrink: 0,
                  }}
                >
                  <h2
                    style={{
                      fontSize: book.title.length > 40 ? "17px" : "21px",
                      fontWeight: 300,
                      color: "#2A2018",
                      lineHeight: 1.35,
                      letterSpacing: "0.01em",
                      marginBottom: "14px",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {book.title}
                  </h2>

                  <div
                    style={{
                      width: "36px",
                      height: "1px",
                      backgroundColor: "#C4B4A4",
                      marginBottom: "14px",
                    }}
                  />

                  <p
                    style={{
                      fontSize: "11px",
                      color: "#8A7868",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 400,
                      margin: 0,
                    }}
                  >
                    {book.author}
                  </p>
                </div>

                {book.summary?.trim() ? (
                  <p
                    style={{
                      flexShrink: 0,
                      margin: 0,
                      padding: "0 2px",
                      fontSize: "12px",
                      lineHeight: 1.55,
                      color: "#5C5348",
                      fontFamily: "Georgia, serif",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {book.summary.trim()}
                  </p>
                ) : null}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                {book.genre ? (
                  <span
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderRadius: "9999px",
                      backgroundColor: "rgba(196, 180, 164, 0.4)",
                      color: "#4A433C",
                    }}
                  >
                    {book.genre}
                  </span>
                ) : null}
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: "9999px",
                    backgroundColor: STATUS_PILL[book.status].bg,
                    color: STATUS_PILL[book.status].color,
                  }}
                >
                  {STATUS_LABELS[book.status]}
                </span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: `${PAGE_W}px`,
              height: "100%",
              perspective: "1600px",
              perspectiveOrigin: "left center",
              zIndex: 20,
              transform: "translateZ(0)",
              pointerEvents: "none",
            }}
          >
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                rotateY: coverRotateY,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  backgroundColor: book.coverColor,
                  borderRadius: `0 ${R_OUT}px ${R_OUT}px 0`,
                  overflow: "hidden",
                  boxShadow:
                    "2px 0 12px rgba(0,0,0,0.25), inset -1px 0 0 rgba(255,255,255,0.06)",
                }}
              >
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="object-contain"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderRadius: `${R_OUT}px 0 0 ${R_OUT}px`,
                  backgroundColor: INSIDE_COVER_GRAY,
                  backgroundImage: `${INSIDE_COVER_GRADIENT}, url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -2px 10px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.08)",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "-48px",
            right: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
            fontSize: "20px",
            lineHeight: 1,
            padding: "8px",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
          }
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}
