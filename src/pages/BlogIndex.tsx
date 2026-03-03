import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShuffleText } from "@/components/animation/ShuffleText";
import { blogArticles } from "@/content/blog/articles";
import { CrtTransition } from "@/components/CrtTransition";

const BlogIndex = () => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [targetSlug, setTargetSlug] = useState<string | null>(null);

  const handleArticleClick = useCallback((slug: string) => {
    setTargetSlug(slug);
    setTransitioning(true);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setTransitioning(false);
    if (targetSlug) {
      navigate(`/blog/${targetSlug}`);
    }
  }, [navigate, targetSlug]);

  return (
    <>
      <CrtTransition active={transitioning} onComplete={handleTransitionComplete} />
      <div className="min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <ShuffleText
          as="h1"
          text="BLOG"
          className="text-3xl md:text-5xl font-bold text-primary text-glow font-terminal"
        />
        <ShuffleText as="p" text="Archivio articoli storico Digital Yogin." className="text-lg text-muted-foreground" />

        <div className="grid gap-6 md:grid-cols-2">
          {blogArticles.map((article) => (
            <article
              key={article.slug}
              onClick={() => handleArticleClick(article.slug)}
              className="border border-primary/70 bg-card overflow-hidden cursor-pointer group hover:border-accent transition-all"
            >
              <div className="w-full h-52 overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                  }}
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{article.date}</p>
                  <span className="text-xs border border-primary/30 px-2 py-1 text-primary/90 inline-block">
                    {article.category.toUpperCase()}
                  </span>
                </div>
                <ShuffleText
                  as="h2"
                  text={article.title}
                  className="text-xl text-secondary font-terminal group-hover:text-primary transition-colors"
                />
                <ShuffleText as="p" text={article.excerpt} className="text-foreground/90 leading-relaxed min-h-20" />
                <div className="pt-3 border-t border-primary/30 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">AUTHOR: {article.author}</span>
                  <span className="text-primary text-xs group-hover:translate-x-1 transition-transform">
                    {">"} READ_DETAIL
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default BlogIndex;
