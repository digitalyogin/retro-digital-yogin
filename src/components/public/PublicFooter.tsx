import { Link } from "react-router-dom";

export const PublicFooter = () => (
  <footer className="dy-footer">
    <Link to="/" className="public-brand">
      <span className="public-brand-mark" aria-hidden="true" /> DIGITALYOGIN
    </Link>
    <p>Strategia · Design · Development</p>
    <div>
      <Link to="/blog">Blog</Link>
      <Link to="/progetti">Progetti</Link>
      <Link to="/chi-siamo">Chi siamo</Link>
      <Link to="/contatti">Contatti</Link>
    </div>
    <span>© {new Date().getFullYear()} DIGITAL YOGIN</span>
  </footer>
);
