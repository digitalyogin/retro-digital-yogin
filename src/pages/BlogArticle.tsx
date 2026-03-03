import { useState, useCallback } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ShuffleText } from "@/components/animation/ShuffleText";
import { getArticleBySlug } from "@/content/blog/articles";
import NotFound from "@/pages/NotFound";
import { CrtTransition } from "@/components/CrtTransition";

type ContentBlock = {
  kind: "heading" | "paragraph";
  text: string;
};

const parseMarkdownToBlocks = (content: string): ContentBlock[] => {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith("![]("))
    .filter((line) => !line.startsWith("|"))
    .map((line) => {
      if (/^#{1,6}\s+/.test(line)) {
        return {
          kind: "heading" as const,
          text: line.replace(/^#{1,6}\s+/, "").replace(/\*\*/g, "").replace(/\*/g, "").trim(),
        };
      }
      if (/^[-*]\s+/.test(line)) {
        return {
          kind: "paragraph" as const,
          text: `• ${line.replace(/^[-*]\s+/, "").replace(/\*\*/g, "").replace(/\*/g, "").trim()}`,
        };
      }
      return {
        kind: "paragraph" as const,
        text: line.replace(/\*\*/g, "").replace(/\*/g, "").trim(),
      };
    });
};

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [goingBack, setGoingBack] = useState(false);

  if (!slug) return <Navigate to="/blog" replace />;

  const article = getArticleBySlug(slug);
  if (!article) return <NotFound />;
  const contentBlocks = parseMarkdownToBlocks(article.content);

  const handleBack = useCallback(() => {
    setGoingBack(true);
  }, []);

  const handleBackComplete = useCallback(() => {
    setGoingBack(false);
    navigate("/blog");
  }, [navigate]);

  return (
    <>
      <CrtTransition active={goingBack} onComplete={handleBackComplete} playDoneSound />
      <div className="min-h-[calc(100vh-120px)] px-4 py-8">
      <article className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-terminal">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            BLOG
          </button>
          <span>/</span>
          <span className="text-primary">{article.slug.toUpperCase()}</span>
        </div>

        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground font-terminal hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {"<"} BACK_TO_BLOG
        </button>

        <ShuffleText
          as="h1"
          text={article.title}
          className="text-3xl md:text-5xl font-bold text-primary text-glow font-terminal"
        />
        <div className="flex items-center gap-3 text-xs">
          <span className="border border-primary/40 text-primary px-2 py-1">{article.category.toUpperCase()}</span>
          <span className="text-muted-foreground">{article.date}</span>
          <span className="text-muted-foreground">by {article.author}</span>
        </div>

        <div className="w-full h-64 md:h-96 overflow-hidden border border-primary/40">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
        </div>

        <section className="border border-border bg-card/60 p-6 space-y-4">
          {contentBlocks.map((block, index) =>
            block.kind === "heading" ? (
              <ShuffleText
                key={`${block.kind}-${index}`}
                as="h2"
                text={block.text}
                className="text-xl md:text-2xl text-secondary font-terminal pt-3 border-t border-primary/20 first:border-0 first:pt-0"
              />
            ) : (
              <ShuffleText
                key={`${block.kind}-${index}`}
                as="p"
                text={block.text}
                className="text-base leading-relaxed text-foreground/90"
              />
            )
          )}
        </section>
      </article>
      </div>
    </>
  );
};

export default BlogArticle;
