import React, { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RetroLayout } from "./components/RetroLayout";
import { PublicLayout } from "./components/public/PublicLayout";
import IntroLoader from "./components/IntroLoader";
import { ScrollToTop } from "./components/ScrollToTop";
import {
  getTuriyaIntroDone,
  TURIYA_ONBOARDING_EVENT,
} from "@/lib/preferences/storage";

const queryClient = new QueryClient();

const HomeV2 = lazy(() => import("./pages/HomeV2"));
const QuickScan = lazy(() => import("./pages/QuickScan"));
const FullReport = lazy(() => import("./pages/FullReport"));
const History = lazy(() => import("./pages/History"));
const ExportPage = lazy(() => import("./pages/ExportPage"));
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));
const ChiSiamo = lazy(() => import("./pages/ChiSiamo"));
const ProgettiPage = lazy(() => import("./pages/ProgettiPage"));
const ProgettoDettaglio = lazy(() => import("./pages/ProgettoDettaglio"));
const Contatti = lazy(() => import("./pages/Contatti"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const Incentivi = lazy(() => import("./pages/Incentivi"));
const Auth = lazy(() => import("./pages/Auth"));
const Notifiche = lazy(() => import("./pages/Notifiche"));
const ScrollStoryLab = lazy(() => import("./pages/ScrollStoryLab"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteFallback = () => (
  <div className="min-h-screen grid place-items-center bg-black text-primary font-terminal">
    INITIALIZING...
  </div>
);

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
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public institutional home */}
            <Route path="/" element={<PublicLayout><HomeV2 /></PublicLayout>} />

            {/* Terminal-style tools and compatibility routes */}
            <Route path="/tools/oracle" element={<RetroLayout><QuickScan /></RetroLayout>} />
            <Route path="/01" element={<RetroLayout><QuickScan /></RetroLayout>} />
            <Route path="/02" element={<RetroLayout><FullReport /></RetroLayout>} />
            <Route path="/03" element={<RetroLayout><History /></RetroLayout>} />
            <Route path="/04" element={<RetroLayout><ExportPage /></RetroLayout>} />
            <Route path="/09" element={<RetroLayout><Settings /></RetroLayout>} />
            <Route path="/99" element={<RetroLayout><About /></RetroLayout>} />
            <Route path="/chi-siamo" element={<PublicLayout><ChiSiamo /></PublicLayout>} />
            <Route path="/progetti" element={<PublicLayout><ProgettiPage /></PublicLayout>} />
            <Route path="/progetti/:slug" element={<PublicLayout><ProgettoDettaglio /></PublicLayout>} />
            <Route path="/contatti" element={<PublicLayout><Contatti /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><BlogIndex /></PublicLayout>} />
            <Route path="/blog/:slug" element={<PublicLayout><BlogArticle /></PublicLayout>} />
            
            {/* Standalone routes */}
            <Route path="/admin" element={<AdminLeads />} />
            <Route path="/incentivi" element={<Incentivi />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/notifiche" element={<Notifiche />} />
            <Route path="/lab/scroll-story" element={<PublicLayout><ScrollStoryLab /></PublicLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
