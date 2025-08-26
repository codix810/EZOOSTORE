import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["picsum.photos"], // ✅ السماح بالصور من picsum
  },
};

export default nextConfig;
