import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { HeroDemo } from "../HeroDemo";

export function Hero() {
    return (
        <section className="hero">
            <div className="wrap hero-grid">
                <div className="hero-copy">
                    <div className="eyebrow">
                        <span className="dot">●</span> a follow-up tool for
                        social DMs and comments
                    </div>
                    <div style={{ height: 16 }} />
                    <h1>
                        <span className="ink">One click. One thread.</span>
                        <br />
                        <span className="italic-serif punch">
                            One reminder.
                        </span>
                    </h1>
                    <p className="hero-sub">
                        Woohoo captures <b>DMs and comments</b> from social,
                        threads them per person, and surfaces them the day you
                        said you&apos;d reply — so warm conversations
                        don&apos;t go cold.
                    </p>
                    <div className="hero-cta">
                        <Link
                            href="/sign-up"
                            className="btn btn-primary btn-lg"
                        >
                            Start free
                            <ArrowRight
                                size={16}
                                strokeWidth={2.5}
                                className="btn-icon"
                            />
                        </Link>
                        <Link
                            href="/extension"
                            className="btn btn-ghost btn-lg"
                        >
                            <Zap size={14} strokeWidth={2} /> Install the
                            extension
                        </Link>
                    </div>
                    <div className="hero-note">
                        <span>No credit card required · Open source</span>
                    </div>
                </div>
                <HeroDemo />
            </div>
        </section>
    );
}
