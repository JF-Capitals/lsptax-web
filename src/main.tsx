import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "./components/ui/toaster.tsx";

// Initialize AOS
AOS.init({
  offset: 200, // Distance from top
  duration: 800, // Animation duration
  easing: "ease-in-out", // Easing
  once: false, // Whether animation should only run once
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <App />
  </StrictMode>
);
