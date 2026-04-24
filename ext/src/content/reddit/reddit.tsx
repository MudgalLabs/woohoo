import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// NOTE: App.css is NOT imported globally. It's pulled in as an inline
// string by each mount helper (mountWithShadow, mountToast, mountHowTo)
// and injected into its own shadow root — so generic selectors like
// `.opacity-0` or `:root` variables never leak into the host page's DOM.
import App from "@/content/reddit/views/App.tsx";
import { mountToast } from "@/content/lib/toastMount";
import { mountHowTo } from "@/content/lib/howToMount";

const container = document.createElement("div");
container.id = "woohoo-app";

document.body.appendChild(container);

createRoot(container).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

mountToast();
mountHowTo({ platform: "reddit" });
