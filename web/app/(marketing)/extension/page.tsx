import { ChromeIcon, FirefoxIcon } from "@/app/components/brand/BrandIcons";

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

export default function ExtensionPage() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 p-6 py-24 text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
                Install Woohoo
            </h1>

            <p className="text-sm text-muted-foreground mb-10 max-w-lg">
                Save DMs and comments in one click — with the Woohoo extension.
                <br />
                Works on Reddit today. LinkedIn and X coming next.
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
    );
}
