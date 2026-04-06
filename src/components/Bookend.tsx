// Stepped quarter-ellipse marble bookend
//
// Shape: flat right edge (against books) + flat bottom (on shelf) +
//        smooth quarter-ellipse arc from top-right → bottom-left
// rx/ry ≈ 0.87 keeps the arc wide and circular (not cone-like).
// All arcs share center at bottom-right corner (CX, CY).

const CX = 158;  // right x  — flat side against books
const CY = 170;  // bottom y — on shelf

/** Quarter-ellipse arc from top of right edge → left of bottom edge. */
const arc = (rx: number, ry: number) =>
  `M ${CX},${CY - ry} A ${rx},${ry} 0 0 0 ${CX - rx},${CY}`;

const OUTER_RX = 156, OUTER_RY = 168;   // rx/ry ≈ 0.929 — nearly circular, wide smooth arch
const BASE = `${arc(OUTER_RX, OUTER_RY)} L ${CX},${CY} Z`;
// = "M 158,2 A 156,168 0 0 0 2,170 L 158,170 Z"

// Step groove positions — each inset 24 px
const STEPS = [
  { rx: 132, ry: 144 }, // Step 1
  { rx: 108, ry: 120 }, // Step 2
  { rx:  84, ry:  96 }, // Step 3
];

export default function Bookend() {
  return (
    <div className="flex-shrink-0 self-end" style={{ width: "162px" }}>
      <svg
        width="162"
        height="178"
        viewBox="0 0 162 178"
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          {/* Warm cream marble — lighter upper-left, deeper lower-right */}
          <linearGradient id="bk-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#F7F3ED" />
            <stop offset="55%"  stopColor="#EDE9DF" />
            <stop offset="100%" stopColor="#DDD8CD" />
          </linearGradient>

          {/* Stone micro-texture */}
          <filter id="bk-t" x="-3%" y="-2%" width="106%" height="104%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.032 0.065"
              numOctaves="5"
              seed="31"
              result="n"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.91  0 0 0 0 0.88  0 0 0 0 0.83  0 0 0 0.12 0"
              in="n"
              result="t"
            />
            <feBlend in="SourceGraphic" in2="t" mode="multiply" />
          </filter>

          {/* Clip to base shape for veins */}
          <clipPath id="bk-c">
            <path d={BASE} />
          </clipPath>
        </defs>

        {/* ── MAIN FILL ── */}
        <path d={BASE} fill="url(#bk-g)" filter="url(#bk-t)" />

        {/* ── MARBLE VEINS (clipped to shape) ── */}
        <g clipPath="url(#bk-c)">
          <path d="M 96,170 Q 74,130 46,86 Q 22,48 4,8"
            fill="none" stroke="rgba(136,122,106,0.40)" strokeWidth="1.2" />
          <path d="M 140,170 Q 114,126 82,80 Q 52,38 28,4"
            fill="none" stroke="rgba(150,136,118,0.26)" strokeWidth="0.8" />
          <path d="M 158,126 Q 128,100 96,74 Q 68,52 48,20"
            fill="none" stroke="rgba(128,116,100,0.22)" strokeWidth="0.9" />
          <path d="M 158,78 Q 136,64 110,54 Q 86,44 64,20"
            fill="none" stroke="rgba(142,130,112,0.20)" strokeWidth="0.7" />
          <path d="M 52,170 Q 36,134 22,96 Q 10,62 4,28"
            fill="none" stroke="rgba(160,148,132,0.30)" strokeWidth="0.6" />
          <path d="M 158,44 Q 134,58 106,76 Q 74,94 40,120"
            fill="none" stroke="rgba(116,104,88,0.26)" strokeWidth="0.8" />
          <path d="M 74,170 Q 56,132 38,92 Q 22,56 10,16"
            fill="none" stroke="rgba(220,210,196,0.34)" strokeWidth="0.5" />
        </g>

        {/* ── STEP RIDGES ── */}
        {/* Each step: wide bright highlight (outer face) + shadow arc (groove) */}
        {STEPS.map(({ rx, ry }, i) => (
          <g key={i}>
            {/* Outer face — catches light, double-width vs old design */}
            <path
              d={arc(rx + 5, ry + 5)}
              fill="none"
              stroke="rgba(255,252,246,0.72)"
              strokeWidth={5.5 - i * 0.5}
              strokeLinecap="round"
            />
            {/* Groove shadow */}
            <path
              d={arc(rx, ry)}
              fill="none"
              stroke="rgba(116,104,88,0.58)"
              strokeWidth={2.5 - i * 0.2}
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* ── OUTER EDGE ── */}
        <path
          d={`${arc(OUTER_RX, OUTER_RY)} L ${CX},${CY} Z`}
          fill="none"
          stroke="rgba(148,136,118,0.30)"
          strokeWidth="1"
        />

        {/* ── BASE STRIP ── */}
        <rect x="2" y="170" width="156" height="8" rx="1"
          fill="#DDD8CE" filter="url(#bk-t)" />
        <line x1="2" y1="170.5" x2="158" y2="170.5"
          stroke="rgba(255,255,255,0.38)" strokeWidth="0.8" />
        <rect x="2" y="176" width="156" height="2" rx="1"
          fill="rgba(0,0,0,0.06)" />
      </svg>
    </div>
  );
}
