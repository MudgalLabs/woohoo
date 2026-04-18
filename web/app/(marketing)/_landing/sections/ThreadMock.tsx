import { Clock } from "lucide-react";

/*
 * Visuals mirror web/app/(app)/my-woohoos/[id]/{ChatBubble,CommentCard}.tsx.
 * Reimplemented inline (no DeleteTimelineItemButton) so the landing has no
 * data-layer coupling. Keep styling in sync with the live components on
 * future UI changes.
 */
export function ThreadMock() {
    return (
        <section
            className="section"
            id="product"
            style={{
                background: "var(--bg-2)",
                borderTop: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
            }}
        >
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> the Woohoo thread
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        Every person,{" "}
                        <span className="italic-serif">one</span> timeline.
                    </h2>
                    <p>
                        DMs and comment replies, in order, across every time
                        you&rsquo;ve talked. No more &ldquo;wait, where did they
                        say that?&rdquo;
                    </p>
                </div>

                <div className="thread-mock">
                    <div className="phone-card">
                        <div className="ph-top">
                            <div className="av">i</div>
                            <div>
                                <div className="handle">u/indie_marketer</div>
                                <div className="plat">
                                    <i /> reddit · 6 interactions
                                </div>
                            </div>
                            <div className="followup">
                                <Clock size={14} strokeWidth={2} />
                                Sun, Apr 21
                            </div>
                        </div>
                        <div className="ph-body">
                            <div className="ph-date">Apr 14 · discovered</div>
                            <div className="dmsg comment">
                                replied to your comment in r/SaaS — &ldquo;this
                                is exactly the thing I&rsquo;ve been looking
                                for, does it handle LinkedIn?&rdquo;
                                <span className="caption">
                                    r/SaaS · post &ldquo;How do you track
                                    DMs?&rdquo;
                                </span>
                            </div>
                            <div className="dmsg you">
                                not yet — Reddit-only for now, LinkedIn&rsquo;s
                                on the roadmap. want me to ping you when it
                                ships?
                                <span className="caption">
                                    you · in-thread · Apr 14
                                </span>
                            </div>

                            <div className="ph-date">Apr 16 · DM</div>
                            <div className="dmsg them">
                                hey — yeah please ping me. I&rsquo;ll try
                                Woohoo this weekend btw, my team is drowning in
                                Reddit leads rn
                                <span className="caption">
                                    DM · Apr 16, 2:14 PM
                                </span>
                            </div>
                            <div className="dmsg you">
                                amazing. here&rsquo;s a link w/ a longer free
                                trial for you → woohoo.to/friend
                                <span className="caption">
                                    you · Apr 16, 2:18 PM
                                </span>
                            </div>
                            <div className="dmsg them">
                                🙏 will report back Sun
                                <span className="caption">
                                    DM · Apr 16, 2:20 PM
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="side-notes">
                        <div className="side-note">
                            <span className="kicker">
                                ◆ correctly threaded
                            </span>
                            <h4>Comments and DMs, merged.</h4>
                            <p>
                                Even when you reply inside their comment chain
                                on a post you don&rsquo;t own, Woohoo stitches
                                it into the right person&rsquo;s thread.
                            </p>
                        </div>
                        <div className="side-note">
                            <span className="kicker">◆ context preserved</span>
                            <h4>Every save links back.</h4>
                            <p>
                                One click and you&rsquo;re back on the original
                                Reddit post or DM. Your memory is in the place
                                you&rsquo;d look anyway.
                            </p>
                        </div>
                        <div className="side-note">
                            <span className="kicker">
                                ◆ never cold-DM blind
                            </span>
                            <h4>Follow up like you know them.</h4>
                            <p>
                                Because you do. Every past exchange, quotable,
                                one scroll away.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
