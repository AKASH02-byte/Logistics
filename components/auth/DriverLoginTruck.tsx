"use client";

export type TruckAnimationState = "idle" | "departing";

interface DriverLoginTruckProps {
  state: TruckAnimationState;
}

/**
 * Detailed inline SVG heavy-duty commercial truck illustration.
 * All shapes are drawn vectors — no raster assets.
 * Re-uses .truck-stage, .truck-body, .truck-wheel, .truck-headlight-glow etc.
 * CSS hooks from globals.css drive the idle float, headlight pulse, wheel spin,
 * and depart animation without any additional JS.
 */
export function DriverLoginTruck({ state }: DriverLoginTruckProps) {
  return (
    <div className={`truck-stage truck-stage--${state}`} aria-hidden="true">
      <svg
        className="truck-svg"
        viewBox="0 0 560 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ── Gradients ── */}
          <linearGradient id="trailerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#46494f" />
            <stop offset="55%" stopColor="#2f3238" />
            <stop offset="100%" stopColor="#1c1e22" />
          </linearGradient>
          <linearGradient id="cabGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d4148" />
            <stop offset="50%" stopColor="#2a2e35" />
            <stop offset="100%" stopColor="#1a1d22" />
          </linearGradient>
          <linearGradient id="hoodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a4f58" />
            <stop offset="100%" stopColor="#23262b" />
          </linearGradient>
          <linearGradient id="windshieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c2e0f0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#5a9abf" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="chassisGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2d32" />
            <stop offset="100%" stopColor="#111315" />
          </linearGradient>
          <linearGradient id="tankGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4e535b" />
            <stop offset="100%" stopColor="#2c2f36" />
          </linearGradient>
          <radialGradient id="headlightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd97a" stopOpacity="1" />
            <stop offset="60%" stopColor="#ffb347" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffa020" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="wheelGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#3a3d43" />
            <stop offset="100%" stopColor="#0e0f11" />
          </radialGradient>
          <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#888d96" />
            <stop offset="100%" stopColor="#4a4f57" />
          </linearGradient>

          {/* ── Filters ── */}
          <filter id="shadowBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="glowFilter" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════
            GROUND — road surface + shadow
            ══════════════════════════════════════════════ */}
        <ellipse
          className="truck-shadow"
          cx="280" cy="198" rx="240" ry="10"
          fill="rgba(0,0,0,0.5)"
          filter="url(#shadowBlur)"
        />
        {/* Road stripe */}
        <rect x="0" y="202" width="560" height="3" rx="1.5" fill="rgba(255,255,255,0.04)" />

        {/* ══════════════════════════════════════════════
            MAIN BODY GROUP — floats on idle
            ══════════════════════════════════════════════ */}
        <g className="truck-body">

          {/* ─────────────────────────────────────────
              TRAILER / CARGO BOX
              ───────────────────────────────────────── */}
          {/* Main trailer box */}
          <rect x="20" y="64" width="280" height="112" rx="4" fill="url(#trailerGrad)" />
          {/* Roof highlight strip */}
          <rect x="20" y="64" width="280" height="9" rx="4" fill="#606570" />
          {/* Bottom sill */}
          <rect x="20" y="166" width="280" height="7" rx="2" fill="#1a1c20" />
          {/* Vertical panel ribs */}
          {[55, 97, 139, 181, 223, 265].map((x) => (
            <rect key={x} x={x} y="73" width="3" height="96" rx="1" fill="rgba(0,0,0,0.35)" />
          ))}
          {/* Horizontal belt line */}
          <rect x="20" y="118" width="280" height="4" rx="1" fill="rgba(0,0,0,0.3)" />
          {/* Rear doors detail */}
          <rect x="20" y="69" width="32" height="104" rx="2" fill="rgba(0,0,0,0.15)" stroke="#111" strokeWidth="1" />
          {/* Rear door handle */}
          <rect x="28" y="112" width="4" height="18" rx="2" fill="#555" />
          {/* Mudflap — rear */}
          <rect x="14" y="160" width="12" height="28" rx="3" fill="#1a1c1f" />
          <ellipse cx="20" cy="174" rx="4" ry="4" fill="#0d0e10" />

          {/* Tail lights */}
          <rect className="truck-taillight" x="14" y="90" width="9" height="20" rx="2" fill="#c23b3b" />
          <rect x="14" y="112" width="9" height="12" rx="2" fill="#e8a020" />

          {/* ─────────────────────────────────────────
              CHASSIS / FRAME
              ───────────────────────────────────────── */}
          <rect x="30" y="173" width="460" height="9" rx="3" fill="url(#chassisGrad)" />
          {/* Cross members */}
          {[70, 130, 190, 310, 390, 450].map((x) => (
            <rect key={x} x={x} y="168" width="8" height="12" rx="1" fill="#1e2025" />
          ))}

          {/* ─────────────────────────────────────────
              FUEL TANK (between axles, under cab)
              ───────────────────────────────────────── */}
          <rect x="340" y="158" width="50" height="18" rx="6" fill="url(#tankGrad)" stroke="#3a3d43" strokeWidth="1" />
          <ellipse cx="390" cy="167" rx="4" ry="8" fill="#3a3e46" />
          <ellipse cx="340" cy="167" rx="4" ry="8" fill="#3a3e46" />
          {/* Fuel cap */}
          <circle cx="365" cy="159" r="4" fill="#4a4f58" stroke="#5a5f68" strokeWidth="0.75" />

          {/* ─────────────────────────────────────────
              CAB
              ───────────────────────────────────────── */}
          {/* Cab sleeper box */}
          <rect x="300" y="78" width="68" height="96" rx="5" fill="#2d3038" />
          <rect x="300" y="78" width="68" height="9" rx="4" fill="#474c55" />
          {/* Sleeper window */}
          <rect x="310" y="92" width="46" height="30" rx="4" fill="#1a252e" stroke="#3a4a55" strokeWidth="1" />
          <rect x="310" y="92" width="46" height="30" rx="4" fill="url(#windshieldGrad)" opacity="0.4" />

          {/* Main cab body */}
          <path
            d="M368 174 V88 Q368 76 378 74 H430 Q442 74 452 86 L490 134 V174 Z"
            fill="url(#cabGrad)"
          />
          {/* Cab roof spoiler */}
          <path d="M378 74 H430 Q440 74 448 70 Q440 62 428 62 H384 Q374 62 373 70 Z" fill="#3a3f47" />
          {/* Roof top fairing */}
          <rect x="374" y="60" width="72" height="6" rx="3" fill="#4a5060" />

          {/* Door panel */}
          <path
            d="M368 100 V174 H440 V134 L408 100 Z"
            fill="#2a2e36"
            stroke="#1a1c22"
            strokeWidth="1"
          />
          {/* Door chrome trim line */}
          <line x1="368" y1="136" x2="440" y2="136" stroke="#4a4f58" strokeWidth="1.5" />
          {/* Door handle */}
          <rect x="418" y="145" width="18" height="5" rx="2.5" fill="#5c6268" stroke="#6c7278" strokeWidth="0.5" />

          {/* Windshield */}
          <path
            d="M378 82 H430 Q440 82 448 92 L462 124 H378 Z"
            fill="url(#windshieldGrad)"
          />
          {/* Windshield reflection stripe */}
          <path
            d="M388 86 H424 Q432 86 438 94 L444 108 H392 Z"
            fill="rgba(255,255,255,0.12)"
          />
          {/* Windshield wiper */}
          <line x1="400" y1="122" x2="455" y2="108" stroke="#222528" strokeWidth="2" strokeLinecap="round" />

          {/* A-pillar / window frame */}
          <path
            d="M378 82 L378 100 L408 100 L378 82"
            fill="#222528"
          />

          {/* Side window (small vent glass) */}
          <rect x="370" y="84" width="10" height="18" rx="2" fill="#1a252e" opacity="0.8" />
          <rect x="370" y="84" width="10" height="18" rx="2" fill="url(#windshieldGrad)" opacity="0.5" />

          {/* Side mirror arm */}
          <rect x="460" y="90" width="18" height="4" rx="2" fill="#2a2d32" />
          {/* Mirror head */}
          <rect x="476" y="84" width="14" height="20" rx="4" fill="#353a42" stroke="#4a4f58" strokeWidth="1" />
          <rect x="477" y="85" width="12" height="18" rx="3" fill="#1a252e" opacity="0.7" />

          {/* Exhaust stack */}
          <rect x="452" y="34" width="10" height="40" rx="4" fill="#2a2d32" stroke="#3a3d42" strokeWidth="1" />
          <rect x="450" y="30" width="14" height="8" rx="3" fill="#3a3d42" />
          {/* Exhaust smoke puffs */}
          <circle cx="457" cy="24" r="5" fill="rgba(200,205,215,0.08)" />
          <circle cx="460" cy="16" r="4" fill="rgba(200,205,215,0.05)" />
          <circle cx="454" cy="10" r="3" fill="rgba(200,205,215,0.03)" />

          {/* Step bars under door */}
          <rect x="380" y="168" width="50" height="6" rx="2" fill="#232529" stroke="#353840" strokeWidth="0.75" />
          <rect x="390" y="160" width="30" height="5" rx="2" fill="#1e2025" />

          {/* Air intake / grill on nose */}
          <rect x="484" y="138" width="8" height="26" rx="3" fill="#1a1c20" />
          {[142, 148, 154, 158].map((y) => (
            <rect key={y} x="484" y={y} width="8" height="2" rx="1" fill="#2e3138" />
          ))}

          {/* Front bumper */}
          <rect x="484" y="160" width="22" height="14" rx="3" fill="#222529" />
          <rect x="484" y="160" width="22" height="5" rx="2" fill="#2e3238" />
          {/* Tow hook */}
          <rect x="494" y="172" width="8" height="5" rx="2" fill="#1a1c20" />
          <circle cx="498" cy="177" r="3" fill="#1a1c20" stroke="#2a2d32" strokeWidth="1" />

          {/* Mudflap — front axle */}
          <rect x="478" y="160" width="10" height="25" rx="3" fill="#1a1c1f" />

          {/* ─────────────────────────────────────────
              HEADLIGHTS — glowing elements
              ───────────────────────────────────────── */}
          {/* Beam / cone of light */}
          <path
            d="M496 138 L540 120 L540 158 Z"
            fill="rgba(255,210,100,0.06)"
          />
          {/* Glow halo */}
          <circle
            className="truck-headlight-glow"
            cx="494" cy="144" r="22"
            fill="url(#headlightGlow)"
            filter="url(#glowFilter)"
          />
          {/* Headlight housing */}
          <rect x="487" y="128" width="12" height="26" rx="4" fill="#1a1c20" stroke="#2e3238" strokeWidth="1" />
          {/* Main beam */}
          <rect className="truck-headlight" x="489" y="130" width="9" height="10" rx="2" fill="#6b5a33" />
          {/* DRL strip */}
          <rect className="truck-headlight" x="489" y="143" width="9" height="4" rx="1.5" fill="#6b5a33" opacity="0.7" />
          {/* Turn indicator */}
          <rect x="489" y="149" width="9" height="4" rx="1.5" fill="#c47a15" opacity="0.6" />

          {/* ─────────────────────────────────────────
              LOGO / BADGE on cab door
              ───────────────────────────────────────── */}
          <rect x="376" y="108" width="24" height="12" rx="3" fill="#f5a623" opacity="0.85" />
          <text x="388" y="118" textAnchor="middle" fontSize="6" fontWeight="700" fill="#1a1305" fontFamily="Arial, sans-serif">FLEET</text>

        </g>

        {/* ══════════════════════════════════════════════
            WHEELS — each wheel group spins around its own cx/cy
            ══════════════════════════════════════════════ */}

        {/* TRAILER — drive axle dual rear (outer pair) */}
        {[{ cx: 88, cls: "truck-wheel truck-wheel--rear" }, { cx: 154, cls: "truck-wheel truck-wheel--rear2" }].map(({ cx, cls }) => (
          <g key={cx} className={cls} style={{ transformOrigin: `${cx}px 185px` }}>
            {/* Outer tyre */}
            <circle cx={cx} cy="185" r="26" fill="url(#wheelGrad)" />
            {/* Tyre tread ring */}
            <circle cx={cx} cy="185" r="26" fill="none" stroke="#0a0b0c" strokeWidth="6" />
            <circle cx={cx} cy="185" r="22" fill="none" stroke="#1c1e22" strokeWidth="2" />
            {/* Rim */}
            <circle cx={cx} cy="185" r="16" fill="url(#rimGrad)" />
            {/* Hub */}
            <circle cx={cx} cy="185" r="7" fill="#2a2d33" />
            <circle cx={cx} cy="185" r="3.5" fill="#1a1c20" />
            {/* Lug bolts */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const bx = cx + 11 * Math.cos(rad);
              const by = 185 + 11 * Math.sin(rad);
              return <circle key={deg} cx={bx} cy={by} r="1.8" fill="#4a4f58" />;
            })}
          </g>
        ))}

        {/* CAB front wheel */}
        <g className="truck-wheel truck-wheel--front" style={{ transformOrigin: "418px 185px" }}>
          <circle cx="418" cy="185" r="26" fill="url(#wheelGrad)" />
          <circle cx="418" cy="185" r="26" fill="none" stroke="#0a0b0c" strokeWidth="6" />
          <circle cx="418" cy="185" r="22" fill="none" stroke="#1c1e22" strokeWidth="2" />
          <circle cx="418" cy="185" r="16" fill="url(#rimGrad)" />
          <circle cx="418" cy="185" r="7" fill="#2a2d33" />
          <circle cx="418" cy="185" r="3.5" fill="#1a1c20" />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const bx = 418 + 11 * Math.cos(rad);
            const by = 185 + 11 * Math.sin(rad);
            return <circle key={deg} cx={bx} cy={by} r="1.8" fill="#4a4f58" />;
          })}
          {/* Disc spoke detail — front wheel */}
          {[0, 72, 144, 216, 288].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 418 + 5 * Math.cos(rad), y1 = 185 + 5 * Math.sin(rad);
            const x2 = 418 + 13 * Math.cos(rad), y2 = 185 + 13 * Math.sin(rad);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6a6f78" strokeWidth="1.5" strokeLinecap="round" />;
          })}
        </g>

        {/* ══════════════════════════════════════════════
            ROAD REFLECTORS (decorative dots on ground)
            ══════════════════════════════════════════════ */}
        {[40, 140, 240, 340, 440, 530].map((x) => (
          <rect key={x} x={x} y="203" width="20" height="2" rx="1" fill="rgba(255,255,255,0.06)" />
        ))}
      </svg>
    </div>
  );
}
