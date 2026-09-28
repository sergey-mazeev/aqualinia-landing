/**
 * Client IP from proxy headers. In production nginx must overwrite (not append)
 * X-Real-IP / X-Forwarded-For, otherwise clients can spoof them.
 */
export function getClientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}
