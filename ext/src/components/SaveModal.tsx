import { useEffect, useState } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import type { AuthSession } from "@woohoo/api";

import { Message } from "@/content/reddit/dm";
import { Branding } from "@/components/Branding";

interface SaveModalProps {
    message: Message;
    isSaved: boolean;
}

export function SaveModal(props: SaveModalProps) {
    const { message: _message, isSaved } = props;
    const [session, setSession] = useState<AuthSession | null | undefined>(
        undefined,
    );
    const [askedForConfirmation, setAskedForConfirmation] = useState(false);

    useEffect(() => {
        chrome.runtime.sendMessage(
            { type: "GET_SESSION" },
            (res: { session: AuthSession | null }) => {
                setSession(res.session);
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

    // Still loading session — render nothing to avoid flash.
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

    const handleRemove = () => {
        if (!askedForConfirmation) {
            setAskedForConfirmation(true);
            return;
        }
    };

    return (
        <div className="cb-modal">
            <div className="flex-y cb-modal-header" style={{ rowGap: 0 }}>
                <h2 className="cb-modal-title">
                    {isSaved ? "Update" : "Save"} message
                </h2>

                {isSaved ? (
                    <a
                        href="https://woohoo.to"
                        className="flex-x"
                        style={{ fontWeight: 500, columnGap: 2 }}
                    >
                        Show in Woohoo
                        <SquareArrowOutUpRight size={12} strokeWidth={2.5} />
                    </a>
                ) : null}
            </div>

            <div className="cb-modal-footer">
                {isSaved ? (
                    <div className="flex-x">
                        <button
                            className="btn btn-secondary"
                            onClick={handleRemove}
                        >
                            {askedForConfirmation ? "Sure?" : "Remove"}
                        </button>

                        {askedForConfirmation ? (
                            <button className="btn btn-primary">Cancel</button>
                        ) : (
                            <button className="btn btn-primary">Update</button>
                        )}
                    </div>
                ) : (
                    <button className="btn btn-primary">Save</button>
                )}
            </div>
        </div>
    );
}
