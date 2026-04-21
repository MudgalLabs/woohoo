// Detects the logged-in Reddit username (the "founder" identity). Primary
// path is a same-origin fetch to /api/me.json, which works as soon as the
// content script loads and the user is signed into Reddit. As a fallback
// (e.g. if that endpoint changes), we watch for the user drawer's profile
// link and capture it the first time the drawer renders. Result is cached
// in chrome.storage.local.

const STORAGE_KEY = "founder_reddit_username";

export function parseRedditUserHref(href: string): string | null {
    const match = /^\/user\/([^/]+)\/?$/.exec(href);
    return match ? match[1] : null;
}

// Accepts "u/heyshikhar", "/u/heyshikhar", "heyshikhar/", or a full profile
// URL and returns the bare handle ("heyshikhar") that matches Reddit's
// shreddit-comment `author` attribute. Empty string if nothing usable.
export function normalizeRedditUsername(input: string): string {
    let s = input.trim();
    if (!s) return "";
    try {
        const url = new URL(s);
        s = url.pathname;
    } catch {
        // not a URL; treat as a handle path fragment
    }
    s = s.replace(/^\/+|\/+$/g, "");
    s = s.replace(/^(?:u|user)\//i, "");
    return s.trim();
}

function scrapeOnce(): string | null {
    // faceplate-tracker is the stable landmark around the drawer's profile
    // row; the older #user-drawer-content wrapper has shifted between Reddit
    // redesigns, so we try the tracker first and keep the id as a fallback.
    const selectors = [
        'faceplate-tracker[source="user_drawer"][noun="profile"] a[href^="/user/"]',
        '#user-drawer-content a[href^="/user/"]',
    ];
    for (const sel of selectors) {
        const link = document.querySelector<HTMLAnchorElement>(sel);
        if (!link) continue;
        const href = link.getAttribute("href");
        if (!href) continue;
        const name = parseRedditUserHref(href);
        if (name) return normalizeRedditUsername(name);
    }
    return null;
}

async function fetchFounderFromApi(): Promise<string | null> {
    try {
        const res = await fetch("/api/me.json", {
            credentials: "include",
            headers: { Accept: "application/json" },
        });
        if (!res.ok) return null;
        const json = (await res.json()) as { data?: { name?: unknown } };
        const name = json?.data?.name;
        if (typeof name !== "string" || !name) return null;
        return normalizeRedditUsername(name) || null;
    } catch {
        return null;
    }
}

let observer: MutationObserver | null = null;

export function startFounderScraper(): () => void {
    if (observer) return () => {};

    const save = (name: string) => {
        chrome.storage.local.set({ [STORAGE_KEY]: name });
        observer?.disconnect();
        observer = null;
    };

    // Primary: ask Reddit's own API. Works regardless of whether the user
    // ever opens the drawer.
    fetchFounderFromApi().then((name) => {
        if (name) save(name);
    });

    const tryCaptureDom = () => {
        const name = scrapeOnce();
        if (!name) return false;
        save(name);
        return true;
    };

    // Fallback path — catch the drawer if the API call fails. If the drawer
    // is already open at mount, grab it synchronously.
    if (tryCaptureDom()) {
        return () => {};
    }

    observer = new MutationObserver(() => {
        tryCaptureDom();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
        observer?.disconnect();
        observer = null;
    };
}

export function getFounderUsername(): Promise<string | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(STORAGE_KEY, (result) => {
            const value = result[STORAGE_KEY];
            if (typeof value !== "string" || !value) {
                resolve(null);
                return;
            }
            const normalized = normalizeRedditUsername(value);
            resolve(normalized || null);
        });
    });
}
