"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/app/components/brand/Logo";

interface MobileMenuProps {
    isLoggedIn: boolean;
    showAnchorLinks: boolean;
}

export function MobileMenu({ showAnchorLinks }: MobileMenuProps) {
    const [open, setOpen] = useState(false);

    const links: { href: string; label: string }[] = [];
    if (showAnchorLinks) {
        links.push(
            { href: "/#how", label: "How it works" },
            { href: "/#product", label: "Product" },
            { href: "/#pricing", label: "Pricing" },
            { href: "/#faq", label: "FAQ" },
        );
    }
    links.push({
        href: "/extension",
        label: "Install the extension",
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Open menu"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted transition md:hidden"
                >
                    <Menu size={20} strokeWidth={2} />
                </button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="marketing-scope w-80 flex flex-col gap-8 bg-background"
            >
                <SheetHeader className="text-left">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <Logo size="sm" />
                </SheetHeader>

                <nav className="flex flex-col gap-1">
                    {links.map((l) => (
                        <SheetClose asChild key={l.href}>
                            <Link
                                href={l.href}
                                className="rounded-md px-3 py-3 text-base text-foreground hover:bg-muted transition"
                            >
                                {l.label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
