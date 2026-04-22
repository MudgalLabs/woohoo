import { Bodhveda } from "bodhveda";

import { targets } from "@/lib/bodhveda-targets";

let client: Bodhveda | null = null;

function getClient(): Bodhveda {
    if (!client) {
        const apiKey = process.env.BODHVEDA_API_KEY;
        if (!apiKey) {
            throw new Error("BODHVEDA_API_KEY is not set");
        }
        const apiURL = process.env.BODHVEDA_API_URL || undefined;
        client = new Bodhveda(apiKey, { apiURL });
    }
    return client;
}

export async function createBodhvedaRecipient(user: {
    id: string;
    name?: string | null;
}) {
    return getClient().recipients.create({
        id: user.id,
        name: user.name ?? undefined,
    });
}

export async function sendWelcomeNotification(
    userId: string,
    name?: string | null,
) {
    const greeting = name ? `Welcome to Woohoo, ${name}!` : "Welcome to Woohoo!";
    return getClient().notifications.send({
        recipient_id: userId,
        target: targets.welcome,
        payload: {
            title: greeting,
            body: "Install the extension and save your first DM or comment in one click. Your follow-ups show up here and on your dashboard.",
        },
    });
}

export function getBodhvedaClient() {
    return getClient();
}
