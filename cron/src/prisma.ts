import { PrismaPg } from "@prisma/adapter-pg";

// The Prisma client is generated into web/app/generated/prisma/ by web's
// `prisma generate`. The cron shares the schema so it reads from the same
// generated output rather than declaring its own. If we add a second consumer
// we should promote this into a packages/core workspace.
import { PrismaClient } from "../../web/app/generated/prisma/client";

// Lazy — construction reads DATABASE_URL from env. ESM imports are hoisted,
// so if we constructed at module load we'd read env before dotenv.config fires
// in the entrypoint. The Proxy lets existing `prisma.user.findMany()` call
// sites keep working without a refactor.
let _client: PrismaClient | null = null;
function getClient(): PrismaClient {
    if (!_client) {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error("DATABASE_URL is not set");
        const adapter = new PrismaPg({ connectionString: url });
        _client = new PrismaClient({ adapter });
    }
    return _client;
}

export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop, receiver) {
        return Reflect.get(getClient(), prop, receiver);
    },
});
