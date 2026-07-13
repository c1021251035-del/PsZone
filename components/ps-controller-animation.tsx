"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   PSControllerAnimation
   Hero visual — geometric PS aesthetic, intentionally abstracted.
   Approach: bold typography + geometric SVG shapes + motion.
   No hand-traced product outline (unreliable at SVG level).
───────────────────────────────────────────────────────────── */
export function PSControllerAnimation() {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[480px] select-none overflow-hidden">

      {/* ── Layer 1: Concentric glow rings ── */}
      {[280, 210, 148].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border border-primary/20 pointer-events-none"
          style={{ width: size, height: size }}
          animate={reduce ? {} : {
            scale:   [1, 1 + 0.04 * (i + 1), 1],
            opacity: [0.35, 0.12, 0.35],
          }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        />
      ))}

      {/* ── Layer 2: Radial glow blob ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 340,
          height: 220,
          background: "radial-gradient(ellipse at center, rgba(113,201,206,0.16) 0%, transparent 68%)",
          borderRadius: "50%",
        }}
      />

      {/* ── Layer 3: 7 teal floating dots ── */}
      {([
        { ox: -148, oy: -55,  r: 4.5, delay: 0    },
        { ox:  152, oy: -48,  r: 3.5, delay: 0.7  },
        { ox: -115, oy:  110, r: 5.5, delay: 1.3  },
        { ox:  118, oy:  105, r: 3.5, delay: 0.4  },
        { ox:    4, oy: -148, r: 4.5, delay: 1.0  },
        { ox: -158, oy:   48, r: 3.0, delay: 1.8  },
        { ox:  155, oy:   52, r: 4.0, delay: 0.9  },
      ] as const).map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary pointer-events-none"
          style={{
            width:  p.r * 2,
            height: p.r * 2,
            left: "50%",
            top:  "50%",
            marginLeft: -p.r,
            marginTop:  -p.r,
          }}
          animate={reduce ? {} : {
            x: [p.ox, p.ox + 9,  p.ox - 6, p.ox],
            y: [p.oy, p.oy - 11, p.oy + 7, p.oy],
            opacity: [0.55, 1, 0.38, 0.55],
          }}
          transition={{ duration: 3.2 + i * 0.33, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* ── Layer 4: PS face-button symbols orbiting ── */}
      {([
        { sym: "△", color: "#4ade80", ox: -155, oy: -68,  delay: 0.15, size: 28 },
        { sym: "○", color: "#f87171", ox:  158, oy: -62,  delay: 0.65, size: 26 },
        { sym: "×", color: "#60a5fa", ox:  155, oy:  72,  delay: 1.15, size: 28 },
        { sym: "□", color: "#f472b6", ox: -155, oy:  72,  delay: 1.65, size: 24 },
      ] as const).map((b, i) => (
        <motion.span
          key={i}
          className="absolute font-black pointer-events-none leading-none"
          style={{
            color:    b.color,
            fontSize: b.size,
            left: "50%",
            top:  "50%",
            marginLeft: -b.size / 2,
            marginTop:  -b.size / 2,
            textShadow: `0 0 20px ${b.color}55`,
          }}
          animate={reduce ? {} : {
            x: [b.ox, b.ox + 8,  b.ox - 5, b.ox],
            y: [b.oy, b.oy - 10, b.oy + 7, b.oy],
            opacity: [0.55, 1, 0.38, 0.55],
            scale:   [1,    1.18, 0.92, 1],
          }}
          transition={{ duration: 4 + i * 0.28, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        >
          {b.sym}
        </motion.span>
      ))}

      {/* ── Layer 5: Controller — entrance + float ── */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 28, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.4, 0.64, 1], delay: 0.12 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -11, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ControllerGeometric />
        </motion.div>
      </motion.div>

      {/* ── Layer 6: Scan shimmer ── */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius: 40 }}
        >
          <motion.div
            style={{
              height: 40,
              width: "100%",
              background: "linear-gradient(to bottom, transparent, rgba(113,201,206,0.06), transparent)",
            }}
            animate={{ y: [-40, 540] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />
        </motion.div>
      )}

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ControllerGeometric
   Approach: geometric, intentional, clean.
   Uses simple SVG primitives (rect, circle, ellipse, path)
   with a design-led composition rather than product tracing.

   Composition:
   • Wide pill body — the "soul" of the controller shape
   • Two pill grips hanging down from body corners
   • L2/R2: tall rounded rects above body
   • L1/R1: thin short rects
   • Touchpad: inset rounded rect centre-top
   • Analog sticks: concentric circles bottom-left / bottom-right
   • D-pad: plus-cross left
   • Face buttons: 4 coloured circles right
   • PS button: small circle centre-bottom
   • Light bar: thin colored rect bottom of body
───────────────────────────────────────────────────────────── */
function ControllerGeometric() {
  const T  = "#71C9CE";   // teal accent
  const T2 = "#A6E3E9";   // lighter teal
  const W  = "#f2f8f8";   // body fill (off-white)
  const W2 = "#e0eff0";   // darker fill for grips / triggers
  const S  = "#9dd4d8";   // stroke

  /* ── Reduced-motion-aware motion.circle/rect for glow pulses ── */
  const GlowCircle = ({
    cx, cy, r, fill, delay = 0,
  }: { cx: number; cy: number; r: number; fill: string; delay?: number }) => (
    <motion.circle
      cx={cx} cy={cy} r={r}
      fill={fill}
      style={{ filter: `drop-shadow(0 0 4px ${fill}88)` }}
      animate={{ opacity: [0.78, 1, 0.78] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );

  return (
    <motion.svg
      width="320"
      height="230"
      viewBox="0 0 320 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: "drop-shadow(0 10px 40px rgba(113,201,206,0.20)) drop-shadow(0 2px 8px rgba(0,0,0,0.06))",
      }}
    >
      <defs>
        <linearGradient id="bodyGrad" x1="160" y1="28" x2="160" y2="175" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f7fafa" />
          <stop offset="55%"  stopColor="#eaf5f6" />
          <stop offset="100%" stopColor="#d6ecee" />
        </linearGradient>
        <linearGradient id="gripGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ddf0f2" />
          <stop offset="100%" stopColor="#b2d8dc" />
        </linearGradient>
        <linearGradient id="trigGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e2f2f4" />
          <stop offset="100%" stopColor="#b8dde1" />
        </linearGradient>
        <linearGradient id="tpGrad" x1="138" y1="48" x2="182" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#c4e9ec" />
          <stop offset="100%" stopColor="#8ecdd3" />
        </linearGradient>
        <radialGradient id="stickBaseGrad" cx="42%" cy="38%" r="62%">
          <stop offset="0%"   stopColor="#d6e8ea" />
          <stop offset="100%" stopColor="#8ab6bc" />
        </radialGradient>
        <radialGradient id="stickCapGrad" cx="38%" cy="32%" r="66%">
          <stop offset="0%"   stopColor="#2a3436" />
          <stop offset="100%" stopColor="#0e1416" />
        </radialGradient>
        <linearGradient id="lbarGrad" x1="124" y1="0" x2="196" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="25%"  stopColor="#58b4f4" />
          <stop offset="50%"  stopColor="#3a9eff" />
          <stop offset="75%"  stopColor="#58b4f4" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* ══ GRIPS — behind body ══ */}
      {/* Left grip */}
      <rect x="42" y="132" width="52" height="74" rx="26"
        fill="url(#gripGrad)" stroke={S} strokeWidth="1.2" />
      {/* Right grip */}
      <rect x="226" y="132" width="52" height="74" rx="26"
        fill="url(#gripGrad)" stroke={S} strokeWidth="1.2" />

      {/* ══ BODY — wide pill ══ */}
      <rect x="38" y="38" width="244" height="130" rx="44"
        fill="url(#bodyGrad)" stroke={S} strokeWidth="1.4" />

      {/* ══ L2 TRIGGER ══ */}
      <rect x="44" y="10" width="48" height="40" rx="14"
        fill="url(#trigGrad)" stroke={S} strokeWidth="1.1" />
      {/* ══ R2 TRIGGER ══ */}
      <rect x="228" y="10" width="48" height="40" rx="14"
        fill="url(#trigGrad)" stroke={S} strokeWidth="1.1" />

      {/* ══ L1 BUMPER ══ */}
      <rect x="50" y="46" width="40" height="14" rx="6"
        fill={W2} stroke={S} strokeWidth="1" />
      {/* ══ R1 BUMPER ══ */}
      <rect x="230" y="46" width="40" height="14" rx="6"
        fill={W2} stroke={S} strokeWidth="1" />

      {/* ══ TOUCHPAD ══ */}
      <motion.rect
        x="126" y="50" width="68" height="50" rx="10"
        fill="url(#tpGrad)" stroke={T} strokeWidth="0.9"
        animate={{ opacity: [0.82, 1, 0.82] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Touchpad divider */}
      <line x1="160" y1="52" x2="160" y2="98" stroke={T} strokeWidth="0.6" opacity="0.4" />

      {/* ══ LIGHT BAR — thin blue arc above touchpad ══ */}
      <motion.rect
        x="136" y="45" width="48" height="5" rx="2.5"
        fill="url(#lbarGrad)"
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ══ CREATE button ══ */}
      <motion.rect x="108" y="68" width="12" height="7" rx="3.5"
        fill={T2} stroke={S} strokeWidth="0.6"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.6, repeat: Infinity }}
      />
      {/* ══ OPTIONS button ══ */}
      <motion.rect x="200" y="68" width="12" height="7" rx="3.5"
        fill={T2} stroke={S} strokeWidth="0.6"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 1.3 }}
      />

      {/* ══ D-PAD ══ */}
      {/* vertical bar */}
      <rect x="88" y="88" width="11" height="32" rx="3"
        fill={W2} stroke={S} strokeWidth="0.8" />
      {/* horizontal bar */}
      <rect x="77" y="99" width="33" height="11" rx="3"
        fill={W2} stroke={S} strokeWidth="0.8" />
      {/* centre square */}
      <rect x="88" y="99" width="11" height="11" rx="1.5"
        fill="#c6e0e4" />

      {/* ══ FACE BUTTONS ══ */}
      {/* △ green — top */}
      <GlowCircle cx={210} cy={82}  r={9.5} fill="#22c55e" delay={0}    />
      <text x="210" y="86.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">△</text>
      {/* □ pink — left */}
      <GlowCircle cx={197} cy={97}  r={9.5} fill="#ec4899" delay={0.55} />
      <text x="197" y="101.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">□</text>
      {/* ○ red — right */}
      <GlowCircle cx={223} cy={97}  r={9.5} fill="#ef4444" delay={1.1}  />
      <text x="223" y="101.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="800">○</text>
      {/* × blue — bottom */}
      <GlowCircle cx={210} cy={112} r={9.5} fill="#3b82f6" delay={1.65} />
      <text x="210" y="116.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="800">×</text>

      {/* ══ LEFT ANALOG STICK ══ */}
      <circle cx="104" cy="138" r="18" fill="url(#stickBaseGrad)" stroke={S} strokeWidth="1.2" />
      <circle cx="104" cy="138" r="12" fill="none" stroke={T2} strokeWidth="0.5" opacity="0.4" />
      {/* Dot grid texture */}
      {[-6,-3,0,3,6].flatMap(dx =>
        [-6,-3,0,3,6].map(dy =>
          Math.abs(dx) + Math.abs(dy) <= 8 ? (
            <circle key={`L${dx}${dy}`} cx={104+dx} cy={138+dy} r="0.9" fill={T2} opacity="0.3" />
          ) : null
        )
      )}
      {/* Thumb cap — drifts */}
      <motion.circle
        cx="104" cy="138" r="10"
        fill="url(#stickCapGrad)"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" }}
        animate={{ cx: [104, 107, 101, 104], cy: [138, 135, 141, 138] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ══ RIGHT ANALOG STICK ══ */}
      <circle cx="186" cy="138" r="18" fill="url(#stickBaseGrad)" stroke={S} strokeWidth="1.2" />
      <circle cx="186" cy="138" r="12" fill="none" stroke={T2} strokeWidth="0.5" opacity="0.4" />
      {[-6,-3,0,3,6].flatMap(dx =>
        [-6,-3,0,3,6].map(dy =>
          Math.abs(dx) + Math.abs(dy) <= 8 ? (
            <circle key={`R${dx}${dy}`} cx={186+dx} cy={138+dy} r="0.9" fill={T2} opacity="0.3" />
          ) : null
        )
      )}
      <motion.circle
        cx="186" cy="138" r="10"
        fill="url(#stickCapGrad)"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" }}
        animate={{ cx: [186, 183, 189, 186], cy: [138, 141, 135, 138] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      />

      {/* ══ PS BUTTON ══ */}
      <motion.circle
        cx="145" cy="138" r="10"
        fill="white"
        stroke={S}
        strokeWidth="1.1"
        style={{ filter: `drop-shadow(0 0 6px ${T}66)` }}
        animate={{ opacity: [0.85, 1, 0.7, 1, 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="145" y="142.5" textAnchor="middle" fill={T} fontSize="7.5" fontWeight="800">PS</text>

      {/* ══ MUTE BUTTON ══ */}
      <motion.circle
        cx="145" cy="153" r="4"
        fill={T2}
        stroke={S}
        strokeWidth="0.6"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />

      {/* ══ TOP BODY SEAM ══ */}
      <path d="M 106 46 Q 134 40 160 39 Q 186 40 214 46"
        stroke={S} strokeWidth="0.6" fill="none" opacity="0.45" />
    </motion.svg>
  );
}
