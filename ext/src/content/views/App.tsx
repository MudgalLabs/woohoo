import { useEffect, useState } from "react";

import "@/content/views/App.css";
import { observeActiveRedditDM } from "@/content/reddit/dm";

function App() {
    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    const [active, setActive] = useState<null | string>(null);

    useEffect(() => {
        const cleanup = observeActiveRedditDM((username) => {
            setActive(username);
        });

        return cleanup;
    }, []);

    return (
        <div className="popup-container">
            {show && (
                <div
                    className={`popup-content ${show ? "opacity-100" : "opacity-0"}`}
                >
                    <h1>This is from CircleBack</h1>
                    <span>Active: {active}</span>
                </div>
            )}

            <button
                className="toggle-button flex items-center justify-center bg-red-400!"
                onClick={toggle}
            ></button>
        </div>
    );
}

export default App;
