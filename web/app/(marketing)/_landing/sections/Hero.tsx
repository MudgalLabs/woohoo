import Link from "next/link";
import { Zap } from "lucide-react";
import { Flourish } from "../RedditGlyph";
import { HeroDemo } from "../HeroDemo";

export function Hero() {
    return (
        <section className="hero">
            <div className="wrap hero-grid">
                <div className="hero-copy">
                    <Flourish />
                    <div className="eyebrow">
                        <span className="dot">●</span> a social CRM for indie
                        founders
                    </div>
                    <div style={{ height: 16 }} />
                    <h1>
                        <span className="ink">You saw it.</span>
                        <br />
                        <span className="italic-serif muted">
                            You meant to act on it.
                        </span>
                        <br />
                        <span className="italic-serif punch">
                            It&apos;s gone.
                        </span>
                    </h1>
                    <p className="hero-sub">
                        Reddit DMs and comments that matter —{" "}
                        <b>saved in one click</b>, threaded per person, surfaced
                        when you said you&apos;d follow up. Built for founders
                        doing their own marketing.
                    </p>
                    <div className="hero-cta">
                        <Link
                            href="/sign-up"
                            className="btn btn-primary btn-lg btn-arrow"
                        >
                            Start free
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
                        <div className="avatars">
                            <span style={{ background: "#E5463B" }} />
                            <span style={{ background: "#F6D45B" }} />
                            <span style={{ background: "#2F7A4B" }} />
                            <span style={{ background: "#1A1512" }} />
                        </div>
                        <span>
                            Open source · AGPL · built by a founder, in public
                        </span>
                    </div>
                </div>
                <HeroDemo />
            </div>
        </section>
    );
}
