type Variant = "primary" | "secondary" | "ghost" | "light" | "outline";
type Size = "md" | "lg" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white shadow-[0_8px_24px_-8px_rgb(0_119_182/0.6)] hover:bg-blue-hover",
  secondary: "bg-sea text-white shadow-[0_8px_24px_-8px_rgb(31_122_102/0.55)] hover:bg-sea-hover",
  ghost: "bg-white/70 text-deep ring-1 ring-line backdrop-blur hover:bg-white hover:ring-sky",
  light: "bg-white text-deep hover:bg-pale",
  outline: "text-blue ring-1 ring-blue/40 hover:bg-pale",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}
