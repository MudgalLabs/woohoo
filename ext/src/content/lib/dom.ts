export function queryAllDeep(
    selector: string,
    root: HTMLElement | Document = document,
) {
    const results: HTMLElement[] = [];

    function traverse(node: any) {
        if (!node) return;

        // Check node itself.
        if (node.shadowRoot) {
            traverse(node.shadowRoot);
        }

        // Normal query.
        if (node.querySelectorAll) {
            results.push(...node.querySelectorAll(selector));
        }

        // Traverse children.
        const children = node.children || [];
        for (const child of children) {
            traverse(child);
        }
    }

    traverse(root);
    return results;
}

export function closestDeep(
    element: HTMLElement,
    selector: string,
): HTMLElement | null {
    let current: any = element;

    while (current) {
        if (current.matches && current.matches(selector)) {
            return current;
        }

        // Normal DOM parent.
        if (current.parentElement) {
            current = current.parentElement;
            continue;
        }

        const root = current.getRootNode?.();
        if (root && (root as ShadowRoot).host) {
            current = (root as ShadowRoot).host;
        } else {
            return null;
        }
    }

    return null;
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

let shadowRoot: ShadowRoot | null = null;

export function getShadowRoot() {
    if (shadowRoot) return shadowRoot;

    const container = document.createElement("div");
    container.id = "circleback-root";
    document.body.appendChild(container);

    shadowRoot = container.attachShadow({ mode: "open" });

    const app = document.createElement("div");
    shadowRoot.appendChild(app);

    return shadowRoot;
}

export function cleanHTML(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove unwanted attributes
    doc.body.querySelectorAll("*").forEach((el) => {
        // remove class, style, data-*
        el.removeAttribute("class");
        el.removeAttribute("style");

        [...el.attributes].forEach((attr) => {
            if (attr.name.startsWith("data-")) {
                el.removeAttribute(attr.name);
            }
        });
    });

    // Remove comments (this fixes your <!--?--> issue)
    const walker = document.createTreeWalker(
        doc.body,
        NodeFilter.SHOW_COMMENT,
        null,
    );

    const comments: Comment[] = [];
    while (walker.nextNode()) {
        comments.push(walker.currentNode as Comment);
    }

    comments.forEach((c) => c.remove());

    return doc.body.innerHTML.trim();
}

export function withLineBreaks(html: string) {
    return html.replace(/\n/g, "<br/>");
}

export function normalizeLinks(html: string) {
    return html.replace(/<a\s+([^>]*href="[^"]+"[^>]*)>/gi, (_, attrs) => {
        // remove existing target/rel to avoid duplicates
        let cleanAttrs = attrs
            .replace(/\s*target="[^"]*"/gi, "")
            .replace(/\s*rel="[^"]*"/gi, "");

        return `<a ${cleanAttrs} target="_blank" rel="noopener noreferrer">`;
    });
}
