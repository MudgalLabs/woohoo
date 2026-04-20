interface BrandingProps {
    logoSize?: number;
    textSize?: number;
}

export function Branding(props: BrandingProps) {
    const { textSize = 12 } = props;
    return (
        <div className="cb-branding-box">
            <p style={{ fontSize: textSize }}>woohoo</p>
        </div>
    );
}
