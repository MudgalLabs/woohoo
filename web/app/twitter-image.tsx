import { ImageResponse } from "next/og";

import { OgBanner, getOgFonts } from "@/lib/og-banner";

export const alt =
    "Woohoo — a follow-up tool for the DMs and comments that matter.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    const fonts = await getOgFonts();
    return new ImageResponse(<OgBanner />, {
        ...size,
        // @ts-expect-error — next/og's fonts typing is stricter than the runtime accepts
        fonts,
    });
}
