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
        const res = await fetch("/api/me/preferences", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus("saved");
    };

    const toggleInApp = async () => {
        const next = !inApp;
        const prev = inApp;
        setInApp(next);
        try {
            await save({ inAppDigestEnabled: next });
        } catch {
            setInApp(prev);
            setStatus("error");
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
            setStatus("error");
        }
    };

    // Free users see the email toggle off + disabled regardless of DB value
    // (cron wouldn't send anyway — filter runs on plan).
    const emailDisplayValue = isPro ? email : false;

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-[1fr_72px_72px] items-center gap-x-4">
                {/* Column headers */}
                <div />
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                    In app
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
                    Email
                </div>

                {/* Separator under headers, spans all 3 columns */}
                <div className="col-span-3 border-t my-2" />

                {/* Follow-up digest row */}
                <div>
                    <p className="text-sm font-medium">Follow-up digest</p>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
                        A daily nudge covering Woohoos that need a follow-up
                        today or are already overdue, around 8am in your
                        timezone.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Toggle
                        value={inApp}
                        onChange={toggleInApp}
                        label="In-app follow-up digest"
                    />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Toggle
                        value={emailDisplayValue}
                        onChange={toggleEmail}
                        disabled={!isPro}
                        label="Email follow-up digest"
                    />
                    {!isPro && (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Pro
                        </span>
                    )}
                </div>
            </div>

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

function Toggle({
    value,
    onChange,
    disabled,
    label,
}: {
    value: boolean;
    onChange: () => void;
    disabled?: boolean;
    label: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={value}
            aria-label={label}
            onClick={onChange}
            disabled={disabled}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
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
    );
}
