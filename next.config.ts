import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Force absolute root resolution to bypass secondary lockfiles in parent directories
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
