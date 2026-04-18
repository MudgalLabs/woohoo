import { getSession } from "@/lib/get-session";
import { Nav } from "@/app/components/home/Nav";
import { Footer } from "@/app/components/home/Footer";

export default async function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    return (
        <div className="marketing-scope min-h-screen flex flex-col">
            <Nav
                isLoggedIn={session !== null}
                showAnchorLinks
                showThemeToggle={false}
            />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
