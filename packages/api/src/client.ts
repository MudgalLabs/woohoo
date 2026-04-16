import type { AuthSession, WoohooUser } from "./types";

export class WoohooApiClient {
    constructor(
        private baseUrl: string,
        private token?: string,
    ) {}

    withToken(token: string): WoohooApiClient {
        return new WoohooApiClient(this.baseUrl, token);
    }

    async signIn(
        email: string,
        password: string,
    ): Promise<{ session: AuthSession } | { error: string }> {
        const res = await fetch(`${this.baseUrl}/api/auth/sign-in/email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as {
                message?: string;
            };
            return { error: body.message ?? "Sign in failed." };
        }

        const body = (await res.json()) as {
            user: WoohooUser;
            session: { token: string };
            token?: string;
        };

        const token = body.token ?? body.session?.token;
        if (!token) return { error: "No session token in response." };

        return {
            session: {
                token,
                user: {
                    id: body.user.id,
                    name: body.user.name,
                    email: body.user.email,
                },
            },
        };
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

    private authHeaders(): Record<string, string> {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    }
}
