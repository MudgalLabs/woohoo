import path from "node:path";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import zip from "vite-plugin-zip-pack";
import manifest from "./manifest.config.js";

const browser = (process.env.BROWSER ?? "chrome") as "chrome" | "firefox";
const outDir = `dist-${browser}`;
const envDir = path.resolve(__dirname, "..");

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, envDir, "");
    const isProd = mode === "production";
    const envVar = isProd ? "VITE_PROD_API_URL" : "VITE_DEV_API_URL";
    const apiBaseUrl = env[envVar];

    if (!apiBaseUrl) {
        throw new Error(
            `${envVar} must be set in .env for ${isProd ? "production" : "dev"} builds.`,
        );
    }

    return {
        envDir,
        define: {
            __API_BASE_URL__: JSON.stringify(apiBaseUrl),
        },
        build: {
            outDir,
        },
        resolve: {
            alias: {
                "@": `${path.resolve(__dirname, "src")}`,
            },
        },
        plugins: [
            react(),
            crx({ manifest, browser }),
            zip({
                inDir: outDir,
                outDir: "release",
                outFileName: `woohoo-${browser}.zip`,
            }),
        ],
        server: {
            cors: {
                origin: [/chrome-extension:\/\//],
            },
        },
    };
});
