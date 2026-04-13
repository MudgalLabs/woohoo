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
