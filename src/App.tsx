import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLeads from "./pages/AdminLeads";
import Incentivi from "./pages/Incentivi";
import Auth from "./pages/Auth";
import Notifiche from "./pages/Notifiche";
import IntroLoader from "./components/IntroLoader";
import { CustomCursor } from "./components/CustomCursor";
import { TerminalConsole } from "./components/TerminalConsole";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
          <ScrollToTop />
          <TerminalConsole />
          {showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminLeads />} />
            <Route path="/incentivi" element={<Incentivi />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/notifiche" element={<Notifiche />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
