import { useEffect, useState } from "react";
import type { AuthSession, StatsResponse } from "@woohoo/api";
import { Logo } from "@/components/Logo";
import { normalizeRedditUsername } from "@/content/reddit/founder";
import { useStoredTheme } from "@/lib/theme";
import { API_BASE_URL as BASE_URL } from "@/lib/api-base-url";
import "./App.css";

const SIGN_UP_URL = `${BASE_URL}/sign-up`;
const DASHBOARD_URL = `${BASE_URL}/dashboard`;

const FOUNDER_KEY = "founder_reddit_username";

export default function App() {
    const [session, setSession] = useState<AuthSession | null | undefined>(
        undefined,
    );
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [redditUsername, setRedditUsername] = useState("");
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

    function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        chrome.runtime.sendMessage(
            { type: "SIGN_IN", email, password },
            (res: { ok: boolean; error?: string }) => {
                setLoading(false);
                if (res.ok) {
                    chrome.runtime.sendMessage(
                        { type: "GET_SESSION" },
                        (r: { session: AuthSession | null }) => setSession(r.session),
                    );
                } else {
                    setError(res.error ?? "Something went wrong.");
                }
            },
        );
    }

    function handleSignOut() {
        chrome.runtime.sendMessage({ type: "SIGN_OUT" }, () => {
            setSession(null);
        });
    }

    function handleOpenDashboard() {
        chrome.tabs.create({ url: DASHBOARD_URL });
    }

    if (session === undefined) {
        return <div className="popup" />;
    }

    if (session) {
        const statsLine = stats
            ? stats.followUpToday > 0
                ? `${stats.totalWoohoos} woohoos · ${stats.followUpToday} to follow up today`
                : `${stats.totalWoohoos} ${stats.totalWoohoos === 1 ? "woohoo" : "woohoos"}`
            : null;

        return (
            <div className="popup">
                <header className="popup-header">
                    <Logo className="popup-logo" />
                    <span className="popup-brand">Woohoo</span>
                </header>

                <div className="account-info">
                    <p className="account-name">{session.user.name}</p>
                    <p className="account-email">{session.user.email}</p>
                    {statsLine && <p className="account-stats">{statsLine}</p>}
                </div>

                <div className="reddit-username">
                    <label className="reddit-username-label" htmlFor="reddit-username-input">
                        Your Reddit username
                    </label>
                    <input
                        id="reddit-username-input"
                        className="input"
                        type="text"
                        placeholder="u/yourhandle"
                        value={redditUsername}
                        onChange={(e) => setRedditUsername(e.target.value)}
                        onBlur={handleRedditUsernameBlur}
                    />
                </div>

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
                <Logo className="popup-logo" />
                <span className="popup-brand">Woohoo</span>
            </header>

            <form onSubmit={handleSignIn} className="signin-form">
                <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                />
                <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </form>

            <p className="signup-hint">
                No account?{" "}
                <a
                    href={SIGN_UP_URL}
                    onClick={(e) => {
                        e.preventDefault();
                        chrome.tabs.create({ url: SIGN_UP_URL });
                    }}
                >
                    Create one on Woohoo
                </a>
            </p>
        </div>
    );
}
