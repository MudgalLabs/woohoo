import { CheckCircle2, Coffee, Flame, type LucideIcon } from "lucide-react";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { WoohooCard } from "@/app/(app)/my-woohoos/WoohooCard";
import type { WoohooCounts } from "@/app/(app)/my-woohoos/WoohooCard";
import { getTimelineCountsByWoohoo } from "@/lib/timeline-counts";
import { EmptyState } from "@/components/empty-state";
import { NoWoohoosYet } from "@/components/no-woohoos-yet";
import { Woohoo, TimelineItem } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

type WoohooWithTimeline = Woohoo & {
    timeline: TimelineItem[];
};

function DashboardSection({
    heading,
    subheading,
    woohoos,
    emptyText,
    emptyIcon,
    variant = "default",
    countsMap,
    className,
}: {
    heading: string;
    subheading: string;
    woohoos: WoohooWithTimeline[];
    emptyText: string;
    emptyIcon: LucideIcon;
    variant?: "default" | "overdue";
    countsMap: Map<string, WoohooCounts>;
    className?: string;
}) {
    return (
        <section className={className}>
            <div className="mb-3">
                <h2 className="text-sm font-semibold text-foreground">
                    {heading}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {subheading}
                </p>
            </div>

            {woohoos.length === 0 ? (
                <EmptyState icon={emptyIcon}>{emptyText}</EmptyState>
            ) : (
                <div className="flex flex-col gap-3">
                    {woohoos.map((w) => (
                        <WoohooCard
                            key={w.id}
                            woohoo={w}
                            counts={countsMap.get(w.id)}
                            variant={variant}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function HeroStats({
    today,
    overdue,
    goingCold,
}: {
    today: number;
    overdue: number;
    goingCold: number;
}) {
    const parts: { count: number; label: string; emphasis?: boolean }[] = [
        { count: today, label: "to follow up today" },
        { count: overdue, label: "overdue", emphasis: overdue > 0 },
        { count: goingCold, label: "going cold" },
    ];

    const allZero = today === 0 && overdue === 0 && goingCold === 0;
    if (allZero) {
        return (
            <p className="text-sm text-muted-foreground">
                All caught up — nothing needs your attention right now.
            </p>
        );
    }

    return (
        <p className="text-sm text-muted-foreground">
            {parts.map((part, i) => (
                <span key={part.label}>
                    {i > 0 && <span className="mx-2 text-border">·</span>}
                    <span
                        className={cn(
                            "text-base font-semibold tracking-tight",
                            part.emphasis
                                ? "text-destructive"
                                : "text-foreground",
                        )}
                    >
                        {part.count}
                    </span>{" "}
                    <span>{part.label}</span>
                </span>
            ))}
        </p>
    );
}

export default async function DashboardPage() {
    const session = await getSession();

    const allWoohoos = await prisma.woohoo.findMany({
        where: { userId: session!.user.id, archivedAt: null },
        include: {
            timeline: {
                orderBy: { interactionAt: "desc" },
                take: 1,
            },
        },
        orderBy: { lastSavedAt: "desc" },
    });

    const countsMap = await getTimelineCountsByWoohoo(session!.user.id);

    if (allWoohoos.length === 0) {
        return <NoWoohoosYet />;
    }

    const now = new Date();
    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    const endOfToday = new Date(
        startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1,
    );
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const today = allWoohoos.filter(
        (w) =>
            w.followUpAt &&
            w.followUpAt >= startOfToday &&
            w.followUpAt <= endOfToday,
    );
    const overdue = allWoohoos.filter(
        (w) => w.followUpAt && w.followUpAt < startOfToday,
    );
    const goingCold = allWoohoos.filter(
        (w) =>
            !w.followUpAt && (!w.lastSavedAt || w.lastSavedAt < sevenDaysAgo),
    );

    return (
        <div className="p-6 space-y-8">
            <HeroStats
                today={today.length}
                overdue={overdue.length}
                goingCold={goingCold.length}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DashboardSection
                    heading="Today"
                    subheading="Woohoos you planned to follow up on today."
                    woohoos={today}
                    emptyText="Nothing due today — enjoy the quiet."
                    emptyIcon={Coffee}
                    countsMap={countsMap}
                    className="order-2 lg:order-0"
                />
                <DashboardSection
                    heading="Overdue"
                    subheading="Follow-up dates that have passed. Don't let these slip."
                    woohoos={overdue}
                    emptyText="You're all caught up. Nice work."
                    emptyIcon={CheckCircle2}
                    variant="overdue"
                    countsMap={countsMap}
                    className="order-1 lg:order-0"
                />
                <DashboardSection
                    heading="Going cold"
                    subheading="No follow-up set and no new interaction in the last 7 days."
                    woohoos={goingCold}
                    emptyText="Everything looks warm. Keep it up."
                    emptyIcon={Flame}
                    countsMap={countsMap}
                    className="order-3 md:col-span-2 lg:col-span-1 lg:order-0"
                />
            </div>
        </div>
    );
}
