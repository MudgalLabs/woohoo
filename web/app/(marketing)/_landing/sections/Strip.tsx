const ITEMS = [
    "Reddit DMs",
    "Comment threads",
    "Warm leads",
    "Feature requests",
    "\u201CI\u2019ll try this weekend\u201D",
    "Bug reports",
    "Partnership pings",
    "Criticism worth reading",
    "The lead you almost lost",
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
