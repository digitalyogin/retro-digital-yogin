import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { PublicFooter } from "./PublicFooter";
import "@/styles/home-v2.css";
import "@/styles/public-pages.css";

type PublicLayoutProps = {
  children: ReactNode;
};

export const PublicLayout = ({ children }: PublicLayoutProps) => {
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

    </div>
  );
};
