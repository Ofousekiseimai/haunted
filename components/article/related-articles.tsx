import { MoreArticles } from "./more-articles";
import { getRelatedArticlesBySubcategory } from "@/lib/articles";
import { getRequestLocale } from "@/lib/locale-server";

type RelatedArticlesProps = {
  subcategorySlug: string;
  currentArticleId?: string;
};

export async function RelatedArticles({
  subcategorySlug,
  currentArticleId,
}: RelatedArticlesProps) {
  const locale = await getRequestLocale();
  const articles = await getRelatedArticlesBySubcategory(
    subcategorySlug,
    {
      excludeArticleId: currentArticleId,
      limit: 6,
    },
    locale,
  );

  if (!articles.length) {
    return null;
  }

  return <MoreArticles heading={`Περισσότερα από την ίδια ενότητα`} articles={articles} />;
}
