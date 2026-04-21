const COLORS = {
    cream: "#F6EFE3",
    ink: "#1C1714",
    inkSoft: "#3A2F26",
    rust: "#C94A2B",
    highlight: "#FFE45C",
    line: "rgba(28,23,20,0.12)",
    muted: "rgba(28,23,20,0.55)",
};

const HIGHLIGHT_GRADIENT = `linear-gradient(180deg, transparent 55%, ${COLORS.highlight} 55%, ${COLORS.highlight} 92%, transparent 92%)`;

async function loadGoogleFont(
    family: string,
    weight = 400,
    italic = false,
): Promise<ArrayBuffer> {
    const axisTag = italic ? "ital,wght" : "wght";
    const axisValue = italic ? `1,${weight}` : `${weight}`;
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${axisTag}@${axisValue}&display=swap`;
    const res = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
        },
    });
    if (!res.ok) {
        throw new Error(`Google Fonts CSS fetch failed for ${family}`);
    }
    const css = await res.text();
    const match = css.match(/src:\s*url\(([^)]+)\)\s*format/);
    if (!match) {
        throw new Error(`No font URL in CSS for ${family} ${weight}`);
    }
    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) {
        throw new Error(`Failed to fetch font file for ${family}`);
    }
    return fontRes.arrayBuffer();
}

export async function getOgFonts() {
    const [fraunces, frauncesItalic, inter, interSemi, mono] =
        await Promise.all([
            loadGoogleFont("Fraunces", 400),
            loadGoogleFont("Fraunces", 400, true),
            loadGoogleFont("Inter", 400),
            loadGoogleFont("Inter", 600),
            loadGoogleFont("JetBrains Mono", 500),
        ]);
    return [
        { name: "Fraunces", data: fraunces, weight: 400, style: "normal" },
        {
            name: "Fraunces",
            data: frauncesItalic,
            weight: 400,
            style: "italic",
        },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
        { name: "Inter", data: interSemi, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
    ] as const;
}

export function OgBanner() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: COLORS.cream,
                display: "flex",
                flexDirection: "column",
                padding: 64,
                fontFamily: "Inter",
                color: COLORS.ink,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontFamily: "Fraunces",
                        fontSize: 32,
                        color: COLORS.rust,
                        letterSpacing: -0.5,
                        lineHeight: 1,
                    }}
                >
                    <div
                        style={{
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            background: COLORS.rust,
                            marginRight: 7,
                        }}
                    />
                    <span>woohoo</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontFamily: "JetBrains Mono",
                        fontSize: 12,
                        color: COLORS.rust,
                        letterSpacing: 2.6,
                        textTransform: "uppercase",
                        fontWeight: 500,
                    }}
                >
                    <div
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: COLORS.rust,
                            marginRight: 10,
                        }}
                    />
                    <span>Works on Reddit · LinkedIn & X next</span>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    marginTop: 24,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: 620,
                        marginRight: 32,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            fontFamily: "JetBrains Mono",
                            fontSize: 11,
                            color: COLORS.rust,
                            letterSpacing: 2.4,
                            textTransform: "uppercase",
                            fontWeight: 500,
                            marginBottom: 18,
                        }}
                    >
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: COLORS.rust,
                                marginRight: 10,
                            }}
                        />
                        <span>A follow-up tool for DMs & comments</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            fontFamily: "Fraunces",
                            fontSize: 68,
                            lineHeight: 1.02,
                            letterSpacing: -2,
                            color: COLORS.ink,
                        }}
                    >
                        <span>Don&apos;t let warm</span>
                        <span>conversations</span>
                        <span
                            style={{
                                fontStyle: "italic",
                                color: COLORS.rust,
                            }}
                        >
                            go cold.
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            fontFamily: "Inter",
                            fontSize: 20,
                            lineHeight: 1.45,
                            color: COLORS.inkSoft,
                            marginTop: 26,
                            width: 560,
                        }}
                    >
                        <span>
                            Capture the DMs and comments that matter. Organized
                            by person.&nbsp;
                        </span>
                        <span
                            style={{
                                background: HIGHLIGHT_GRADIENT,
                                padding: "0 2px",
                            }}
                        >
                            Follow up
                        </span>
                        <span>&nbsp;before they forget about you.</span>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: "0 0 auto",
                        transform: "rotate(2deg)",
                        background: "#fff",
                        width: 360,
                        borderRadius: 14,
                        padding: 20,
                        border: `1px solid ${COLORS.line}`,
                        boxShadow: "0 10px 32px rgba(28,23,20,0.10)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.highlight})`,
                                marginRight: 10,
                            }}
                        />
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                marginRight: 8,
                            }}
                        >
                            u/indie_marketer
                        </span>
                        <span style={{ fontSize: 12, color: COLORS.muted }}>
                            · Tue 2:14pm
                        </span>
                        <span
                            style={{
                                fontSize: 10,
                                fontFamily: "JetBrains Mono",
                                letterSpacing: 1.2,
                                color: COLORS.muted,
                                textTransform: "uppercase",
                                marginLeft: "auto",
                            }}
                        >
                            DM
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            fontSize: 14,
                            lineHeight: 1.5,
                            color: COLORS.inkSoft,
                        }}
                    >
                        <span>Hey — saw your comment in r/SaaS.&nbsp;</span>
                        <span
                            style={{
                                background: HIGHLIGHT_GRADIENT,
                                padding: "0 2px",
                            }}
                        >
                            I&apos;ll try Woohoo this weekend
                        </span>
                        <span>&nbsp;and send feedback.</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 14,
                            paddingTop: 12,
                            borderTop: `1px solid ${COLORS.line}`,
                            fontSize: 11,
                            fontFamily: "JetBrains Mono",
                            color: COLORS.muted,
                            letterSpacing: 0.5,
                            fontWeight: 500,
                        }}
                    >
                        <span>SAVED · FOLLOW UP FRIDAY</span>
                        <span style={{ color: COLORS.rust }}>●</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
