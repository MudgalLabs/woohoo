import Link from "next/link";

function GithubGlyph({ size = 14 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
        >
            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.73.08-.73 1.21.09 1.85 1.25 1.85 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.77-1.62-2.66-.31-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.54.12-3.2 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.89.12 3.2.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5z" />
        </svg>
    );
}

export function CtaBig() {
    return (
        <section className="cta-big" id="cta">
            <div className="cta-stars" aria-hidden>
                <span
                    style={{
                        position: "absolute",
                        left: "12%",
                        top: "20%",
                        transform: "rotate(-18deg)",
                    }}
                >
                    ✦
                </span>
                <span
                    style={{
                        position: "absolute",
                        right: "14%",
                        top: "28%",
                        transform: "rotate(12deg)",
                    }}
                >
                    ✧
                </span>
                <span
                    style={{
                        position: "absolute",
                        left: "22%",
                        bottom: "18%",
                        transform: "rotate(24deg)",
                    }}
                >
                    ✦
                </span>
                <span
                    style={{
                        position: "absolute",
                        right: "22%",
                        bottom: "12%",
                        transform: "rotate(-10deg)",
                    }}
                >
                    ✧
                </span>
            </div>
            <div className="wrap">
                <h2>
                    The lead you&rsquo;ll remember is the one you{" "}
                    <span className="italic-serif punch">
                        followed up with.
                    </span>
                </h2>
                <p className="cta-sub">
                    Install the extension. Save the next DM that matters. Take
                    it from there.
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Link
                        href="/sign-up"
                        className="btn btn-primary btn-lg btn-arrow"
                    >
                        Start free
                    </Link>
                    <a
                        href="https://github.com/MudgalLabs/woohoo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-lg"
                    >
                        <GithubGlyph size={14} /> View on GitHub
                    </a>
                </div>
                <div
                    className="hand"
                    style={{
                        marginTop: 24,
                        color: "var(--accent)",
                        fontSize: 22,
                        transform: "rotate(-2deg)",
                    }}
                >
                    — no credit card, no onboarding call, no kidding
                </div>
            </div>
        </section>
    );
}
