import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { HeroDemo } from "../HeroDemo";
import { getHeroWoohoo } from "../demo/mocks";
import { Button } from "@woohoo/ui";

export function Hero() {
    return (
        <section className="hero">
            <div className="wrap hero-grid">
                <div className="hero-copy">
                    <div className="eyebrow">
                        <span className="dot">●</span> a follow-up tool for DMs
                        and comments
                    </div>
                    <div className="h-8" />

                    <h1>
                        <span className="ink">
                            Don’t let warm conversations{" "}
                        </span>
                        <span className="italic-serif punch">go cold.</span>
                    </h1>

                    <p className="hero-sub">
                        Capture <b>messagess and comments</b>, organize them by
                        person, and{" "}
                        <span className="mark">follow up when it matters.</span>
                    </p>

                    <div className="hero-cta">
                        <Link href="/sign-up">
                            <Button className="group" variant="default">
                                Start for free
                                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                            </Button>
                        </Link>

                        <Link href="/extension">
                            <Button
                                variant="outline"
                                className="hover:bg-secondary/10 group"
                            >
                                Install the extension
                                <Zap size={16} strokeWidth={2} />
                            </Button>
                        </Link>
                    </div>

                    <div className="hero-note">
                        <span>Free forever. No credit card.</span>
                    </div>
                </div>

                <HeroDemo woohoo={getHeroWoohoo()} />
            </div>

            <div className="h-16" />
        </section>
    );
}
