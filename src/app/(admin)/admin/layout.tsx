import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "../../globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Заявки", template: "%s — Админка" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="ru" className={onest.variable}>
      <body className="min-h-dvh bg-slate-50 text-deep">{children}</body>
    </html>
  );
}
