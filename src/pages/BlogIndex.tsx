import { Link } from "react-router-dom";
import { ShuffleText } from "@/components/animation/ShuffleText";
import { blogArticles } from "@/content/blog/articles";

const BlogIndex = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <ShuffleText
          as="h1"
          text="BLOG"
          className="text-3xl md:text-5xl font-bold text-primary text-glow font-terminal"
        />
        <ShuffleText
          as="p"
          text="Approfondimenti su sviluppo prodotto, performance frontend, accessibilita e integrazione web-mobile."
          className="text-lg text-muted-foreground"
        />

        <div className="space-y-4">
          {blogArticles.map((article) => (
            <article key={article.slug} className="border border-border bg-card p-5 space-y-3">
              <p className="text-xs text-muted-foreground">{new Date(article.date).toLocaleDateString("it-IT")}</p>
              <ShuffleText
                as="h2"
                text={article.title}
                className="text-xl md:text-2xl text-secondary font-terminal"
              />
              <ShuffleText as="p" text={article.excerpt} className="text-foreground/90" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs border border-primary/30 px-2 py-1 text-primary/90">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={`/blog/${article.slug}`}
                className="inline-block text-primary hover:text-primary/80 underline"
              >
                Leggi articolo
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;
