export function RedditGlyph({ size = 14 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
        >
            <circle cx="12" cy="12" r="11" />
            <path
                fill="#fff"
                d="M17.5 11.2a1.7 1.7 0 0 0-2.9-1.2c-1-.7-2.4-1.1-3.9-1.1l.8-3.3 2.4.5a1.2 1.2 0 1 0 .1-.7l-2.7-.6c-.1 0-.2 0-.2.2l-.9 3.9c-1.5 0-2.9.5-3.9 1.1a1.7 1.7 0 1 0-1.9 2.8 3 3 0 0 0 0 .6c0 2.3 2.7 4.2 6 4.2s6-1.9 6-4.2a3 3 0 0 0 0-.6 1.7 1.7 0 0 0 1.1-1.6zM9 13a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-4.8 1.7a.3.3 0 0 1 .4 0 3.4 3.4 0 0 0 2.4.8 3.4 3.4 0 0 0 2.4-.8.3.3 0 0 1 .5.5 4 4 0 0 1-2.9 1 4 4 0 0 1-2.9-1 .3.3 0 0 1 .1-.5z"
            />
        </svg>
    );
}

export function Flourish() {
    return (
        <svg
            className="flourish"
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            aria-hidden
        >
            <path
                d="M4 40 C 20 8, 50 8, 66 30 S 108 50, 116 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M112 16 L 116 20 L 112 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
}
