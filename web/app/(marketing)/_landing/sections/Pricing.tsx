import Link from "next/link";

export function Pricing() {
    return (
        <section className="section" id="pricing">
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> pricing
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        Free while it&rsquo;s{" "}
                        <span className="italic-serif">early</span>. Cheap after
                        that.
                    </h2>
                    <p>
                        Built by a solo founder. Priced like it. No seat math,
                        no &ldquo;contact sales,&rdquo; no usage traps.
                    </p>
                </div>

                <div className="pricing-grid">
                    <div className="price-card">
                        <div className="plan-name">Free</div>
                        <div className="amt">
                            <span className="big">$0</span>
                            <span className="per">forever · one founder</span>
                        </div>
                        <p className="price-note">
                            Everything you need to stop losing warm Reddit
                            leads.
                        </p>
                        <ul className="price-list">
                            <li>Reddit DMs and comments</li>
                            <li>Up to 100 active Woohoos</li>
                            <li>Unlimited saved DMs + comments per Woohoo</li>
                            <li>Follow-up dashboard (today / overdue / cold)</li>
                            <li>Self-host if you want to (AGPL)</li>
                        </ul>
                        <Link
                            href="/sign-up"
                            className="btn btn-ghost btn-lg btn-arrow"
                        >
                            Start free
                        </Link>
                    </div>

                    <div className="price-card featured">
                        <span className="badge">coming soon</span>
                        <div className="plan-name">Pro</div>
                        <div className="amt">
                            <span className="big">$5</span>
                            <span className="per">
                                / month · or $50/yr (two months free)
                            </span>
                        </div>
                        <p className="price-note">
                            For the founder whose DMs actually flood.
                        </p>
                        <ul className="price-list">
                            <li>Unlimited active Woohoos</li>
                            <li>
                                All platforms as they ship — X, LinkedIn,
                                Instagram
                            </li>
                            <li>
                                Daily follow-up digest — morning &amp; evening,
                                your timezone
                            </li>
                            <li>Support the work, shape the roadmap</li>
                        </ul>
                        <a
                            href="mailto:hi@mudgallabs.com?subject=Woohoo%20Pro%20waitlist"
                            className="btn btn-lg btn-arrow"
                            style={{
                                background: "var(--highlight)",
                                color: "var(--ink)",
                            }}
                        >
                            Join the waitlist
                        </a>
                    </div>
                </div>
                <p className="pricing-foot">
                    Pricing isn&rsquo;t final. If Pro ships and feels too
                    expensive, yell at us.
                </p>
            </div>
        </section>
    );
}
