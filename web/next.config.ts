import path from "node:path";
import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";

loadEnv({ path: path.resolve(__dirname, "../.env") });

const nextConfig: NextConfig = {
    output: "standalone",
    turbopack: {
        root: __dirname,
    },
};

export default nextConfig;
