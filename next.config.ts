import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Add brand asset CDNs here per deploy. Placeholder local assets need no remotePatterns.
    remotePatterns: [
      // Demo lifestyle photography for the redesigned homepage (Unsplash).
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
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
