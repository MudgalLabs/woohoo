"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import type { TimelineItem, Woohoo } from "@/app/generated/prisma/client";
import { DemoWoohooCard } from "./demo/DemoWoohooCard";
import { PlatformIcon } from "@/components/PlatformIcon";

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

interface HeroDemoProps {
    woohoo: Woohoo & { timeline: TimelineItem[] };
}

export function HeroDemo({ woohoo }: HeroDemoProps) {
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
                    <PlatformIcon platform="reddit" />
                    <span className="sub">u/indie_marketer</span>
                    <span>· 2h ago · DM</span>
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
                    <svg
                        className="save-hint-arrow"
                        width="48"
                        height="60"
                        viewBox="0 0 114 144"
                        fill="none"
                        aria-hidden
                    >
                        <path
                            d="M111.3 141.183C98.6856 139.08 62.6293 133.497 61.7 113.983C61.3133 105.863 65.3815 94.4969 72.1 89.2715C86.5279 78.05 110.476 93.0215 90.5889 106.694C79.4361 114.361 63.501 108.142 52.2778 103.583C35.7341 96.8617 27.8565 83.7242 20.9889 68.1159C17.5012 60.1893 9.72805 19.9966 12.1 21.1826"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M7.30005 6.78264C9.69761 8.08797 27.7313 18.6736 25.7 17.0937C23.0414 15.0259 20.0849 13.1675 17.7 10.7826C14.8785 7.96098 11.3893 5.89418 8.90002 2.78258C6.71568 0.0521464 2.5 17.9588 2.5 21.1827"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="hand">Save this Reddit DM</span>
                </div>
            </div>

            <div className="thread-preview" aria-hidden={!saved}>
                <DemoWoohooCard
                    woohoo={woohoo}
                    counts={{ dm: 1, comment: 0 }}
                />
            </div>

            <div className="demo-caption">
                Works on Reddit today. LinkedIn, X, and more coming soon.
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
