import type { BlogArticle } from "./types";

export const blogArticles: BlogArticle[] = [
  {
    slug: "design-retro-performance-web",
    title: "Design Retro e Performance Web: convivere senza compromessi",
    excerpt:
      "Come costruire interfacce evocative in stile terminale mantenendo tempi di rendering rapidi e stabilita in preview.",
    date: "2026-03-03",
    tags: ["frontend", "performance", "lovable"],
    sections: [
      {
        heading: "Perche stile e performance sembrano in conflitto",
        paragraphs: [
          "Quando si introducono effetti visuali forti, il rischio principale e saturare il main thread con animazioni continue e repaint troppo frequenti.",
          "La strategia migliore e isolare gli effetti in componenti con ciclo di vita pulito, attivazione on-view e fallback statico su dispositivi meno capaci.",
        ],
      },
      {
        heading: "Checklist pratica per un sito stabile",
        paragraphs: [
          "Usa trigger con IntersectionObserver, limita gli FPS e distruggi timer o requestAnimationFrame durante l'unmount.",
          "Non animare elementi critici come campi form o controlli di navigazione: la leggibilita operativa resta prioritaria rispetto all'effetto visivo.",
        ],
      },
    ],
  },
  {
    slug: "animazioni-accessibili-nel-2026",
    title: "Animazioni accessibili nel 2026: guida operativa",
    excerpt:
      "Una guida concreta per rispettare reduce motion e mantenere contenuti leggibili anche in presenza di effetti testuali complessi.",
    date: "2026-03-01",
    tags: ["accessibility", "ux", "motion"],
    sections: [
      {
        heading: "Ridurre movimento senza perdere identita",
        paragraphs: [
          "Il supporto a prefers-reduced-motion non e opzionale: l'interfaccia deve restare completa anche senza animazioni.",
          "Ogni testo deve essere presente come contenuto reale nel DOM, cosi screen reader e funzioni di copia/incolla restano perfettamente funzionanti.",
        ],
      },
      {
        heading: "Decisioni di UX che migliorano tutto",
        paragraphs: [
          "Limitare l'animazione a titoli e paragrafi narrativi migliora la comprensione e riduce errori utente su form e CTA.",
          "Le animazioni one-shot in viewport sono in genere il miglior compromesso tra impatto visivo, performance e comfort cognitivo.",
        ],
      },
    ],
  },
];

export const getArticleBySlug = (slug: string) => {
  return blogArticles.find((article) => article.slug === slug);
};
