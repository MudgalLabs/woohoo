export function queryAllDeep(selector: string, root = document) {
    const results: HTMLElement[] = [];

    function traverse(node: any) {
        if (!node) return;

        if (node.querySelectorAll) {
            results.push(...node.querySelectorAll(selector));
        }

        // Traverse shadow roots.
        const children = node.querySelectorAll?.("*") || [];
        children.forEach((el: any) => {
            if (el.shadowRoot) {
                traverse(el.shadowRoot);
            }
        });
    }

    traverse(root);
    return results;
}

export function isVisible(el: Element | null): boolean {
    if (!el) return false;

    const rect = el.getBoundingClientRect();

    return (
        rect.width > 0 &&
        rect.height > 0 &&
        window.getComputedStyle(el).visibility !== "hidden" &&
        window.getComputedStyle(el).display !== "none"
    );
}
