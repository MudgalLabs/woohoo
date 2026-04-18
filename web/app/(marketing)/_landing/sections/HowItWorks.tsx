import { Bell, Bookmark } from "lucide-react";

export function HowItWorks() {
    return (
        <section className="section" id="how">
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> how it works
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        Three clicks from{" "}
                        <span className="italic-serif">
                            &ldquo;oh interesting&rdquo;
                        </span>{" "}
                        to <span className="mark">follow up Sunday.</span>
                    </h2>
                    <p>
                        No tab switching. No copy-paste. No &ldquo;I&rsquo;ll
                        log it later.&rdquo; The extension lives where your
                        conversations already happen.
                    </p>
                </div>

                <div className="steps">
                    <div className="step">
                        <div className="num">1</div>
                        <h3>Capture</h3>
                        <p>
                            Hover any Reddit DM or comment. Click Save. The
                            extension grabs the message, the author, the
                            permalink — everything.
                        </p>
                        <div className="illo">
                            <div className="mini-msg">
                                <div>
                                    <span className="who">u/ship_it_pls</span>{" "}
                                    · r/SaaS · 3h
                                </div>
                                <div style={{ marginTop: 6 }}>
                                    ...would kill for a tool like this. does it
                                    do X?
                                </div>
                                <span className="bm" aria-hidden>
                                    <Bookmark size={14} strokeWidth={2.5} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="step">
                        <div className="num">2</div>
                        <h3>Organize</h3>
                        <p>
                            All interactions with one person on one platform
                            roll into a single{" "}
                            <span className="italic-serif">Woohoo</span> — DMs
                            and comments threaded together, even nested
                            replies.
                        </p>
                        <div className="illo">
                            <div className="mini-thread">
                                <div className="bubble them">
                                    does it do X?
                                    <span className="caption">
                                        comment · r/SaaS
                                    </span>
                                </div>
                                <div className="bubble you">
                                    yes — shipping this weekend
                                    <span className="caption">
                                        you, in-thread
                                    </span>
                                </div>
                                <div className="bubble them">
                                    perfect. DMing you
                                    <span className="caption">
                                        DM · 2h later
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="step">
                        <div className="num">3</div>
                        <h3>Follow up</h3>
                        <p>
                            Set a date. Your dashboard surfaces{" "}
                            <b>Follow up today</b>, <b>Overdue</b>, and{" "}
                            <b>Maybe getting cold</b> — so no warm lead goes
                            stale.
                        </p>
                        <div className="illo">
                            <div className="mini-date">
                                <Bell size={14} strokeWidth={2} />
                                <span>
                                    remind me <b>Sun, Apr 21</b> — &ldquo;check
                                    if they tried it&rdquo;
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
