import type { ReactNode } from "react";

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
}) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "items-start";
  const dark = tone === "dark";
  return (
    <div className={`mb-12 flex max-w-2xl flex-col gap-4 md:mb-16 ${alignment}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase ${
            dark ? "bg-white/10 text-sky" : "bg-mint text-sea"
          }`}
        >
          <span className={`size-1.5 rounded-full ${dark ? "bg-sky" : "bg-sea"}`} />
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-[2rem] leading-[1.1] font-bold tracking-tight text-balance md:text-5xl ${
          dark ? "text-white" : "text-deep"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg leading-relaxed text-pretty ${dark ? "text-white/75" : "text-muted"}`}>{subtitle}</p>
      )}
    </div>
  );
}
