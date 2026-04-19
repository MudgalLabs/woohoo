import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { bearer } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/prisma";
import { PlanTier } from "@/app/generated/prisma/client";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["chrome-extension://*"],
    // bearer() allows Authorization: Bearer <token> auth (used by the extension).
    // nextCookies() must remain last.
    plugins: [bearer(), nextCookies()],
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // Every new signup gets a Free subscription. "No subscription"
                    // still resolves to Free via getUserPlan, but keeping a row
                    // here makes billing/analytics straightforward later.
                    const free = await prisma.plan.findUnique({
                        where: { tier: PlanTier.free },
                        select: { id: true },
                    });
                    if (!free) return;
                    await prisma.subscription.upsert({
                        where: { userId: user.id },
                        create: { userId: user.id, planId: free.id },
                        update: {},
                    });
                },
            },
        },
    },
});
