import Link from "next/link";

import { PlateImage } from "@/components/ui/plate-image";
import type { SuggestionArticle } from "@/lib/articles";

type ArticleSuggestionCardProps = {
  article: SuggestionArticle;
};

/** Year only — a suggestion card wants a datum, not a formatted date. */
function toYear(date?: string) {
  if (!date) return null;
  return date.trim().match(/(1[5-9]\d{2}|20[0-2]\d)/)?.[1] ?? null;
}

export function ArticleSuggestionCard({ article }: ArticleSuggestionCardProps) {
  const href = `/${article.categoryKey}/${article.subcategorySlug}/${article.slug}`;
  const year = toYear(article.date);
  // Press and Society material is scanned paper and must not be cropped;
  // folklore is commissioned illustration and can be.
  const isScan = article.categoryKey !== "laografia";

  return (
    <Link href={href} className={isScan ? "clip group" : "rec group"}>
      <div className={isScan ? "clip__mat" : "rec__plate"}>
        {article.image?.src ? (
          isScan ? (
            <PlateImage
              src={article.image.src}
              alt={article.image.alt ?? article.title}
              width={640}
              height={480}
              sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
            />
          ) : (
            <PlateImage
              src={article.image.src}
              alt={article.image.alt ?? article.title}
              fill
              sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
            />
          )
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="mono mono--micro">—</span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="mono mono--micro">
          {[article.subcategoryLabel, year].filter(Boolean).join(" · ")}
        </span>
        <h3 className={isScan ? "clip__title" : "rec__title"}>{article.title}</h3>
        {!isScan && article.excerpt && <p className="rec__excerpt">{article.excerpt}</p>}
      </div>
    </Link>
  );
}
