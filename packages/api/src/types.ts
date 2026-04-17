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
    // Reddit-only: nearest-first ancestor comment ids. When the backend
    // finds one already saved for this user, the new item is threaded
    // into that ancestor's Woohoo instead of the peerId-based one.
    ancestorExternalIds?: string[];
    // If true, the backend ignores ancestorExternalIds and always
    // upserts the Woohoo by peerId (the user explicitly asked for a
    // fresh Woohoo for this comment's author).
    forceNewWoohoo?: boolean;
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

export interface CheckSavedResponse {
    saved: boolean;
    woohooId?: string;
    timelineItemId?: string;
    // Set when the item itself isn't saved but one of its ancestors is.
    // The UI uses this to offer an override ("save as new Woohoo for
    // u/{author}" vs. thread into the ancestor's Woohoo).
    ancestorMatch?: {
        woohooId: string;
        peerId: string;
        peerName?: string | null;
    };
}
