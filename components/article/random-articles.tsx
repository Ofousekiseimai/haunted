import { ArticleSuggestionCard } from "./suggestion-card";
import { getRandomArticles } from "@/lib/articles";
import { getRequestLocale } from "@/lib/locale-server";

type RandomArticlesProps = {
  currentArticleId?: string;
};

export async function RandomArticles({ currentArticleId }: RandomArticlesProps) {
  const locale = await getRequestLocale();
  const articles = await getRandomArticles(
    {
      excludeArticleId: currentArticleId,
      limit: 5,
    },
    locale,
  );

  if (!articles.length) {
    return null;
  }

  return (
    <section className="space-y-6 pt-10">
      <h2 className="text-2xl font-semibold text-n-1">Περισσότερα άρθρα</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleSuggestionCard key={`${article.categoryKey}-${article.id}`} article={article} />
        ))}
      </div>
    </section>
  );
}
