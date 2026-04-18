import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon: LucideIcon;
    children: ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, children, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center gap-2 py-8 text-center",
                className,
            )}
        >
            <Icon
                className="h-8 w-8 text-muted-foreground/60"
                strokeWidth={1.5}
                aria-hidden
            />
            <p className="text-sm text-muted-foreground">{children}</p>
        </div>
    );
}
