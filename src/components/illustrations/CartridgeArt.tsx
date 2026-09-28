/** Cut-away of a filter housing showing the five stage layers, top to bottom. */
export function CartridgeArt({ className = "" }: { className?: string }) {
  const layers = [
    { y: 70, h: 56, fill: "#eef3f6", pattern: "sediment" },
    { y: 128, h: 56, fill: "#f6e3bb", pattern: "resin" },
    { y: 186, h: 56, fill: "#2f3b43", pattern: "carbon" },
    { y: 244, h: 56, fill: "#e4f4fc", pattern: "fibre" },
    { y: 302, h: 56, fill: "#d3f0e5", pattern: "mineral" },
  ];
  return (
    <svg viewBox="0 0 320 420" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cart-shell" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#d4ebf8" stopOpacity="0.9" />
        </linearGradient>
        <clipPath id="cart-clip">
          <rect x="96" y="70" width="128" height="288" rx="26" />
        </clipPath>
      </defs>
      <ellipse cx="160" cy="400" rx="110" ry="10" fill="#0b3a53" opacity="0.08" />
      <rect x="80" y="40" width="160" height="340" rx="40" fill="url(#cart-shell)" stroke="#b8d9ec" strokeWidth="2" />
      <rect x="70" y="26" width="180" height="34" rx="12" fill="#0077b6" />
      <rect x="148" y="8" width="24" height="22" rx="6" fill="#0b3a53" />
      <g clipPath="url(#cart-clip)">
        {layers.map((l) => (
          <rect key={l.y} x="96" y={l.y} width="128" height={l.h} fill={l.fill} />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={`s${i}`} cx={104 + (i * 37) % 116} cy={80 + ((i * 13) % 40)} r="2" fill="#a9b8c2" />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <circle key={`r${i}`} cx={106 + (i % 6) * 21} cy={140 + Math.floor(i / 6) * 15} r="6" fill="#e7b863" opacity="0.8" />
        ))}
        {Array.from({ length: 22 }, (_, i) => (
          <rect key={`c${i}`} x={100 + (i * 29) % 118} y={192 + ((i * 7) % 44)} width="7" height="5" rx="1.5" fill="#0f171c" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`f${i}`} d={`M${104 + i * 14} 248v48`} stroke="#9fd2ee" strokeWidth="3" strokeLinecap="round" />
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={`m${i}`} cx={108 + (i % 8) * 15} cy={316 + Math.floor(i / 8) * 20} r="5" fill="#8fd3b8" />
        ))}
      </g>
      {/* flow arrows */}
      <path d="M52 70v280" stroke="#7cc6ee" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      <path d="M44 340l8 12 8-12" stroke="#7cc6ee" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {layers.map((l, i) => (
        <g key={`n${l.y}`}>
          <circle cx="268" cy={l.y + l.h / 2} r="15" fill="#fff" stroke="#b8d9ec" strokeWidth="1.5" />
          <text x="268" y={l.y + l.h / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0b3a53">
            {i + 1}
          </text>
          <path d={`M228 ${l.y + l.h / 2}h24`} stroke="#b8d9ec" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}
