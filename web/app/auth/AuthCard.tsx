"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button, Input, Label } from "@woohoo/ui";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { GoogleIcon } from "@/app/components/brand/BrandIcons";

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
            footer={<span className="text-muted-foreground"></span>}
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
                                    minLength={
                                        mode === "signup" ? 8 : undefined
                                    }
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
