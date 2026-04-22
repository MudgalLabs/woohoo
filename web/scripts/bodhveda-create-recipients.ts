// Backfill script — create a Bodhveda recipient for every existing user.
// Run once after the Bodhveda integration goes live in prod:
//
//   cd web && npx tsx scripts/bodhveda-create-recipients.ts
//
// Safe to re-run: createBatch upserts (see Bodhveda API — existing
// recipient IDs land in `updated`, not `failed`). Does NOT send welcome
// notifications to backfilled users (would feel like spam for existing
// accounts).

import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(__dirname, "..", "..", ".env") });

import { prisma } from "../lib/prisma";
import { getBodhvedaClient } from "../lib/bodhveda";

const BATCH_SIZE = 100;

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, name: true },
    });
    console.log(`Found ${users.length} users.`);
    if (users.length === 0) return;

    const bodhveda = getBodhvedaClient();

    let created = 0;
    let updated = 0;
    let failed = 0;
    const failures: unknown[] = [];

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        const res = await bodhveda.recipients.createBatch({
            recipients: batch.map((u) => ({
                id: u.id,
                name: u.name ?? undefined,
            })),
        });
        created += res.created.length;
        updated += res.updated.length;
        failed += res.failed.length;
        failures.push(...res.failed);
        console.log(
            `Batch ${i / BATCH_SIZE + 1}: +${res.created.length} created, ${res.updated.length} updated, ${res.failed.length} failed`,
        );
    }

    console.log(
        `\nTotals — created: ${created}, updated: ${updated}, failed: ${failed}`,
    );
    if (failures.length > 0) {
        console.error("Failures:", JSON.stringify(failures, null, 2));
        process.exit(1);
    }
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
