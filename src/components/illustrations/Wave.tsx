/** Organic wave divider. Place at the top or bottom edge of a section (position: absolute). */
export function Wave({
  fill,
  position = "bottom",
  className = "",
}: {
  fill: string;
  position?: "top" | "bottom";
  className?: string;
}) {
  const top = position === "top";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 h-12 w-full md:h-20 ${top ? "top-0 -translate-y-px rotate-180" : "bottom-0 translate-y-px"} ${className}`}
    >
      <path
        d="M0 42c120 26 240 36 360 22S600 12 720 14s240 44 360 50 240-18 360-40V90H0Z"
        fill={fill}
        opacity="0.55"
      />
      <path d="M0 58c160 22 300 28 440 12S700 26 840 34s280 38 400 30 160-20 200-28V90H0Z" fill={fill} />
    </svg>
  );
}
