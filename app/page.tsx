export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.02),transparent)]">
            <div className="max-w-2xl text-center space-y-6">
                {/* subtle label */}
                <div className="text-sm text-(--color-muted)">
                    CircleBack.to
                </div>

                {/* title */}
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                    Never miss a follow-up.
                </h1>

                {/* subtitle */}
                <p className="text-lg text-(--color-muted) leading-relaxed">
                    Capture conversations, track context, and never let them go
                    cold.
                </p>

                {/* CTA (placeholder) */}
                {/* <div className="pt-4">
                    <button className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] bg-white/60 backdrop-blur-sm hover:bg-white transition">
                        Get early access
                    </button>
                </div> */}

                <div className="pt-4 text-sm text-(--color-muted)">
                    Coming soon.
                </div>
            </div>
        </main>
    );
}
