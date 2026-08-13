type PublicPageHeroProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  introduction: string;
};

export const PublicPageHero = ({ eyebrow, title, accent, introduction }: PublicPageHeroProps) => (
  <header className="public-page-hero">
    <p className="dy-eyebrow">{eyebrow}</p>
    <h1>{title}{accent && <em>{accent}</em>}</h1>
    <p>{introduction}</p>
  </header>
);
