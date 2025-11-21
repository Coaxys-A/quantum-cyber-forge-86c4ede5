import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import i18n from "./lib/i18n";
import { initializeLanguage } from "./lib/ip-language-detector";

// Initialize language detection on app load
initializeLanguage(i18n).catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
