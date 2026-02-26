import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { blogArticles } from "@/lib/blogData";
import { CrtTransition } from "@/components/CrtTransition";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ARTICLES_PER_PAGE = 4;

const Blog = () => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  const [targetSlug, setTargetSlug] = useState<string | null>(null);
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogArticles.length / ARTICLES_PER_PAGE);
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = blogArticles.slice(startIdx, startIdx + ARTICLES_PER_PAGE);

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

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              <span className="text-muted-foreground text-sm">
                PAGE {currentPage}/{totalPages} :: TOTAL: {blogArticles.length}
              </span>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {paginatedArticles.map((article, index) => (
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

          {/* Pagination */}
          <div className="mt-12 border-t border-primary pt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-primary text-primary font-terminal text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 border font-terminal text-sm transition-colors ${
                  currentPage === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {String(page).padStart(2, "0")}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-primary text-primary font-terminal text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
