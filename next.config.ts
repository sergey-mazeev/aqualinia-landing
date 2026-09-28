import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  serverExternalPackages: ["@libsql/client", "libsql"],
  // Read from disk at runtime, so file tracing can't see them: SQL migrations and the
  // native libsql binary for Linux (picked by platform at runtime).
  outputFileTracingIncludes: {
    "/**/*": ["./drizzle/**/*", "./node_modules/.pnpm/@libsql+linux-*/**/*"],
  },
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
