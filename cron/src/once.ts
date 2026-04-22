// One-shot runner for local testing / manual ops. Runs a single tick and
// exits. Useful for:
//     npm run once -- --user <userId>      # send just one user's digest
//     npm run once                         # run a normal tick end-to-end
//
// Also useful from the VPS to send a catchup digest after an outage.

import path from "node:path";
import { config as loadEnv } from "dotenv";

// Load repo-root .env for local dev.
loadEnv({ path: path.resolve(__dirname, "..", "..", ".env") });

import { prisma } from "./prisma";
import { runTick, sendDigestToUser } from "./digest";

async function main() {
    const args = process.argv.slice(2);
    const userFlag = args.indexOf("--user");
    const userId = userFlag >= 0 ? args[userFlag + 1] : undefined;

    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                timezone: true,
                emailDigestEnabled: true,
                inAppDigestEnabled: true,
                subscription: {
                    select: {
                        status: true,
                        plan: { select: { tier: true } },
                    },
                },
            },
        });
        if (!user) {
            console.error(`[once] user ${userId} not found`);
            process.exit(1);
        }
        const isPro =
            user.subscription?.plan.tier === "pro" &&
            user.subscription?.status !== "canceled";
        console.log(`[once] sending digest for ${user.email} (pro=${isPro})`);
        const res = await sendDigestToUser(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                timezone: user.timezone,
                emailDigestEnabled: user.emailDigestEnabled,
                inAppDigestEnabled: user.inAppDigestEnabled,
                isPro,
            },
            new Date(),
        );
        console.log(`[once] result: ${res}`);
    } else {
        console.log("[once] running one full tick");
        await runTick();
    }

    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error("[once] fatal", err);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
});
