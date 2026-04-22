import { CheckCircle2, Coffee, Flame, type LucideIcon } from "lucide-react";
import { CountBadge } from "@woohoo/ui";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { WoohooCard } from "@/app/(app)/my-woohoos/WoohooCard";
import type { WoohooCounts } from "@/app/(app)/my-woohoos/WoohooCard";
import { getTimelineCountsByWoohoo } from "@/lib/timeline-counts";
import { EmptyState } from "@/components/empty-state";
import { NoWoohoosYet } from "@/components/no-woohoos-yet";
import { Woohoo, TimelineItem } from "@/app/generated/prisma/client";
import { endOfDayInTz, startOfDayInTz } from "@/lib/date-tz";

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
    timezone,
    className,
}: {
    heading: string;
    subheading: string;
    woohoos: WoohooWithTimeline[];
    emptyText: string;
    emptyIcon: LucideIcon;
    variant?: "default" | "overdue";
    countsMap: Map<string, WoohooCounts>;
    timezone: string;
    className?: string;
}) {
    return (
        <section className={className}>
            <div className="mb-3">
                <h2 className="text-sm font-semibold text-foreground inline-flex items-center">
                    {heading}
                    <CountBadge
                        className={
                            variant === "overdue" && woohoos.length > 0
                                ? "ml-2 bg-destructive/15 text-destructive"
                                : "ml-2"
                        }
                        count={woohoos.length}
                        active={woohoos.length > 0}
                    />
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
                            timezone={timezone}
                        />
                    ))}
                </div>
            )}
        </section>
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

    const timezone = session!.user.timezone ?? "UTC";
    const now = new Date();
    const startOfToday = startOfDayInTz(now, timezone);
    const endOfToday = endOfDayInTz(now, timezone);
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
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DashboardSection
                    heading="Overdue"
                    subheading="Follow-up dates that have passed. Don't let these slip."
                    woohoos={overdue}
                    emptyText="You're all caught up. Nice work."
                    emptyIcon={CheckCircle2}
                    variant="overdue"
                    countsMap={countsMap}
                    timezone={timezone}
                />
                <DashboardSection
                    heading="Today"
                    subheading="Woohoos you planned to follow up on today."
                    woohoos={today}
                    emptyText="Nothing due today — enjoy the quiet."
                    emptyIcon={Coffee}
                    countsMap={countsMap}
                    timezone={timezone}
                />
                <DashboardSection
                    heading="Going cold"
                    subheading="No follow-up set and no new interaction in the last 7 days."
                    woohoos={goingCold}
                    emptyText="Everything looks warm. Keep it up."
                    emptyIcon={Flame}
                    countsMap={countsMap}
                    timezone={timezone}
                    className="md:col-span-2 lg:col-span-1"
                />
            </div>
        </div>
    );
}
