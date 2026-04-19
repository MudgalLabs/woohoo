import { prisma } from "@/lib/prisma";
import { PlanTier } from "@/app/generated/prisma/client";

export class PlanLimitError extends Error {
    constructor(
        public readonly limit: number,
        public readonly planName: string,
    ) {
        super(
            `${planName} plan is limited to ${limit} active Woohoos. Archive one or upgrade to Pro.`,
        );
        this.name = "PlanLimitError";
    }
}

export interface ResolvedPlan {
    id: string;
    tier: PlanTier;
    name: string;
    activeWoohooLimit: number | null;
}

const FREE_FALLBACK: ResolvedPlan = {
    id: "plan_free",
    tier: PlanTier.free,
    name: "Free",
    activeWoohooLimit: 100,
};

// "No subscription = free user." Resolves the plan either from a live
// subscription row, or falls back to Free so the caller never has to branch.
export async function getUserPlan(userId: string): Promise<ResolvedPlan> {
    const sub = await prisma.subscription.findUnique({
        where: { userId },
        include: { plan: true },
    });
    if (!sub) return FREE_FALLBACK;
    return {
        id: sub.plan.id,
        tier: sub.plan.tier,
        name: sub.plan.name,
        activeWoohooLimit: sub.plan.activeWoohooLimit,
    };
}

export function getActiveWoohooCount(userId: string): Promise<number> {
    return prisma.woohoo.count({ where: { userId, archivedAt: null } });
}

// Throws PlanLimitError if activating one more Woohoo would push the user
// past their plan's activeWoohooLimit. Used before creating a new Woohoo
// or unarchiving an existing one.
export async function assertCanActivateWoohoo(userId: string): Promise<void> {
    const plan = await getUserPlan(userId);
    if (plan.activeWoohooLimit == null) return;
    const count = await getActiveWoohooCount(userId);
    if (count >= plan.activeWoohooLimit) {
        throw new PlanLimitError(plan.activeWoohooLimit, plan.name);
    }
}
