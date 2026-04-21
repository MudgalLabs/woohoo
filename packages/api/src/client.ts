import type {
    AuthSession,
    WoohooUser,
    SaveItemPayload,
    SaveItemResponse,
    CheckSavedResponse,
    StatsResponse,
    ApiError,
} from "./types";

export class WoohooApiClient {
    constructor(
        private baseUrl: string,
        private token?: string,
        private onUnauthorized?: () => void,
    ) {}

    withToken(token: string): WoohooApiClient {
        return new WoohooApiClient(this.baseUrl, token, this.onUnauthorized);
    }

    async signOut(): Promise<void> {
        await fetch(`${this.baseUrl}/api/auth/sign-out`, {
            method: "POST",
            headers: this.authHeaders(),
        }).catch(() => {
            // Best-effort — local state is cleared regardless.
        });
    }

    async getSession(): Promise<AuthSession | null> {
        if (!this.token) return null;

        const res = await fetch(`${this.baseUrl}/api/auth/get-session`, {
            headers: this.authHeaders(),
        });

        if (!res.ok) return null;

        const body = (await res.json().catch(() => null)) as {
            user: WoohooUser;
            session: { token: string };
        } | null;

        if (!body?.user || !body?.session?.token) return null;

        return {
            token: body.session.token,
            user: {
                id: body.user.id,
                name: body.user.name,
                email: body.user.email,
            },
        };
    }

    async saveItem(
        payload: SaveItemPayload,
    ): Promise<SaveItemResponse | ApiError> {
        const res = await fetch(`${this.baseUrl}/api/woohoos/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...this.authHeaders() },
            body: JSON.stringify(payload),
        });

        if (res.status === 401) {
            this.onUnauthorized?.();
            return { error: "Session expired. Please sign in again." };
        }

        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as {
                error?: string;
                code?: string;
                limit?: number;
                planName?: string;
            };
            return {
                error: body.error ?? "Save failed.",
                code: body.code,
                limit: body.limit,
                planName: body.planName,
            };
        }

        return res.json() as Promise<SaveItemResponse>;
    }

    async deleteWoohoo(
        id: string,
    ): Promise<{ ok: true } | { error: string }> {
        const res = await fetch(`${this.baseUrl}/api/woohoos/${id}`, {
            method: "DELETE",
            headers: this.authHeaders(),
        });

        if (res.status === 401) {
            this.onUnauthorized?.();
            return { error: "Session expired. Please sign in again." };
        }

        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            return { error: body.error ?? "Delete failed." };
        }

        return { ok: true };
    }

    async deleteTimelineItem(
        itemId: string,
    ): Promise<{ ok: true } | { error: string }> {
        const res = await fetch(`${this.baseUrl}/api/timeline-items/${itemId}`, {
            method: "DELETE",
            headers: this.authHeaders(),
        });

        if (res.status === 401) {
            this.onUnauthorized?.();
            return { error: "Session expired. Please sign in again." };
        }

        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as {
                error?: string;
            };
            return { error: body.error ?? "Delete failed." };
        }

        return { ok: true };
    }

    async checkSaved(params: {
        platform: string;
        peerId: string;
        externalId: string;
        authorId?: string;
        founderExternalId?: string;
        ancestorExternalIds?: string[];
    }): Promise<CheckSavedResponse> {
        const { ancestorExternalIds, authorId, founderExternalId, ...rest } = params;
        const qs = new URLSearchParams(rest);
        if (authorId) qs.append("authorId", authorId);
        if (founderExternalId) qs.append("founderExternalId", founderExternalId);
        if (ancestorExternalIds) {
            for (const id of ancestorExternalIds) {
                qs.append("ancestorExternalIds", id);
            }
        }
        const res = await fetch(`${this.baseUrl}/api/woohoos/check?${qs.toString()}`, {
            headers: this.authHeaders(),
        });

        if (res.status === 401) {
            this.onUnauthorized?.();
            return { saved: false };
        }

        if (!res.ok) return { saved: false };

        return res.json() as Promise<CheckSavedResponse>;
    }

    async getStats(): Promise<StatsResponse | null> {
        if (!this.token) return null;

        const res = await fetch(`${this.baseUrl}/api/stats`, {
            headers: this.authHeaders(),
        });

        if (res.status === 401) {
            this.onUnauthorized?.();
            return null;
        }

        if (!res.ok) return null;

        return res.json() as Promise<StatsResponse>;
    }

    private authHeaders(): Record<string, string> {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    }
}
