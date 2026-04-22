import { CountBadge } from "@woohoo/ui";
import { DemoWoohooCard } from "../demo/DemoWoohooCard";
import type { Woohoo, TimelineItem } from "@/app/generated/prisma/client";
import { dashboardToday, dashboardOverdue, dashboardCold } from "../demo/mocks";
import Link from "next/link";

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
        <section id="#dashboard" className={className}>
            <div className="mb-3">
                <h2 className="text-[14px]! font-semibold! text-foreground inline-flex items-center">
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
            <div className="flex flex-col gap-3">
                {woohoos.map((w) => {
                    const dm = w.timeline.filter((i) => i.type === "dm").length;
                    const comment = w.timeline.length - dm;
                    return (
                        <Link key={w.id} href="#dashboard">
                            <DemoWoohooCard
                                woohoo={w}
                                counts={{ dm, comment }}
                                variant={variant}
                            />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export function Dashboard() {
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
                        Open your dashboard and see what’s overdue, what’s due
                        today, and what’s going cold. No setup. No pipeline.
                        Just people.
                    </p>
                </div>

                <div className="dash-frame app-island">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <DemoDashboardSection
                                heading="Overdue"
                                subheading="Follow-up dates that have passed. Don't let these slip."
                                woohoos={dashboardOverdue}
                                variant="overdue"
                            />
                            <DemoDashboardSection
                                heading="Today"
                                subheading="Woohoos you planned to follow up on today."
                                woohoos={dashboardToday}
                            />
                            <DemoDashboardSection
                                heading="Going cold"
                                subheading="No follow-up set and no new interaction in the last 7 days."
                                woohoos={dashboardCold}
                                className="md:col-span-2 lg:col-span-1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
