import Link from "next/link";
import { Inbox } from "lucide-react";

export function NoWoohoosYet() {
    return (
        <div className="flex flex-col items-center text-center p-6 pt-16">
            <Inbox
                className="h-10 w-10 text-muted-foreground/60 mb-4"
                strokeWidth={1.5}
                aria-hidden
            />
            <h1 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                Capture your first Woohoo
            </h1>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Save messages and comments with the extension and they&apos;ll
                show up here. Follow up at the right time, never let a warm lead
                go cold.
            </p>
            <Link
                href="/extension"
                className="text-sm font-medium text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                Install the extension →
            </Link>
        </div>
    );
}
