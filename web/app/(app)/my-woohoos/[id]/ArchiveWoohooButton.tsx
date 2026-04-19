"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Button,
} from "@woohoo/ui";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ArchiveWoohooButtonProps {
    woohooId: string;
    archived: boolean;
}

export function ArchiveWoohooButton({
    woohooId,
    archived,
}: ArchiveWoohooButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const next = !archived;

    const confirm = async () => {
        setSaving(true);
        setError(null);

        const res = await fetch(`/api/woohoos/${woohooId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ archived: next }),
        });

        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as {
                error?: string;
                code?: string;
                limit?: number;
                planName?: string;
            };
            const msg =
                body.code === "plan_limit_reached"
                    ? `You're at the ${body.planName ?? "Free"} plan limit of ${body.limit ?? 100} active Woohoos. Archive another one or upgrade to Pro.`
                    : (body.error ?? "Failed to update.");
            setError(msg);
            setSaving(false);
            return;
        }

        setOpen(false);
        if (next) {
            router.push("/my-woohoos");
        }
        router.refresh();
    };

    const Icon = archived ? ArchiveRestore : Archive;
    const title = archived ? "Unarchive Woohoo" : "Archive Woohoo";
    const dialogTitle = archived
        ? "Unarchive this Woohoo?"
        : "Archive this Woohoo?";
    const dialogDescription = archived
        ? "It'll show up in your active Woohoos again."
        : "It'll be hidden from your dashboard and active list. You can unarchive it anytime from the Archived tab. It will become active again if you save a new message or comment from this person.";
    const actionLabel = archived ? "Unarchive" : "Archive";
    const loadingLabel = archived ? "Unarchiving…" : "Archiving…";

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Icon size={16} />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {dialogDescription}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={saving}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            void confirm();
                        }}
                        disabled={saving}
                    >
                        {saving ? loadingLabel : actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
