import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    icons: {
        48: "public/logo.png",
    },
    action: {
        default_icon: {
            48: "public/logo.png",
        },
        default_popup: "src/popup/index.html",
    },
    background: {
        service_worker: "src/background/index.ts",
        type: "module" as const,
    },
    permissions: ["storage", "tabs"],
    host_permissions: [
        "https://www.reddit.com/*",
        "https://woohoo.to/*",
        "http://localhost:3000/*",
    ],
    content_scripts: [
        {
            js: ["src/content/main.tsx"],
            // Only run on Reddit.
            matches: ["https://www.reddit.com/*"],
        },
    ],
});
