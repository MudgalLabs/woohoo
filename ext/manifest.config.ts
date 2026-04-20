import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

const browser = (process.env.BROWSER ?? "chrome") as "chrome" | "firefox";
const isProd = process.env.NODE_ENV === "production";

const hostPermissions = [
    "https://www.reddit.com/*",
    "https://woohoo.to/*",
    ...(isProd ? [] : ["http://localhost:3000/*"]),
];

const background =
    browser === "firefox"
        ? { scripts: ["src/background/index.ts"], type: "module" as const }
        : {
              service_worker: "src/background/index.ts",
              type: "module" as const,
          };

const geckoSettings =
    browser === "firefox"
        ? {
              browser_specific_settings: {
                  gecko: {
                      id: "woohoo@mudgallabs.com",
                      strict_min_version: "121.0",
                      data_collection_permissions: {
                          required: [
                              "personallyIdentifyingInfo" as const,
                              "websiteContent" as const,
                          ],
                      },
                  },
              },
          }
        : {};

const chromeOnly =
    browser === "chrome" ? { minimum_chrome_version: "114" } : {};

export default defineManifest({
    manifest_version: 3,
    name: "Woohoo",
    version: pkg.version,
    description:
        "Woohoo — A follow-up tool for DMs, comments, and social leads.",
    icons: {
        16: "public/icon16.png",
        32: "public/icon32.png",
        48: "public/icon48.png",
        128: "public/icon128.png",
    },
    action: {
        default_icon: {
            16: "public/icon16.png",
            32: "public/icon32.png",
            48: "public/icon48.png",
            128: "public/icon128.png",
        },
        default_popup: "src/popup/index.html",
    },
    background,
    permissions: ["storage", "tabs"],
    host_permissions: hostPermissions,
    content_scripts: [
        {
            js: ["src/content/main.tsx"],
            matches: ["https://www.reddit.com/*"],
        },
    ],
    web_accessible_resources: [
        {
            resources: ["public/logo.png", "assets/*"],
            matches: ["https://www.reddit.com/*"],
        },
    ],
    ...geckoSettings,
    ...chromeOnly,
});
