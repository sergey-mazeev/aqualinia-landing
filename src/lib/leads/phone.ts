const ALLOWED = /^[+\d\s().-]+$/;

/**
 * Normalizes a phone number to E.164 or returns null.
 * Accepts Russian formats (8…, 7…, +7…, bare 10 digits starting with 9)
 * and international numbers written with `+` or `00`.
 */
export function normalizePhone(input: string): string | null {
  const raw = input.trim();
  if (!raw || !ALLOWED.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");

  if (raw.startsWith("+")) {
    if (digits.startsWith("7")) return digits.length === 11 ? `+${digits}` : null;
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  if (digits.startsWith("00")) {
    const rest = digits.slice(2);
    if (rest.startsWith("7")) return rest.length === 11 ? `+${rest}` : null;
    return rest.length >= 8 && rest.length <= 15 ? `+${rest}` : null;
  }
  if (digits.length === 11 && (digits[0] === "8" || digits[0] === "7")) return `+7${digits.slice(1)}`;
  if (digits.length === 10 && digits[0] === "9") return `+7${digits}`;
  return null;
}

/** `+79991234567` → `+7 999 123-45-67`; other numbers are returned unchanged. */
export function formatPhone(e164: string): string {
  const m = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}` : e164;
}

/** Digits only, for wa.me links and search. */
export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}
