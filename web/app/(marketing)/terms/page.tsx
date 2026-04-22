export const metadata = {
    title: "Terms of Service — Woohoo",
    description:
        "The terms that govern your use of the Woohoo web app and browser extension.",
};

const EFFECTIVE_DATE = "April 22, 2026";

export default function TermsPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Terms of Service
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
                Effective Date: {EFFECTIVE_DATE}
            </p>

            <div className="mt-10 space-y-10 text-[15px] leading-7 text-foreground">
                <section>
                    <p>Welcome to Woohoo!</p>
                    <p className="mt-3">
                        By using Woohoo, you agree to these Terms of Service.
                        Please read them carefully. If you do not agree, you
                        should not use the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        1. Overview
                    </h2>
                    <p className="mt-3">
                        Woohoo is a lightweight follow-up tool that lets you
                        capture direct messages and comments from supported
                        platforms (currently Reddit, with more planned),
                        organise them into threads (&ldquo;Woohoos&rdquo;), and
                        set follow-up reminders. Woohoo is operated by Mudgal
                        Labs. We offer a Free plan and a paid Pro plan with
                        higher limits.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        2. Your Responsibilities
                    </h2>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                        <li>
                            You agree to use Woohoo in compliance with all
                            applicable laws and regulations, and with the
                            terms of service of the platforms Woohoo
                            integrates with.
                        </li>
                        <li>
                            You must not misuse, disrupt, or attack the
                            service or infrastructure.
                        </li>
                        <li>
                            You are responsible for keeping your account
                            credentials secure.
                        </li>
                        <li>
                            You must be at least 13 years old, and old enough
                            to form a binding contract in your country.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        3. Data Ownership
                    </h2>
                    <p className="mt-3">
                        You own the content you save into Woohoo. We do not
                        claim ownership and will never share it without your
                        consent. You can delete any saved item, Woohoo, or
                        your entire account from within the app. We do not
                        use your saved content to train models or for
                        advertising.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        4. Subscriptions &amp; Billing
                    </h2>
                    <p className="mt-3">
                        Payments for the Pro plan are processed by{" "}
                        <a
                            href="https://www.paddle.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Paddle
                        </a>
                        , which acts as our Merchant of Record. Paddle
                        handles checkout, billing, and tax collection. By
                        purchasing a paid plan you also agree to
                        Paddle&rsquo;s{" "}
                        <a
                            href="https://www.paddle.com/legal/checkout-buyer-terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            buyer terms
                        </a>
                        .
                    </p>
                    <p className="mt-3">
                        You can cancel your paid plan at any time.
                        Cancellation stops future renewals; your Pro access
                        stays active through the end of the current billing
                        period. Refunds are governed by our{" "}
                        <a
                            href="/refund"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Refund Policy
                        </a>
                        .
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        5. Third-Party Platforms
                    </h2>
                    <p className="mt-3">
                        Woohoo integrates with third-party platforms
                        (currently Reddit, with more planned). Those
                        platforms are not operated by us. We are not
                        responsible for their availability, policies, or the
                        content they host. If a platform changes in a way
                        that breaks Woohoo, we will adapt but cannot
                        guarantee uninterrupted support for every
                        integration.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        6. Service Availability
                    </h2>
                    <p className="mt-3">
                        We aim to keep the platform stable and accessible
                        but make no guarantees regarding uptime or data
                        retention. Features may change or be removed
                        without notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        7. Termination
                    </h2>
                    <p className="mt-3">
                        You can stop using Woohoo anytime. We may suspend
                        or terminate accounts that abuse the system or
                        violate these terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        8. Changes to These Terms
                    </h2>
                    <p className="mt-3">
                        We may update these Terms of Service over time.
                        Continued use after changes means you accept the
                        updated terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        9. Contact
                    </h2>
                    <p className="mt-3">
                        For questions or feedback, email:{" "}
                        <a
                            href="mailto:hey@woohoo.to"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            hey@woohoo.to
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
}
