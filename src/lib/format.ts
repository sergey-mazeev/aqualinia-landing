import type { AppLocale } from "@/i18n/routing";

const NBSP = " ";

/** Groups thousands without Intl so server and browser output is identical (no hydration mismatch). */
function group(amount: number, separator: string): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded));
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/** `12990` → `12 990 ₽` (ru) or `₽12,990` (en). */
export function formatRub(amount: number, locale: AppLocale): string {
  return locale === "ru" ? `${group(amount, NBSP)}${NBSP}₽` : `₽${group(amount, ",")}`;
}

export function formatNumber(amount: number, locale: AppLocale): string {
  return group(amount, locale === "ru" ? NBSP : ",");
}
