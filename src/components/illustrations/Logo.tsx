export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7cc6ee" />
          <stop offset="1" stopColor="#0077b6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#logo-g)" />
      <path d="M20 8s8 8.4 8 14.2a8 8 0 0 1-16 0C12 16.4 20 8 20 8Z" fill="#fff" />
      <path d="M15.5 24c1.6 2.4 5.2 3.3 8 1.2" stroke="#0077b6" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
