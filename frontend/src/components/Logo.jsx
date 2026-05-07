import React from 'react';

// FlyYaro — Logo Mark (icon only)
// A rounded gradient badge containing a stylized paper plane forming a subtle "Y" with its trail.
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
      {/* Paper plane swooping up-right */}
      <path
        d="M50 14 L14 30 L26 35 L31 50 Z"
        fill="#ffffff"
      />
      {/* Inner crease */}
      <path
        d="M50 14 L26 35 L31 50 Z"
        fill="#ffffff"
        fillOpacity="0.55"
      />
      {/* Curved trail forming the Y tail */}
      <path
        d="M14 30 Q22 46 36 44"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
        strokeDasharray="3 4"
      />
    </svg>
  );
}

// Horizontal lockup: mark + wordmark + (optional) slogan
export function LogoHorizontal({
  height = 40,
  variant = 'dark', // 'dark' (for light bg) | 'light' (for dark bg)
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

// Stacked variant: mark above wordmark
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

// Pure SVG strings (for download)
export const LOGO_SVG = {
  mark: () => `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0770e3"/>
      <stop offset="55%" stop-color="#0a8df0"/>
      <stop offset="100%" stop-color="#00d1c1"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#g)"/>
  <path d="M50 14 L14 30 L26 35 L31 50 Z" fill="#ffffff"/>
  <path d="M50 14 L26 35 L31 50 Z" fill="#ffffff" fill-opacity="0.55"/>
  <path d="M14 30 Q22 46 36 44" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.7" stroke-dasharray="3 4"/>
</svg>`,

  horizontal: (variant = 'dark') => {
    const wordPrimary = variant === 'light' ? '#ffffff' : '#0a2540';
    const wordAccent = variant === 'light' ? '#00d1c1' : '#0770e3';
    const sloganColor = variant === 'light' ? '#9ec3e6' : '#5a7a99';
    const bg = variant === 'light' ? '#05203c' : '#ffffff';
    return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="280" viewBox="0 0 900 280">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0770e3"/>
      <stop offset="55%" stop-color="#0a8df0"/>
      <stop offset="100%" stop-color="#00d1c1"/>
    </linearGradient>
  </defs>
  <rect width="900" height="280" fill="${bg}"/>
  <g transform="translate(60 80) scale(1.875)">
    <rect width="64" height="64" rx="16" fill="url(#g)"/>
    <path d="M50 14 L14 30 L26 35 L31 50 Z" fill="#ffffff"/>
    <path d="M50 14 L26 35 L31 50 Z" fill="#ffffff" fill-opacity="0.55"/>
    <path d="M14 30 Q22 46 36 44" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.7" stroke-dasharray="3 4"/>
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
    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0770e3"/>
      <stop offset="55%" stop-color="#0a8df0"/>
      <stop offset="100%" stop-color="#00d1c1"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="${bg}"/>
  <g transform="translate(220 140) scale(2.5)">
    <rect width="64" height="64" rx="16" fill="url(#g)"/>
    <path d="M50 14 L14 30 L26 35 L31 50 Z" fill="#ffffff"/>
    <path d="M50 14 L26 35 L31 50 Z" fill="#ffffff" fill-opacity="0.55"/>
    <path d="M14 30 Q22 46 36 44" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.7" stroke-dasharray="3 4"/>
  </g>
  <text x="300" y="430" text-anchor="middle" font-family="Inter, sans-serif" font-size="80" font-weight="800" letter-spacing="-2">
    <tspan fill="${wordPrimary}">Fly</tspan><tspan fill="${wordAccent}">Yaro</tspan>
  </text>
  <text x="300" y="475" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" font-weight="600" fill="${sloganColor}" letter-spacing="4">BOOK SMART. FLY BETTER.</text>
</svg>`;
  },
};
