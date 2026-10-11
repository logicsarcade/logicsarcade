import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true, // inline CSS into the HTML: removes the render-blocking stylesheet request
  },
};

export default nextConfig;
