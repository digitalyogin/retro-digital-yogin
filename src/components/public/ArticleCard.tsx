import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { BlogArticle } from "@/content/blog/articles";

export const ArticleCard = ({ article }: { article: BlogArticle }) => (
  <article className="public-article-card">
    <Link to={`/blog/${article.slug}`} className="public-card-image" aria-label={`Leggi ${article.title}`}>
      <img src={article.image} alt={`Immagine di copertina: ${article.title}`} loading="lazy" width="1200" height="675" referrerPolicy="no-referrer" />
    </Link>
    <div className="public-card-body">
      <div className="public-card-meta"><span>{article.category}</span><time>{article.date}</time></div>
      <h2><Link to={`/blog/${article.slug}`}>{article.title}</Link></h2>
      <p>{article.excerpt}</p>
      <div className="public-card-footer"><span>{article.author}</span><Link to={`/blog/${article.slug}`} aria-label={`Leggi ${article.title}`}><ArrowUpRight size={15} /></Link></div>
    </div>
  </article>
);
