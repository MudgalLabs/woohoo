import { useEffect, useState } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { WoohooApiClient } from "@woohoo/api";
import type { AuthSession } from "@woohoo/api";

import { Message } from "@/content/reddit/dm";
import { Branding } from "@/components/Branding";

const BASE_URL =
    (import.meta.env.VITE_API_URL as string | undefined) ??
    "http://localhost:3000";

interface SaveModalProps {
    message: Message;
    isSaved: boolean;
    peer: string;
    onSaved?: () => void;
}

export function SaveModal(props: SaveModalProps) {
    const { message, peer, onSaved } = props;

    const [session, setSession] = useState<AuthSession | null | undefined>(
        undefined,
    );
    const [isSaved, setIsSaved] = useState(props.isSaved);
    const [woohooId, setWoohooId] = useState<string | null>(null);
    const [followUpAt, setFollowUpAt] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signOutOnExpiry = () => {
        chrome.runtime.sendMessage({ type: "SIGN_OUT" });
    };

    // Load session and check saved state from DB on every open.
    useEffect(() => {
        chrome.runtime.sendMessage(
            { type: "GET_SESSION" },
            async (res: { session: AuthSession | null }) => {
                const s = res.session;
                setSession(s);

                if (s && peer && message.id) {
                    const client = new WoohooApiClient(BASE_URL, s.token, signOutOnExpiry);
                    const result = await client.checkSaved({
                        platform: "reddit",
                        peerId: peer,
                        externalId: message.id,
                    });
                    setIsSaved(result.saved);
                    setWoohooId(result.woohooId ?? null);
                }
            },
        );

        const handleStorageChange = (changes: {
            [key: string]: chrome.storage.StorageChange;
        }) => {
            if ("session" in changes) {
                const newSession =
                    (changes["session"]?.newValue as AuthSession) ?? null;
                setSession(newSession);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }, []);

    if (session === undefined) return null;

    if (!session) {
        return (
            <div className="cb-modal">
                <div className="flex-y cb-modal-header" style={{ rowGap: 0 }}>
                    <Branding />
                </div>
                <p className="cb-modal-text" style={{ marginTop: 8 }}>
                    Login to your Woohoo account in the extension first.
                </p>
            </div>
        );
    }

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        const client = new WoohooApiClient(BASE_URL, session.token, signOutOnExpiry);
        const result = await client.saveItem({
            platform: "reddit",
            peerId: peer,
            followUpAt: followUpAt || undefined,
            item: {
                type: "dm",
                externalId: message.id,
                contentText: message.contentText,
                contentHtml: message.contentHTML,
                authorId: message.username,
                authorName: message.username,
                interactionAt: message.timestamp,
            },
        });

        setSaving(false);

        if ("error" in result) {
            setError(result.error);
            return;
        }

        setIsSaved(true);
        setWoohooId(result.woohoo.id);
        onSaved?.();

        // Cache saved state locally for quick bookmark icon init.
        chrome.storage.local.set({ [`saved_${message.id}`]: result.woohoo.id });
    };

    const woohooUrl = woohooId
        ? `${BASE_URL}/my-woohoos/${woohooId}`
        : `${BASE_URL}/my-woohoos`;

    const contentPreview =
        message.contentText.length > 80
            ? message.contentText.slice(0, 80) + "…"
            : message.contentText;

    return (
        <div className="cb-modal">
            <div className="flex-y cb-modal-header" style={{ rowGap: 0 }}>
                <div className="flex-x" style={{ justifyContent: "space-between" }}>
                    <h2 className="cb-modal-title">
                        {isSaved ? "Saved" : "Save DM"}
                    </h2>

                    {isSaved && (
                        <a
                            href={woohooUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-x"
                            style={{ fontWeight: 500, columnGap: 2, fontSize: 12 }}
                        >
                            Open
                            <SquareArrowOutUpRight size={11} strokeWidth={2.5} />
                        </a>
                    )}
                </div>
            </div>

            <p
                className="cb-modal-text"
                style={{
                    marginTop: 6,
                    marginBottom: 10,
                    color: "var(--ink-muted)",
                    fontStyle: "italic",
                }}
            >
                &ldquo;{contentPreview}&rdquo;
            </p>

            {!isSaved && (
                <div style={{ marginBottom: 10 }}>
                    <label
                        style={{
                            display: "block",
                            fontSize: 11,
                            color: "var(--ink-muted)",
                            marginBottom: 4,
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                        }}
                    >
                        Follow up (optional)
                    </label>
                    <input
                        type="datetime-local"
                        value={followUpAt}
                        onChange={(e) => setFollowUpAt(e.target.value)}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            fontSize: 12,
                            padding: "4px 6px",
                            borderRadius: 4,
                            border: "1px solid var(--rule)",
                            background: "var(--paper)",
                            color: "var(--ink)",
                            outline: "none",
                        }}
                    />
                </div>
            )}

            {error && (
                <p
                    style={{
                        fontSize: 11,
                        color: "var(--red)",
                        marginBottom: 6,
                    }}
                >
                    {error}
                </p>
            )}

            <div className="cb-modal-footer">
                {!isSaved && (
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ width: "100%", textAlign: "center" }}
                    >
                        {saving ? "Saving…" : "Save"}
                    </button>
                )}
            </div>
        </div>
    );
}
