import Link from "next/link";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { WoohooCard } from "./WoohooCard";
import { getTimelineCountsByWoohoo } from "@/lib/timeline-counts";
import { NoWoohoosYet } from "@/components/no-woohoos-yet";
import { EmptyState } from "@/components/empty-state";
import { Archive } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = { title: "My Woohoos" };

type View = "active" | "archived";

function TabLink({
    href,
    label,
    count,
    active,
}: {
    href: string;
    label: string;
    count: number;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:text-foreground",
                active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
            )}
        >
            {label}
            {count > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary/20 px-1.5 text-xs font-medium text-secondary-foreground">
                    {count}
                </span>
            )}
        </Link>
    );
}

export default async function MyWoohoos({
    searchParams,
}: {
    searchParams: Promise<{ view?: string }>;
}) {
    const { view: viewParam } = await searchParams;
    const view: View = viewParam === "archived" ? "archived" : "active";

    const session = await getSession();
    const userId = session!.user.id;

    const [activeCount, archivedCount, woohoos, countsMap] = await Promise.all([
        prisma.woohoo.count({ where: { userId, archivedAt: null } }),
        prisma.woohoo.count({
            where: { userId, archivedAt: { not: null } },
        }),
        prisma.woohoo.findMany({
            where: {
                userId,
                archivedAt: view === "archived" ? { not: null } : null,
            },
            orderBy: { lastSavedAt: "desc" },
            include: {
                timeline: {
                    orderBy: { interactionAt: "desc" },
                    take: 1,
                },
            },
        }),
        getTimelineCountsByWoohoo(userId),
    ]);

    if (activeCount === 0 && archivedCount === 0) {
        return <NoWoohoosYet />;
    }

    return (
        <div className="p-6 w-full">
            <div className="mb-4 inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <TabLink
                    href="/my-woohoos"
                    label="Active"
                    count={activeCount}
                    active={view === "active"}
                />
                <TabLink
                    href="/my-woohoos?view=archived"
                    label="Archived"
                    count={archivedCount}
                    active={view === "archived"}
                />
            </div>

            {woohoos.length === 0 ? (
                <EmptyState icon={Archive}>
                    {view === "archived"
                        ? "No archived Woohoos yet."
                        : "No active Woohoos. Check the Archived tab."}
                </EmptyState>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
                    {woohoos.map((w) => (
                        <WoohooCard
                            key={w.id}
                            woohoo={w}
                            counts={countsMap.get(w.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
