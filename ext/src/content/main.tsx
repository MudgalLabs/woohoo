import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/content/views/App.css";
import App from "@/content/views/App.tsx";
import { mountToast } from "@/content/lib/toastMount";

const container = document.createElement("div");
container.id = "woohoo-app";

document.body.appendChild(container);

createRoot(container).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

mountToast();
