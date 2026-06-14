import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Add brand asset CDNs here per deploy. Placeholder local assets need no remotePatterns.
    remotePatterns: [],
  },
};

export default nextConfig;
