"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { RedditGlyph } from "./RedditGlyph";

const PARTICLES = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = 60 + (i % 3) * 20;
    const colors = ["var(--accent)", "var(--highlight)", "var(--good)"];
    return {
        dx: `${Math.cos(a) * r}px`,
        dy: `${Math.sin(a) * r}px`,
        r: `${(a * 180) / Math.PI}deg`,
        bg: colors[i % 3],
        delay: `${(i % 5) * 20}ms`,
    };
});

export function HeroDemo() {
    const [saved, setSaved] = useState(false);

    function handleSave() {
        if (saved) return;
        setSaved(true);
        window.setTimeout(() => setSaved(false), 3800);
    }

    return (
        <div className={`demo-stage ${saved ? "is-saved" : ""}`}>
            <div className="reddit-panel">
                <div className="reddit-top">
                    <RedditGlyph />
                    <span>u/</span>
                    <span className="sub">indie_marketer</span>
                    <span>· 2h · direct message</span>
                </div>
                <div className="reddit-msg">
                    Hey — saw your comment in r/SaaS.{" "}
                    <span className="highlight">
                        I&apos;ll try Woohoo this weekend and send feedback
                    </span>
                    , my team&apos;s drowning in Reddit leads rn. Also — do you
                    support LinkedIn?
                </div>

                <div
                    className={`save-slot ${saved ? "is-saved" : ""}`}
                    aria-hidden={saved}
                >
                    {!saved && <span className="save-ping" aria-hidden />}
                    <button
                        type="button"
                        className={`save-floater ${saved ? "saved" : ""}`}
                        onClick={handleSave}
                        aria-label="Save to Woohoo"
                    >
                        <Bookmark
                            size={18}
                            strokeWidth={2.5}
                            fill={saved ? "currentColor" : "transparent"}
                        />
                    </button>
                </div>

                <div
                    className={`save-hint ${saved ? "is-gone" : ""}`}
                    aria-hidden={saved}
                >
                    <span className="hand">try it</span>
                    <svg
                        width="30"
                        height="22"
                        viewBox="0 0 30 22"
                        fill="none"
                        aria-hidden
                    >
                        <path
                            d="M2 14 C 10 4, 20 4, 26 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M22 8 L 26 12 L 22 16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                </div>
            </div>

            <div className="thread-preview" aria-hidden={!saved}>
                <div className="avatar">i</div>
                <div className="meta">
                    <div className="name">u/indie_marketer</div>
                    <div className="caption">
                        reddit · new Woohoo · opened just now
                    </div>
                </div>
                <div className="pill">Remind Sun</div>
            </div>

            <div className="burst">
                {PARTICLES.map((p, i) => (
                    <i
                        key={i}
                        style={
                            {
                                "--dx": p.dx,
                                "--dy": p.dy,
                                "--r": p.r,
                                background: p.bg,
                                left: "50%",
                                top: "50%",
                                animationDelay: p.delay,
                            } as React.CSSProperties
                        }
                    />
                ))}
            </div>
        </div>
    );
}
