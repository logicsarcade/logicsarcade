import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true, // lets Lighthouse / DevTools map minified code to source
  // /favicon.ico is served from the /icons folder (see app/api/favicon/route.ts)
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/api/favicon" }];
  },
  experimental: {
    inlineCss: true, // inline CSS into the HTML: removes the render-blocking stylesheet request
  },
};

export default nextConfig;
