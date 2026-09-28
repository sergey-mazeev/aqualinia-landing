import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("meta");
  return <main className="container-x py-20 text-3xl font-semibold">{t("title")}</main>;
}
