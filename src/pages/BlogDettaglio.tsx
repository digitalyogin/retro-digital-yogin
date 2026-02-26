import { useParams, useNavigate } from "react-router-dom";
import { blogArticles } from "@/lib/blogData";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";

const BlogDettaglio = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-primary text-xl font-terminal">ERROR_404: ARTICLE_NOT_FOUND</p>
        <button onClick={() => navigate("/05")} className="mt-4 text-accent hover:text-primary transition-colors font-terminal">
          {'>'} BACK_TO_BLOG
        </button>
      </div>
    );
  }

  return (
    <article className="py-12 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/05")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-terminal text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK_TO_BLOG
        </button>

        {/* Header */}
        <header className="mb-8 border-b border-primary pb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs border border-accent/50 px-2 py-0.5 text-accent">
              {article.category.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">{article.date}</span>
            <span className="text-xs text-muted-foreground">by {article.author}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-primary text-glow leading-tight">
            {article.title}
          </h1>
        </header>

        {/* Hero image */}
        <div className="w-full h-64 md:h-96 overflow-hidden relative mb-10 border border-primary">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
          }} />
          <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-green max-w-none
          prose-headings:text-primary prose-headings:font-terminal
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-primary/30 prose-h2:pb-2
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-h4:text-lg prose-h4:text-accent
          prose-p:text-muted-foreground prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
          prose-strong:text-foreground
          prose-em:text-accent/80
          prose-li:text-muted-foreground prose-li:text-base
          prose-a:text-accent prose-a:no-underline hover:prose-a:text-primary
          prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:bg-card prose-blockquote:py-2 prose-blockquote:px-4
          prose-img:border prose-img:border-primary/30 prose-img:rounded-none prose-img:my-6 prose-img:max-w-md prose-img:w-full prose-img:mx-auto
          prose-table:border prose-table:border-primary/30
          prose-th:text-primary prose-th:border-primary/30
          prose-td:border-primary/30
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-primary">
          <button
            onClick={() => navigate("/05")}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-terminal"
          >
            <ArrowLeft className="w-4 h-4" />
            {'>'} RETURN_TO_ARCHIVE
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogDettaglio;
