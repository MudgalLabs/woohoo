"use client";

import { useState } from "react";

import { DateTimePicker } from "@/components/DateTimePicker";

interface FollowUpEditorProps {
    woohooId: string;
    followUpAt: string | null;
}

export function FollowUpEditor({ woohooId, followUpAt }: FollowUpEditorProps) {
    const [current, setCurrent] = useState<Date | null>(
        followUpAt ? new Date(followUpAt) : null,
    );
    const [saving, setSaving] = useState(false);

    const save = async (next: Date | null) => {
        const prev = current;
        setCurrent(next);
        setSaving(true);
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
        } finally {
            setSaving(false);
        }
    };

    return (
        <DateTimePicker
            value={current}
            onChange={save}
            disabled={saving}
        />
    );
}
