import { ArrowLeft } from "lucide-react";
import { Navigate, Link, useParams } from "react-router-dom";
import { PublicCTA } from "@/components/public/PublicCTA";
import { getArticleBySlug } from "@/content/blog/articles";

type ContentBlock =
  | { kind: "heading"; text: string; level: number }
  | { kind: "paragraph" | "list" | "quote" | "table"; text: string }
  | { kind: "image"; src: string };

const cleanMarkdown = (text: string) => text
  .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
  .replace(/\*\*|__/g, "")
  .replace(/\*|_/g, "")
  .trim();

const parseMarkdownToBlocks = (content: string): ContentBlock[] => content
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const image = line.match(/^!\[[^\]]*\]\((https?:\/\/[^)]+)\)$/);
    if (image) return { kind: "image" as const, src: image[1] };
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) return { kind: "heading" as const, level: heading[1].length, text: cleanMarkdown(heading[2]) };
    if (/^>\s*/.test(line)) return { kind: "quote" as const, text: cleanMarkdown(line.replace(/^>\s*/, "")) };
    if (/^([-*]|\d+\.)\s+/.test(line)) return { kind: "list" as const, text: cleanMarkdown(line.replace(/^([-*]|\d+\.)\s+/, "")) };
    if (/^\|.*\|$/.test(line)) return { kind: "table" as const, text: cleanMarkdown(line.split("|").filter(Boolean).join(" · ")) };
    return { kind: "paragraph" as const, text: cleanMarkdown(line) };
  });

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const contentBlocks = article ? parseMarkdownToBlocks(article.content) : [];

  if (!slug) return <Navigate to="/blog" replace />;
  if (!article) {
    return (
      <div className="public-page public-empty-state">
        <p className="dy-eyebrow">ARTICOLO NON TROVATO</p>
        <h1>Il contenuto richiesto non è disponibile.</h1>
        <Link to="/blog" className="dy-button dy-button-primary"><ArrowLeft size={15} /> Torna al blog</Link>
      </div>
    );
  }

  return (
    <div className="public-page">
      <article className="public-article">
        <Link to="/blog" className="public-back-link"><ArrowLeft size={15} /> Tutti gli articoli</Link>
        <header className="public-article-header">
          <div className="public-card-meta"><span>{article.category}</span><time>{article.date}</time><span>{article.author}</span></div>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
        </header>
        <figure className="public-article-cover">
          <img src={article.image} alt={`Copertina dell'articolo ${article.title}`} width="1600" height="900" referrerPolicy="no-referrer" />
        </figure>
        <section className="public-reading-content">
          {contentBlocks.map((block, index) => {
            const key = `${block.kind}-${index}`;
            if (block.kind === "heading") return block.level <= 2 ? <h2 key={key}>{block.text}</h2> : <h3 key={key}>{block.text}</h3>;
            if (block.kind === "image") return <figure className="public-inline-image" key={key}><img src={block.src} alt="" loading="lazy" width="1200" height="675" referrerPolicy="no-referrer" /></figure>;
            if (block.kind === "quote") return <blockquote key={key}>{block.text}</blockquote>;
            if (block.kind === "list") return <p className="public-list-item" key={key}>{block.text}</p>;
            if (block.kind === "table") return <p className="public-table-row" key={key}>{block.text}</p>;
            return <p key={key}>{block.text}</p>;
          })}
        </section>
      </article>
      <PublicCTA title="Trasformiamo le idee in decisioni." />
    </div>
  );
};

export default BlogArticle;
