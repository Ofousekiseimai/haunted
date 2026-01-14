import Link from "next/link";

import type { Article, LaografiaSubcategory } from "@/lib/laografia";
import type { Locale } from "@/lib/locale";

type ArticleCardProps = {
  article: Article;
  subcategorySlug: LaografiaSubcategory["subcategorySlug"];
  locale?: Locale;
};

export function ArticleCard({ article, subcategorySlug, locale = "el" }: ArticleCardProps) {
  const readLabel = locale === "en" ? "Read Article →" : "Διάβασε την ιστορία →";

  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-primary-400/60 hover:bg-zinc-900">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-zinc-100">{article.title}</h2>
        <p className="text-sm text-zinc-500">
          {article.author}
          {article.author && article.date && " · "}
          {article.date}
        </p>
        {article.excerpt && <p className="text-base text-zinc-400">{article.excerpt}</p>}
      </div>
      <Link
        href={`/laografia/${subcategorySlug}/${article.slug}`}
        className="mt-6 inline-flex items-center text-sm font-medium text-primary-300 transition hover:text-primary-200"
      >
        {readLabel}
      </Link>
    </article>
  );
}
