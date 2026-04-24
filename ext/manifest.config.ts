import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

const browser = (process.env.BROWSER ?? "chrome") as "chrome" | "firefox";
const isProd = process.env.NODE_ENV === "production";

const hostPermissions = [
    "https://www.reddit.com/*",
    "https://www.linkedin.com/*",
    "https://woohoo.to/*",
    ...(isProd ? [] : ["http://localhost:3000/*"]),
];

const externallyConnectableMatches = [
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
    // "activeTab" is granted only when the user clicks the extension icon
    // (i.e. opens the popup), and gives the popup read access to the active
    // tab's URL — which we use to show the platform-specific "How to use"
    // help card. Not a broad permission, well-accepted by store review.
    permissions: ["storage", "activeTab"],
    host_permissions: hostPermissions,
    content_scripts: [
        {
            js: ["src/content/reddit/reddit.tsx"],
            matches: ["https://www.reddit.com/*"],
        },
        {
            js: ["src/content/linkedin/linkedin.tsx"],
            matches: ["https://www.linkedin.com/*"],
        },
    ],
    web_accessible_resources: [
        {
            resources: ["public/logo.png", "assets/*"],
            matches: [
                "https://www.reddit.com/*",
                "https://www.linkedin.com/*",
            ],
        },
    ],
    externally_connectable: {
        matches: externallyConnectableMatches,
    },
    ...geckoSettings,
    ...chromeOnly,
});
