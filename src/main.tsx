import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "./components/ui/toaster.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

// Initialize AOS
AOS.init({
  offset: 200, // Distance from top
  duration: 800, // Animation duration
  easing: "ease-in-out", // Easing
  once: false, // Whether animation should only run once
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Toaster />
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
