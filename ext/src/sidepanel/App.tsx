import crxLogo from "@/assets/logo.svg";
import HelloWorld from "@/components/HelloWorld";
import "./App.css";

export default function App() {
    return (
        <div>
            <a
                href="https://crxjs.dev/vite-plugin"
                target="_blank"
                rel="noreferrer"
            >
                <img src={crxLogo} className="logo crx" alt="crx logo" />
            </a>
            <HelloWorld msg="Vite + React + CRXJS" />
        </div>
    );
}
