const ITEMS = [
    "Reddit DMs",
    "comment threads",
    "warm leads",
    "feature requests",
    "\u201CI\u2019ll try this weekend\u201D",
    "bug reports",
    "partnership pings",
    "criticism worth reading",
    "the lead you almost lost",
];

export function Strip() {
    const row = [...ITEMS, ...ITEMS];
    return (
        <div className="strip">
            <div className="strip-row">
                {row.map((t, i) => (
                    <span key={i}>
                        {t} <span className="dot">✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
