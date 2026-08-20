import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    after: true,
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

export default nextConfig;
