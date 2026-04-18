export function Problem() {
    return (
        <section className="section problem" id="problem">
            <div className="wrap problem-grid">
                <div>
                    <div className="eyebrow">
                        <span className="dot">●</span> the problem
                    </div>
                    <div style={{ height: 16 }} />
                    <h2>
                        The warm lead you had on{" "}
                        <span className="italic-serif">Tuesday</span> is cold by{" "}
                        <span className="mark">Friday.</span>
                    </h2>
                    <p className="problem-lede">
                        Tracking conversations in your head fails. Spreadsheets
                        are too slow. Scrolling back through notifications is
                        painful. Important signals get lost — and warm becomes
                        cold, quietly.
                    </p>
                </div>

                <div className="timeline">
                    <div className="timeline-item is-hot">
                        <div className="time">Tue 9:14 AM</div>
                        <div className="txt">
                            <b>u/indie_marketer</b>: &ldquo;I&rsquo;ll try this
                            weekend&rdquo;
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="time">Tue 11:02 AM</div>
                        <div className="txt">
                            you reply in their comment chain
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="time">Wed</div>
                        <div className="txt">
                            they DM about <b>LinkedIn support</b>
                        </div>
                    </div>
                    <div className="timeline-item lost">
                        <div className="time">Thu</div>
                        <div className="txt">
                            notification buried under 40 others
                        </div>
                    </div>
                    <div className="timeline-item lost">
                        <div className="time">Sun</div>
                        <div className="txt">they tried a competitor instead</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
