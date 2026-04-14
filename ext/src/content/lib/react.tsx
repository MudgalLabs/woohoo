import { createRoot } from "react-dom/client";
import { ComponentType } from "react";

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

    // inject base styles if needed
    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, sans-serif; }
    `;
    shadow.appendChild(style);

    createRoot(root).render(<Comp {...props} />);
}
