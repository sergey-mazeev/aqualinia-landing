import { ACCENTS, type Accent } from "./palette";

/** Stylised filter pitcher. `uid` keeps gradient ids unique when rendered several times. */
export function PitcherArt({ accent = "blue", uid, className = "" }: { accent?: Accent; uid: string; className?: string }) {
  const color = ACCENTS[accent];
  const water = `pw-${uid}`;
  const glass = `pg-${uid}`;
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={water} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe5f8" />
          <stop offset="1" stopColor="#7cc6ee" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#eaf6fd" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <ellipse cx="96" cy="206" rx="64" ry="7" fill="#0b3a53" opacity="0.08" />
      {/* handle */}
      <path d="M146 72c26 2 34 22 30 48s-18 42-36 44" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* body */}
      <path d="M40 58h110l-8 138a10 10 0 0 1-10 9H58a10 10 0 0 1-10-9L40 58Z" fill={`url(#${glass})`} stroke="#b8d9ec" strokeWidth="2" />
      {/* water */}
      <path d="M47 118c16-7 30 6 50 0s32-8 49 0l-4 78a8 8 0 0 1-8 7H59a8 8 0 0 1-8-7l-4-78Z" fill={`url(#${water})`} />
      {/* reservoir + cartridge */}
      <path d="M52 58h86l-4 34H56l-4-34Z" fill="#ffffff" opacity="0.7" stroke="#b8d9ec" strokeWidth="1.5" />
      <rect x="82" y="80" width="26" height="40" rx="9" fill={color} opacity="0.9" />
      <rect x="86" y="86" width="6" height="26" rx="3" fill="#fff" opacity="0.45" />
      {/* lid */}
      <path d="M34 50c0-8 6-14 14-14h96c8 0 12 6 12 12v10H34v-8Z" fill={color} />
      <path d="M34 50c0-8 6-14 14-14h14l-8 22H34v-8Z" fill="#fff" opacity="0.25" />
      <circle cx="140" cy="46" r="4" fill="#fff" opacity="0.9" />
      {/* highlight */}
      <path d="M58 70l6 118" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <circle cx="120" cy="160" r="4" fill="#fff" opacity="0.7" />
      <circle cx="106" cy="178" r="2.5" fill="#fff" opacity="0.7" />
    </svg>
  );
}
