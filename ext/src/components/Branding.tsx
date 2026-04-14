import { Logo } from "@/components/Logo";

interface BrandingProps {
    logoSize?: number;
    textSize?: number;
}

export function Branding(props: BrandingProps) {
    const { logoSize = 12, textSize = 12 } = props;
    return (
        <div className="cb-branding-box">
            <Logo height={logoSize} />
            <p style={{ fontSize: textSize }}>CircleBack</p>
        </div>
    );
}
