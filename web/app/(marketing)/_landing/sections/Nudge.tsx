import { Bell, CheckCheck, Clock, Layers, Sliders } from "lucide-react";
import { Logo } from "@/app/components/brand/Logo";

export function Nudge() {
    return (
        <section className="section landing-nudge" id="product">
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> the tap on the shoulder
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        Every morning, Woohoo tells you{" "}
                        <span className="mark">who to reply to.</span>
                    </h2>
                    <p>
                        One nudge. Not forty. You open the app already knowing
                        what needs you today — in-app for everyone, in your
                        inbox on Pro.
                    </p>
                </div>

                <div className="nudge-grid">
                    <div className="nudge-card">
                        <span className="nudge-label nudge-label--free">
                            Free · in-app
                        </span>

                        <div className="bell-chrome">
                            <div className="bell-chrome__header">
                                <Logo
                                    variant="full"
                                    size="sm"
                                    href={null}
                                />
                                <span className="bell-chrome__bell">
                                    <Bell size={16} strokeWidth={2} />
                                    <span className="bell-chrome__badge">
                                        1
                                    </span>
                                </span>
                            </div>

                            <div className="bell-popover">
                                <div className="bell-popover__head">
                                    <span className="bell-popover__title">
                                        Notifications
                                    </span>
                                    <span className="bell-popover__action">
                                        <CheckCheck
                                            size={12}
                                            strokeWidth={2.25}
                                        />
                                        Mark all read
                                    </span>
                                </div>
                                <ul className="bell-popover__list">
                                    <li className="bell-item bell-item--unread">
                                        <span className="bell-item__dot" />
                                        <div className="bell-item__body">
                                            <p className="bell-item__title">
                                                Today&rsquo;s Woohoo digest
                                            </p>
                                            <p className="bell-item__sub">
                                                You have 2 overdue and 3
                                                follow-ups today.
                                            </p>
                                            <p className="bell-item__time">
                                                just now
                                            </p>
                                        </div>
                                    </li>
                                    <li className="bell-item">
                                        <div className="bell-item__body">
                                            <p className="bell-item__title">
                                                Today&rsquo;s Woohoo digest
                                            </p>
                                            <p className="bell-item__sub">
                                                You have 1 overdue and 2
                                                follow-ups today.
                                            </p>
                                            <p className="bell-item__time">
                                                1d ago
                                            </p>
                                        </div>
                                    </li>
                                    <li className="bell-item">
                                        <div className="bell-item__body">
                                            <p className="bell-item__title">
                                                Welcome to Woohoo
                                            </p>
                                            <p className="bell-item__sub">
                                                Capture anything worth
                                                following up on.
                                            </p>
                                            <p className="bell-item__time">
                                                5d ago
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="nudge-card">
                        <span className="nudge-label nudge-label--pro">
                            Pro · email
                        </span>

                        <div className="email-chrome">
                            <div className="email-chrome__row">
                                <span className="email-chrome__sender">
                                    Woohoo
                                </span>
                                <span className="email-chrome__subject">
                                    <b>2 overdue, 3 today</b>
                                    <span className="email-chrome__preview">
                                        {" "}
                                        — Knock them out while it&rsquo;s
                                        fresh.
                                    </span>
                                </span>
                                <span className="email-chrome__time">
                                    8:02 AM
                                </span>
                            </div>

                            <div className="email-body">
                                <div className="email-body__logo">
                                    <Logo
                                        variant="full"
                                        size="md"
                                        href={null}
                                    />
                                </div>
                                <p className="email-body__greet">
                                    Hey Shikhar,
                                </p>
                                <p className="email-body__lede">
                                    2 overdue, 3 today. Knock them out while
                                    it&rsquo;s fresh.
                                </p>

                                <h4 className="email-body__heading">
                                    Overdue (2)
                                </h4>
                                <p className="email-item">
                                    <span className="email-item__peer">
                                        u/indie_marketer
                                    </span>
                                    <span className="email-item__meta">
                                        {" "}
                                        · Reddit · 2 days overdue
                                    </span>
                                </p>
                                <p className="email-item">
                                    <span className="email-item__peer">
                                        u/solo_founder
                                    </span>
                                    <span className="email-item__meta">
                                        {" "}
                                        · Reddit · 1 day overdue
                                    </span>
                                </p>

                                <h4 className="email-body__heading">
                                    Today (3)
                                </h4>
                                <p className="email-item">
                                    <span className="email-item__peer">
                                        u/dev_in_trenches
                                    </span>
                                    <span className="email-item__meta">
                                        {" "}
                                        · Reddit
                                    </span>
                                </p>
                                <p className="email-item">
                                    <span className="email-item__peer">
                                        u/wannabe_founder
                                    </span>
                                    <span className="email-item__meta">
                                        {" "}
                                        · Reddit
                                    </span>
                                </p>
                                <p className="email-item">
                                    <span className="email-item__peer">
                                        u/agency_owner
                                    </span>
                                    <span className="email-item__meta">
                                        {" "}
                                        · Reddit
                                    </span>
                                </p>

                                <div className="email-body__cta">
                                    Open dashboard
                                </div>
                                <p className="email-body__footer">
                                    Once a day, around 8am in your timezone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="nudge-proof-row">
                    <div className="nudge-proof">
                        <Clock
                            className="nudge-proof__icon"
                            size={18}
                            strokeWidth={2}
                        />
                        <div>
                            <p className="nudge-proof__title">
                                8am, your time
                            </p>
                            <p className="nudge-proof__body">
                                Delivered in your local timezone. Never twice
                                in one day.
                            </p>
                        </div>
                    </div>
                    <div className="nudge-proof">
                        <Layers
                            className="nudge-proof__icon"
                            size={18}
                            strokeWidth={2}
                        />
                        <div>
                            <p className="nudge-proof__title">
                                One nudge, not forty
                            </p>
                            <p className="nudge-proof__body">
                                Your whole follow-up queue, collapsed into one
                                signal.
                            </p>
                        </div>
                    </div>
                    <div className="nudge-proof">
                        <Sliders
                            className="nudge-proof__icon"
                            size={18}
                            strokeWidth={2}
                        />
                        <div>
                            <p className="nudge-proof__title">On your terms</p>
                            <p className="nudge-proof__body">
                                In-app, email, or both. Toggle in Settings
                                anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
