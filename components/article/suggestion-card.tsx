import Image from "next/image";
import Link from "next/link";

import type { SuggestionArticle } from "@/lib/articles";

function formatDate(date?: string) {
  if (!date) {
    return null;
  }

  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) {
    return date;
  }

  try {
    return new Intl.DateTimeFormat("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsed);
  } catch {
    return date;
  }
}

type ArticleSuggestionCardProps = {
  article: SuggestionArticle;
};

export function ArticleSuggestionCard({ article }: ArticleSuggestionCardProps) {
  const formattedDate = formatDate(article.date);
  const href = `/${article.categoryKey}/${article.subcategorySlug}/${article.slug}`;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:border-primary-400/60 hover:bg-zinc-900"
    >
      {article.image?.src ? (
        <div className="relative h-48 w-full overflow-hidden border-b border-zinc-800/60">
          <Image
            src={article.image.src}
            alt={article.image.alt ?? article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-48 w-full items-center justify-center border-b border-n-7 bg-n-9 text-sm text-n-4">
          Χωρίς εικόνα
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-code uppercase tracking-[0.24em] text-zinc-400">
          {article.subcategoryLabel}
        </p>
        <h3 className="text-xl font-semibold text-zinc-100 transition group-hover:text-primary-300">
          {article.title}
        </h3>
        {article.excerpt && <p className="text-sm leading-6 text-zinc-400">{article.excerpt}</p>}

        {(formattedDate || article.mainArea) && (
          <div className="mt-auto flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
            {formattedDate && <span>{formattedDate}</span>}
            {article.mainArea && <span>{article.mainArea}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
