const envUrl = import.meta.env.VITE_API_URL as string | undefined;

if (import.meta.env.PROD && !envUrl) {
    throw new Error(
        "VITE_API_URL must be set in production builds. " +
            "Set it in .env.production at the repo root.",
    );
}

export const API_BASE_URL = envUrl ?? "http://localhost:3000";
