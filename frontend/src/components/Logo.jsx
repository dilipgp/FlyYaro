import React from 'react';

// Airplane silhouette (top-down, swept wings, jet tail) — used everywhere
// Wrapped in a rotation group so it tilts up-right like taking off.
const PLANE_PATH =
  'M32 8 L35 25 L58 31 L58 35 L35 32 L34 45 L42 51 L42 53 L32 50 L22 53 L22 51 L30 45 L29 32 L6 35 L6 31 L29 25 Z';
const PLANE_ROTATION = 40;

// FlyYaro — Logo Mark (icon only)
export function LogoMark({ size = 40, className = '' }) {
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FlyYaro logo mark"
    >
      <defs>
        <linearGradient id={`flyyaro-grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0770e3" />
          <stop offset="55%" stopColor="#0a8df0" />
          <stop offset="100%" stopColor="#00d1c1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx="16" fill={`url(#flyyaro-grad-${id})`} />

      {/* Subtle dotted contrail behind the plane (lower-left to mid) */}
      <path
        d="M9 54 Q18 48 26 42"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
        strokeDasharray="2 4"
      />

      {/* Airplane silhouette tilted up-right */}
      <g transform={`rotate(${PLANE_ROTATION} 32 32)`}>
        <path d={PLANE_PATH} fill="#ffffff" />
        {/* Subtle inner shading on wing root for depth */}
        <path
          d="M32 8 L35 25 L34 45 L32 50 Z"
          fill="#ffffff"
          fillOpacity="0.65"
        />
      </g>
    </svg>
  );
}

// Horizontal lockup: mark + wordmark + (optional) slogan
export function LogoHorizontal({
  height = 40,
  variant = 'dark',
  withSlogan = true,
  className = '',
}) {
  const wordPrimary = variant === 'light' ? '#ffffff' : '#0a2540';
  const wordAccent = variant === 'light' ? '#00d1c1' : '#0770e3';
  const sloganColor = variant === 'light' ? '#9ec3e6' : '#5a7a99';
  const wordSize = height * 0.7;
  const sloganSize = height * 0.24;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} style={{ height }}>
      <LogoMark size={height} />
      <div className="flex flex-col leading-none">
        <div
          style={{
            fontSize: wordSize,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: wordPrimary }}>Fly</span>
          <span style={{ color: wordAccent }}>Yaro</span>
        </div>
        {withSlogan && (
          <div
            style={{
              fontSize: sloganSize,
              color: sloganColor,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: height * 0.1,
            }}
          >
            Book Smart. Fly Better.
          </div>
        )}
      </div>
    </div>
  );
}

// Stacked variant
export function LogoStacked({ size = 80, variant = 'dark', withSlogan = true, className = '' }) {
  const wordPrimary = variant === 'light' ? '#ffffff' : '#0a2540';
  const wordAccent = variant === 'light' ? '#00d1c1' : '#0770e3';
  const sloganColor = variant === 'light' ? '#9ec3e6' : '#5a7a99';

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      <div className="text-center leading-none">
        <div
          style={{
            fontSize: size * 0.42,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: wordPrimary }}>Fly</span>
          <span style={{ color: wordAccent }}>Yaro</span>
        </div>
        {withSlogan && (
          <div
            style={{
              fontSize: size * 0.13,
              color: sloganColor,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: size * 0.08,
            }}
          >
            Book Smart. Fly Better.
          </div>
        )}
      </div>
    </div>
  );
}

// --- Pure SVG strings (for downloads / clipboard) -------------------------

const MARK_INNER = `
  <rect width="64" height="64" rx="16" fill="url(#g)"/>
  <path d="M9 54 Q18 48 26 42" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.55" stroke-dasharray="2 4"/>
  <g transform="rotate(${PLANE_ROTATION} 32 32)">
    <path d="${PLANE_PATH}" fill="#ffffff"/>
    <path d="M32 8 L35 25 L34 45 L32 50 Z" fill="#ffffff" fill-opacity="0.65"/>
  </g>`;

const GRADIENT_DEF = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0770e3"/>
      <stop offset="55%" stop-color="#0a8df0"/>
      <stop offset="100%" stop-color="#00d1c1"/>
    </linearGradient>
  </defs>`;

export const LOGO_SVG = {
  mark: () => `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 64 64">${GRADIENT_DEF}${MARK_INNER}
</svg>`,

  horizontal: (variant = 'dark') => {
    const wordPrimary = variant === 'light' ? '#ffffff' : '#0a2540';
    const wordAccent = variant === 'light' ? '#00d1c1' : '#0770e3';
    const sloganColor = variant === 'light' ? '#9ec3e6' : '#5a7a99';
    const bg = variant === 'light' ? '#05203c' : '#ffffff';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="280" viewBox="0 0 900 280">${GRADIENT_DEF}
  <rect width="900" height="280" fill="${bg}"/>
  <g transform="translate(60 80) scale(1.875)">${MARK_INNER}
  </g>
  <text x="220" y="160" font-family="Inter, sans-serif" font-size="86" font-weight="800" letter-spacing="-2">
    <tspan fill="${wordPrimary}">Fly</tspan><tspan fill="${wordAccent}">Yaro</tspan>
  </text>
  <text x="222" y="200" font-family="Inter, sans-serif" font-size="22" font-weight="600" fill="${sloganColor}" letter-spacing="3">BOOK SMART. FLY BETTER.</text>
</svg>`;
  },

  stacked: (variant = 'dark') => {
    const wordPrimary = variant === 'light' ? '#ffffff' : '#0a2540';
    const wordAccent = variant === 'light' ? '#00d1c1' : '#0770e3';
    const sloganColor = variant === 'light' ? '#9ec3e6' : '#5a7a99';
    const bg = variant === 'light' ? '#05203c' : '#ffffff';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">${GRADIENT_DEF}
  <rect width="600" height="600" fill="${bg}"/>
  <g transform="translate(220 140) scale(2.5)">${MARK_INNER}
  </g>
  <text x="300" y="430" text-anchor="middle" font-family="Inter, sans-serif" font-size="80" font-weight="800" letter-spacing="-2">
    <tspan fill="${wordPrimary}">Fly</tspan><tspan fill="${wordAccent}">Yaro</tspan>
  </text>
  <text x="300" y="475" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" font-weight="600" fill="${sloganColor}" letter-spacing="4">BOOK SMART. FLY BETTER.</text>
</svg>`;
  },
};
