"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { DateTimePicker } from "@/components/DateTimePicker";
import { cn } from "@/lib/utils";
import { followUpLabel } from "../WoohooCard";
import { dayDiffInTz } from "@/lib/date-tz";

interface FollowUpEditorProps {
    woohooId: string;
    followUpAt: string | null;
    timezone: string;
}

export function FollowUpEditor({
    woohooId,
    followUpAt,
    timezone,
}: FollowUpEditorProps) {
    const [current, setCurrent] = useState<Date | null>(
        followUpAt ? new Date(followUpAt) : null,
    );
    const [editing, setEditing] = useState(false);

    const save = async (next: Date | null) => {
        const prev = current;
        setCurrent(next);
        try {
            const res = await fetch(`/api/woohoos/${woohooId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    followUpAt: next ? next.toISOString() : null,
                }),
            });
            if (!res.ok) setCurrent(prev);
        } catch {
            setCurrent(prev);
        }
    };

    if (editing) {
        return (
            <DateTimePicker
                value={current}
                onChange={save}
                autoOpen
                onOpenChange={(open) => {
                    if (!open) setEditing(false);
                }}
            />
        );
    }

    if (current) {
        const isOverdue = dayDiffInTz(current, new Date(), timezone) < 0;
        return (
            <button
                type="button"
                onClick={() => setEditing(true)}
                className={cn(
                    "inline-flex items-center text-sm font-medium rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-accent/50 cursor-pointer",
                    isOverdue ? "text-destructive" : "text-primary",
                )}
            >
                {followUpLabel(current, timezone)}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-accent/50 hover:text-foreground cursor-pointer"
        >
            <Plus size={14} />
            Set follow-up
        </button>
    );
}
