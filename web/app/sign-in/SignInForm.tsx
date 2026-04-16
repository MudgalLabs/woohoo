"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { Field } from "@/app/components/auth/Field";

export default function SignInForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSignIn(e: React.SubmitEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await authClient.signIn.email({ email, password });

        setLoading(false);

        if (res.error) {
            setError(res.error.message ?? "Something went wrong.");
            return;
        }

        router.push("/dashboard");
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to pick up where you left off."
            footer={
                <span className="flex items-center gap-x-1">
                    <p>New here?</p>

                    <Link
                        href="/sign-up"
                        className="font-medium text-primary hover:underline"
                    >
                        Create an account
                    </Link>
                </span>
            }
        >
            <form onSubmit={handleSignIn} className="space-y-4">
                <Field
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    required
                />
                <Field
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                >
                    {loading ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </AuthLayout>
    );
}
