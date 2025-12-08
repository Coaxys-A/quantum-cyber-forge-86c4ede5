import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PerformanceProvider } from "@/components/PerformanceProvider";
import { AppRouter } from "@/lib/app-router";
import { LocaleDetectionBanner } from "@/components/LocaleDetectionBanner";
import { initializeLanguage } from "@/lib/ip-language-detector";
import i18n from "@/lib/i18n";

// Configure QueryClient with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize language detection on app load (non-blocking)
    initializeLanguage(i18n);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <LocaleDetectionBanner />
              <AppRouter />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </PerformanceProvider>
    </QueryClientProvider>
  );
};

export default App;
