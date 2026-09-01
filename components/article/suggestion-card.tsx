import Image from "next/image";
import Link from "next/link";

import { GlowCard } from "@/components/ui/glow-card";
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
    <Link href={href} className="group block h-full">
      <GlowCard className="flex h-full flex-col">
        {article.image?.src ? (
          <div className="relative -mx-6 -mt-6 mb-4 h-48 w-[calc(100%+3rem)] overflow-hidden">
            <Image
              src={article.image.src}
              alt={article.image.alt ?? article.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div
            className="flex -mx-6 -mt-6 mb-4 h-48 w-[calc(100%+3rem)] items-center justify-center text-sm"
            style={{ background: "var(--surface)", color: "var(--ash-dim)" }}
          >
            Χωρίς εικόνα
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3">
          <p
            className="uppercase"
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "var(--fs-meta)",
              letterSpacing: "0.18em",
              color: "var(--ash-dim)",
            }}
          >
            {article.subcategoryLabel}
          </p>
          <h3
            className="text-xl font-semibold transition group-hover:text-[var(--accent-bright)]"
            style={{ color: "var(--bone)" }}
          >
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm leading-6" style={{ color: "var(--ash)" }}>
              {article.excerpt}
            </p>
          )}

          {(formattedDate || article.mainArea) && (
            <div
              className="mt-auto flex flex-wrap gap-3 uppercase"
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "var(--fs-meta)",
                letterSpacing: "0.18em",
                color: "var(--ash-dim)",
              }}
            >
              {formattedDate && <span>{formattedDate}</span>}
              {article.mainArea && <span>{article.mainArea}</span>}
            </div>
          )}
        </div>
      </GlowCard>
    </Link>
  );
}
