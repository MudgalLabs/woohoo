import { ChromeIcon, FirefoxIcon } from "@/app/components/brand/BrandIcons";
import { PlatformIcon } from "@/components/PlatformIcon";

export const metadata = { title: "Install Woohoo" };

function BrowserCard({
    icon,
    browser,
    href,
    comingSoon,
}: {
    icon: React.ReactNode;
    browser: string;
    href?: string;
    comingSoon?: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 w-56 hover:shadow-sm transition">
            {icon}
            <span className="text-sm font-medium text-foreground">
                {browser}
            </span>
            {comingSoon ? (
                <button
                    type="button"
                    disabled
                    className="text-sm font-medium text-muted-foreground bg-muted px-4 py-1.5 rounded-md cursor-not-allowed"
                >
                    Coming soon
                </button>
            ) : (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary-foreground bg-primary px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
                >
                    Add to {browser}
                </a>
            )}
        </div>
    );
}

function PlatformHelp({
    id,
    platform,
    name,
    children,
}: {
    id: string;
    platform: string;
    name: string;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            className="w-full max-w-2xl mx-auto scroll-mt-24 rounded-xl border border-border bg-card p-6 text-left"
        >
            <div className="flex items-center gap-2 mb-4">
                <PlatformIcon platform={platform} size={22} />
                <h2 className="text-lg font-semibold text-foreground">
                    How to use Woohoo on {name}
                </h2>
            </div>
            {children}
        </section>
    );
}

export default function ExtensionPage() {
    return (
        <div className="flex flex-col items-center flex-1 p-6 py-16 text-center gap-16">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                    Install Woohoo
                </h1>

                <p className="text-sm text-muted-foreground mb-10 max-w-lg">
                    Save DMs and comments in one click — with the Woohoo
                    extension.
                    <br />
                    Works on Reddit and LinkedIn today. X and more coming next.
                </p>

                <div className="flex gap-6 flex-wrap justify-center">
                    <BrowserCard
                        icon={<ChromeIcon />}
                        browser="Chrome"
                        href="https://chromewebstore.google.com/detail/woohoo/ajbhmciagbhndmfijmolmjfekajoegkp"
                    />
                    <BrowserCard
                        icon={<FirefoxIcon />}
                        browser="Firefox"
                        comingSoon
                    />
                </div>
            </div>

            <PlatformHelp id="reddit" platform="reddit" name="Reddit">
                <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>
                        Open a Reddit chat — either the floating chat popup or
                        the full page at{" "}
                        <code className="text-foreground">
                            reddit.com/chat/room/…
                        </code>
                        .
                    </li>
                    <li>
                        Hover a message — a small bookmark button appears at
                        its bottom-right corner.
                    </li>
                    <li>
                        Click the bookmark. Pick an optional follow-up date and
                        hit <strong>Save</strong>.
                    </li>
                    <li>
                        Post comments work the same way — open any Reddit post
                        (<code className="text-foreground">/r/*/comments/*</code>
                        ) and hover a comment to save it.
                    </li>
                </ol>
                <p className="text-xs text-muted-foreground mt-4 border-t border-border pt-3">
                    Saves create a Woohoo per{" "}
                    <strong className="text-foreground">(Reddit user)</strong>.
                    Everything you save for{" "}
                    <code className="text-foreground">u/someone</code> rolls up
                    into their timeline.
                </p>
            </PlatformHelp>

            <PlatformHelp id="linkedin" platform="linkedin" name="LinkedIn">
                <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>
                        Open a LinkedIn message thread at{" "}
                        <code className="text-foreground">
                            linkedin.com/messaging/thread/…
                        </code>
                        . Click any conversation from your inbox to get there.
                    </li>
                    <li>
                        Hover a message — a small bookmark button appears at
                        its bottom-left corner.
                    </li>
                    <li>
                        Click the bookmark. Pick an optional follow-up date and
                        hit <strong>Save</strong>.
                    </li>
                </ol>
                <p className="text-xs text-muted-foreground mt-4 border-t border-border pt-3">
                    Only <strong className="text-foreground">text messages</strong>{" "}
                    can be saved today — reshared posts, reactions, files, and
                    calls show a note that they can't be saved yet. Post
                    comments on LinkedIn feeds are coming next. The pop-out
                    chat in the bottom-right of LinkedIn isn't supported —
                    click the conversation to open the full thread first.
                </p>
            </PlatformHelp>
        </div>
    );
}
