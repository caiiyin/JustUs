import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  allowedDevOrigins: ["ahnbi3.suwon.ac.kr", "ahnbi3.suwon.ac.kr:5001"],
};

export default nextConfig;
