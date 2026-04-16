import { useEffect, useState } from "react";
import type { AuthSession } from "@woohoo/api";
import { Logo } from "@/components/Logo";
import "./App.css";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";
const SIGN_UP_URL = `${BASE_URL}/sign-up`;

export default function App() {
    const [session, setSession] = useState<AuthSession | null | undefined>(
        undefined,
    );
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        chrome.runtime.sendMessage({ type: "GET_SESSION" }, (res: { session: AuthSession | null }) => {
            setSession(res.session);
        });
    }, []);

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

    if (session === undefined) {
        return <div className="popup" />;
    }

    if (session) {
        return (
            <div className="popup">
                <header className="popup-header">
                    <Logo className="popup-logo" />
                    <span className="popup-brand">Woohoo</span>
                </header>

                <div className="account-info">
                    <p className="account-name">{session.user.name}</p>
                    <p className="account-email">{session.user.email}</p>
                </div>

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
