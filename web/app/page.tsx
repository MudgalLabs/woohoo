import { getSession } from "@/lib/get-session";
import { Nav } from "@/app/components/home/Nav";
import { Hero } from "@/app/components/home/Hero";

export default async function Home() {
    const session = await getSession();

    return (
        <>
            <Nav isLoggedIn={session !== null} />
            <Hero />
        </>
    );
}
