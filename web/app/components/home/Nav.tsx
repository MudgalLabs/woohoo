import Link from "next/link";
import { Button } from "@woohoo/ui";
import { Logo } from "@/app/components/brand/Logo";
import { ThemeToggleIcon } from "@/app/components/ThemeToggleIcon";
import { MobileMenu } from "@/app/components/home/MobileMenu";

interface NavProps {
    isLoggedIn?: boolean;
    showAnchorLinks?: boolean;
    showThemeToggle?: boolean;
}

export function Nav({
    isLoggedIn = false,
    showAnchorLinks = false,
    showThemeToggle = true,
}: NavProps) {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                <div>
                    <Logo />
                </div>

                <div className="hidden md:flex items-center gap-5">
                    {showAnchorLinks && (
                        <>
                            <Link
                                href="/#how"
                                className="text-sm text-primary underline-offset-4 hover:underline hover:brightness-90 transition"
                            >
                                How it works
                            </Link>
                            <Link
                                href="/#product"
                                className="text-sm text-primary underline-offset-4 hover:underline hover:brightness-90 transition"
                            >
                                Product
                            </Link>
                            <Link
                                href="/#pricing"
                                className="text-sm text-primary underline-offset-4 hover:underline hover:brightness-90 transition"
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/#faq"
                                className="text-sm text-primary underline-offset-4 hover:underline hover:brightness-90 transition"
                            >
                                FAQ
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {showThemeToggle && (
                        <div className="hidden md:flex">
                            <ThemeToggleIcon />
                        </div>
                    )}
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button>Dashboard</Button>
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
                    <MobileMenu
                        isLoggedIn={isLoggedIn}
                        showAnchorLinks={showAnchorLinks}
                    />
                </div>
            </div>
        </nav>
    );
}
