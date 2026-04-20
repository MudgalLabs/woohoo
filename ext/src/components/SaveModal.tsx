import { useEffect, useState } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { WoohooApiClient } from "@woohoo/api";
import type { AuthSession } from "@woohoo/api";

import { Message, getActiveRedditChatRoomUrl } from "@/content/reddit/dm";
import { getFounderUsername } from "@/content/reddit/founder";
import { Branding } from "@/components/Branding";
import { emitToast } from "@/content/lib/toast";
import { DateTimePicker } from "@/components/DateTimePicker";
import { API_BASE_URL as BASE_URL } from "@/lib/api-base-url";

interface SaveModalProps {
    message: Message;
    isSaved: boolean;
    peer: string;
    kind: "dm" | "comment";
    onSaved?: () => void;
    onUnsaved?: () => void;
    onClose?: () => void;
}

export function SaveModal(props: SaveModalProps) {
    const { message, peer, kind, onSaved, onUnsaved, onClose } = props;

    const [session, setSession] = useState<AuthSession | null | undefined>(
        undefined,
    );
    const [isSaved, setIsSaved] = useState(props.isSaved);
    const [woohooId, setWoohooId] = useState<string | null>(null);
    const [timelineItemId, setTimelineItemId] = useState<string | null>(null);
    const [followUpAt, setFollowUpAt] = useState<Date | null>(null);
    const [saving, setSaving] = useState(false);
    const [unsaving, setUnsaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ancestorMatch, setAncestorMatch] = useState<{
        woohooId: string;
        peerId: string;
        peerName?: string | null;
    } | null>(null);
    const [founderUsername, setFounderUsername] = useState<string | null>(null);

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
                    const founder = await getFounderUsername();
                    setFounderUsername(founder);

                    const client = new WoohooApiClient(
                        BASE_URL,
                        s.token,
                        signOutOnExpiry,
                    );
                    const result = await client.checkSaved({
                        platform: "reddit",
                        peerId: peer,
                        externalId: message.id,
                        authorId:
                            kind === "comment" ? message.username : undefined,
                        founderExternalId: founder ?? undefined,
                        ancestorExternalIds:
                            kind === "comment"
                                ? message.ancestorExternalIds
                                : undefined,
                    });
                    setIsSaved(result.saved);
                    setWoohooId(result.woohooId ?? null);
                    setTimelineItemId(result.timelineItemId ?? null);
                    setAncestorMatch(result.ancestorMatch ?? null);

                    // Keep the parent SaveButton + local cache in sync with the
                    // server — the cache can go stale if the user deletes from
                    // the web app.
                    if (result.saved) {
                        onSaved?.();
                        if (result.woohooId) {
                            chrome.storage.local.set({
                                [`saved_${message.id}`]: result.woohooId,
                            });
                        }
                    } else {
                        chrome.storage.local.remove(`saved_${message.id}`);
                    }
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
        return () =>
            chrome.storage.onChanged.removeListener(handleStorageChange);
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

    const woohooUrl = woohooId
        ? `${BASE_URL}/my-woohoos/${woohooId}`
        : `${BASE_URL}/my-woohoos`;

    const contentPreview =
        message.contentText.length > 80
            ? message.contentText.slice(0, 80) + "…"
            : message.contentText;

    const handleUnsave = async () => {
        if (!session || !timelineItemId) return;
        setUnsaving(true);
        setError(null);

        const client = new WoohooApiClient(
            BASE_URL,
            session.token,
            signOutOnExpiry,
        );
        const result = await client.deleteTimelineItem(timelineItemId);

        if ("error" in result) {
            setUnsaving(false);
            setError(result.error);
            return;
        }

        setIsSaved(false);
        setWoohooId(null);
        setTimelineItemId(null);
        setUnsaving(false);

        chrome.storage.local.remove(`saved_${message.id}`);

        emitToast({
            message: kind === "dm" ? "Unsaved DM" : "Unsaved comment",
        });

        onUnsaved?.();
        onClose?.();
    };

    if (isSaved) {
        return (
            <div className="cb-modal">
                <div
                    className="flex-x cb-modal-header"
                    style={{ justifyContent: "space-between", marginBottom: 6 }}
                >
                    <h2 className="cb-modal-title">Saved</h2>
                    <a
                        href={woohooUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link flex-x"
                        style={{
                            fontWeight: 500,
                            columnGap: 2,
                            fontSize: 12,
                        }}
                    >
                        Open
                        <SquareArrowOutUpRight size={11} strokeWidth={2.5} />
                    </a>
                </div>
                <p
                    className="cb-modal-text"
                    style={{
                        color: "var(--ink-muted)",
                        fontStyle: "italic",
                        marginBottom: 10,
                    }}
                >
                    &ldquo;{contentPreview}&rdquo;
                </p>

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
                    <button
                        className="btn btn-secondary"
                        onClick={handleUnsave}
                        disabled={unsaving || !timelineItemId}
                        style={{ width: "100%", textAlign: "center" }}
                    >
                        {unsaving ? "Unsaving…" : "Unsave"}
                    </button>
                </div>
            </div>
        );
    }

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        const client = new WoohooApiClient(
            BASE_URL,
            session.token,
            signOutOnExpiry,
        );
        const chatUrl =
            kind === "dm"
                ? (getActiveRedditChatRoomUrl() ?? undefined)
                : undefined;
        const result = await client.saveItem({
            platform: "reddit",
            peerId: peer,
            chatUrl,
            followUpAt: followUpAt ? followUpAt.toISOString() : undefined,
            ancestorExternalIds:
                kind === "comment" ? message.ancestorExternalIds : undefined,
            founderExternalId: founderUsername ?? undefined,
            item: {
                type: kind,
                externalId: message.id,
                contentText: message.contentText,
                contentHtml: message.contentHTML,
                sourceUrl: kind === "comment" ? message.sourceUrl : undefined,
                authorId: message.username,
                authorName: message.username,
                interactionAt: message.timestamp,
            },
        });

        if ("error" in result) {
            setSaving(false);
            const msg =
                result.code === "plan_limit_reached"
                    ? `You're at the ${result.planName ?? "Free"} plan limit of ${result.limit ?? 100} active Woohoos. Archive one at woohoo.to/my-woohoos or upgrade to Pro.`
                    : result.error;
            setError(msg);
            return;
        }

        setWoohooId(result.woohoo.id);
        setTimelineItemId(result.timelineItem.id);

        // Cache saved state locally for quick bookmark icon init.
        chrome.storage.local.set({
            [`saved_${message.id}`]: result.woohoo.id,
        });

        const savedWoohooUrl = `${BASE_URL}/my-woohoos/${result.woohoo.id}`;
        emitToast({
            message: kind === "dm" ? "Saved DM" : "Saved comment",
            href: savedWoohooUrl,
        });

        onSaved?.();
        onClose?.();
    };

    return (
        <div className="cb-modal">
            <div className="flex-y cb-modal-header" style={{ rowGap: 0 }}>
                <h2 className="cb-modal-title">
                    {kind === "dm" ? "Save DM" : "Save Comment"}
                </h2>
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

            {kind === "comment" && (
                <p
                    style={{
                        fontSize: 11,
                        color: "var(--ink-muted)",
                        margin: 0,
                        marginBottom: 10,
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                    }}
                >
                    Saving to u/{ancestorMatch ? ancestorMatch.peerId : peer}
                    's Woohoo
                </p>
            )}

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
                <DateTimePicker
                    value={followUpAt}
                    onChange={setFollowUpAt}
                />
            </div>

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
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ width: "100%", textAlign: "center" }}
                >
                    {saving ? "Saving…" : "Save"}
                </button>
            </div>
        </div>
    );
}
