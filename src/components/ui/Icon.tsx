import type { SVGProps } from "react";

// Minimal stroke icon set (24×24, currentColor).
const paths = {
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 12.5l4.5 4.5L19 7.5",
  chevron: "M6 9l6 6 6-6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  drop: "M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z",
  shield: "M12 3l7 3v5c0 5-3.4 8.6-7 10-3.6-1.4-7-5-7-10V6l7-3ZM8.5 12l2.5 2.5 4.5-5",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  refresh: "M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4",
  badge: "M12 3l2.4 1.6 2.9.1.9 2.7 2.3 1.8-.9 2.8.9 2.8-2.3 1.8-.9 2.7-2.9.1L12 21l-2.4-1.6-2.9-.1-.9-2.7L3.5 15l.9-2.8-.9-2.8 2.3-1.8.9-2.7 2.9-.1L12 3ZM9 12l2 2 4-4",
  wrench: "M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.7-.7-2.3 2.5-2.5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6",
  send: "M21 3L3 10.5l7 2.5 2.5 7L21 3ZM10 13l4-4",
  chat: "M4 5h16v11H9l-5 4V5Z",
  gift: "M4 10h16v4H4zM5 14h14v7H5zM12 10v11M12 10S9 3 6.5 5.5 12 10 12 10Zm0 0s3-7 5.5-4.5S12 10 12 10Z",
  // Problem icons
  flask: "M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7 15h10",
  rust: "M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11ZM10 13h.01M13.5 15.5h.01M12 11h.01M14 12.5h.01",
  kettle: "M6 9h11l-1 11H7L6 9ZM8 9V6a4 4 0 0 1 7 0M17 11h1.5a2 2 0 0 1 0 4H17M8 14h7M8 17h7",
  atom: "M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM12 21c2.2 0 4-4 4-9s-1.8-9-4-9-4 4-4 9 1.8 9 4 9ZM4.2 16.5c1.1 1.9 5.5 1.5 9.8-1s6.9-6 5.8-8-5.5-1.5-9.8 1-6.9 6-5.8 8Z",
  particles: "M6 7h.01M11 5h.01M17 7h.01M8 12h.01M14 11h.01M19 13h.01M6 17h.01M12 17h.01M17 18h.01",
  microbe: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 7V3M12 21v-4M7 12H3M21 12h-4M8.5 8.5 5.6 5.6M18.4 18.4l-2.9-2.9M15.5 8.5l2.9-2.9M5.6 18.4l2.9-2.9M10.5 11h.01M13.5 13h.01",
  sparkles: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z",
  minus: "M5 12h14",
  plus: "M12 5v14M5 12h14",
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 24,
  strokeWidth = 1.8,
  ...props
}: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
