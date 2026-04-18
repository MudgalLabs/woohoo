function DashItem({
    i,
    name,
    why,
    tag,
    tagLabel,
}: {
    i: string;
    name: string;
    why: string;
    tag: "hot" | "warm" | "old";
    tagLabel: string;
}) {
    return (
        <div className="dash-item">
            <div className="av">{i}</div>
            <div>
                <div className="who">{name}</div>
                <div className="why">{why}</div>
            </div>
            <div className={`tag ${tag}`}>{tagLabel}</div>
        </div>
    );
}

export function Dashboard() {
    return (
        <section className="section" id="dashboard">
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> the dashboard
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        Open Monday.{" "}
                        <span className="italic-serif muted">
                            Know exactly
                        </span>{" "}
                        <span className="mark">who to reply to.</span>
                    </h2>
                    <p>
                        Three piles, nothing else. No deals, no pipeline, no
                        columns to configure. Just people you said you&rsquo;d
                        follow up with.
                    </p>
                </div>

                <div className="dash">
                    <div className="dash-top">
                        <div className="title">
                            <span>Your Woohoos</span>
                            <span className="date">Mon, Apr 22</span>
                        </div>
                        <div className="meta">42 active · 6 need you today</div>
                    </div>
                    <div className="dash-cols">
                        <div className="dash-col today">
                            <h5>
                                Follow up today <span className="count">6</span>
                            </h5>
                            <DashItem
                                i="I"
                                name="u/indie_marketer"
                                why="said they&rsquo;d try this weekend"
                                tag="hot"
                                tagLabel="hot"
                            />
                            <DashItem
                                i="P"
                                name="u/product_nerd"
                                why="asked about team pricing"
                                tag="hot"
                                tagLabel="hot"
                            />
                            <DashItem
                                i="S"
                                name="u/ship_it_pls"
                                why="waiting on LinkedIn eta"
                                tag="warm"
                                tagLabel="warm"
                            />
                            <DashItem
                                i="K"
                                name="u/kellybuilds"
                                why="bug repro — DM reply"
                                tag="warm"
                                tagLabel="warm"
                            />
                        </div>
                        <div className="dash-col overdue">
                            <h5>
                                Overdue <span className="count">3</span>
                            </h5>
                            <DashItem
                                i="R"
                                name="u/redditlurker42"
                                why='4 days late · "I&rsquo;ll try Sun"'
                                tag="hot"
                                tagLabel="!"
                            />
                            <DashItem
                                i="M"
                                name="u/marketer_mike"
                                why="2 days late · partnership"
                                tag="warm"
                                tagLabel="!"
                            />
                            <DashItem
                                i="N"
                                name="u/nothankyou"
                                why="1 day late · feature req"
                                tag="warm"
                                tagLabel="!"
                            />
                        </div>
                        <div className="dash-col cold">
                            <h5>
                                Maybe getting cold{" "}
                                <span className="count">12</span>
                            </h5>
                            <DashItem
                                i="J"
                                name="u/jane_builds"
                                why="no reply in 10 days"
                                tag="old"
                                tagLabel="cold"
                            />
                            <DashItem
                                i="D"
                                name="u/devdan"
                                why="no reply in 14 days"
                                tag="old"
                                tagLabel="cold"
                            />
                            <DashItem
                                i="F"
                                name="u/fromscratch"
                                why="no reply in 19 days"
                                tag="old"
                                tagLabel="cold"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
