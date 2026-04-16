import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@woohoo/ui";
import { APP_TITLE, APP_DESCRIPTION } from "@/lib/constants";

export function Hero() {
    return (
        <section className="mx-auto flex max-w-4xl flex-col items-center px-4 py-32 text-center sm:py-40">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl leading-[1.05]">
                {APP_TITLE}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
                {APP_DESCRIPTION}
            </p>

            <div className="mt-10">
                <Link href="/sign-up">
                    <Button size="lg" className="group h-12 px-7 text-base">
                        Start for free
                        <ArrowRight
                            className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
                            strokeWidth={2.5}
                        />
                    </Button>
                </Link>
            </div>
        </section>
    );
}
