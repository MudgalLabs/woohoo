import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { bearer } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/prisma";
import { PlanTier } from "@/app/generated/prisma/client";

export const emailPasswordAuthEnabled =
    process.env.ENABLE_EMAIL_PASSWORD_AUTH === "true";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    ...(emailPasswordAuthEnabled
        ? { emailAndPassword: { enabled: true as const } }
        : {}),
    account: {
        accountLinking: {
            enabled: true,
        },
    },
    user: {
        additionalFields: {
            timezone: {
                type: "string",
                required: false,
                input: false,
            },
        },
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
