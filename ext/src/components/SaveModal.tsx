import { useState } from "react";

import { Message } from "@/content/reddit/dm";

interface SaveModalProps {
    message: Message;
}

export function SaveModal({ message }: SaveModalProps) {
    const [expanded, setExpanded] = useState(false);

    const previewText = getPreviewText(message.contentText);

    return (
        <div style={{ width: 260 }}>
            {/* Header */}
            <div style={{ fontSize: 12, color: "#6b5f50", marginBottom: 6 }}>
                <strong>{message.username || "Unknown"}</strong>
            </div>

            {/* Content */}
            {!expanded ? (
                <div
                    style={{
                        fontSize: 13,
                        color: "#1a1410",
                        lineHeight: 1.4,
                    }}
                >
                    {previewText}
                </div>
            ) : (
                <div
                    style={{
                        fontSize: 13,
                        color: "#1a1410",
                        lineHeight: 1.5,
                    }}
                    dangerouslySetInnerHTML={{
                        __html: message.contentHTML,
                    }}
                />
            )}

            {/* Expand */}
            {message.contentText.length > 140 && (
                <button
                    onClick={() => setExpanded((v) => !v)}
                    style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: "#8a7f72",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                    }}
                >
                    {expanded ? "Show less" : "View more"}
                </button>
            )}
        </div>
    );
}

function getPreviewText(text: string, maxChars = 140) {
    if (text.length <= maxChars) return text;

    return text.slice(0, maxChars).trim() + "...";
}
