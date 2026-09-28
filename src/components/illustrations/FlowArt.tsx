import { ACCENTS, type Accent } from "./palette";

const CARTRIDGE_FILLS = ["#e9eef2", "#f3d9a8", "#2f3b43", "#dff2fb", "#cfeee3"];

/** Under-sink system: a faucet and 3–5 translucent housings on a bracket. */
export function FlowArt({
  accent = "blue",
  stages = 3,
  uid,
  className = "",
}: {
  accent?: Accent;
  stages?: number;
  uid: string;
  className?: string;
}) {
  const color = ACCENTS[accent];
  const count = Math.min(5, Math.max(3, stages));
  const width = 30;
  const gap = 8;
  const total = count * width + (count - 1) * gap;
  const startX = 120 - total / 2 + 14;
  const housing = `fh-${uid}`;
  const chrome = `fc-${uid}`;
  return (
    <svg viewBox="0 0 240 220" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={housing} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#d7ecf8" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={chrome} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9fb4c2" />
          <stop offset="0.5" stopColor="#eef4f8" />
          <stop offset="1" stopColor="#8aa1b1" />
        </linearGradient>
      </defs>
      <ellipse cx="128" cy="206" rx="86" ry="7" fill="#0b3a53" opacity="0.08" />
      {/* faucet */}
      <rect x="18" y="150" width="30" height="8" rx="3" fill={`url(#${chrome})`} />
      <rect x="28" y="54" width="10" height="100" rx="5" fill={`url(#${chrome})`} />
      <path d="M33 60c0-30 44-34 50-6" stroke={`url(#${chrome})`} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M83 58v10" stroke="#7cc6ee" strokeWidth="4" strokeLinecap="round" />
      <path d="M83 76v14M83 98v8" stroke="#7cc6ee" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      {/* bracket */}
      <rect x={startX - 8} y="62" width={total + 16} height="14" rx="5" fill={color} />
      <path d={`M${startX - 8} 69h-20`} stroke="#b8d9ec" strokeWidth="4" strokeLinecap="round" />
      {Array.from({ length: count }, (_, i) => {
        const x = startX + i * (width + gap);
        return (
          <g key={i}>
            <rect x={x} y="76" width={width} height="118" rx="12" fill={`url(#${housing})`} stroke="#b8d9ec" strokeWidth="1.5" />
            <rect x={x + 7} y="88" width={width - 14} height="92" rx="7" fill={CARTRIDGE_FILLS[i % CARTRIDGE_FILLS.length]} />
            {i === 2 &&
              Array.from({ length: 6 }, (_, d) => (
                <circle key={d} cx={x + 11 + (d % 2) * 8} cy={98 + d * 12} r="2" fill="#586a75" />
              ))}
            <rect x={x + 3} y="72" width={width - 6} height="10" rx="4" fill={color} opacity="0.85" />
            <path d={`M${x + 6} 96v80`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </g>
        );
      })}
    </svg>
  );
}
