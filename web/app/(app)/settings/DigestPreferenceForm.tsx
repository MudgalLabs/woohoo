"use client";

import { useState } from "react";

interface DigestPreferenceFormProps {
    currentEnabled: boolean;
}

export function DigestPreferenceForm({
    currentEnabled,
}: DigestPreferenceFormProps) {
    const [enabled, setEnabled] = useState(currentEnabled);
    const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

    const toggle = async () => {
        const next = !enabled;
        const previous = enabled;
        setEnabled(next); // optimistic — no disabled flicker
        setStatus("idle");
        try {
            const res = await fetch("/api/me/preferences", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailDigestEnabled: next }),
            });
            if (!res.ok) {
                setEnabled(previous);
                setStatus("error");
                return;
            }
            setStatus("saved");
        } catch {
            setEnabled(previous);
            setStatus("error");
        }
    };

    return (
        <div className="flex items-center justify-between gap-3">
            <label
                htmlFor="digest-enabled"
                className="flex cursor-pointer items-center gap-2 text-sm"
            >
                <input
                    id="digest-enabled"
                    type="checkbox"
                    checked={enabled}
                    onChange={toggle}
                    className="h-4 w-4 cursor-pointer accent-primary"
                />
                <span>{enabled ? "Enabled" : "Disabled"}</span>
            </label>
            {status === "error" && (
                <span className="text-xs text-destructive">
                    Could not save. Try again.
                </span>
            )}
            {status === "saved" && (
                <span className="text-xs text-muted-foreground">Saved.</span>
            )}
        </div>
    );
}
