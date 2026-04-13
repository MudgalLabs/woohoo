import Image from "next/image";

export default function Home() {
    return (
        <main className="min-h-screen px-6 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.02),transparent)]">
            {/* top nav */}
            <div className="absolute top-4 left-6 flex items-center gap-2 text-sm text-red">
                <Image
                    src="/logo.svg"
                    alt="CircleBack logo"
                    width={24}
                    height={24}
                    priority
                />
                <span className="tracking-tight font-medium text-lg">
                    CircleBack.to
                </span>
            </div>

            {/* hero */}
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-2xl text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                        Never miss a follow-up.
                    </h1>

                    <p className="text-lg text-muted leading-relaxed">
                        Capture conversations, track context, and never let them
                        go cold.
                    </p>

                    <div className="text-sm text-red font-mono font-medium chip-red w-fit mx-auto">
                        Coming soon
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-md p-4">
                <h2 className="text-foreground">Huddle Ventures</h2>
                <p className="text-accent">1,006 karma →</p>
            </div>

            <p className="text-muted">Anonymous. Unfiltered.</p>

            <span className="bg-chip text-chip-foreground text-xs px-2 py-1 rounded-sm">
                VERIFIED
            </span>

            <span className="font-mono text-xs tracking-wide">VERIFIED</span>
        </main>
    );
}
