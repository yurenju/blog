import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 180,
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
