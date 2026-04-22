import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";

export interface DigestWoohoo {
    id: string;
    peerName: string | null;
    peerId: string;
    platform: string;
    followUpAt: Date | null;
    lastInteractionAt: Date | null;
}

export interface FollowUpDigestProps {
    name: string;
    baseUrl: string;
    unsubscribeUrl: string;
    today: DigestWoohoo[];
    overdue: DigestWoohoo[];
}

// Colors — hex equivalents of the OKLCH tokens in web/app/globals.css :root.
// Kept inline so the template is a true email client artefact (email clients
// don't evaluate CSS custom properties across the <head>/<body> boundary
// reliably). Keep in sync if the theme changes.
const colors = {
    // Outer page background — slightly darker than the card so the card pops.
    // Maps to --sidebar, which is the "paper with a hint more shadow" tone.
    bg: "#ede7db",
    // Inner card surface — the app's primary writing surface (--background).
    card: "#f5f0e8",
    foreground: "#1a1410",
    mutedFg: "#635a4a",
    border: "#c8bfb0",
    primary: "#c0392b",
    primaryFg: "#f5f0e8",
};

const logoFont =
    "'Fredoka', ui-rounded, 'Segoe UI', system-ui, -apple-system, sans-serif";
const bodyFont =
    "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function platformLabel(p: string): string {
    return p.charAt(0).toUpperCase() + p.slice(1);
}

function overdueLabel(date: Date | null, now: Date): string {
    if (!date) return "";
    const days = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
    if (days <= 0) return "today";
    if (days === 1) return "1 day overdue";
    return `${days} days overdue`;
}

export function FollowUpDigest({
    name,
    baseUrl,
    unsubscribeUrl,
    today,
    overdue,
}: FollowUpDigestProps) {
    const now = new Date();
    const previewText =
        overdue.length > 0
            ? `${overdue.length} overdue, ${today.length} today`
            : `${today.length} follow-up${today.length === 1 ? "" : "s"} for today`;

    return (
        <Html>
            <Head>
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <Preview>{previewText}</Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Link href={baseUrl} style={logoLink}>
                        <Text style={logo}>woohoo</Text>
                    </Link>
                    <Text style={greeting}>Hey {name},</Text>
                    <Text style={paragraph}>
                        {previewText}. Knock them out while it's fresh.
                    </Text>

                    {overdue.length > 0 && (
                        <Section>
                            <Heading as="h2" style={sectionHeading}>
                                Overdue ({overdue.length})
                            </Heading>
                            {overdue.map((w) => (
                                <Text key={w.id} style={item}>
                                    <Link
                                        href={`${baseUrl}/my-woohoos/${w.id}`}
                                        style={itemLink}
                                    >
                                        {w.peerName ?? w.peerId}
                                    </Link>
                                    <span style={itemMeta}>
                                        {" "}&middot; {platformLabel(w.platform)}{" "}&middot;{" "}
                                        {overdueLabel(w.followUpAt, now)}
                                    </span>
                                </Text>
                            ))}
                        </Section>
                    )}

                    {today.length > 0 && (
                        <Section>
                            <Heading as="h2" style={sectionHeading}>
                                Today ({today.length})
                            </Heading>
                            {today.map((w) => (
                                <Text key={w.id} style={item}>
                                    <Link
                                        href={`${baseUrl}/my-woohoos/${w.id}`}
                                        style={itemLink}
                                    >
                                        {w.peerName ?? w.peerId}
                                    </Link>
                                    <span style={itemMeta}>
                                        {" "}&middot; {platformLabel(w.platform)}
                                    </span>
                                </Text>
                            ))}
                        </Section>
                    )}

                    <Hr style={hr} />

                    <Section style={ctaSection}>
                        <Link href={`${baseUrl}/dashboard`} style={ctaLink}>
                            Open dashboard
                        </Link>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Woohoo sends this digest once a day, around 8am in your
                        timezone. You can turn it off in{" "}
                        <Link
                            href={`${baseUrl}/settings`}
                            style={footerLink}
                        >
                            settings
                        </Link>{" "}
                        or{" "}
                        <Link href={unsubscribeUrl} style={footerLink}>
                            unsubscribe here
                        </Link>
                        .
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const bodyStyle: React.CSSProperties = {
    background: colors.bg,
    fontFamily: bodyFont,
    margin: 0,
    padding: 0,
    color: colors.foreground,
};

const containerStyle: React.CSSProperties = {
    padding: "32px 28px",
    margin: "40px auto",
    maxWidth: 560,
    background: colors.card,
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
};

const logoLink: React.CSSProperties = {
    textDecoration: "none",
    display: "inline-block",
    marginBottom: 20,
};

const logo: React.CSSProperties = {
    fontFamily: logoFont,
    fontSize: 20,
    fontWeight: 500,
    color: colors.primary,
    margin: 0,
    letterSpacing: "-0.01em",
    lineHeight: 1,
};

const greeting: React.CSSProperties = {
    fontSize: 16,
    margin: "0 0 8px",
    color: colors.foreground,
};

const paragraph: React.CSSProperties = {
    fontSize: 14,
    color: colors.mutedFg,
    margin: "0 0 24px",
    lineHeight: "1.5",
};

const sectionHeading: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    margin: "24px 0 10px",
    color: colors.foreground,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
};

const item: React.CSSProperties = {
    fontSize: 14,
    margin: "0 0 8px",
    lineHeight: "1.4",
    color: colors.foreground,
};

const itemLink: React.CSSProperties = {
    color: colors.primary,
    textDecoration: "none",
    fontWeight: 500,
};

const itemMeta: React.CSSProperties = {
    color: colors.mutedFg,
    fontSize: 13,
    fontWeight: 400,
};

const hr: React.CSSProperties = {
    borderTop: `1px solid ${colors.border}`,
    borderBottom: "none",
    margin: "28px 0",
};

const ctaSection: React.CSSProperties = {
    textAlign: "center",
    margin: "0",
};

const ctaLink: React.CSSProperties = {
    display: "inline-block",
    background: colors.primary,
    color: colors.primaryFg,
    padding: "10px 22px",
    borderRadius: 6,
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 14,
};

const footer: React.CSSProperties = {
    fontSize: 12,
    color: colors.mutedFg,
    textAlign: "center",
    margin: 0,
    lineHeight: "1.5",
};

const footerLink: React.CSSProperties = {
    color: colors.mutedFg,
    textDecoration: "underline",
};
