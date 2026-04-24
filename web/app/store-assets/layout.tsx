import "../(marketing)/_landing/styles.css";
import "./store-assets.css";

export default function StoreAssetsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="marketing-scope">{children}</div>;
}
