import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-pale px-4 text-center">
      <p className="text-7xl font-bold text-sky">404</p>
      <h1 className="text-2xl font-semibold md:text-3xl">{t("title")}</h1>
      <p className="max-w-md text-muted">{t("text")}</p>
      <Link
        href="/"
        className="rounded-full bg-blue px-6 py-3 font-semibold text-white transition hover:bg-blue-hover"
      >
        {t("home")}
      </Link>
    </main>
  );
}
