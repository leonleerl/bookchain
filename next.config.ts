import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      // Fix for porto package trying to import 'zod/mini'
      // Use compatibility layer that re-exports zod v4/mini with missing exports
      "zod/mini": "./node_modules/zod-mini-compat",
    },
  },
  webpack: (config, { isServer }) => {
    // Fallback for webpack builds
    const path = require("path");
    config.resolve.alias = {
      ...config.resolve.alias,
      "zod/mini": path.resolve(__dirname, "node_modules/zod-mini-compat"),
    };
    return config;
  },
};

export default nextConfig;
