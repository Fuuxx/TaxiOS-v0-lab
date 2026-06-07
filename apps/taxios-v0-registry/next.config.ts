import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@taxios-v2/ui"]
};

export default nextConfig;
