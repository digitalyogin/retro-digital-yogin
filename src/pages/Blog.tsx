import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { blogArticles } from "@/lib/blogData";
import { CrtTransition } from "@/components/CrtTransition";

const Blog = () => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [targetSlug, setTargetSlug] = useState<string | null>(null);
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);

  const handleArticleClick = useCallback((slug: string) => {
    setTargetSlug(slug);
    setTransitioning(true);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setTransitioning(false);
    if (targetSlug) {
      navigate(`/05/${targetSlug}`);
    }
  }, [navigate, targetSlug]);

  return (
    <>
      <CrtTransition active={transitioning} onComplete={handleTransitionComplete} />
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-12 border-b-2 border-primary pb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl md:text-6xl font-bold text-primary text-glow">
                BLOG_ARCHIVE
              </h1>
              <span className="text-muted-foreground text-sm">TOTAL: {blogArticles.length}</span>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {blogArticles.map((article, index) => (
              <article
                key={article.slug}
                onClick={() => handleArticleClick(article.slug)}
                className="border border-primary bg-card hover:border-2 hover:border-accent transition-all group relative overflow-hidden cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 1,
                  transition: 'all 0.4s ease-out',
                }}
                onMouseEnter={() => setHoveredArticle(article.slug)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                {/* Article Image */}
                <div className="w-full h-48 overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                  }} />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
                </div>

                <div className="p-6">
                  {hoveredArticle === article.slug && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent" />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <span className="text-xs border border-accent/50 px-2 py-0.5 text-accent">
                        {article.category.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>

                  <h2 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="pt-3 border-t border-primary/30 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      AUTHOR: {article.author}
                    </span>
                    <span className="text-primary text-xs group-hover:translate-x-1 transition-transform">
                      {'>'} READ_MORE
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
