import { ArticleSuggestionCard } from "./suggestion-card";
import { getRelatedArticlesBySubcategory } from "@/lib/articles";

type RelatedArticlesProps = {
  subcategorySlug: string;
  currentArticleId?: string;
};

export async function RelatedArticles({
  subcategorySlug,
  currentArticleId,
}: RelatedArticlesProps) {
  const articles = await getRelatedArticlesBySubcategory(subcategorySlug, {
    excludeArticleId: currentArticleId,
    limit: 6,
  });

  if (!articles.length) {
    return null;
  }

  return (
    <section className="space-y-6 pt-10">
      <h2 className="text-2xl font-semibold text-n-1">
        Περισσότερα από την ίδια ενότητα
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleSuggestionCard key={`${article.categoryKey}-${article.id}`} article={article} />
        ))}
      </div>
    </section>
  );
}
