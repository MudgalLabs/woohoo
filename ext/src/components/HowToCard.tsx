import { useEffect, useState } from "react";
import { X, SquareArrowOutUpRight } from "lucide-react";

import { API_BASE_URL as BASE_URL } from "@/lib/api-base-url";

type Platform = "reddit" | "linkedin";

const PLATFORM_LABEL: Record<Platform, string> = {
    reddit: "Reddit",
    linkedin: "LinkedIn",
};

const dismissKey = (platform: Platform) => `howto_dismissed_${platform}`;

interface HowToCardProps {
    platform: Platform;
    // Light by default on every platform — Woohoo's own branding, not the
    // host page's theme. Same call as SaveButton (see LinkedIn adapter).
    theme?: "light" | "dark";
    // Where the card anchors on the viewport. Top-right keeps it in the
    // user's primary line of sight on first load; both Reddit and LinkedIn
    // reserve their own floating UI for the bottom corners.
    anchor?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

export function HowToCard({
    platform,
    theme = "light",
    anchor = "top-right",
}: HowToCardProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(dismissKey(platform), (result) => {
            setVisible(!result[dismissKey(platform)]);
        });
    }, [platform]);

    function handleOpen() {
        const url = `${BASE_URL}/extension#${platform}`;
        window.open(url, "_blank", "noopener,noreferrer");
    }

    function handleDismiss(e: React.MouseEvent) {
        e.stopPropagation();
        chrome.storage.local.set({ [dismissKey(platform)]: true });
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className={theme}>
            <div
                className={`cb-howto cb-howto--${anchor}`}
                onClick={handleOpen}
                role="button"
                tabIndex={0}
            >
                <div className="cb-howto-body">
                    <span className="cb-howto-brand">woohoo</span>
                    <span className="cb-howto-title">
                        How to use on {PLATFORM_LABEL[platform]}
                        <SquareArrowOutUpRight
                            size={11}
                            strokeWidth={2.5}
                            className="cb-howto-extlink"
                        />
                    </span>
                </div>
                <button
                    className="cb-howto-dismiss"
                    aria-label="Dismiss"
                    onClick={handleDismiss}
                >
                    <X size={14} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
