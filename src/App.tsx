import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppRouter } from "@/lib/app-router";
import { LocaleDetectionBanner } from "@/components/LocaleDetectionBanner";
import { initializeLanguage } from "@/lib/ip-language-detector";
import i18n from "@/lib/i18n";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize language detection on app load
    initializeLanguage(i18n);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
