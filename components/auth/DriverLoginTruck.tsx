"use client";

export type TruckAnimationState = "idle" | "departing";

interface DriverLoginTruckProps {
  state: TruckAnimationState;
}

/**
 * Custom inline SVG truck for the driver login screen. No raster/stock
 * assets — every part is a drawn shape so the idle/departing animation
 * states can drive individual pieces (wheels, headlights, body) with CSS.
 */
export function DriverLoginTruck({ state }: DriverLoginTruckProps) {
  return (
    <div className={`truck-stage truck-stage--${state}`} aria-hidden="true">
      <svg
        className="truck-svg"
        viewBox="0 0 420 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cabGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3f47" />
            <stop offset="100%" stopColor="#23262b" />
          </linearGradient>
          <linearGradient id="cargoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a4f57" />
            <stop offset="100%" stopColor="#2c2f34" />
          </linearGradient>
          <radialGradient id="headlightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffcf7a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffcf7a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ground shadow */}
        <ellipse className="truck-shadow" cx="205" cy="182" rx="170" ry="10" />

        <g className="truck-body">
          {/* cargo body */}
          <rect x="18" y="58" width="230" height="86" rx="6" fill="url(#cargoGradient)" />
          <rect x="18" y="58" width="230" height="10" rx="4" fill="#5b606a" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={48 + i * 38}
              y1="70"
              x2={48 + i * 38}
              y2="144"
              stroke="#1c1e22"
              strokeWidth="2"
              opacity="0.5"
            />
          ))}

          {/* cab */}
          <path
            d="M248 144 V86 Q248 70 264 70 H336 Q352 70 360 84 L382 118 V144 Z"
            fill="url(#cabGradient)"
          />
          {/* windshield */}
          <path
            d="M266 82 H332 Q340 82 345 90 L358 112 H266 Z"
            fill="#9fd4e8"
            opacity="0.85"
          />
          <path
            d="M266 82 H332 Q340 82 345 90 L358 112 H266 Z"
            fill="#0d1a1f"
            opacity="0.15"
          />

          {/* headlight */}
          <circle className="truck-headlight-glow" cx="386" cy="132" r="16" fill="url(#headlightGlow)" />
          <rect className="truck-headlight" x="378" y="122" width="10" height="18" rx="3" fill="#ffe3a3" />

          {/* tail light */}
          <rect className="truck-taillight" x="14" y="96" width="8" height="16" rx="2" fill="#c23b3b" />

          {/* chassis */}
          <rect x="30" y="144" width="345" height="8" rx="3" fill="#16181b" />
        </g>

        {/* wheels */}
        <g className="truck-wheel truck-wheel--front">
          <circle cx="330" cy="156" r="22" fill="#111214" />
          <circle cx="330" cy="156" r="10" fill="#7a7f88" />
          <circle cx="330" cy="156" r="3.5" fill="#2a2c30" />
        </g>
        <g className="truck-wheel truck-wheel--rear">
          <circle cx="90" cy="156" r="22" fill="#111214" />
          <circle cx="90" cy="156" r="10" fill="#7a7f88" />
          <circle cx="90" cy="156" r="3.5" fill="#2a2c30" />
        </g>
        <g className="truck-wheel truck-wheel--rear2">
          <circle cx="146" cy="156" r="22" fill="#111214" />
          <circle cx="146" cy="156" r="10" fill="#7a7f88" />
          <circle cx="146" cy="156" r="3.5" fill="#2a2c30" />
        </g>
      </svg>
    </div>
  );
}
