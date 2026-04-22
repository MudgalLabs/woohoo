import { WoohooApiClient } from "@woohoo/api";
import type { AuthSession, StatsResponse, WoohooUser } from "@woohoo/api";
import { API_BASE_URL as BASE_URL } from "@/lib/api-base-url";

type IncomingMessage =
    | { type: "GET_SESSION" }
    | { type: "SIGN_OUT" }
    | { type: "GET_STATS" }
    | { type: "REFRESH_BADGE" };

type Reply =
    | { session: AuthSession | null }
    | { ok: true }
    | { ok: false; error: string }
    | { stats: StatsResponse | null };

// Woohoo brand primary + foreground, converted from the OKLCH tokens in
// web/app/globals.css. MV3 can't reliably read toolbar theme, so one fixed
// pair covers both light and dark browser themes.
const BADGE_BG = "#c0392b";
const BADGE_FG = "#f5f0e8";

function setBadge(stats: StatsResponse | null) {
    if (!stats) {
        chrome.action.setBadgeText({ text: "" });
        return;
    }
    const count = stats.overdue + stats.followUpToday;
    if (count <= 0) {
        chrome.action.setBadgeText({ text: "" });
        return;
    }
    const text = count > 99 ? "99+" : String(count);
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color: BADGE_BG });
    // setBadgeTextColor is MV3-only and not in older Firefox builds.
    if (typeof chrome.action.setBadgeTextColor === "function") {
        chrome.action.setBadgeTextColor({ color: BADGE_FG });
    }
}

async function refreshBadge(): Promise<StatsResponse | null> {
    try {
        const stored = await chrome.storage.local.get("session");
        const session = stored["session"] as AuthSession | undefined;
        if (!session) {
            setBadge(null);
            return null;
        }
        const client = new WoohooApiClient(BASE_URL, session.token);
        const stats = await client.getStats();
        setBadge(stats);
        return stats;
    } catch {
        // Transient failure — leave badge as-is rather than flashing empty.
        return null;
    }
}

async function handle(msg: IncomingMessage): Promise<Reply> {
    if (msg.type === "GET_SESSION") {
        const stored = await chrome.storage.local.get("session");
        const session = stored["session"] as AuthSession | undefined;

        if (!session) return { session: null };

        // Validate with server — also refreshes expiresAt if within updateAge window.
        const client = new WoohooApiClient(BASE_URL, session.token);
        const refreshed = await client.getSession();

        if (!refreshed) {
            await chrome.storage.local.remove("session");
            setBadge(null);
            return { session: null };
        }

        await chrome.storage.local.set({ session: refreshed });
        return { session: refreshed };
    }

    if (msg.type === "SIGN_OUT") {
        const stored = await chrome.storage.local.get("session");
        const session = stored["session"] as AuthSession | undefined;
        if (session) {
            const client = new WoohooApiClient(BASE_URL, session.token);
            await client.signOut();
        }
        await chrome.storage.local.remove("session");
        setBadge(null);
        return { ok: true };
    }

    if (msg.type === "GET_STATS") {
        const stored = await chrome.storage.local.get("session");
        const session = stored["session"] as AuthSession | undefined;
        if (!session) {
            setBadge(null);
            return { stats: null };
        }

        const client = new WoohooApiClient(BASE_URL, session.token);
        const stats = await client.getStats();
        setBadge(stats);
        return { stats };
    }

    if (msg.type === "REFRESH_BADGE") {
        await refreshBadge();
        return { ok: true };
    }

    return { ok: false, error: "Unknown message type." };
}

chrome.runtime.onMessage.addListener(
    (msg: IncomingMessage, _sender, sendResponse) => {
        handle(msg).then(sendResponse);
        return true; // keeps the message channel open for the async reply
    },
);

// External messages — the web app posts the session token here after the user
// completes Google OAuth on /auth/ext-return. externally_connectable in the
// manifest restricts which origins can reach this listener.
type ExternalMessage = {
    type: "AUTH_SUCCESS";
    token: string;
    user: WoohooUser;
};

const ALLOWED_EXTERNAL_ORIGINS = new Set([
    "https://woohoo.to",
    "http://localhost:3000",
]);

chrome.runtime.onMessageExternal.addListener(
    (msg: ExternalMessage, sender, sendResponse) => {
        if (!sender.origin || !ALLOWED_EXTERNAL_ORIGINS.has(sender.origin)) {
            sendResponse({ ok: false, error: "Unauthorized origin." });
            return false;
        }
        if (msg?.type !== "AUTH_SUCCESS" || !msg.token || !msg.user) {
            sendResponse({ ok: false, error: "Bad payload." });
            return false;
        }
        chrome.storage.local
            .set({
                session: {
                    token: msg.token,
                    user: {
                        id: msg.user.id,
                        name: msg.user.name,
                        email: msg.user.email,
                    },
                },
            })
            .then(async () => {
                await refreshBadge();
                sendResponse({ ok: true });
            });
        return true; // async response
    },
);

// Refresh the badge whenever the service worker wakes up — covers browser
// restart, extension install/update, and cold-start after the worker slept.
chrome.runtime.onStartup.addListener(() => {
    refreshBadge();
});
chrome.runtime.onInstalled.addListener(() => {
    refreshBadge();
});
refreshBadge();
