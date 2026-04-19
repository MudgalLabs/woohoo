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
                        <span className="ink">One click. One thread.</span>
                        <br />
                        <span className="italic-serif punch">
                            One reminder.
                        </span>
                    </h1>
                    <p className="hero-sub">
                        Woohoo captures <b>DMs and comments </b> from social,
                        threads them per person, and surfaces them the day you
                        said you&apos;d reply — so warm conversations don&apos;t
                        go cold.
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
                                className="hover:bg-secondary/10"
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
