import { ArticleCard } from "@/components/public/ArticleCard";
import { PublicCTA } from "@/components/public/PublicCTA";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { blogArticles } from "@/content/blog/articles";

const BlogIndex = () => (
  <div className="public-page">
    <PublicPageHero
      eyebrow="PENSIERO · PRODOTTO · TECNOLOGIA"
      title="Idee per orientarsi nel"
      accent="cambiamento digitale."
      introduction="Approfondimenti su sviluppo, design, branding e strategia: l'archivio editoriale di Digital Yogin."
    />
    <section className="public-page-section public-article-grid" aria-label="Archivio articoli">
      {blogArticles.map((article) => <ArticleCard article={article} key={article.slug} />)}
    </section>
    <PublicCTA />
  </div>
);

export default BlogIndex;
