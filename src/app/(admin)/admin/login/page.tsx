import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/illustrations/Logo";
import { buttonClass } from "@/components/ui/button";
import { isAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = { title: "Вход" };

const ERRORS: Record<string, string> = {
  password: "Неверный пароль.",
  rate: "Слишком много попыток. Подождите 10 минут.",
  config: "Админка не настроена: задайте ADMIN_PASSWORD и SESSION_SECRET.",
  invalid: "Не удалось войти. Обновите страницу и попробуйте ещё раз.",
};

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/admin";
  if (await isAdmin()) redirect(next.startsWith("/admin") ? next : "/admin");
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;

  return (
    <main className="grid min-h-dvh place-items-center bg-linear-to-br from-pale to-mint px-4">
      <form
        action="/api/admin/login"
        method="post"
        className="w-full max-w-sm rounded-[28px] bg-white p-8 shadow-lift"
      >
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <h1 className="text-xl font-bold">Заявки</h1>
            <p className="text-sm text-muted">Вход для менеджера</p>
          </div>
        </div>
        <input type="hidden" name="next" value={next} />
        <label htmlFor="password" className="mt-8 mb-1.5 block text-sm font-semibold">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-invalid={!!error}
          aria-describedby={error ? "login-error" : undefined}
          className="h-12 w-full rounded-2xl border border-line px-4 outline-none focus:border-blue focus:ring-4 focus:ring-sky/30"
        />
        {error && (
          <p id="login-error" role="alert" className="mt-2 text-sm font-medium text-sale">
            {error}
          </p>
        )}
        <button type="submit" className={buttonClass("primary", "md", "mt-6 w-full")}>
          Войти
        </button>
      </form>
    </main>
  );
}
