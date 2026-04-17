export const metadata = { title: "Install Woohoo" };

function ChromeIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            className="w-10 h-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="24" cy="24" r="24" fill="#EAEAEA" />
            <circle cx="24" cy="24" r="10" fill="#4285F4" />
            <circle cx="24" cy="24" r="6" fill="white" />
            <path d="M24 14 L38 14 A14 14 0 0 1 43.1 32.5 Z" fill="#EA4335" />
            <path d="M24 14 L10 14 A14 14 0 0 0 4.9 32.5 Z" fill="#FBBC05" />
            <path
                d="M4.9 32.5 A14 14 0 0 0 43.1 32.5 L37.1 29 A8 8 0 0 1 10.9 29 Z"
                fill="#34A853"
            />
        </svg>
    );
}

function FirefoxIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            className="w-10 h-10"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="24" cy="24" r="24" fill="#EAEAEA" />
            <circle cx="24" cy="24" r="13" fill="#0060DF" />
            <circle cx="24" cy="24" r="8" fill="#00B3F4" />
            <circle cx="24" cy="24" r="4" fill="#FF980E" />
        </svg>
    );
}

function BrowserCard({
    icon,
    browser,
    href,
}: {
    icon: React.ReactNode;
    browser: string;
    href: string;
}) {
    return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 w-50">
            {icon}
            <span className="text-sm font-medium text-foreground">
                {browser}
            </span>
            <a
                href={href}
                className="text-sm font-medium text-primary-foreground bg-primary px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
            >
                Add to {browser}
            </a>
        </div>
    );
}

export default function ExtensionPage() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 p-6 py-24 text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
                Install the Woohoo extension
            </h1>
            <p className="text-sm text-muted-foreground mb-10 max-w-lg">
                Save Reddit DMs in one click. Available for Chrome and Firefox.
            </p>

            <div className="flex gap-6 flex-wrap justify-center">
                <BrowserCard icon={<ChromeIcon />} browser="Chrome" href="#" />
                <BrowserCard
                    icon={<FirefoxIcon />}
                    browser="Firefox"
                    href="#"
                />
            </div>
        </div>
    );
}
