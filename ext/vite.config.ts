import path from "node:path";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";
import manifest from "./manifest.config.js";

const browser = (process.env.BROWSER ?? "chrome") as "chrome" | "firefox";
const outDir = `dist-${browser}`;

export default defineConfig({
    envDir: path.resolve(__dirname, ".."),
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
});
