"use client";

import { useState } from "react";

const ITEMS: { q: string; a: string }[] = [
    {
        q: "Does Woohoo post or DM on my behalf?",
        a: "No. Woohoo only captures and organizes. You still reply on the platform yourself — because that's what keeps your voice real and your account in good standing.",
    },
    {
        q: "How is this different from a Notion template or a spreadsheet?",
        a: "Speed. You save a conversation in one click from inside Reddit — no copying, no tab switching, no forgetting the permalink. And comments + DMs from the same person auto-thread, which spreadsheets don't do.",
    },
    {
        q: "Which platforms are supported today?",
        a: "Reddit only today — DMs and comments (including nested comment chains). X, LinkedIn, and Instagram are on the roadmap.",
    },
    {
        q: "Is my data private? Can I self-host?",
        a: "Yes. The code is open source under AGPL. You can self-host with docker compose if you'd rather own your data than trust ours. Either way, we never read your DMs — you capture what you choose.",
    },
    {
        q: "Do you integrate with my CRM?",
        a: "Not yet — and maybe never. Woohoo is not trying to be a CRM. If you want this, open an issue on GitHub and tell us why.",
    },
    {
        q: "Who built this?",
        a: "One indie founder who was tired of losing warm leads in their own DMs. Built in public under Mudgal Labs. PRs and feature requests welcome.",
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
                    <h2>Questions founders actually ask.</h2>
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
                                onClick={() =>
                                    setOpen(open === i ? -1 : i)
                                }
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
