import type { NextConfig } from "next";
import { finalizeOffline } from "./scripts/finalize-offline.mjs";
const isDev = process.env.NODE_ENV !== "production";
// Static pages include Next's inline Flight bootstrap. Enforce an origin policy,
// and evaluate a strict script policy in report-only mode before promoting it.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://t0.gstatic.com https://t1.gstatic.com https://t2.gstatic.com https://t3.gstatic.com https://ascii-magic.com https://corca.app https://deck.gallery https://delphi.tools https://diskanalyzer.com https://dotmatrix.zzzzshawn.cloud https://earweb.bttl.xyz https://evilcharts.com https://excalidraw.com https://github.com https://ipsw.me https://is1-ssl.mzstatic.com https://labs.google https://lmstudio.ai https://lucide-animated.com https://mounty.app https://poketube.fun https://reactbits.dev https://sileo.aaryan.design https://torph.lochie.me https://ui.unlumen.com https://www.google.com https://www.ilovepdf.com",
  "font-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(!isDev ? ["upgrade-insecure-requests"] : []),
].join("; ");
const nextConfig: NextConfig = {
  reactCompiler: true,
  compiler: {
    async runAfterProductionCompile(metadata) {
      finalizeOffline(metadata);
    },
  },
  poweredByHeader: false,
  images: { remotePatterns: [] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Content-Security-Policy-Report-Only",
            value: "script-src 'self'; object-src 'none'; base-uri 'self'",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ];
  },
};
export default nextConfig;
