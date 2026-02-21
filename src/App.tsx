import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RetroLayout } from "./components/RetroLayout";
import QuickScan from "./pages/QuickScan";
import FullReport from "./pages/FullReport";
import History from "./pages/History";
import ExportPage from "./pages/ExportPage";
import Settings from "./pages/Settings";
import About from "./pages/About";
import AdminLeads from "./pages/AdminLeads";
import Incentivi from "./pages/Incentivi";
import Auth from "./pages/Auth";
import Notifiche from "./pages/Notifiche";
import NotFound from "./pages/NotFound";
import IntroLoader from "./components/IntroLoader";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

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
            <Route path="/02" element={<RetroLayout><FullReport /></RetroLayout>} />
            <Route path="/03" element={<RetroLayout><History /></RetroLayout>} />
            <Route path="/04" element={<RetroLayout><ExportPage /></RetroLayout>} />
            <Route path="/09" element={<RetroLayout><Settings /></RetroLayout>} />
            <Route path="/99" element={<RetroLayout><About /></RetroLayout>} />
            
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
