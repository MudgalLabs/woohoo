import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
                                className="text-sm text-muted-foreground hover:text-foreground transition"
                            >
                                How it works
                            </Link>
                            <Link
                                href="/#product"
                                className="text-sm text-muted-foreground hover:text-foreground transition"
                            >
                                Product
                            </Link>
                            <Link
                                href="/#faq"
                                className="text-sm text-muted-foreground hover:text-foreground transition"
                            >
                                FAQ
                            </Link>
                        </>
                    )}
                    <Link
                        href={showAnchorLinks ? "/#pricing" : "/#pricing"}
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/extension"
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        Extension
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {showThemeToggle && (
                        <div className="hidden md:flex">
                            <ThemeToggleIcon />
                        </div>
                    )}
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
                    <MobileMenu
                        isLoggedIn={isLoggedIn}
                        showAnchorLinks={showAnchorLinks}
                    />
                </div>
            </div>
        </nav>
    );
}
