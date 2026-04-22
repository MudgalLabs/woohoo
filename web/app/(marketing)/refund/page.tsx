export const metadata = {
    title: "Refund Policy — Woohoo",
    description:
        "When and how you can get a refund on your Woohoo subscription.",
};

const EFFECTIVE_DATE = "April 22, 2026";

export default function RefundPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Refund Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
                Effective Date: {EFFECTIVE_DATE}
            </p>

            <div className="mt-10 space-y-6 text-[15px] leading-7 text-foreground">
                <p>Thank you for subscribing to Woohoo.</p>

                <p>
                    Woohoo&rsquo;s Free plan has no charge. For the Pro plan, if
                    you&rsquo;re unhappy with Woohoo within{" "}
                    <strong>14 days </strong> of your first payment, email us
                    and we&rsquo;ll issue a full refund — no questions.
                </p>

                <p>
                    After 14 days, Pro subscriptions are non-refundable for the
                    current billing period. You can cancel at any time; your Pro
                    access stays active through the end of the period
                    you&rsquo;ve already paid for.
                </p>

                <p>
                    Payments and refunds are processed by{" "}
                    <a
                        href="https://www.paddle.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        Paddle
                    </a>
                    , our Merchant of Record. Approved refunds typically take
                    3–10 business days to reflect, depending on your bank or
                    card issuer.
                </p>

                <p>
                    If you have any questions, concerns, or would like to
                    request a refund, feel free to contact us at{" "}
                    <a
                        href="mailto:hey@woohoo.to"
                        className="text-primary underline-offset-4 hover:underline"
                    >
                        hey@woohoo.to
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
