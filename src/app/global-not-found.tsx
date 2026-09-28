import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
};

// Rendered for URLs that match no route at all (bypasses both root layouts).
export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body>
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-pale px-4 text-center">
          <p className="text-7xl font-bold text-sky">404</p>
          <h1 className="text-2xl font-semibold">Страница не найдена · Page not found</h1>
          <a
            href="/"
            className="rounded-full bg-blue px-6 py-3 font-semibold text-white hover:bg-blue-hover"
          >
            На главную · Home
          </a>
        </main>
      </body>
    </html>
  );
}
