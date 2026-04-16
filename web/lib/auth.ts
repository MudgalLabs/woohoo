import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { bearer } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/prisma";

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
});
