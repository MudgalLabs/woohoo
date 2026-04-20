import Link from "next/link";

import { cn } from "@/lib/utils";

interface SidebarUsageProps {
    planName: string;
    activeCount: number;
    limit: number | null;
}

export function SidebarUsage({
    planName,
    activeCount,
    limit,
}: SidebarUsageProps) {
    if (limit == null) return null;

    const pct = Math.min(100, Math.round((activeCount / limit) * 100));
    const atLimit = activeCount >= limit;
    const nearLimit = activeCount >= limit * 0.8;

    return (
        <Link
            href="/settings/plan"
            className="block mx-2 mb-2 rounded-md border bg-sidebar-accent/30 p-2.5 text-xs hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:hidden"
        >
            <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-sidebar-foreground/80">
                    {planName} plan
                </span>
                <span className="tabular-nums text-sidebar-foreground/60">
                    {activeCount} / {limit}
                </span>
            </div>
            <div className="h-1 w-full rounded-full bg-sidebar-border overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all",
                        atLimit
                            ? "bg-destructive"
                            : nearLimit
                              ? "bg-amber-500"
                              : "bg-primary",
                    )}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </Link>
    );
}
