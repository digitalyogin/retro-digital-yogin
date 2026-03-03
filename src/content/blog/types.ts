export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  sections: Array<{
    heading?: string;
    paragraphs: string[];
  }>;
};
