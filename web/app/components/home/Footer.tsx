import Link from "next/link";
import { Logo } from "@/app/components/brand/Logo";

export function Footer() {
    return (
        <footer className="w-full border-t border-border mt-auto bg-muted/30">
            <div className="mx-auto max-w-5xl px-4 py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Logo size="sm" />
                        <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
                            Built with ❤️️️ by Mudgal Labs
                        </p>
                    </div>

                    <div>
                        <h5 className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
                            Product
                        </h5>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/#how" className=" transition">
                                    How it works
                                </Link>
                            </li>
                            <li>
                                <Link href="/#product" className=" transition">
                                    The thread
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#dashboard"
                                    className=" transition"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/#pricing" className=" transition">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
                            Resources
                        </h5>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/extension" className=" transition">
                                    Extension
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/MudgalLabs/woohoo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className=" transition"
                                >
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <Link href="/#faq" className=" transition">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">
                            Company
                        </h5>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="https://mudgallabs.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className=" transition"
                                >
                                    Mudgal Labs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:hey@woohoo.to"
                                    className=" transition"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
                    <span>
                        © {new Date().getFullYear()} Mudgal Labs · AGPL v3
                    </span>
                    <span>built by a founder, in public</span>
                </div>
            </div>
        </footer>
    );
}
