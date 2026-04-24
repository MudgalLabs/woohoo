// Platform-neutral message shape consumed by SaveButton + SaveModal. Each
// platform adapter builds one of these from its own DOM before mounting the
// button.
//
// - `sourceUrl` is only populated for comments on platforms that link to the
//   original post/thread; DMs omit it.
// - `ancestorExternalIds` is Reddit comment-specific (nearest-first thingids
//   used for server-side threading). LinkedIn and DM flows leave it unset.
export type Message = {
    id: string;
    username: string;
    timestamp: string;
    contentText: string;
    contentHTML: string;
    sourceUrl?: string;
    ancestorExternalIds?: string[];
};
