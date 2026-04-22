export interface WoohooUser {
    id: string;
    name: string;
    email: string;
}

export interface AuthSession {
    user: WoohooUser;
    token: string;
}

/** A Reddit DM parsed from the page DOM by the extension content script. */
export interface RedditMessage {
    id: string;
    username: string;
    timestamp: string;
    contentText: string;
    contentHTML: string;
}

export interface SaveItemPayload {
    platform: string;
    peerId: string;
    chatUrl?: string;
    followUpAt?: string;
    // Reddit-only: nearest-first ancestor comment ids. The backend only
    // consults these when the comment is founder-authored — peer-authored
    // comments always go to their own author's Woohoo.
    ancestorExternalIds?: string[];
    // Logged-in founder's platform handle (e.g. Reddit username). Lets the
    // backend decide whether this save is "me replying inside a lead's
    // thread" (merge into that lead's Woohoo) or anything else (route to
    // the comment author's own Woohoo).
    founderExternalId?: string;
    item: {
        type: "dm" | "comment";
        externalId: string;
        contentText: string;
        contentHtml?: string;
        sourceUrl?: string;
        authorId: string;
        authorName?: string;
        interactionAt: string;
    };
}

export interface SaveItemResponse {
    woohoo: {
        id: string;
        platform: string;
        peerId: string;
        followUpAt: string | null;
    };
    timelineItem: {
        id: string;
        externalId: string | null;
    };
}

export interface ApiError {
    error: string;
    // "plan_limit_reached" when the save/unarchive was blocked by the user's
    // active-Woohoo cap. Clients can special-case to nudge toward upgrade.
    code?: string;
    limit?: number;
    planName?: string;
}

export interface StatsResponse {
    totalWoohoos: number;
    followUpToday: number;
    overdue: number;
}

export interface CheckSavedResponse {
    saved: boolean;
    woohooId?: string;
    timelineItemId?: string;
    // Set only when routing would actually attach the new item to an
    // ancestor's Woohoo (i.e. founder replying inside a saved peer thread).
    // The UI uses it to preview "Saving to u/X's Woohoo".
    ancestorMatch?: {
        woohooId: string;
        peerId: string;
        peerName?: string | null;
    };
}
