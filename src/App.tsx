import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RetroLayout } from "./components/RetroLayout";
import QuickScan from "./pages/QuickScan";
import ChiSiamo from "./pages/ChiSiamo";
import ProgettiOnline from "./pages/ProgettiOnline";
import ProgettoDettaglio from "./pages/ProgettoDettaglio";
import Contatti from "./pages/Contatti";
import Blog from "./pages/Blog";
import BlogDettaglio from "./pages/BlogDettaglio";
import AdminLeads from "./pages/AdminLeads";
import Incentivi from "./pages/Incentivi";
import Auth from "./pages/Auth";
import Notifiche from "./pages/Notifiche";
import NotFound from "./pages/NotFound";
import IntroLoader from "./components/IntroLoader";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(() => {
    return localStorage.getItem('introSeen') !== 'true';
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          {showIntro && <IntroLoader onComplete={() => { setShowIntro(false); window.scrollTo(0, 0); }} />}
          <Routes>
            {/* Terminal-style routes with RetroLayout */}
            <Route path="/" element={<RetroLayout><QuickScan /></RetroLayout>} />
            <Route path="/01" element={<RetroLayout><QuickScan /></RetroLayout>} />
            <Route path="/02" element={<RetroLayout><ChiSiamo /></RetroLayout>} />
            <Route path="/03" element={<RetroLayout><ProgettiOnline /></RetroLayout>} />
            <Route path="/03/:slug" element={<RetroLayout><ProgettoDettaglio /></RetroLayout>} />
            <Route path="/04" element={<RetroLayout><Contatti /></RetroLayout>} />
            <Route path="/05" element={<RetroLayout><Blog /></RetroLayout>} />
            <Route path="/05/:slug" element={<RetroLayout><BlogDettaglio /></RetroLayout>} />
            
            {/* Standalone routes */}
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
