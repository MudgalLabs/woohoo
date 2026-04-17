import Link from "next/link";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { WoohooCard } from "@/app/(app)/my-woohoos/WoohooCard";
import { Woohoo, TimelineItem } from "@/app/generated/prisma/client";

export const metadata = { title: "Dashboard" };

type WoohooWithTimeline = Woohoo & { timeline: TimelineItem[] };

function DashboardSection({
    heading,
    subheading,
    woohoos,
    emptyText,
}: {
    heading: string;
    subheading: string;
    woohoos: WoohooWithTimeline[];
    emptyText: string;
}) {
    return (
        <div>
            <div className="mb-3">
                <h2 className="text-sm font-semibold text-foreground">{heading}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{subheading}</p>
            </div>

            {woohoos.length === 0 ? (
                <p className="text-sm text-muted-foreground">{emptyText}</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {woohoos.map((w) => (
                        <WoohooCard key={w.id} woohoo={w} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default async function DashboardPage() {
    const session = await getSession();

    const allWoohoos = await prisma.woohoo.findMany({
        where: { userId: session!.user.id },
        include: {
            timeline: {
                orderBy: { interactionAt: "desc" },
                take: 1,
            },
        },
        orderBy: { lastSavedAt: "desc" },
    });

    if (allWoohoos.length === 0) {
        return (
            <div className="flex flex-col items-center text-center p-6 pt-16">
                <h1 className="text-lg font-semibold text-foreground mb-2">
                    Capture your first Woohoo
                </h1>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Save a Reddit DM with the extension and it&apos;ll show up here.
                    Follow up at the right time, never let a warm lead go cold.
                </p>
                <Link
                    href="/extension"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Install the extension →
                </Link>
            </div>
        );
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const today = allWoohoos.filter(
        (w) => w.followUpAt && w.followUpAt >= startOfToday && w.followUpAt <= endOfToday,
    );
    const overdue = allWoohoos.filter(
        (w) => w.followUpAt && w.followUpAt < startOfToday,
    );
    const goingCold = allWoohoos.filter(
        (w) => !w.followUpAt && (!w.lastSavedAt || w.lastSavedAt < sevenDaysAgo),
    );

    return (
        // Mobile: single column, stacked as overdue → today → going cold
        // Desktop: 2 columns — today fills left, overdue + going cold stacked right
        // Each column scrolls independently so both are always visible
        <div className="h-[calc(100vh-3rem)] flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
            {/* Mobile-only: overdue first */}
            <div className="md:hidden flex flex-col gap-6 overflow-y-auto">
                <DashboardSection
                    heading="Overdue"
                    subheading="Follow-up dates that have passed. Don't let these slip."
                    woohoos={overdue}
                    emptyText="You're all caught up. Nice work."
                />
                <DashboardSection
                    heading="Today"
                    subheading="Woohoos you planned to follow up on today."
                    woohoos={today}
                    emptyText="Nothing due today — enjoy the quiet."
                />
                <DashboardSection
                    heading="Might be going cold"
                    subheading="No follow-up set and no new interaction in the last 7 days."
                    woohoos={goingCold}
                    emptyText="Everything looks warm. Keep it up."
                />
            </div>

            {/* Desktop: left column = Today */}
            <div className="hidden md:flex flex-col flex-1 overflow-y-auto">
                <DashboardSection
                    heading="Today"
                    subheading="Woohoos you planned to follow up on today."
                    woohoos={today}
                    emptyText="Nothing due today — enjoy the quiet."
                />
            </div>

            {/* Desktop: right column = Overdue + Going Cold */}
            <div className="hidden md:flex flex-col flex-1 gap-8 overflow-y-auto">
                <DashboardSection
                    heading="Overdue"
                    subheading="Follow-up dates that have passed. Don't let these slip."
                    woohoos={overdue}
                    emptyText="You're all caught up. Nice work."
                />
                <DashboardSection
                    heading="Might be going cold"
                    subheading="No follow-up set and no new interaction in the last 7 days."
                    woohoos={goingCold}
                    emptyText="Everything looks warm. Keep it up."
                />
            </div>
        </div>
    );
}
