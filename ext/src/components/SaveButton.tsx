import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import { SaveModal } from "@/components/SaveModal";
import {
    getActive,
    setActive,
    subscribe,
} from "@/content/store/activeSaveButton";
import type { Message } from "@/components/types";
import type { Theme } from "@/content/lib/theme";
import { useTheme } from "@/content/lib/useTheme";

interface SaveButtonProps {
    message: Message;
    isSaved: boolean;
    peer: string;
    peerName?: string;
    kind: "dm" | "comment";
    platform: string;
    chatUrl?: string;
    founderExternalId?: string | null;
    // Controls which edge the popover modal is anchored to. "right" (default)
    // anchors to the button's right — modal opens toward the top-left of the
    // button (Reddit pattern). "left" anchors to the button's left — modal
    // opens toward the top-right (LinkedIn, where we mount the button at the
    // message's bottom-left so the modal has room to the right).
    align?: "left" | "right";
    // Optional theme override. When omitted, the button detects theme from
    // the host page's DOM (Reddit applies theme-dark/theme-light classes).
    // Platforms without that signal (LinkedIn) pass an explicit value so the
    // button renders with Woohoo's own branding regardless of system theme.
    theme?: Theme;
    // `false` means the underlying item (e.g. a LinkedIn reshare, reaction,
    // file, or call) can't be saved. The button still renders so the user
    // can see Woohoo is working on every message — the modal explains why
    // this particular one won't save. Defaults to true.
    saveable?: boolean;
    unsaveableReason?: string;
}

export function SaveButton(props: SaveButtonProps) {
    const {
        message,
        peer,
        peerName,
        kind,
        platform,
        chatUrl,
        founderExternalId,
        align = "right",
        theme: themeOverride,
        saveable = true,
        unsaveableReason,
    } = props;
    const { id } = message;
    const [isActive, setIsActive] = useState(getActive() === id);
    const [isSaved, setIsSaved] = useState(props.isSaved);
    const detectedTheme = useTheme();
    const theme = themeOverride ?? detectedTheme;

    useEffect(() => {
        return subscribe((activeId) => {
            setIsActive(activeId === id);
        });
    }, [id]);

    const toggle = () => {
        if (isActive) {
            setActive(null);
        } else {
            setActive(id);
        }
    };

    const close = () => {
        if (getActive() === id) setActive(null);
    };

    const popoverClass = [
        "cb-popover",
        align === "left" ? "cb-popover--align-left" : "",
        isActive ? "open" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={theme}
            style={{
                position: "relative",
                display: "inline-block",
            }}
        >
            <div className={popoverClass}>
                {isActive && (
                    <SaveModal
                        message={message}
                        isSaved={isSaved}
                        peer={peer}
                        peerName={peerName}
                        kind={kind}
                        platform={platform}
                        chatUrl={chatUrl}
                        founderExternalId={founderExternalId}
                        saveable={saveable}
                        unsaveableReason={unsaveableReason}
                        onSaved={() => setIsSaved(true)}
                        onUnsaved={() => setIsSaved(false)}
                        onClose={close}
                    />
                )}
            </div>

            <button
                className={`cb-icon-btn ${isActive ? "open" : ""}`}
                onClick={toggle}
            >
                <Bookmark
                    size={16}
                    strokeWidth={2.5}
                    fill={isSaved ? "var(--red)" : "transparent"}
                />
            </button>
        </div>
    );
}
