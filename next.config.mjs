/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  transpilePackages: ["@taxios-v2/ui"],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
