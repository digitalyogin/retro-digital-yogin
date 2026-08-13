import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CommandCenter } from "@/components/CommandCenter";
import { PublicFooter } from "./PublicFooter";
import "@/styles/home-v2.css";
import "@/styles/public-pages.css";

type PublicLayoutProps = {
  children: ReactNode;
};

const TURIYA_NAV_ITEMS = [
  { code: "00", label: "HOME", path: "/" },
  { code: "01", label: "QUICK_SCAN", path: "/tools/oracle" },
  { code: "05", label: "CHI_SIAMO", path: "/chi-siamo" },
  { code: "06", label: "PROGETTI", path: "/progetti" },
  { code: "07", label: "CONTATTI", path: "/contatti" },
  { code: "08", label: "BLOG", path: "/blog" },
  { code: "09", label: "SETTINGS", path: "/09" },
];

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isHome || !location.hash) return;
    let attempts = 0;
    let frame = 0;
    const scrollToAnchor = () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        window.requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
        return;
      }
      if (attempts++ < 30) frame = window.requestAnimationFrame(scrollToAnchor);
    };
    frame = window.requestAnimationFrame(scrollToAnchor);
    return () => window.cancelAnimationFrame(frame);
  }, [isHome, location.hash]);

  return (
    <div className="public-shell min-h-screen bg-black text-foreground">
      <header className="public-nav">
        <Link to="/" className="public-brand" aria-label="Digital Yogin — Home">
          <span className="public-brand-mark" aria-hidden="true" />
          DIGITALYOGIN
        </Link>

        <nav className="public-nav-links" aria-label="Navigazione principale">
          <a href={isHome ? "#filosofia" : "/#filosofia"}>Filosofia</a>
          <a href={isHome ? "#servizi" : "/#servizi"}>Servizi</a>
          <a href={isHome ? "#portfolio" : "/#portfolio"}>Portfolio</a>
          <Link to="/contatti">Inizia</Link>
        </nav>
      </header>

      <main>{children}</main>

      <PublicFooter />

      <div className="public-turiya-launcher">
        <span className="public-turiya-status" aria-hidden="true" />
        <span className="public-turiya-label">TURIYA_ONLINE</span>
        <CommandCenter navItems={TURIYA_NAV_ITEMS} onNavigate={navigate} />
      </div>
    </div>
  );
};
