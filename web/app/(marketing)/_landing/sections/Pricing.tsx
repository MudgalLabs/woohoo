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
                        Start free.{" "}
                        <span className="italic-serif">Upgrade </span> when it
                        clicks.
                    </h2>
                    <p>No seats. No pipelines. Just follow-ups.</p>
                </div>

                <div className="pricing-grid">
                    <div className="price-card">
                        <div className="plan-name">Free</div>
                        <div className="amt">
                            <span className="big">$0</span>
                            <span className="per">forever</span>
                        </div>
                        <p className="price-note">
                            Everything you need to follow up on conversations.
                        </p>
                        <ul className="price-list">
                            <li>Up to 100 active conversations</li>
                            <li>1 platform</li>
                            <li>Unlimited DMs and comments</li>
                            <li>Self-host if you want to</li>
                        </ul>
                        <Link
                            href="/sign-up"
                            className="btn btn-ghost btn-lg btn-arrow"
                        >
                            Start free
                        </Link>
                    </div>

                    <div className="price-card featured">
                        <span className="badge">Early access</span>
                        <div className="plan-name">Pro</div>
                        <div className="amt">
                            <span className="big">$5</span>
                            <span className="per">
                                / month · or $50/yr (two months free)
                            </span>
                        </div>
                        <p className="price-note">
                            For when your conversations start to pile up.
                        </p>
                        <ul className="price-list">
                            <li>Everything in free</li>
                            <li>Unlimited active conversations</li>
                            <li>
                                All platforms as they ship — X, LinkedIn, and
                                more
                            </li>
                            <li>
                                Daily follow-up digest — morning &amp; evening
                            </li>
                            <li>Help shape what gets built next</li>
                        </ul>
                        <a
                            href="mailto:hey@woohoo.to?subject=Woohoo%20Pro%20early%20access"
                            className="btn btn-lg btn-arrow"
                            style={{
                                background: "var(--highlight)",
                                color: "var(--ink)",
                            }}
                        >
                            Request early access
                        </a>
                    </div>
                </div>
                <p className="pricing-foot">
                    Early pricing. Goes up as more platforms and features ship.
                </p>
            </div>
        </section>
    );
}
