export function queryAllDeep(selector: string, root = document) {
    const results: Element[] = [];

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
