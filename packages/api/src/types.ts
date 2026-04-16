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
}
