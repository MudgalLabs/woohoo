export const metadata = {
    title: "Privacy Policy — Woohoo",
    description:
        "How Woohoo collects, stores, and uses data from the Woohoo web app and browser extension.",
};

const LAST_UPDATED = "April 21, 2026";

export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
                Last updated: {LAST_UPDATED}
            </p>

            <div className="mt-10 space-y-10 text-[15px] leading-7 text-foreground">
                <section>
                    <p>
                        Woohoo is a social CRM for indie founders, built and
                        operated by Mudgal Labs. This policy explains what
                        information we collect, why we collect it, and the
                        choices you have. It covers both the Woohoo web app at{" "}
                        <a
                            href="https://woohoo.to"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            woohoo.to
                        </a>{" "}
                        and the Woohoo browser extension for Chrome and Firefox.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        What we collect
                    </h2>
                    <p className="mt-3">
                        We only store data that you either enter into Woohoo or
                        explicitly save using the extension. Specifically:
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                        <li>
                            <strong>Account information.</strong> Your email
                            address, name, and a hashed password when you sign
                            up. Used to authenticate you and send essential
                            account email.
                        </li>
                        <li>
                            <strong>Saved interactions.</strong> When you click
                            the save button on a DM or comment on a supported
                            platform, we store the text of that message, a
                            sanitized HTML copy, a link back to the original
                            source, the timestamp, and the platform usernames
                            involved (both the other person and, if you set
                            it, your own handle so we can thread replies
                            correctly).
                        </li>
                        <li>
                            <strong>Follow-up metadata.</strong> Any follow-up
                            date or note you attach to a saved Woohoo.
                        </li>
                        <li>
                            <strong>Session data.</strong> A session token
                            issued at sign-in, stored in your browser&rsquo;s
                            local storage and sent with each request to
                            identify you.
                        </li>
                    </ul>
                    <p className="mt-3">
                        The extension does <em>not</em> read platform content
                        in the background. It only captures the specific
                        message or comment you click &ldquo;Save&rdquo; on. It
                        does not scrape your inbox, your feed, or any other
                        data from the platforms it integrates with.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        What we do not collect
                    </h2>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                        <li>
                            We do not run any third-party analytics, tracking
                            pixels, or behavioural advertising SDKs.
                        </li>
                        <li>
                            We do not read or store passwords or account
                            credentials for any of the platforms you use with
                            Woohoo.
                        </li>
                        <li>
                            We do not sell, rent, or share your data with third
                            parties for their own marketing.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        How we use it
                    </h2>
                    <p className="mt-3">
                        Collected data is used solely to provide the Woohoo
                        service: rendering your Woohoos dashboard, grouping
                        saved items into the correct threads, reminding you of
                        follow-ups, and authenticating your extension sessions.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Where it is stored
                    </h2>
                    <p className="mt-3">
                        Data is stored in a PostgreSQL database operated by us
                        and hosted on Cloudflare infrastructure, encrypted at
                        rest. Transport between your browser and our backend
                        uses HTTPS.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Sub-processors
                    </h2>
                    <p className="mt-3">
                        We rely on a small number of infrastructure providers
                        to run Woohoo. They process data only on our behalf and
                        under their own security commitments:
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                        <li>
                            <strong>Cloudflare</strong> — application hosting,
                            database hosting, and CDN.
                        </li>
                        <li>
                            <strong>Stripe</strong> — if you subscribe to a
                            paid plan, Stripe handles your payment details. We
                            never see your card data.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Retention
                    </h2>
                    <p className="mt-3">
                        Saved items live in your account until you delete them
                        — either individually, by deleting the Woohoo they
                        belong to, or by deleting your account. When you delete
                        your account, all associated Woohoos and timeline items
                        are removed.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Your rights
                    </h2>
                    <p className="mt-3">
                        You can delete any saved item, Woohoo, or your entire
                        account from within the web app at any time. You can
                        also request an export of your data, or ask us to
                        delete specific records, by emailing{" "}
                        <a
                            href="mailto:hey@woohoo.to"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            hey@woohoo.to
                        </a>
                        .
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Extension permissions
                    </h2>
                    <p className="mt-3">
                        The Woohoo extension requests a minimal set of
                        permissions:
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-6">
                        <li>
                            <strong>storage</strong> — to cache your session
                            token and some local UI preferences in your
                            browser.
                        </li>
                        <li>
                            <strong>tabs</strong> — to open the Woohoo
                            dashboard or sign-up page in a new tab when you
                            click the extension popup.
                        </li>
                        <li>
                            <strong>Host access to supported platforms</strong>{" "}
                            — to inject the save button on DM and comment
                            threads. The currently supported platform is{" "}
                            <code>reddit.com</code>. Support for additional
                            platforms (such as LinkedIn and X) will be added
                            in future releases; your browser will prompt you
                            to approve each new host permission before it
                            takes effect.
                        </li>
                        <li>
                            <strong>Host access to woohoo.to</strong> — to send
                            your saved items to our backend.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Children
                    </h2>
                    <p className="mt-3">
                        Woohoo is not directed at children under 13 and we do
                        not knowingly collect data from them.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Changes to this policy
                    </h2>
                    <p className="mt-3">
                        If we make a material change to this policy, we&apos;ll
                        update the &ldquo;Last updated&rdquo; date above and,
                        where appropriate, notify you by email.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Contact
                    </h2>
                    <p className="mt-3">
                        Questions, concerns, or deletion requests — email{" "}
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
