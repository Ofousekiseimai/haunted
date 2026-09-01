import { MoreArticles } from "./more-articles";
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

  return <MoreArticles heading={`Περισσότερα άρθρα`} articles={articles} />;
}
