import { createRoot } from "react-dom/client";

import styles from "@/content/views/App.css?inline";
import { Toast } from "@/components/Toast";

const HOST_ID = "woohoo-toast-host";

export function mountToast(): void {
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

    createRoot(root).render(<Toast />);
}
