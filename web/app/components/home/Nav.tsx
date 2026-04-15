import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavProps {
    isLoggedIn?: boolean;
}

export function Nav({ isLoggedIn = false }: NavProps) {
    return (
        <nav className="w-full border-b border-border">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight text-primary"
                >
                    woohoo
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/pricing"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        Pricing
                    </Link>

                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button variant="default">Dashboard →</Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/sign-in">
                                <Button variant="ghost">Sign In</Button>
                            </Link>

                            <Link href="/sign-up">
                                <Button>Start for free</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
