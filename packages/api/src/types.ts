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
