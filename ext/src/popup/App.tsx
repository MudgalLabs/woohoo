import { useEffect, useState } from "react";
import type { AuthSession, StatsResponse } from "@woohoo/api";
import { normalizeRedditUsername } from "@/content/reddit/founder";
import { useStoredTheme } from "@/lib/theme";
import { API_BASE_URL as BASE_URL } from "@/lib/api-base-url";
import "./App.css";

const AUTH_URL = `${BASE_URL}/auth?from=ext&extId=${chrome.runtime.id}`;
const DASHBOARD_URL = `${BASE_URL}/dashboard`;
const EXTENSION_HELP_URL = `${BASE_URL}/extension`;

const FOUNDER_KEY = "founder_reddit_username";

type Platform = "reddit" | "linkedin";

const PLATFORM_LABEL: Record<Platform, string> = {
    reddit: "Reddit",
    linkedin: "LinkedIn",
};

/**
 * Sniffs the active tab's hostname to infer which platform we're on. The
 * manifest's `activeTab` permission makes `tab.url` readable whenever the
 * popup is open (user just clicked the icon), so this works on any
 * Reddit/LinkedIn subdomain — not just the www. ones in host_permissions.
 */
async function detectActivePlatform(): Promise<Platform | null> {
    try {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        const url = tab?.url;
        if (!url) return null;
        const host = new URL(url).hostname;
        if (host === "reddit.com" || host.endsWith(".reddit.com"))
            return "reddit";
        if (host === "linkedin.com" || host.endsWith(".linkedin.com"))
            return "linkedin";
        return null;
    } catch {
        return null;
    }
}

export default function App() {
    const [session, setSession] = useState<AuthSession | null | undefined>(
        undefined,
    );
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [redditUsername, setRedditUsername] = useState("");
    const [platform, setPlatform] = useState<Platform | null>(null);
    const theme = useStoredTheme();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    useEffect(() => {
        chrome.runtime.sendMessage({ type: "GET_SESSION" }, (res: { session: AuthSession | null }) => {
            setSession(res.session);
        });
        chrome.storage.local.get(FOUNDER_KEY, (result) => {
            const value = result[FOUNDER_KEY];
            if (typeof value !== "string") return;
            const normalized = normalizeRedditUsername(value);
            setRedditUsername(normalized);
            // Self-heal stored value if it was saved in a pre-normalization form.
            if (normalized !== value) {
                if (normalized) {
                    chrome.storage.local.set({ [FOUNDER_KEY]: normalized });
                } else {
                    chrome.storage.local.remove(FOUNDER_KEY);
                }
            }
        });
        detectActivePlatform().then((p) => setPlatform(p));
    }, []);

    useEffect(() => {
        const onChange = (
            changes: Record<string, chrome.storage.StorageChange>,
            area: string,
        ) => {
            if (area !== "local") return;
            if (changes.session) {
                const next = changes.session.newValue as AuthSession | undefined;
                setSession(next ?? null);
            }
            if (changes[FOUNDER_KEY]) {
                const next = changes[FOUNDER_KEY].newValue;
                if (typeof next === "string") {
                    setRedditUsername(normalizeRedditUsername(next));
                } else if (next === undefined) {
                    setRedditUsername("");
                }
            }
        };
        chrome.storage.onChanged.addListener(onChange);
        return () => chrome.storage.onChanged.removeListener(onChange);
    }, []);

    function handleRedditUsernameBlur() {
        const normalized = normalizeRedditUsername(redditUsername);
        setRedditUsername(normalized);
        if (normalized) {
            chrome.storage.local.set({ [FOUNDER_KEY]: normalized });
        } else {
            chrome.storage.local.remove(FOUNDER_KEY);
        }
    }

    useEffect(() => {
        if (!session) {
            setStats(null);
            return;
        }
        chrome.runtime.sendMessage(
            { type: "GET_STATS" },
            (res: { stats: StatsResponse | null }) => {
                setStats(res.stats);
            },
        );
    }, [session]);

    function handleSignIn() {
        chrome.tabs.create({ url: AUTH_URL });
    }

    function handleSignOut() {
        chrome.runtime.sendMessage({ type: "SIGN_OUT" }, () => {
            setSession(null);
        });
    }

    function handleOpenDashboard() {
        chrome.tabs.create({ url: DASHBOARD_URL });
    }

    function handleOpenHelp() {
        if (!platform) return;
        chrome.tabs.create({ url: `${EXTENSION_HELP_URL}#${platform}` });
    }

    if (session === undefined) {
        return <div className="popup" />;
    }

    if (session) {
        let statsLine: string | null = null;
        if (stats) {
            const parts = [
                `${stats.totalWoohoos} ${stats.totalWoohoos === 1 ? "woohoo" : "woohoos"}`,
            ];
            if (stats.overdue > 0) parts.push(`${stats.overdue} overdue`);
            if (stats.followUpToday > 0) parts.push(`${stats.followUpToday} today`);
            statsLine = parts.join(" · ");
        }

        return (
            <div className="popup">
                <header className="popup-header">
                    <span className="popup-brand">woohoo</span>
                </header>

                <div className="account-info">
                    <p className="account-name">{session.user.name}</p>
                    <p className="account-email">{session.user.email}</p>
                    {statsLine && <p className="account-stats">{statsLine}</p>}
                </div>

                {platform && (
                    <button
                        className="help-card"
                        onClick={handleOpenHelp}
                    >
                        <span className="help-card-title">
                            How to use Woohoo on {PLATFORM_LABEL[platform]}
                        </span>
                        <span className="help-card-hint">
                            Opens a short guide in a new tab
                        </span>
                    </button>
                )}

                {platform === "reddit" && (
                    <div className="reddit-username">
                        <label
                            className="reddit-username-label"
                            htmlFor="reddit-username-input"
                        >
                            Your Reddit username
                        </label>
                        <input
                            id="reddit-username-input"
                            className="input"
                            type="text"
                            placeholder="u/yourhandle"
                            value={redditUsername}
                            onChange={(e) =>
                                setRedditUsername(e.target.value)
                            }
                            onBlur={handleRedditUsernameBlur}
                        />
                    </div>
                )}

                <button
                    className="btn-dashboard"
                    onClick={handleOpenDashboard}
                >
                    Open dashboard
                </button>

                <button className="btn-signout" onClick={handleSignOut}>
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <div className="popup">
            <header className="popup-header">
                <span className="popup-brand">woohoo</span>
            </header>

            <p className="signin-intro">
                Sign in to start saving DMs and comments.
            </p>

            <button className="btn-signin" onClick={handleSignIn}>
                Sign in
            </button>
        </div>
    );
}
