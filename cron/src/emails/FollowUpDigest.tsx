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
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Heading style={h1}>Woohoo</Heading>
                    <Text style={greeting}>Hey {name},</Text>
                    <Text style={paragraph}>
                        {previewText}. Knock them out while it's fresh.
                    </Text>

                    {overdue.length > 0 && (
                        <Section>
                            <Heading as="h2" style={h2}>
                                Overdue ({overdue.length})
                            </Heading>
                            {overdue.map((w) => (
                                <Text key={w.id} style={item}>
                                    <Link
                                        href={`${baseUrl}/my-woohoos/${w.id}`}
                                        style={itemLink}
                                    >
                                        {w.peerName ?? w.peerId}
                                    </Link>{" "}
                                    <span style={itemMeta}>
                                        &middot; {platformLabel(w.platform)}
                                        {" · "}
                                        {overdueLabel(w.followUpAt, now)}
                                    </span>
                                </Text>
                            ))}
                        </Section>
                    )}

                    {today.length > 0 && (
                        <Section>
                            <Heading as="h2" style={h2}>
                                Today ({today.length})
                            </Heading>
                            {today.map((w) => (
                                <Text key={w.id} style={item}>
                                    <Link
                                        href={`${baseUrl}/my-woohoos/${w.id}`}
                                        style={itemLink}
                                    >
                                        {w.peerName ?? w.peerId}
                                    </Link>{" "}
                                    <span style={itemMeta}>
                                        &middot; {platformLabel(w.platform)}
                                    </span>
                                </Text>
                            ))}
                        </Section>
                    )}

                    <Hr style={hr} />

                    <Text style={cta}>
                        <Link href={`${baseUrl}/dashboard`} style={ctaLink}>
                            Open dashboard
                        </Link>
                    </Text>

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

const body: React.CSSProperties = {
    background: "#f5f0e8",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: 0,
};

const container: React.CSSProperties = {
    padding: "32px 24px",
    margin: "40px auto",
    maxWidth: 560,
    background: "#ffffff",
    borderRadius: 8,
};

const h1: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: "#c0392b",
    margin: "0 0 24px",
};

const greeting: React.CSSProperties = {
    fontSize: 16,
    margin: "0 0 8px",
};

const paragraph: React.CSSProperties = {
    fontSize: 14,
    color: "#555",
    margin: "0 0 24px",
    lineHeight: "1.5",
};

const h2: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    margin: "24px 0 8px",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};

const item: React.CSSProperties = {
    fontSize: 14,
    margin: "0 0 6px",
    lineHeight: "1.4",
};

const itemLink: React.CSSProperties = {
    color: "#c0392b",
    textDecoration: "none",
    fontWeight: 500,
};

const itemMeta: React.CSSProperties = {
    color: "#888",
    fontSize: 13,
};

const hr: React.CSSProperties = {
    borderTop: "1px solid #e5e5e5",
    borderBottom: "none",
    margin: "24px 0",
};

const cta: React.CSSProperties = {
    textAlign: "center",
    margin: "24px 0",
};

const ctaLink: React.CSSProperties = {
    background: "#c0392b",
    color: "#f5f0e8",
    padding: "10px 20px",
    borderRadius: 6,
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 14,
};

const footer: React.CSSProperties = {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    margin: 0,
    lineHeight: "1.5",
};

const footerLink: React.CSSProperties = {
    color: "#888",
    textDecoration: "underline",
};
