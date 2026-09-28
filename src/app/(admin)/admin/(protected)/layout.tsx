import Link from "next/link";
import { LogoMark } from "@/components/illustrations/Logo";
import { requireAdmin } from "@/lib/auth/require-admin";
import { leadCounters } from "@/lib/db/leads-repo";

export default async function ProtectedLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  const counters = leadCounters();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark size={32} />
            <span className="text-lg font-bold">Заявки</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/admin?status=new"
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold ${
                counters.fresh ? "bg-blue text-white" : "bg-pale text-muted"
              }`}
            >
              Новые
              <span className={`rounded-full px-2 text-xs leading-5 ${counters.fresh ? "bg-white text-blue" : "bg-white"}`}>
                {counters.fresh}
              </span>
            </Link>
            <span className="rounded-full bg-pale px-3 py-1.5 text-muted">
              Сегодня: <b className="text-deep">{counters.today}</b>
            </span>
            <span className="rounded-full bg-pale px-3 py-1.5 text-muted">
              Всего: <b className="text-deep">{counters.total}</b>
            </span>
            <a href="/" target="_blank" className="rounded-full px-3 py-1.5 text-muted hover:bg-pale hover:text-deep">
              Сайт ↗
            </a>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="rounded-full px-3 py-1.5 font-semibold text-sale hover:bg-[#fdecea]">
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  );
}
