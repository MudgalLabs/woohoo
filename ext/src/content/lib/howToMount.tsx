import { createRoot } from "react-dom/client";

import styles from "@/content/App.css?inline";
import { HowToCard } from "@/components/HowToCard";

const HOST_ID = "woohoo-howto-host";

type Platform = "reddit" | "linkedin";

/**
 * Mounts the floating "How to use Woohoo on <Platform>" card into a shadow
 * DOM host so its styles don't bleed into the host page. Idempotent — a
 * second call is a no-op if the host already exists.
 */
export function mountHowTo(options: {
    platform: Platform;
    theme?: "light" | "dark";
    anchor?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}): void {
    if (document.getElementById(HOST_ID)) return;

    const host = document.createElement("div");
    host.id = HOST_ID;
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });

    const root = document.createElement("div");
    shadow.appendChild(root);

    const style = document.createElement("style");
    style.textContent = styles;
    shadow.appendChild(style);

    createRoot(root).render(<HowToCard {...options} />);
}
