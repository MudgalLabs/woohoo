import { cn } from "@/lib/utils";

type BrandIconProps = {
    className?: string;
    size?: number | string;
};

function sizeAttrs(size: number | string | undefined) {
    return size !== undefined ? { width: size, height: size } : {};
}

function BrandImage({
    src,
    className,
    size,
    defaultSize,
}: BrandIconProps & { src: string; defaultSize: string }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element -- static SVG; next/image adds no benefit for vector icons
        <img
            src={src}
            alt=""
            aria-hidden="true"
            className={cn(!size && !className && defaultSize, className)}
            {...sizeAttrs(size)}
        />
    );
}

export function GoogleIcon(props: BrandIconProps) {
    return <BrandImage src="/brand/google.svg" defaultSize="size-5" {...props} />;
}

export function ChromeIcon(props: BrandIconProps) {
    return <BrandImage src="/brand/chrome.svg" defaultSize="size-10" {...props} />;
}

export function FirefoxIcon(props: BrandIconProps) {
    return <BrandImage src="/brand/firefox.svg" defaultSize="size-10" {...props} />;
}

export function GithubIcon({ className, size }: BrandIconProps) {
    const style =
        size !== undefined
            ? { width: size, height: size }
            : undefined;
    return (
        <span
            aria-hidden="true"
            style={{
                ...style,
                maskImage: "url(/brand/github.svg)",
                WebkitMaskImage: "url(/brand/github.svg)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
            }}
            className={cn(
                "inline-block bg-current",
                !size && !className && "size-5",
                className,
            )}
        />
    );
}
