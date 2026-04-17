import { Globe } from "lucide-react";

interface PlatformIconProps {
    platform: string;
    size?: number;
    className?: string;
}

export function PlatformIcon({ platform, size = 18, className }: PlatformIconProps) {
    switch (platform.toLowerCase()) {
        case "reddit":
            return (
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    width={size}
                    height={size}
                    fill="#FF4500"
                    aria-label="Reddit"
                    className={className}
                >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.983 0 1.78.797 1.78 1.78 0 .724-.435 1.343-1.053 1.614a3.111 3.111 0 0 1 .04.52c0 2.654-3.088 4.808-6.9 4.808-3.812 0-6.9-2.154-6.9-4.808 0-.174.014-.347.04-.52-.617-.27-1.052-.89-1.052-1.614 0-.983.797-1.78 1.78-1.78.477 0 .9.182 1.207.49 1.207-.868 2.88-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.111-.701zM9.25 12c-.687 0-1.249.561-1.249 1.25 0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
            );
        default:
            return <Globe size={size} className={className} />;
    }
}

export function peerHandle(platform: string, peerId: string): string {
    switch (platform.toLowerCase()) {
        case "reddit":
            return `u/${peerId}`;
        default:
            return peerId;
    }
}

export function peerProfileUrl(
    platform: string,
    peerId: string,
): string | null {
    switch (platform.toLowerCase()) {
        case "reddit":
            return `https://www.reddit.com/user/${peerId}/`;
        default:
            return null;
    }
}
