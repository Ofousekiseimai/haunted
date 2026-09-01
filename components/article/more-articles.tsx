import { ArticleSuggestionCard } from "./suggestion-card";
import type { SuggestionArticle } from "@/lib/articles";

type MoreArticlesProps = {
  heading: string;
  articles: SuggestionArticle[];
};

/**
 * The shell the three "more like this" rails share — related, same-area and
 * random each hand-rolled their own heading before, in three different sizes.
 */
export function MoreArticles({ heading, articles }: MoreArticlesProps) {
  if (!articles.length) return null;

  return (
    <section className="article__more">
      <div className="article__more-head">
        <span className="mark" aria-hidden="true" />
        <h2 className="article__more-title">{heading}</h2>
      </div>
      <div className="recs">
        {articles.map((article) => (
          <ArticleSuggestionCard key={`${article.categoryKey}-${article.id}`} article={article} />
        ))}
      </div>
    </section>
  );
}
