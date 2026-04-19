"use client";

import { useState } from "react";

const ITEMS: { q: string; a: string }[] = [
    {
        q: "Does Woohoo post or DM on my behalf?",
        a: "No. Woohoo only captures and organizes. You reply on the platform yourself.",
    },
    {
        q: "How is this different from a Notion template or a spreadsheet?",
        a: "Speed. Save a conversation in one click — no copying, no tab switching. Messages from the same person are grouped automatically.",
    },
    {
        q: "Will this get my account flagged or banned?",
        a: "No. Woohoo doesn’t send messages or automate anything. You reply manually, like you normally would.",
    },
    {
        q: "What kind of conversations is this useful for?",
        a: "Leads, feature requests, partnerships, feedback — anything worth following up on.",
    },
    {
        q: "Which platforms are supported today?",
        a: "Reddit today (DMs and comments). X, LinkedIn, and more are coming.",
    },
    {
        q: "Is my data private? Can I self-host?",
        a: "Yes. Woohoo is open source (AGPL) and can be self-hosted. We never access your DMs — you choose what to save.",
    },
    {
        q: "Do you integrate with my CRM?",
        a: "Not yet — and maybe never. Woohoo is not a CRM.",
    },
    {
        q: "Who's behind Woohoo?",
        a: "Built in public by Mudgal Labs. Open source under AGPL.",
    },
];

export function Faq() {
    const [open, setOpen] = useState(0);
    return (
        <section className="section" id="faq">
            <div className="wrap">
                <div
                    className="section-head"
                    style={{
                        textAlign: "center",
                        margin: "0 auto 48px",
                    }}
                >
                    <div
                        className="eyebrow"
                        style={{
                            justifyContent: "center",
                            display: "flex",
                        }}
                    >
                        <span className="dot">●</span>&nbsp;FAQ
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>Before you try Woohoo.</h2>
                </div>
                <div className="faq">
                    {ITEMS.map((it, i) => (
                        <div
                            key={i}
                            className={`faq-item${open === i ? " open" : ""}`}
                        >
                            <button
                                type="button"
                                className="faq-q"
                                onClick={() => setOpen(open === i ? -1 : i)}
                                aria-expanded={open === i}
                            >
                                <span>{it.q}</span>
                                <span className="sign">+</span>
                            </button>
                            <div className="faq-a">
                                <p>{it.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
