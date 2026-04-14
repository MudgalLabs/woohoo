import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { SaveModal } from "@/components/SaveModal";
import {
    getActive,
    setActive,
    subscribe,
} from "@/content/store/activeSaveButton";
import { Message } from "@/content/reddit/dm";

interface SaveButtonProps {
    message: Message;
}

export function SaveButton(props: SaveButtonProps) {
    const { message } = props;
    const { id } = message;
    const [isActive, setIsActive] = useState(getActive() === id);

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

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            {isActive && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "calc(100% + 8px)",
                        right: "0px",
                        transform: isActive
                            ? "translateX(0) scale(1)"
                            : "translateX(6px) scale(0.95)",
                        opacity: isActive ? 1 : 0,
                        transition: "all 120ms ease",
                        background: "#f5f0e8",
                        padding: "8px",
                        color: "#1a1410",
                        borderRadius: "6px",
                        whiteSpace: "nowrap",
                        boxShadow:
                            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    }}
                >
                    <SaveModal message={message} />
                </div>
            )}

            <button
                style={{
                    // background: "#e3d8c2",
                    background: "transparent",
                    padding: "2px 2px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                }}
                onClick={toggle}
            >
                <Logo height={16} />
            </button>
        </div>
    );
}
