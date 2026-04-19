import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@woohoo/ui";
import { getSession } from "@/lib/get-session";
import { getActiveWoohooCount, getUserPlan } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const metadata = { title: "Plan & usage" };

const UPGRADE_MAILTO =
    "mailto:hey@woohoo.to?subject=Woohoo%20Pro%20early%20access";

export default async function PlanSettingsPage() {
    const session = await getSession();
    const userId = session!.user.id;

    const [plan, activeCount] = await Promise.all([
        getUserPlan(userId),
        getActiveWoohooCount(userId),
    ]);

    const isFree = plan.tier === "free";
    const limit = plan.activeWoohooLimit;
    const pct = limit
        ? Math.min(100, Math.round((activeCount / limit) * 100))
        : 0;
    const atLimit = limit != null && activeCount >= limit;
    const nearLimit = limit != null && activeCount >= limit * 0.8;

    return (
        <div className="p-6 w-full max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Plan & usage</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Your current plan and how close you are to its limits.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-5 mb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">
                                {plan.name}
                            </h2>
                            <span
                                className={cn(
                                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                    isFree
                                        ? "bg-muted text-muted-foreground"
                                        : "bg-primary/10 text-primary",
                                )}
                            >
                                {isFree ? "Current plan" : "Pro"}
                            </span>
                        </div>
                    </div>
                    {isFree && (
                        <Button asChild size="sm">
                            <a href={UPGRADE_MAILTO}>
                                <Sparkles className="size-4" />
                                Upgrade to Pro
                            </a>
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-lg border bg-card p-5">
                <div className="flex items-baseline justify-between mb-3">
                    <div>
                        <h3 className="text-sm font-medium">Active Woohoos</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Archived Woohoos don&apos;t count toward your limit.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-semibold tabular-nums">
                            {activeCount}
                            {limit != null && (
                                <span className="text-muted-foreground font-normal">
                                    {" "}
                                    / {limit}
                                </span>
                            )}
                        </div>
                        {limit == null && (
                            <div className="text-xs text-muted-foreground">
                                Unlimited
                            </div>
                        )}
                    </div>
                </div>

                {limit != null && (
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
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
                )}

                {atLimit && isFree && (
                    <p className="text-sm text-destructive mt-3">
                        You&apos;re at the limit. New saves are blocked until
                        you archive a Woohoo from{" "}
                        <Link
                            href="/my-woohoos"
                            className="underline underline-offset-2"
                        >
                            My Woohoos
                        </Link>{" "}
                        or upgrade.
                    </p>
                )}
                {!atLimit && nearLimit && isFree && (
                    <p className="text-sm text-amber-600 dark:text-amber-500 mt-3">
                        You&apos;re close to the limit — consider upgrading to
                        Pro so new saves aren&apos;t blocked.
                    </p>
                )}
            </div>
        </div>
    );
}
