"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { Field } from "@/app/components/auth/Field";

export default function SignUpForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await authClient.signUp.email({ name, email, password });

        setLoading(false);

        if (res.error) {
            setError(res.error.message ?? "Something went wrong.");
            return;
        }

        router.push("/dashboard");
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start saving the moments worth keeping."
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSignUp} className="space-y-4">
                <Field
                    label="Name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoFocus
                    required
                />
                <Field
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                />
                <Field
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                />

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                >
                    {loading ? "Creating account…" : "Create account"}
                </Button>
            </form>
        </AuthLayout>
    );
}
