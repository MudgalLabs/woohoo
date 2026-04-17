import Link from "next/link";
import { Logo } from "@/app/components/brand/Logo";

export function Footer() {
    return (
        <footer className="w-full border-t border-border mt-auto">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
                <Logo size="sm" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <Link href="/pricing" className="hover:text-foreground transition">
                        Pricing
                    </Link>
                    <Link href="/extension" className="hover:text-foreground transition">
                        Extension
                    </Link>
                </div>
                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Woohoo
                </p>
            </div>
        </footer>
    );
}
