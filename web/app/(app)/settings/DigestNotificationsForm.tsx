"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
    initialInApp: boolean;
    initialEmail: boolean;
    isPro: boolean;
}

export function DigestNotificationsForm({
    initialInApp,
    initialEmail,
    isPro,
}: Props) {
    const [inApp, setInApp] = useState(initialInApp);
    const [email, setEmail] = useState(initialEmail);
    const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

    const save = async (patch: {
        emailDigestEnabled?: boolean;
        inAppDigestEnabled?: boolean;
    }) => {
        setStatus("idle");
        try {
            const res = await fetch("/api/me/preferences", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setStatus("saved");
        } catch {
            setStatus("error");
            throw new Error("save_failed");
        }
    };

    const toggleInApp = async () => {
        const next = !inApp;
        const prev = inApp;
        setInApp(next);
        try {
            await save({ inAppDigestEnabled: next });
        } catch {
            setInApp(prev);
        }
    };

    const toggleEmail = async () => {
        if (!isPro) return;
        const next = !email;
        const prev = email;
        setEmail(next);
        try {
            await save({ emailDigestEnabled: next });
        } catch {
            setEmail(prev);
        }
    };

    // Free users see the email toggle in a visually-disabled state regardless
    // of DB value (cron wouldn't send anyway — filter runs on plan).
    const emailDisplayValue = isPro ? email : false;

    return (
        <div className="space-y-4">
            <ToggleRow
                label="In-app notification"
                description="Show the digest in your notifications bell."
                value={inApp}
                onChange={toggleInApp}
            />
            <ToggleRow
                label="Email"
                description={
                    isPro
                        ? "Send the digest to your email around 8am in your timezone."
                        : "Available on Pro. Upgrade to receive a daily email digest."
                }
                value={emailDisplayValue}
                onChange={toggleEmail}
                disabled={!isPro}
            />
            <div className="min-h-[16px]">
                {status === "error" && (
                    <span className="text-xs text-destructive">
                        Could not save. Try again.
                    </span>
                )}
                {status === "saved" && (
                    <span className="text-xs text-muted-foreground">
                        Saved.
                    </span>
                )}
            </div>
        </div>
    );
}

function ToggleRow({
    label,
    description,
    value,
    onChange,
    disabled,
}: {
    label: string;
    description: string;
    value: boolean;
    onChange: () => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <p
                    className={cn(
                        "text-sm font-medium",
                        disabled && "text-muted-foreground",
                    )}
                >
                    {label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {description}
                </p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={value}
                aria-label={label}
                onClick={onChange}
                disabled={disabled}
                className={cn(
                    "relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    value ? "bg-primary" : "bg-input",
                )}
            >
                <span
                    aria-hidden
                    className={cn(
                        "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow ring-0 transition-transform",
                        value ? "translate-x-5" : "translate-x-0",
                    )}
                />
            </button>
        </div>
    );
}
