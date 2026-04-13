import { Logo } from "./Logo";

export function SaveButton() {
    return (
        <button
            style={{
                background: "#f5f0e8",
                // background: "transparent",
                padding: "2px 2px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Logo height={16} />
        </button>
    );
}
