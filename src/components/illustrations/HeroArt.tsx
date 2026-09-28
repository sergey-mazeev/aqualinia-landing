import { PitcherArt } from "./PitcherArt";

/** Hero composition: a glass filling with water, a pitcher and floating drops. */
export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 520 520" className="h-full w-full">
        <defs>
          <radialGradient id="hero-blob" cx="0.45" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#d9effb" />
            <stop offset="1" stopColor="#bfe5f8" />
          </radialGradient>
          <linearGradient id="hero-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9fd6f3" />
            <stop offset="1" stopColor="#0077b6" />
          </linearGradient>
          <linearGradient id="hero-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#e3f3fc" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="hero-stream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc6ee" stopOpacity="0" />
            <stop offset="1" stopColor="#7cc6ee" />
          </linearGradient>
          <clipPath id="hero-glass-clip">
            <path d="M190 170h180l-20 270a16 16 0 0 1-16 15H226a16 16 0 0 1-16-15L190 170Z" />
          </clipPath>
        </defs>
        <path
          d="M262 36c96-8 196 52 218 150s-24 214-120 262-230 34-290-40S12 250 50 164 166 44 262 36Z"
          fill="url(#hero-blob)"
        />
        <circle cx="430" cy="110" r="40" fill="#ddf5ec" />
        <circle cx="96" cy="400" r="26" fill="#ddf5ec" />
        {/* stream */}
        <rect x="273" y="40" width="14" height="190" rx="7" fill="url(#hero-stream)" />
        {/* glass */}
        <g clipPath="url(#hero-glass-clip)">
          <rect x="180" y="170" width="200" height="300" fill="url(#hero-glass)" />
          <path
            className="hero-wave"
            d="M150 250c30-12 50 12 80 0s50-12 80 0 50 12 80 0 50-12 80 0v240H150Z"
            fill="url(#hero-water)"
            opacity="0.9"
          />
          <path d="M150 262c30-10 50 10 80 0s50-10 80 0 50 10 80 0 50-10 80 0" stroke="#fff" strokeWidth="3" fill="none" opacity="0.6" />
        </g>
        <path
          d="M190 170h180l-20 270a16 16 0 0 1-16 15H226a16 16 0 0 1-16-15L190 170Z"
          fill="none"
          stroke="#a9d3ea"
          strokeWidth="3"
        />
        <path d="M212 190l14 230" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity="0.75" />
        {/* bubbles */}
        <circle className="hero-bubble" cx="300" cy="400" r="6" fill="#fff" opacity="0.8" />
        <circle className="hero-bubble [animation-delay:1.2s]" cx="326" cy="420" r="4" fill="#fff" opacity="0.8" />
        <circle className="hero-bubble [animation-delay:2.1s]" cx="262" cy="430" r="5" fill="#fff" opacity="0.8" />
        {/* drops */}
        <path className="animate-float" d="M92 150s18 19 18 32a18 18 0 0 1-36 0c0-13 18-32 18-32Z" fill="#7cc6ee" />
        <path
          className="animate-float [animation-delay:1.5s]"
          d="M440 250s12 13 12 22a12 12 0 0 1-24 0c0-9 12-22 12-22Z"
          fill="#1f7a66"
          opacity="0.75"
        />
        <path
          className="animate-float [animation-delay:3s]"
          d="M150 70s9 10 9 16a9 9 0 0 1-18 0c0-6 9-16 9-16Z"
          fill="#0077b6"
          opacity="0.6"
        />
      </svg>
      <PitcherArt uid="hero" accent="sea" className="absolute bottom-[6%] left-[2%] w-[34%] drop-shadow-xl" />
    </div>
  );
}
