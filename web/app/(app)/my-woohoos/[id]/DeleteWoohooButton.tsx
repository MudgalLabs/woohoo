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

interface DeleteWoohooButtonProps {
    woohooId: string;
}

export function DeleteWoohooButton({ woohooId }: DeleteWoohooButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const confirmDelete = async () => {
        setDeleting(true);
        setError(null);

        const res = await fetch(`/api/woohoos/${woohooId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { error?: string };
            setError(body.error ?? "Failed to delete.");
            setDeleting(false);
            return;
        }

        setOpen(false);
        router.push("/my-woohoos");
        router.refresh();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    title="Delete Woohoo"
                >
                    <Trash2 size={16} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this Woohoo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This removes the Woohoo and every saved message in its
                        timeline. This action cannot be undone.
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
                        {deleting ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
