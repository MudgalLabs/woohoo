"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Label } from "@woohoo/ui";
import { COMMON_TIMEZONES } from "@/lib/timezones";
import { cn } from "@/lib/utils";

interface TimezoneFormProps {
    currentTimezone: string | null;
}

export function TimezoneForm({ currentTimezone }: TimezoneFormProps) {
    const [value, setValue] = useState<string>(currentTimezone ?? "UTC");
    const [browserTz, setBrowserTz] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
    const router = useRouter();

    useEffect(() => {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (detected) setBrowserTz(detected);
    }, []);

    const options = useMemo(() => {
        const list = [...COMMON_TIMEZONES];
        const extras = new Set<string>();
        if (currentTimezone) extras.add(currentTimezone);
        if (browserTz) extras.add(browserTz);
        extras.add(value);
        for (const tz of extras) {
            if (!list.some((o) => o.value === tz)) {
                list.unshift({ value: tz, label: tz });
            }
        }
        return list;
    }, [currentTimezone, browserTz, value]);

    const dirty = value !== (currentTimezone ?? "UTC");

    const save = async () => {
        setSaving(true);
        setStatus("idle");
        try {
            const res = await fetch("/api/me/timezone", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ timezone: value }),
            });
            if (!res.ok) {
                setStatus("error");
                return;
            }
            setStatus("saved");
            router.refresh();
        } catch {
            setStatus("error");
        } finally {
            setSaving(false);
        }
    };

    const applyBrowserTimezone = () => {
        if (browserTz) setValue(browserTz);
    };

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                <Label htmlFor="tz-select" className="sr-only">
                    Timezone
                </Label>
                <select
                    id="tz-select"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                {browserTz && (
                    <button
                        type="button"
                        onClick={applyBrowserTimezone}
                        disabled={browserTz === value}
                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 disabled:opacity-60 disabled:no-underline disabled:cursor-default"
                    >
                        {browserTz === value
                            ? `Matches your browser (${browserTz})`
                            : `Use browser timezone (${browserTz})`}
                    </button>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    size="sm"
                    onClick={save}
                    disabled={!dirty || saving}
                >
                    {saving ? "Saving…" : "Save"}
                </Button>
                {status === "saved" && (
                    <span
                        className={cn(
                            "text-xs text-muted-foreground",
                            dirty && "hidden",
                        )}
                    >
                        Saved.
                    </span>
                )}
                {status === "error" && (
                    <span className="text-xs text-destructive">
                        Could not save. Try again.
                    </span>
                )}
            </div>
        </div>
    );
}
