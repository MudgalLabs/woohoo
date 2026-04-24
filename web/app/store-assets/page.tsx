import {
    ArrowRight,
    Bookmark,
    Calendar,
    CheckCheck,
    ExternalLink,
    Zap,
} from "lucide-react";
import { PlatformIcon } from "@/components/PlatformIcon";

export const metadata = {
    title: "Store assets",
    robots: { index: false, follow: false },
};

function Frame({
    label,
    dims = "1280×800",
    children,
}: {
    label: string;
    dims?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="sa-frame-wrap">
            <div className="sa-frame-label">
                {label} · {dims}
            </div>
            <div className="sa-frame">{children}</div>
        </div>
    );
}

function SurfaceReddit({ children }: { children: React.ReactNode }) {
    return (
        <div className="sa-surface sa-surface--reddit">
            <span className="sa-surface__mark">
                <PlatformIcon platform="reddit" size={14} />
            </span>
            {children}
        </div>
    );
}

function SurfaceWoohoo({ children }: { children: React.ReactNode }) {
    return (
        <div className="sa-surface sa-surface--woohoo">
            <span className="sa-surface__mark">W</span>
            {children}
        </div>
    );
}

function HandArrow() {
    return (
        <svg
            className="sa-hint-arrow"
            width="42"
            height="54"
            viewBox="0 0 114 144"
            fill="none"
            aria-hidden
        >
            <path
                d="M111.3 141.183C98.6856 139.08 62.6293 133.497 61.7 113.983C61.3133 105.863 65.3815 94.4969 72.1 89.2715C86.5279 78.05 110.476 93.0215 90.5889 106.694C79.4361 114.361 63.501 108.142 52.2778 103.583C35.7341 96.8617 27.8565 83.7242 20.9889 68.1159C17.5012 60.1893 9.72805 19.9966 12.1 21.1826"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <path
                d="M7.30005 6.78264C9.69761 8.08797 27.7313 18.6736 25.7 17.0937C23.0414 15.0259 20.0849 13.1675 17.7 10.7826C14.8785 7.96098 11.3893 5.89418 8.90002 2.78258C6.71568 0.0521464 2.5 17.9588 2.5 21.1827"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function StoreAssetsPage() {
    return (
        <div className="sa-root">
            <div className="sa-instructions">
                <h1>Chrome Web Store screenshot frames</h1>
                <p>
                    Each frame below is exactly 1280×800 (the size CWS wants).
                    Open DevTools, <code>Cmd+Shift+P</code> → &ldquo;Capture
                    node screenshot&rdquo;, click the <code>.sa-frame</code>{" "}
                    element in the Elements panel. You get a pixel-perfect PNG.
                    Upload the 5 frames in order. The 440×280 tile at the
                    bottom is the small promo tile shown in CWS search and
                    category carousels (upload via Developer Dashboard → Store
                    listing → Graphic assets).
                </p>
            </div>

            {/* ======================== FRAME 1 — HERO ======================== */}
            <Frame label="01 · Hero">
                <div className="sa-inner">
                    <div className="sa-copy">
                        <div className="sa-wordmark">woohoo</div>
                        <div className="sa-eyebrow">
                            <span className="dot">●</span> a follow-up tool for
                            DMs and comments
                        </div>
                        <h1 className="sa-headline">
                            Don&rsquo;t let warm conversations{" "}
                            <span className="accent">go cold.</span>
                        </h1>
                        <p className="sa-sub">
                            Capture the DMs and comments that matter. Organized
                            by person. <span className="sa-mark">Follow up</span>{" "}
                            before they forget about you.
                        </p>
                        <div className="sa-cta-row">
                            <span className="sa-btn sa-btn-primary">
                                Start for free
                                <ArrowRight size={14} />
                            </span>
                            <span className="sa-btn sa-btn-ghost">
                                Install the extension
                                <Zap size={14} />
                            </span>
                        </div>
                        <div className="sa-note">
                            Open source · Free forever · No credit card
                        </div>
                    </div>

                    <div className="sa-stage">
                        <div className="sa-stage-col">
                            <SurfaceReddit>In your Reddit tab</SurfaceReddit>
                            <div className="sa-reddit-card">
                                <div className="sa-reddit">
                                    <div className="sa-reddit-top">
                                        <PlatformIcon
                                            platform="reddit"
                                            size={18}
                                        />
                                        <span className="sub">
                                            u/indie_marketer
                                        </span>
                                        <span>· 2h ago · DM</span>
                                    </div>
                                    <div className="sa-reddit-msg">
                                        Hey — saw your comment in r/SaaS.{" "}
                                        <span className="highlight">
                                            I&rsquo;ll try Woohoo this weekend
                                            and send feedback
                                        </span>
                                        , my team&rsquo;s drowning in Reddit
                                        leads rn. Also — do you support
                                        LinkedIn?
                                    </div>
                                    <div className="sa-save-btn">
                                        <Bookmark
                                            size={18}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                </div>
                                <div className="sa-hint" aria-hidden>
                                    <span className="hand">
                                        Save this Reddit DM
                                    </span>
                                    <HandArrow />
                                </div>
                            </div>
                            <div className="sa-caption">
                                Works on Reddit today. LinkedIn and X coming
                                next.
                            </div>
                        </div>
                    </div>
                </div>
            </Frame>

            {/* ======================== FRAME 2 — ONE-CLICK SAVE ======================== */}
            <Frame label="02 · One-click save">
                <div className="sa-inner">
                    <div className="sa-copy">
                        <div className="sa-wordmark">woohoo</div>
                        <div className="sa-eyebrow">
                            <span className="dot">●</span> 1-click capture
                        </div>
                        <h1 className="sa-headline">
                            Save any DM or comment in{" "}
                            <span className="accent">one click.</span>
                        </h1>
                        <p className="sa-sub">
                            Hover, click the bookmark, optionally{" "}
                            <span className="sa-mark">
                                pick a follow-up date
                            </span>
                            . <b>No tab switch.</b> No copy-paste. No
                            spreadsheet.
                        </p>
                    </div>

                    <div className="sa-stage">
                        <div className="sa-stage-col">
                            <SurfaceReddit>In your Reddit tab</SurfaceReddit>
                            <div className="sa-modal-stack">
                                <div className="sa-reddit-thread">
                                    <div className="comment-meta">
                                        <PlatformIcon
                                            platform="reddit"
                                            size={18}
                                        />
                                        <span className="sub">
                                            u/Ok-Professional-6626
                                        </span>
                                        <span>· r/SaaS · 3h ago</span>
                                    </div>
                                    <p className="comment-body">
                                        Hi. This is a good problem to solve. I
                                        am not sure how many folks will pay for
                                        this.{" "}
                                        <span className="highlight">
                                            Share me the link. Would love to
                                            try it out.
                                        </span>{" "}
                                        I have been using Notion to track my
                                        leads.
                                    </p>
                                    <div className="comment-footer">
                                        <span>↑ 12</span>
                                        <span>💬 Reply</span>
                                        <span>↗ Share</span>
                                    </div>
                                </div>

                                <div className="sa-save-modal">
                                    <h4>Save Comment</h4>
                                    <blockquote>
                                        &ldquo;Hi. This is a good problem to
                                        solve. I am not sure how many folks
                                        wil…&rdquo;
                                    </blockquote>
                                    <div className="saving-to">
                                        Saving to{" "}
                                        <b>u/Ok-Professional-6626&rsquo;s</b>{" "}
                                        Woohoo
                                    </div>
                                    <div className="fu-label">
                                        Follow up (optional)
                                    </div>
                                    <div className="fu-btn">
                                        <Calendar size={14} />
                                        <span>Apr 28, 09:00 AM</span>
                                    </div>
                                    <div className="save-cta">Save</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Frame>

            {/* ======================== FRAME 3 — THREADED BY PERSON ======================== */}
            <Frame label="03 · Threaded by person">
                <div className="sa-inner">
                    <div className="sa-copy">
                        <div className="sa-wordmark">woohoo</div>
                        <div className="sa-eyebrow">
                            <span className="dot">●</span> the woohoo detail
                            view
                        </div>
                        <h1 className="sa-headline">
                            Every person,{" "}
                            <span className="accent">one place.</span>
                        </h1>
                        <p className="sa-sub">
                            Saved DMs on one tab, comments on another.
                            Follow-up front and center.{" "}
                            <span className="sa-mark">Jump back</span> to the
                            live DM or comment in one click.
                        </p>
                    </div>

                    <div className="sa-stage">
                        <div className="sa-stage-col">
                            <SurfaceWoohoo>In woohoo</SurfaceWoohoo>
                            <div className="sa-thread">
                                <div className="sa-thread-head">
                                    <div className="avatar-lg">I</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="peer-name">
                                            <PlatformIcon
                                                platform="reddit"
                                                size={16}
                                            />
                                            u/indie_marketer
                                        </div>
                                        <div className="meta-row">
                                            <span>Last interaction 2h ago</span>
                                            <span aria-hidden>·</span>
                                            <span className="open-chat">
                                                Open chat
                                                <ExternalLink size={10} />
                                            </span>
                                        </div>
                                        <div className="sa-fu-chip">
                                            <Calendar size={12} />
                                            Follow up in 3 days
                                        </div>
                                    </div>
                                </div>

                                <div className="sa-tabs">
                                    <div className="tab active">
                                        DMs
                                        <span className="count">3</span>
                                    </div>
                                    <div className="tab">
                                        Comments
                                        <span className="count">2</span>
                                    </div>
                                </div>

                                <div className="sa-day-divider">Yesterday</div>

                                <div className="sa-bubble-row peer">
                                    <div className="sa-bubble">
                                        hey — yeah please ping me. I&rsquo;ll
                                        try Woohoo this weekend btw
                                    </div>
                                    <div className="sa-bubble-time">
                                        2:14 PM
                                    </div>
                                </div>

                                <div className="sa-bubble-row you">
                                    <div className="sa-bubble">
                                        amazing. here&rsquo;s a link w/ a
                                        longer free trial → woohoo.to/friend
                                    </div>
                                    <div className="sa-bubble-time">
                                        2:51 PM
                                    </div>
                                </div>

                                <div className="sa-bubble-row peer">
                                    <div className="sa-bubble">
                                        🙏 will report back Sun
                                    </div>
                                    <div className="sa-bubble-time">
                                        2:53 PM
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Frame>

            {/* ======================== FRAME 4 — DASHBOARD REMINDERS ======================== */}
            <Frame label="04 · Dashboard reminders">
                <div className="sa-inner">
                    <div className="sa-copy">
                        <div className="sa-wordmark">woohoo</div>
                        <div className="sa-eyebrow">
                            <span className="dot">●</span> the dashboard
                        </div>
                        <h1 className="sa-headline">
                            Know exactly{" "}
                            <span className="accent">who to reply to.</span>
                        </h1>
                        <p className="sa-sub">
                            Overdue, due today, going cold — three piles,{" "}
                            <span className="sa-mark">no pipeline</span>. Open
                            it with your morning coffee so nothing slips.
                        </p>
                    </div>

                    <div className="sa-stage">
                        <div className="sa-stage-col">
                            <SurfaceWoohoo>In woohoo</SurfaceWoohoo>
                            <div className="sa-dash">
                                <div className="sa-dash-section">
                                    <div className="sa-dash-head">
                                        <h4>Overdue</h4>
                                        <span className="count overdue">
                                            2
                                        </span>
                                    </div>
                                    <div className="sa-dash-sub">
                                        Follow-up dates that have passed.
                                    </div>
                                    <div className="sa-dash-card overdue">
                                        <div className="sa-avatar">R</div>
                                        <div className="body">
                                            <div className="head">
                                                <div className="handle">
                                                    <PlatformIcon
                                                        platform="reddit"
                                                        size={14}
                                                    />
                                                    u/redditlurker42
                                                </div>
                                                <div className="fu">
                                                    4 days overdue
                                                </div>
                                            </div>
                                            <div className="preview">
                                                &ldquo;I&rsquo;ll try it Sunday
                                                and let you know&rdquo;
                                            </div>
                                            <div className="meta">
                                                1 DM · Saved 6d ago
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="sa-dash-section">
                                    <div className="sa-dash-head">
                                        <h4>Today</h4>
                                        <span className="count">2</span>
                                    </div>
                                    <div className="sa-dash-sub">
                                        Woohoos you planned to follow up on
                                        today.
                                    </div>
                                    <div className="sa-dash-card">
                                        <div className="sa-avatar">I</div>
                                        <div className="body">
                                            <div className="head">
                                                <div className="handle">
                                                    <PlatformIcon
                                                        platform="reddit"
                                                        size={14}
                                                    />
                                                    u/indie_marketer
                                                </div>
                                                <div className="fu">Today</div>
                                            </div>
                                            <div className="preview">
                                                &ldquo;I&rsquo;ll try Woohoo
                                                this weekend and send
                                                feedback&rdquo;
                                            </div>
                                            <div className="meta">
                                                3 DMs · 2 comments · Saved 20h
                                                ago
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sa-dash-card">
                                        <div className="sa-avatar">P</div>
                                        <div className="body">
                                            <div className="head">
                                                <div className="handle">
                                                    <PlatformIcon
                                                        platform="reddit"
                                                        size={14}
                                                    />
                                                    u/product_nerd
                                                </div>
                                                <div className="fu">Today</div>
                                            </div>
                                            <div className="preview">
                                                &ldquo;what&rsquo;s the pricing
                                                for teams? we&rsquo;d be 4
                                                seats to start.&rdquo;
                                            </div>
                                            <div className="meta">
                                                1 DM · 3 comments · Saved 1d
                                                ago
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Frame>

            {/* ======================== FRAME 5 — REMINDERS ======================== */}
            <Frame label="05 · Reminders">
                <div className="sa-inner">
                    <div className="sa-copy">
                        <div className="sa-wordmark">woohoo</div>
                        <div className="sa-eyebrow">
                            <span className="dot">●</span> reminders
                        </div>
                        <h1 className="sa-headline">
                            Three taps on the{" "}
                            <span className="accent">shoulder.</span>
                        </h1>
                        <p className="sa-sub">
                            <b>Extension badge</b> while you browse,{" "}
                            <b>in-app bell</b> when you open Woohoo, and a{" "}
                            <span className="sa-mark">morning email digest</span>{" "}
                            on Pro. Pick your nudge.
                        </p>
                    </div>

                    <div className="sa-stage">
                        <div className="sa-reminders">
                            <div>
                                <div className="sa-toolbar">
                                    <span className="ext-icon" />
                                    <span className="ext-icon" />
                                    <span className="url-pill">
                                        <span>🔒</span> reddit.com/r/SaaS
                                    </span>
                                    <span className="ext-icon woohoo">
                                        W
                                        <span className="ext-badge">3</span>
                                    </span>
                                </div>
                                <div className="sa-toolbar-caption">
                                    <span>
                                        2 overdue, 1 due today — at a glance
                                    </span>
                                    <span>↑</span>
                                </div>
                            </div>

                            <div className="sa-bell">
                                <div className="sa-bell-head">
                                    <span className="sa-bell-title">
                                        Notifications
                                    </span>
                                    <span className="sa-bell-action">
                                        <CheckCheck
                                            size={12}
                                            strokeWidth={2.25}
                                        />
                                        Mark all read
                                    </span>
                                </div>
                                <div className="sa-bell-item unread">
                                    <span className="dot" />
                                    <div className="body">
                                        <p className="title">
                                            Today&rsquo;s Woohoo digest
                                        </p>
                                        <p className="sub">
                                            You have 2 overdue and 1 follow-up
                                            today.
                                        </p>
                                        <p className="time">just now</p>
                                    </div>
                                </div>
                                <div className="sa-bell-item">
                                    <span className="dot empty" />
                                    <div className="body">
                                        <p className="title">
                                            Yesterday&rsquo;s Woohoo digest
                                        </p>
                                        <p className="sub">
                                            You had 1 overdue and 2 follow-ups.
                                        </p>
                                        <p className="time">1d ago</p>
                                    </div>
                                </div>
                            </div>

                            <div className="sa-email">
                                <span className="sender">Woohoo</span>
                                <span className="subject">
                                    <b>2 overdue, 1 today</b>
                                    <span className="preview">
                                        {" "}
                                        — Knock them out while it&rsquo;s fresh.
                                    </span>
                                </span>
                                <span className="pro-tag">Pro</span>
                                <span className="time">8:02 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Frame>

            {/* ======================== PROMO TILE 440×280 ======================== */}
            <div className="sa-frame-wrap">
                <div className="sa-frame-label">Promo tile · 440×280</div>
                <div className="sa-tile">
                    <div className="wordmark">woohoo</div>
                    <div className="tagline">
                        <span className="dot">●</span> a follow-up tool for DMs
                        and comments
                    </div>
                </div>
            </div>
        </div>
    );
}
