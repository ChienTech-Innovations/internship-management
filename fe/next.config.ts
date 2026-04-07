import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin"
          }
        ]
      }
    ];
  },
  // Ensure static assets are handled correctly
  trailingSlash: false,
  // Handle API routes properly
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*"
      }
    ];
  }
};

export default nextConfig;
