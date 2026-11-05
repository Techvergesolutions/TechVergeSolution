import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./styles/fonts.css";
import App from "./App.tsx";
import "./index.css";

// The initial HTML contains route-specific schema for crawlers. React owns
// those schemas after startup, so remove them before client-side navigation.
document.querySelectorAll("script[data-prerender-jsonld]").forEach((script) => script.remove());

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
