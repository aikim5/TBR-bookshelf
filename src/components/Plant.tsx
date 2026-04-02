// Pothos heart-leaf: base at origin (0,0), tip at (0,−28). Max width ~26 px.
const LEAF_D =
  "M 0,0 C -3,0 -6,-2 -7,-0.5 C -12,-3 -13,-10 -11,-17 C -9.5,-22 -5.5,-27 0,-28 C 5.5,-27 9.5,-22 11,-17 C 13,-10 12,-3 7,-0.5 C 6,-2 3,0 0,0 Z";

const VEIN_D =
  "M 0,-1 L 0,-27 M -1,-10 C -5,-14 -8,-16 -9,-18 M 1,-10 C 5,-14 8,-16 9,-18 M -1,-18 C -4,-21 -5,-23 -6,-25 M 1,-18 C 4,-21 5,-23 6,-25";

const S = "#1C3A0E";
const D = "#243D12";
const M = "#2E5218";
const L = "#3A6422";

function Leaf({
  x, y, a, s, c,
}: { x: number; y: number; a: number; s: number; c: string }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${a}) scale(${s})`}>
      <path d={LEAF_D} fill={c} />
      <path d={VEIN_D} fill="none" stroke={S} strokeWidth="0.7" opacity="0.38" />
    </g>
  );
}

export default function Plant() {
  return (
    <div className="flex-shrink-0 self-end" style={{ width: "180px" }}>
      <svg
        width="180"
        height="248"
        viewBox="0 0 180 248"
        style={{ overflow: "visible", pointerEvents: "none" }}
      >
        {/* ════════════════════════════════════════════════
            1. POT BODY
            ════════════════════════════════════════════════ */}
        <path d="M 12,172 L 10,244 Q 90,256 170,244 L 168,172 Z" fill="#C8B8A0" />
        <path d="M 12,172 L 10,244" fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="14" strokeLinecap="butt" />
        <path d="M 168,172 L 170,244" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="10" strokeLinecap="butt" />
        <path d="M 15,190 Q 90,196 165,190" fill="none" stroke="#A89880" strokeWidth="0.65" opacity="0.38" />
        <path d="M 13,210 Q 90,216 167,210" fill="none" stroke="#A89880" strokeWidth="0.60" opacity="0.30" />
        <path d="M 11,228 Q 90,234 169,228" fill="none" stroke="#A89880" strokeWidth="0.55" opacity="0.24" />
        <path d="M 10,244 Q 90,256 170,244" fill="none" stroke="#A89880" strokeWidth="0.9" opacity="0.48" />

        {/* ════════════════════════════════════════════════
            2. EIGHT VINES — varying lengths
               V3, V6: stub — barely below shelf (2 leaves)
               V1, V4: short (3 leaves)
               V8: medium (4 leaves)
               V5: long (5 leaves)
               V2, V7: very long (6 leaves)
            ════════════════════════════════════════════════ */}

        {/* V1 — tight left zigzag, SHORT */}
        <path d="M 18,165 C 10,172 4,186 6,210 C 8,234 22,241 14,268 C 6,295 -10,300 -6,330 C -2,352 12,358 4,382"
          fill="none" stroke={S} strokeWidth="1.2" strokeLinecap="round" />

        {/* V2 — wide lazy arcs, VERY LONG */}
        <path d="M 42,165 C 26,173 14,192 18,222 C 22,252 42,258 32,292 C 22,326 2,331 8,366 C 14,401 34,406 24,442 C 14,478 -4,483 4,518 C 14,550 32,555 20,586"
          fill="none" stroke={S} strokeWidth="1.3" strokeLinecap="round" />

        {/* V3 — short stub, barely hangs below shelf */}
        <path d="M 64,164 C 76,169 84,185 78,212 C 72,236 58,242 62,268 C 66,280 76,284 70,298"
          fill="none" stroke={S} strokeWidth="1.2" strokeLinecap="round" opacity="0.92" />

        {/* V4 — nearly straight, SHORT */}
        <path d="M 84,164 C 90,170 96,186 90,213 C 84,240 70,246 74,276 C 78,306 94,311 88,342"
          fill="none" stroke={S} strokeWidth="1.1" strokeLinecap="round" opacity="0.88" />

        {/* V5 — tight oscillation, LONG */}
        <path d="M 102,164 C 112,168 120,184 114,212 C 108,240 92,246 96,276 C 100,306 118,311 112,342 C 106,373 90,378 94,410 C 98,442 116,447 110,480"
          fill="none" stroke={S} strokeWidth="1.2" strokeLinecap="round" />

        {/* V6 — short stub, barely hangs below shelf */}
        <path d="M 122,165 C 138,170 148,185 144,212 C 140,234 126,240 130,264 C 134,278 146,282 142,300"
          fill="none" stroke={S} strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />

        {/* V7 — irregular double-S, VERY LONG */}
        <path d="M 144,165 C 158,160 170,174 168,200 C 166,226 150,232 154,262 C 158,292 174,297 172,328 C 170,359 154,364 158,396 C 162,428 178,433 176,464 C 174,496 160,501 164,532 C 168,560 182,565 180,594"
          fill="none" stroke={S} strokeWidth="1.2" strokeLinecap="round" opacity="0.88" />

        {/* V8 — drifts right, MEDIUM */}
        <path d="M 162,165 C 172,170 182,187 180,216 C 178,245 164,252 168,282 C 172,312 186,317 184,348 C 182,379 168,384 172,416 C 176,446 190,451 188,476"
          fill="none" stroke={S} strokeWidth="1.1" strokeLinecap="round" opacity="0.84" />

        {/* ════════════════════════════════════════════════
            3. POT RIM
            ════════════════════════════════════════════════ */}
        <rect x="6" y="157" width="168" height="17" rx="5" fill="#D4C8B0" />
        <rect x="7" y="157" width="166" height="3" rx="1.5" fill="rgba(255,255,255,0.24)" />
        <path d="M 12,172 Q 90,177 168,172" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />

        {/* ════════════════════════════════════════════════
            4. CROWN — full 360° angle distribution,
               leaves pointing in ALL directions,
               Y positions scattered (not tiered).
            ════════════════════════════════════════════════ */}

        {/* Rim-level anchors */}
        <Leaf x={18}  y={166} a={47}   s={1.18} c={L} />
        <Leaf x={40}  y={165} a={-130} s={1.44} c={D} />
        <Leaf x={72}  y={163} a={170}  s={1.60} c={M} />
        <Leaf x={100} y={163} a={65}   s={1.55} c={D} />
        <Leaf x={130} y={165} a={-55}  s={1.38} c={L} />
        <Leaf x={158} y={167} a={110}  s={1.06} c={M} />
        <Leaf x={170} y={168} a={-35}  s={0.88} c={D} />

        {/* Lower scatter — y=128–162 */}
        <Leaf x={24}  y={162} a={-85}  s={1.12} c={M} />
        <Leaf x={52}  y={160} a={80}   s={1.30} c={L} />
        <Leaf x={88}  y={158} a={-160} s={1.42} c={D} />
        <Leaf x={124} y={159} a={40}   s={1.35} c={M} />
        <Leaf x={152} y={161} a={-175} s={1.18} c={L} />
        <Leaf x={170} y={162} a={105}  s={0.96} c={D} />
        <Leaf x={60}  y={150} a={22}   s={1.70} c={D} />
        <Leaf x={108} y={148} a={-85}  s={1.75} c={M} />
        <Leaf x={82}  y={145} a={148}  s={1.88} c={L} />
        <Leaf x={35}  y={142} a={-32}  s={1.40} c={M} />
        <Leaf x={144} y={140} a={95}   s={1.32} c={D} />
        <Leaf x={14}  y={138} a={-118} s={1.16} c={L} />
        <Leaf x={164} y={136} a={175}  s={1.10} c={M} />
        <Leaf x={50}  y={134} a={58}   s={1.54} c={D} />
        <Leaf x={130} y={131} a={-105} s={1.46} c={L} />
        <Leaf x={28}  y={136} a={-145} s={1.14} c={M} />
        <Leaf x={154} y={133} a={128}  s={1.08} c={D} />

        {/* ── Mid tier y=95–132 ──────────────────────────────
            Angles strictly alternate sign left→right so each
            leaf points the OPPOSITE way from its neighbours.
            Extends to x≈2 and x≈178 to widen the crown sides. */}

        {/* y≈98–118 row */}
        <Leaf x={2}   y={110} a={42}   s={1.08} c={M} />
        <Leaf x={22}  y={102} a={-64}  s={1.26} c={L} />
        <Leaf x={46}  y={110} a={16}   s={1.52} c={D} />
        <Leaf x={70}  y={118} a={76}   s={1.74} c={M} />
        <Leaf x={90}  y={122} a={-10}  s={1.90} c={D} />
        <Leaf x={112} y={116} a={-74}  s={1.70} c={L} />
        <Leaf x={136} y={108} a={52}   s={1.44} c={M} />
        <Leaf x={160} y={100} a={-60}  s={1.20} c={D} />
        <Leaf x={178} y={108} a={38}   s={1.02} c={L} />

        {/* y≈125–132 row */}
        <Leaf x={18}  y={128} a={82}   s={1.16} c={L} />
        <Leaf x={44}  y={130} a={-14}  s={1.48} c={D} />
        <Leaf x={78}  y={128} a={-64}  s={1.78} c={M} />
        <Leaf x={104} y={126} a={60}   s={1.72} c={L} />
        <Leaf x={138} y={128} a={-10}  s={1.42} c={M} />
        <Leaf x={162} y={126} a={80}   s={1.12} c={D} />

        {/* ── Upper dome y=48–92 ─────────────────────────────
            Each row: angles alternate ±, all |a| ≤ 85° so tips
            point upward and fill the dome. Extra leaves extend
            to x=4 and x=178 for wider sides. */}

        {/* Tip of dome y≈52–58 */}
        <Leaf x={90}  y={52}  a={6}    s={1.92} c={D} />
        <Leaf x={66}  y={58}  a={-68}  s={1.74} c={M} />
        <Leaf x={116} y={56}  a={64}   s={1.70} c={L} />

        {/* y≈65–82 */}
        <Leaf x={50}  y={68}  a={22}   s={1.58} c={M} />
        <Leaf x={132} y={66}  a={-18}  s={1.54} c={L} />
        <Leaf x={72}  y={74}  a={-82}  s={1.64} c={D} />
        <Leaf x={112} y={72}  a={80}   s={1.60} c={M} />
        <Leaf x={34}  y={78}  a={-40}  s={1.40} c={L} />
        <Leaf x={148} y={76}  a={42}   s={1.36} c={D} />
        <Leaf x={16}  y={82}  a={54}   s={1.24} c={M} />
        <Leaf x={166} y={80}  a={-52}  s={1.20} c={L} />

        {/* y≈84–92 */}
        <Leaf x={82}  y={85}  a={-62}  s={1.80} c={M} />
        <Leaf x={100} y={85}  a={60}   s={1.76} c={L} />
        <Leaf x={58}  y={90}  a={12}   s={1.62} c={D} />
        <Leaf x={122} y={88}  a={-10}  s={1.56} c={M} />
        <Leaf x={28}  y={90}  a={48}   s={1.38} c={L} />
        <Leaf x={152} y={88}  a={-46}  s={1.34} c={D} />
        <Leaf x={4}   y={90}  a={-30}  s={1.12} c={M} />
        <Leaf x={178} y={88}  a={32}   s={1.08} c={L} />

        {/* ── Gap fillers — placed at interstitial positions between
            the alternating leaves above to close visible holes ── */}

        {/* Top-dome gaps */}
        <Leaf x={78}  y={52}  a={-30}  s={1.44} c={L} />
        <Leaf x={104} y={54}  a={25}   s={1.40} c={D} />

        {/* Upper-mid gaps (between the wide-angle leaves) */}
        <Leaf x={60}  y={72}  a={66}   s={1.36} c={M} />
        <Leaf x={122} y={70}  a={-64}  s={1.32} c={L} />
        <Leaf x={44}  y={84}  a={-22}  s={1.30} c={D} />
        <Leaf x={138} y={82}  a={20}   s={1.26} c={M} />
        <Leaf x={12}  y={88}  a={70}   s={1.08} c={L} />
        <Leaf x={170} y={86}  a={-68}  s={1.06} c={D} />

        {/* Mid-tier gaps */}
        <Leaf x={34}  y={106} a={52}   s={1.32} c={D} />
        <Leaf x={58}  y={114} a={-42}  s={1.36} c={M} />
        <Leaf x={124} y={112} a={-46}  s={1.38} c={L} />
        <Leaf x={148} y={104} a={58}   s={1.32} c={D} />
        <Leaf x={170} y={104} a={-36}  s={1.08} c={M} />

        {/* ════════════════════════════════════════════════
            5. DRAPING LEAVES — angles varied (not all ±90°)
            ════════════════════════════════════════════════ */}

        {/* V1 — 3 leaves */}
        <Leaf x={6}   y={210} a={105}  s={1.52} c={M} />
        <Leaf x={14}  y={268} a={-78}  s={1.10} c={D} />
        <Leaf x={4}   y={382} a={92}   s={1.38} c={L} />

        {/* V2 — 6 leaves */}
        <Leaf x={18}  y={222} a={-112} s={1.34} c={D} />
        <Leaf x={32}  y={292} a={75}   s={1.58} c={L} />
        <Leaf x={8}   y={366} a={-88}  s={1.00} c={M} />
        <Leaf x={24}  y={442} a={100}  s={1.30} c={D} />
        <Leaf x={4}   y={518} a={-82}  s={0.76} c={L} />
        <Leaf x={20}  y={586} a={95}   s={0.60} c={M} />

        {/* V3 — 1 leaf (stub) */}
        <Leaf x={78}  y={212} a={-118} s={1.46} c={L} />
        <Leaf x={66}  y={272} a={88}   s={1.22} c={M} />

        {/* V4 — 3 leaves */}
        <Leaf x={90}  y={213} a={68}   s={1.22} c={M} />
        <Leaf x={74}  y={276} a={-102} s={1.52} c={D} />
        <Leaf x={88}  y={342} a={78}   s={1.04} c={L} />

        {/* V5 — 5 leaves */}
        <Leaf x={114} y={212} a={-90}  s={1.44} c={D} />
        <Leaf x={96}  y={276} a={112}  s={1.06} c={M} />
        <Leaf x={112} y={342} a={-76}  s={1.38} c={L} />
        <Leaf x={94}  y={410} a={95}   s={0.88} c={D} />
        <Leaf x={110} y={480} a={-105} s={1.20} c={M} />

        {/* V6 — 1 leaf (stub) */}
        <Leaf x={144} y={212} a={118}  s={1.58} c={L} />
        <Leaf x={132} y={276} a={-82}  s={1.24} c={M} />

        {/* V7 — 6 leaves */}
        <Leaf x={168} y={200} a={-100} s={1.48} c={M} />
        <Leaf x={154} y={262} a={80}   s={1.22} c={D} />
        <Leaf x={172} y={328} a={-88}  s={1.50} c={L} />
        <Leaf x={158} y={396} a={108}  s={0.86} c={M} />
        <Leaf x={176} y={464} a={-92}  s={1.22} c={D} />
        <Leaf x={164} y={532} a={85}   s={0.64} c={L} />

        {/* V8 — 4 leaves */}
        <Leaf x={180} y={216} a={75}   s={1.32} c={L} />
        <Leaf x={168} y={282} a={-110} s={1.60} c={D} />
        <Leaf x={184} y={348} a={92}   s={0.94} c={M} />
        <Leaf x={188} y={476} a={-80}  s={1.28} c={L} />
      </svg>
    </div>
  );
}
