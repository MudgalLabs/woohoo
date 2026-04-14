import { createRoot } from "react-dom/client";
import { ComponentType } from "react";

import styles from "@/content/views/App.css?inline";

export function mount(
    container: HTMLElement,
    Comp: ComponentType<any>,
    props: Record<string, any> = {},
) {
    const root = createRoot(container);

    root.render(<Comp {...props} />);
}

export function mountWithShadow(
    el: HTMLElement,
    Comp: ComponentType<any>,
    props: Record<string, any> = {},
) {
    const shadow = el.attachShadow({ mode: "open" });

    const root = document.createElement("div");
    shadow.appendChild(root);

    const style = document.createElement("style");
    style.textContent = styles;
    shadow.appendChild(style);

    createRoot(root).render(<Comp {...props} />);
}
