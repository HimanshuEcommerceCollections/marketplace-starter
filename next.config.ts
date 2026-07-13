import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // All photography is served from local /assets/* files, so no remote hosts
    // are whitelisted. Add brand asset CDNs here per deploy if needed.
    remotePatterns: [],
  },
  async redirects() {
    // The admin "category" pages were merged into flat "service" pages.
    return [
      {
        source: "/admin/categories/:path*",
        destination: "/admin/services/:path*",
        permanent: true,
      },
      {
        source: "/admin/categories",
        destination: "/admin/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
