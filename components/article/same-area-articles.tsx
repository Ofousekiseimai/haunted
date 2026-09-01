import { MoreArticles } from "./more-articles";
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

  return <MoreArticles heading={`Άρθρα από την περιοχή «{mainArea}»`} articles={articles} />;
}
