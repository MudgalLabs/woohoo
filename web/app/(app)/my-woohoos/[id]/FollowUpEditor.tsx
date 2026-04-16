"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

interface FollowUpEditorProps {
    woohooId: string;
    followUpAt: string | null;
}

function toDatetimeLocal(iso: string | null): string {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDisplay(iso: string | null): string {
    if (!iso) return "Not set";
    return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function FollowUpEditor({ woohooId, followUpAt }: FollowUpEditorProps) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(toDatetimeLocal(followUpAt));
    const [current, setCurrent] = useState(followUpAt);
    const [saving, setSaving] = useState(false);

    const save = async () => {
        setSaving(true);
        const res = await fetch(`/api/woohoos/${woohooId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ followUpAt: value || null }),
        });

        if (res.ok) {
            const data = (await res.json()) as { woohoo: { followUpAt: string | null } };
            setCurrent(data.woohoo.followUpAt);
            setValue(toDatetimeLocal(data.woohoo.followUpAt));
        }

        setSaving(false);
        setEditing(false);
    };

    const cancel = () => {
        setValue(toDatetimeLocal(current));
        setEditing(false);
    };

    if (editing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="datetime-local"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="text-sm border border-border rounded px-2 py-1 bg-background"
                    autoFocus
                />
                <button
                    onClick={save}
                    disabled={saving}
                    className="p-1 rounded hover:bg-accent text-primary"
                    title="Save"
                >
                    <Check size={16} />
                </button>
                <button
                    onClick={cancel}
                    className="p-1 rounded hover:bg-accent text-muted-foreground"
                    title="Cancel"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className={current ? "text-primary font-medium text-sm" : "text-muted-foreground text-sm"}>
                {formatDisplay(current)}
            </span>
            <button
                onClick={() => setEditing(true)}
                className="p-1 rounded hover:bg-accent text-muted-foreground"
                title="Edit follow-up date"
            >
                <Pencil size={14} />
            </button>
        </div>
    );
}
