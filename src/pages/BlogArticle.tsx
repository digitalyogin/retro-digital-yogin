import { Navigate, useParams } from "react-router-dom";
import { ShuffleText } from "@/components/animation/ShuffleText";
import { getArticleBySlug } from "@/content/blog/articles";
import NotFound from "@/pages/NotFound";

const BlogArticle = () => {
  const { slug } = useParams();

  if (!slug) return <Navigate to="/blog" replace />;

  const article = getArticleBySlug(slug);
  if (!article) return <NotFound />;

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-8">
      <article className="max-w-4xl mx-auto space-y-6">
        <ShuffleText
          as="h1"
          text={article.title}
          className="text-3xl md:text-5xl font-bold text-primary text-glow font-terminal"
        />
        <ShuffleText
          as="p"
          text={new Date(article.date).toLocaleDateString("it-IT")}
          className="text-sm text-muted-foreground"
        />

        {article.sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="border border-border bg-card/60 p-6 space-y-3">
            {section.heading ? (
              <ShuffleText
                as="h2"
                text={section.heading}
                className="text-xl md:text-2xl text-secondary font-terminal"
              />
            ) : null}
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <ShuffleText
                key={paragraphIndex}
                as="p"
                text={paragraph}
                className="text-base leading-relaxed text-foreground/90"
              />
            ))}
          </section>
        ))}
      </article>
    </div>
  );
};

export default BlogArticle;
