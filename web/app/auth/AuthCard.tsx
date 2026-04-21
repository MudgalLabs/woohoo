"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button, Input, Label } from "@woohoo/ui";
import { AuthLayout } from "@/app/components/auth/AuthLayout";

interface AuthCardProps {
    from?: string;
    extId?: string;
    enableEmailPassword?: boolean;
}

type Mode = "signin" | "signup";

export function AuthCard({ from, extId, enableEmailPassword }: AuthCardProps) {
    const router = useRouter();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    const [mode, setMode] = useState<Mode>("signin");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const redirectAfterEmailAuth =
        from === "ext" && extId
            ? `/auth/ext-return?extId=${encodeURIComponent(extId)}`
            : "/dashboard";

    async function handleGoogle() {
        setGoogleError(null);
        setGoogleLoading(true);

        const res = await authClient.signIn.social({
            provider: "google",
            callbackURL: redirectAfterEmailAuth,
        });

        if (res.error) {
            setGoogleLoading(false);
            setGoogleError(res.error.message ?? "Something went wrong.");
        }
    }

    async function handleEmailSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEmailError(null);
        setEmailLoading(true);

        const res =
            mode === "signin"
                ? await authClient.signIn.email({ email, password })
                : await authClient.signUp.email({ name, email, password });

        setEmailLoading(false);

        if (res.error) {
            setEmailError(res.error.message ?? "Something went wrong.");
            return;
        }

        router.push(redirectAfterEmailAuth);
    }

    return (
        <AuthLayout
            title="Welcome to Woohoo"
            subtitle="Sign in to start saving the moments worth keeping."
            footer={
                <span className="text-muted-foreground">
                    New here? Continue with Google — we&apos;ll create your
                    account.
                </span>
            }
        >
            <div className="space-y-4">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={googleLoading}
                    onClick={handleGoogle}
                >
                    <GoogleIcon className="size-5" />
                    {googleLoading ? "Redirecting…" : "Continue with Google"}
                </Button>

                {googleError && (
                    <p className="text-sm text-destructive">{googleError}</p>
                )}

                {enableEmailPassword && (
                    <>
                        <div className="relative py-2">
                            <div
                                aria-hidden
                                className="absolute inset-0 flex items-center"
                            >
                                <span className="w-full border-t border-border" />
                            </div>
                            <span className="relative z-10 flex justify-center">
                                <span className="bg-card px-2 text-xs uppercase tracking-widest text-muted-foreground">
                                    Or
                                </span>
                            </span>
                        </div>

                        <form
                            onSubmit={handleEmailSubmit}
                            className="space-y-3"
                        >
                            {mode === "signup" && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={
                                        mode === "signin"
                                            ? "current-password"
                                            : "new-password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    minLength={mode === "signup" ? 8 : undefined}
                                    required
                                />
                            </div>

                            {emailError && (
                                <p className="text-sm text-destructive">
                                    {emailError}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={emailLoading}
                            >
                                {emailLoading
                                    ? mode === "signin"
                                        ? "Signing in…"
                                        : "Creating account…"
                                    : mode === "signin"
                                      ? "Sign in"
                                      : "Create account"}
                            </Button>

                            <button
                                type="button"
                                onClick={() =>
                                    setMode(
                                        mode === "signin" ? "signup" : "signin",
                                    )
                                }
                                className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
                            >
                                {mode === "signin"
                                    ? "Need an account? Sign up"
                                    : "Already have an account? Sign in"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </AuthLayout>
    );
}

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23Z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.85Z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38Z"
            />
        </svg>
    );
}
