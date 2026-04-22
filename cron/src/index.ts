import path from "node:path";
import { config as loadEnv } from "dotenv";

// Load repo-root .env for local dev. In Docker, env vars come from compose
// and dotenv.config silently no-ops when the file is missing.
loadEnv({ path: path.resolve(__dirname, "..", "..", ".env") });

import cron from "node-cron";

import { prisma } from "./prisma";
import { runTick } from "./digest";

async function main() {
    console.log("[cron] starting up");
    console.log(`[cron] CRON_ENABLED=${process.env.CRON_ENABLED ?? "true"}`);
    console.log(`[cron] schedule: every 30 minutes (0,30 * * * *)`);

    // Catchup tick on boot — picks up users whose local 8am passed while
    // cron was down (up to 12 hours late, enforced by findEligibleUsers).
    console.log("[cron] running catchup tick");
    try {
        await runTick();
    } catch (err) {
        console.error("[cron] catchup tick error", err);
    }

    // Every 30 minutes at :00 and :30. Sends within the next ~30min of each
    // user's local 8am — worst case ~29min late.
    cron.schedule("0,30 * * * *", async () => {
        console.log("[cron] tick");
        try {
            await runTick();
        } catch (err) {
            console.error("[cron] tick error", err);
        }
    });

    const shutdown = async (signal: string) => {
        console.log(`[cron] ${signal} received, shutting down`);
        try {
            await prisma.$disconnect();
        } catch {
            // ignore
        }
        process.exit(0);
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
    console.error("[cron] fatal startup error", err);
    process.exit(1);
});
