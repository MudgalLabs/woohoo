import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@woohoo/ui";
import { Logo } from "@/app/components/brand/Logo";

interface NavProps {
    isLoggedIn?: boolean;
}

export function Nav({ isLoggedIn = false }: NavProps) {
    return (
        <nav className="w-full border-b border-border">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                <div>
                    <Logo />
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/pricing"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button className="group" variant="default">
                                Dashboard
                                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                            </Button>
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
