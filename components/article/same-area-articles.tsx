import { ArticleSuggestionCard } from "./suggestion-card";
import { getArticlesByMainArea } from "@/lib/articles";
import { getRequestLocale } from "@/lib/locale-server";

type SameAreaArticlesProps = {
  mainArea?: string | null;
  currentArticleId?: string;
};

export async function SameAreaArticles({ mainArea, currentArticleId }: SameAreaArticlesProps) {
  if (!mainArea) {
    return null;
  }

  const locale = await getRequestLocale();
  const articles = await getArticlesByMainArea(
    mainArea,
    {
      excludeArticleId: currentArticleId,
      limit: 6,
    },
    locale,
  );

  if (!articles.length) {
    return null;
  }

  return (
    <section className="space-y-6 pt-10">
      <h2 className="text-2xl font-semibold text-n-1">
        Άρθρα από την περιοχή «{mainArea}»
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleSuggestionCard key={`${article.categoryKey}-${article.id}`} article={article} />
        ))}
      </div>
    </section>
  );
}
