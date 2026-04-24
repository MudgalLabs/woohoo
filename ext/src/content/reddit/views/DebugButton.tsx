import { useState } from "react";

interface DebugButtonProps {
    peer: string;
    isReady: boolean;
}

export function DebugButton(props: DebugButtonProps) {
    const { peer, isReady } = props;

    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    return (
        <div className="popup-container">
            {show && (
                <div
                    className={`popup-content ${show ? "opacity-100" : "opacity-0"}`}
                >
                    {!peer ? "Open any chat" : `Current chat: ${peer}`}
                </div>
            )}

            <button
                className={`toggle-button ${isReady ? "btn-primary" : ""}`}
                onClick={toggle}
            ></button>
        </div>
    );
}
