import type { Target } from "bodhveda";

// Bodhveda target catalog. `channel` is the semantic category (not a
// delivery medium — Bodhveda doesn't model medium today, everything is
// in-app). `topic` narrows within a channel; `event` names the trigger.
export const targets = {
    welcome: {
        channel: "marketing",
        topic: "none",
        event: "welcome",
    },
    digestSent: {
        channel: "digest",
        topic: "none",
        event: "sent",
    },
} as const satisfies Record<string, Target>;
