import { useState } from "react";
import { SquareArrowOutUpRight } from "lucide-react";

import { Message } from "@/content/reddit/dm";
import { Branding } from "@/components/Branding";

interface SaveModalProps {
    message: Message;
    isSaved: boolean;
}

export function SaveModal(props: SaveModalProps) {
    const { message, isSaved } = props;
    const [askedForConfirmation, setAskedForConfirmation] = useState(false);

    const handleRemove = () => {
        // Before removing, ask user to confirm.
        if (!askedForConfirmation) {
            setAskedForConfirmation(true);
            return;
        }
    };

    // const previewText = getPreviewText(message.contentText);

    return (
        <div className="cb-modal">
            <div className="flex-y cb-modal-header" style={{ rowGap: 0 }}>
                <h2 className="cb-modal-title">
                    {isSaved ? "Update" : "Save"} message
                </h2>

                {isSaved ? (
                    <a
                        href="https://cirleback.to/conversation/69"
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

function getPreviewText(text: string, maxChars = 160) {
    if (text.length <= maxChars) return text;

    const trimmed = text.slice(0, maxChars);
    const lastSpace = trimmed.lastIndexOf(" ");

    return trimmed.slice(0, lastSpace) + "...";
}
