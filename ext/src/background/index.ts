import { WoohooApiClient } from "@woohoo/api";
import type { AuthSession, StatsResponse } from "@woohoo/api";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";

type IncomingMessage =
    | { type: "GET_SESSION" }
    | { type: "SIGN_IN"; email: string; password: string }
    | { type: "SIGN_OUT" }
    | { type: "GET_STATS" };

type Reply =
    | { session: AuthSession | null }
    | { ok: true }
    | { ok: false; error: string }
    | { stats: StatsResponse | null };

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
            return { session: null };
        }

        await chrome.storage.local.set({ session: refreshed });
        return { session: refreshed };
    }

    if (msg.type === "SIGN_IN") {
        const client = new WoohooApiClient(BASE_URL);
        const result = await client.signIn(msg.email, msg.password);
        if ("error" in result) return { ok: false, error: result.error };
        await chrome.storage.local.set({ session: result.session });
        return { ok: true };
    }

    if (msg.type === "SIGN_OUT") {
        const stored = await chrome.storage.local.get("session");
        const session = stored["session"] as AuthSession | undefined;
        if (session) {
            const client = new WoohooApiClient(BASE_URL, session.token);
            await client.signOut();
        }
        await chrome.storage.local.remove("session");
        return { ok: true };
    }

    if (msg.type === "GET_STATS") {
        const stored = await chrome.storage.local.get("session");
        const session = stored["session"] as AuthSession | undefined;
        if (!session) return { stats: null };

        const client = new WoohooApiClient(BASE_URL, session.token);
        const stats = await client.getStats();
        return { stats };
    }

    return { ok: false, error: "Unknown message type." };
}

chrome.runtime.onMessage.addListener(
    (msg: IncomingMessage, _sender, sendResponse) => {
        handle(msg).then(sendResponse);
        return true; // keeps the message channel open for the async reply
    },
);
