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
import ChiSiamo from "./pages/ChiSiamo";
import ProgettiPage from "./pages/ProgettiPage";
import ProgettoDettaglio from "./pages/ProgettoDettaglio";
import Contatti from "./pages/Contatti";
import BlogIndex from "./pages/BlogIndex";
import BlogArticle from "./pages/BlogArticle";
import AdminLeads from "./pages/AdminLeads";
import Incentivi from "./pages/Incentivi";
import Auth from "./pages/Auth";
import Notifiche from "./pages/Notifiche";
import NotFound from "./pages/NotFound";
import IntroLoader from "./components/IntroLoader";
import { ScrollToTop } from "./components/ScrollToTop";
import {
  getTuriyaIntroDone,
  TURIYA_ONBOARDING_EVENT,
} from "@/lib/preferences/storage";

const queryClient = new QueryClient();

const shouldShowIntroOnLoad = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("introSeen") !== "true";
  } catch {
    return false;
  }
};

const App = () => {
  const [showIntro, setShowIntro] = useState(shouldShowIntroOnLoad);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          {showIntro && (
            <IntroLoader
              onComplete={() => {
                setShowIntro(false);
                if (!getTuriyaIntroDone() && typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent(TURIYA_ONBOARDING_EVENT));
                }
                if (typeof window !== "undefined") {
                  window.scrollTo(0, 0);
                }
              }}
            />
          )}
          <Routes>
            {/* Terminal-style routes with RetroLayout */}
            <Route path="/" element={<RetroLayout><QuickScan /></RetroLayout>} />
            <Route path="/01" element={<RetroLayout><QuickScan /></RetroLayout>} />
            <Route path="/02" element={<RetroLayout><FullReport /></RetroLayout>} />
            <Route path="/03" element={<RetroLayout><History /></RetroLayout>} />
            <Route path="/04" element={<RetroLayout><ExportPage /></RetroLayout>} />
            <Route path="/09" element={<RetroLayout><Settings /></RetroLayout>} />
            <Route path="/99" element={<RetroLayout><About /></RetroLayout>} />
            <Route path="/chi-siamo" element={<RetroLayout><ChiSiamo /></RetroLayout>} />
            <Route path="/progetti" element={<RetroLayout><ProgettiPage /></RetroLayout>} />
            <Route path="/progetti/:slug" element={<RetroLayout><ProgettoDettaglio /></RetroLayout>} />
            <Route path="/contatti" element={<RetroLayout><Contatti /></RetroLayout>} />
            <Route path="/blog" element={<RetroLayout><BlogIndex /></RetroLayout>} />
            <Route path="/blog/:slug" element={<RetroLayout><BlogArticle /></RetroLayout>} />
            
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
