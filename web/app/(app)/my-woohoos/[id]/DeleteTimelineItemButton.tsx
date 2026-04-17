"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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

interface DeleteTimelineItemButtonProps {
    itemId: string;
}

export function DeleteTimelineItemButton({
    itemId,
}: DeleteTimelineItemButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const confirmDelete = async () => {
        setDeleting(true);
        setError(null);

        const res = await fetch(`/api/timeline-items/${itemId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { error?: string };
            setError(body.error ?? "Failed to delete.");
            setDeleting(false);
            return;
        }

        setOpen(false);
        router.refresh();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    title="Remove saved message"
                >
                    <Trash2 size={14} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove this saved message?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This removes the message from this Woohoo&apos;s timeline.
                        You can always save it again from the original platform.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            void confirmDelete();
                        }}
                        disabled={deleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleting ? "Removing…" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
