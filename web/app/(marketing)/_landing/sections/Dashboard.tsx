import { cn } from "@/lib/utils";
import { DemoWoohooCard } from "../demo/DemoWoohooCard";
import type { Woohoo, TimelineItem } from "@/app/generated/prisma/client";
import { dashboardToday, dashboardOverdue, dashboardCold } from "../demo/mocks";

type MockWoohoo = Woohoo & { timeline: TimelineItem[] };

function DemoDashboardSection({
    heading,
    subheading,
    woohoos,
    variant = "default",
    className,
}: {
    heading: string;
    subheading: string;
    woohoos: MockWoohoo[];
    variant?: "default" | "overdue";
    className?: string;
}) {
    return (
        <section className={className}>
            <div className="mb-4">
                <h2 className="text-sm font-semibold text-foreground pb-1">
                    {heading}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {subheading}
                </p>
            </div>
            <div className="flex flex-col gap-3">
                {woohoos.map((w) => (
                    <DemoWoohooCard
                        key={w.id}
                        woohoo={w}
                        counts={{ dm: w.timeline.length, comment: 0 }}
                        variant={variant}
                    />
                ))}
            </div>
        </section>
    );
}

export function Dashboard() {
    const stats = [
        {
            count: dashboardToday.length,
            label: "to follow up today",
            emphasis: false,
        },
        {
            count: dashboardOverdue.length,
            label: "overdue",
            emphasis: true,
        },
        {
            count: dashboardCold.length,
            label: "going cold",
            emphasis: false,
        },
    ];

    return (
        <section className="section" id="dashboard">
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> the dashboard
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        <span className="italic-serif muted">Know exactly</span>{" "}
                        <span className="mark">who to reply to.</span>
                    </h2>
                    <p>
                        Open your dashboard and see what’s due today, what’s
                        overdue, and what’s going cold. No setup. No pipeline.
                        Just people.
                    </p>
                </div>

                <div className="dash-frame">
                    <p className="text-sm text-muted-foreground mb-6">
                        {stats.map((part, i) => (
                            <span key={part.label}>
                                {i > 0 && (
                                    <span className="mx-2 text-border">·</span>
                                )}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                        <DemoDashboardSection
                            heading="Today"
                            subheading="Woohoos you planned to follow up on today."
                            woohoos={dashboardToday}
                            className="order-2 lg:order-0"
                        />
                        <DemoDashboardSection
                            heading="Overdue"
                            subheading="Follow-up dates that have passed. Don't let these slip."
                            woohoos={dashboardOverdue}
                            variant="overdue"
                            className="order-1 lg:order-0"
                        />
                        <DemoDashboardSection
                            heading="Going cold"
                            subheading="No follow-up set and no new interaction in the last 7 days."
                            woohoos={dashboardCold}
                            className="order-3 md:col-span-2 lg:col-span-1 lg:order-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
