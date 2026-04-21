export function IsIsnt() {
    return (
        <section className="section isnot-section" id="isnot">
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> honest scope
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        What it is.{" "}
                        <span className="italic-serif muted">And what it</span>{" "}
                        <span className="italic-serif punch">isn&rsquo;t.</span>
                    </h2>
                    <p>
                        Woohoo is built for follow-ups — not everything else.
                        Here&rsquo;s what it does and what it refuses to become.
                    </p>
                </div>

                <div className="isnot-grid">
                    <div className="is-card">
                        <h3>
                            It is <span className="tag">yes</span>
                        </h3>
                        <ul className="is-list">
                            <li>
                                <span>
                                    <b>A capture tool.</b> 1-click save of DMs
                                    and comments that matter, link back to the
                                    original.
                                </span>
                            </li>
                            <li>
                                <span>
                                    <b>A person-first timeline.</b> All
                                    interactions with one person, threaded
                                    correctly.
                                </span>
                            </li>
                            <li>
                                <span>
                                    <b>A follow-up dashboard.</b> Today,
                                    overdue, going cold — and nothing else.
                                </span>
                            </li>
                            <li>
                                <span>
                                    <b>Open source.</b> AGPL, self-host with
                                    docker compose if you want to.
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="isnot-card">
                        <h3>
                            It isn&rsquo;t <span className="tag">no</span>
                        </h3>
                        <ul className="is-list">
                            <li>
                                <span className="main">
                                    <b>An outbound tool. </b> You still reply on
                                    the platform, like a human.
                                </span>
                            </li>
                            <li>
                                <span className="main">
                                    <b>A full CRM. </b> No deals, no pipeline
                                    stages, no forecast charts.
                                </span>
                            </li>
                            <li>
                                <span className="main">
                                    <b>A scheduler or analytics suite. </b>{" "}
                                    There are good tools for those. This
                                    isn&rsquo;t one.
                                </span>
                            </li>
                            <li>
                                <span className="main">
                                    <b>A spreadsheet with extra steps. </b> If
                                    it doesn&rsquo;t save you time, delete it.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
