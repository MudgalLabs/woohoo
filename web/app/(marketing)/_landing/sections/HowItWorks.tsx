import Image from "next/image";
import { DemoChatBubble } from "../demo/DemoChatBubble";
import { DemoFollowUpChip } from "../demo/DemoFollowUpChip";
import { PlatformIcon } from "@/components/PlatformIcon";
import { stepTwoMessages, stepThreeFollowUp } from "../demo/mocks";

function SurfaceBadge({ surface }: { surface: "reddit" | "woohoo" }) {
    if (surface === "reddit") {
        return (
            <span className="step-surface step-surface--reddit">
                <span className="step-surface__mark" aria-hidden>
                    <PlatformIcon platform="reddit" size={14} />
                </span>
                In your Reddit tab
            </span>
        );
    }
    return (
        <span className="step-surface step-surface--woohoo">
            <span className="step-surface__mark" aria-hidden>
                W
            </span>
            In Woohoo
        </span>
    );
}

export function HowItWorks() {
    return (
        <section className="section" id="how">
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> how it works
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        From{" "}
                        <span className="italic-serif">
                            &ldquo;oh interesting&rdquo;
                        </span>{" "}
                        to followed up <span className="mark">in seconds.</span>
                    </h2>
                    <p>
                        No tab switching. No copy-paste. No &ldquo;I&rsquo;ll
                        log it later.&rdquo; The extension works right inside
                        Reddit.
                    </p>
                </div>

                <div className="steps">
                    <div className="step">
                        <SurfaceBadge surface="reddit" />
                        <div className="header">
                            <div className="num">1</div>
                            <h3>Capture</h3>
                        </div>
                        <p>
                            Save any DM or comment in one click. The extension
                            captures everything that matters.
                        </p>
                        <div className="illo illo-screenshot">
                            <Image
                                src="/landing/ext-save-comment.png"
                                alt="The Woohoo extension's Save Comment dialog open on a Reddit comment, showing the comment preview and an optional follow-up picker."
                                width={1684}
                                height={1024}
                                sizes="(max-width: 900px) 100vw, 360px"
                            />
                        </div>
                    </div>

                    <div className="step">
                        <SurfaceBadge surface="woohoo" />
                        <div className="header">
                            <div className="num">2</div>
                            <h3>Organize</h3>
                        </div>
                        <p>
                            Open Woohoo — every DM and comment is grouped by
                            person, automatically.
                        </p>
                        <div className="illo illo-stack">
                            <DemoChatBubble
                                item={stepTwoMessages[0].item}
                                isFromPeer={stepTwoMessages[0].isFromPeer}
                            />
                            <DemoChatBubble
                                item={stepTwoMessages[1].item}
                                isFromPeer={stepTwoMessages[1].isFromPeer}
                            />
                        </div>
                    </div>

                    <div className="step">
                        <SurfaceBadge surface="woohoo" />
                        <div className="header">
                            <div className="num">3</div>
                            <h3>Follow up</h3>
                        </div>
                        <p>
                            Set a date. Woohoo reminds you at 8am — in-app,
                            or in your inbox on Pro — so nothing slips through.
                        </p>
                        <div className="illo">
                            <div className="illo-followup">
                                <DemoFollowUpChip
                                    followUpAt={stepThreeFollowUp}
                                />
                                <span className="illo-followup-caption">
                                    reminded where you&rsquo;ll see it.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
