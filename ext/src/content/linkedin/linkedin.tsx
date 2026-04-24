import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// NOTE: App.css is NOT imported globally — each mount helper pulls it in
// as an inline string and scopes it to its own shadow root. Importing the
// stylesheet here would have crxjs declare it on content_scripts.css and
// leak generic selectors (:root, .opacity-0, etc.) into LinkedIn's DOM.
import App from "@/content/linkedin/views/App.tsx";
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
mountHowTo({ platform: "linkedin" });
