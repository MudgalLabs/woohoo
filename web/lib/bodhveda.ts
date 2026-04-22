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

// Bodhveda's entity.NewRecipient lowercases external_id on insert, but its
// Get(external_id) lookup doesn't — a case-sensitivity bug in Bodhveda's
// recipient repo that surfaces as a 500 "create recipient: resource not
// found" on any call that hits CreateIfNotExists for an existing recipient.
// Until Bodhveda normalizes at the DTO layer, we lowercase on our side so
// every Woohoo → Bodhveda call matches what Bodhveda actually stores.
export function bodhvedaRecipientId(userId: string): string {
    return userId.toLowerCase();
}

export async function createBodhvedaRecipient(user: {
    id: string;
    name?: string | null;
}) {
    return getClient().recipients.create({
        id: bodhvedaRecipientId(user.id),
        name: user.name ?? undefined,
    });
}

export async function sendWelcomeNotification(
    userId: string,
    name?: string | null,
) {
    const greeting = name ? `Welcome to Woohoo, ${name}!` : "Welcome to Woohoo!";
    return getClient().notifications.send({
        recipient_id: bodhvedaRecipientId(userId),
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
