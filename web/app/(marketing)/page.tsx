import "./_landing/styles.css";

import { Hero } from "./_landing/sections/Hero";
import { Strip } from "./_landing/sections/Strip";
import { Problem } from "./_landing/sections/Problem";
import { HowItWorks } from "./_landing/sections/HowItWorks";
import { ThreadMock } from "./_landing/sections/ThreadMock";
import { Dashboard } from "./_landing/sections/Dashboard";
import { IsIsnt } from "./_landing/sections/IsIsnt";
import { Pricing } from "./_landing/sections/Pricing";
import { Faq } from "./_landing/sections/Faq";
import { CtaBig } from "./_landing/sections/CtaBig";

export default function LandingPage() {
    return (
        <div className="landing">
            <div className="page">
                <Hero />
                <Strip />
                <Problem />
                <HowItWorks />
                <ThreadMock />
                <Dashboard />
                <IsIsnt />
                <Pricing />
                <Faq />
                <CtaBig />
            </div>
        </div>
    );
}
