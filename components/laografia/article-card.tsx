import Link from "next/link";

import { GlowCard } from "@/components/ui/glow-card";
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
    <article className="group">
      <GlowCard>
        <div className="flex flex-col gap-2">
          <h2
            className="text-2xl font-semibold transition group-hover:text-[var(--accent-bright)]"
            style={{ color: "var(--bone)" }}
          >
            {article.title}
          </h2>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "var(--fs-meta)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ash-dim)",
            }}
          >
            {article.author}
            {article.author && article.date && " · "}
            {article.date}
          </p>
          {article.excerpt && (
            <p className="text-base" style={{ color: "var(--ash)" }}>
              {article.excerpt}
            </p>
          )}
        </div>
        <Link
          href={`/laografia/${subcategorySlug}/${article.slug}`}
          className="mt-6 inline-flex items-center text-sm font-medium transition hover:text-[var(--accent-bright)]"
          style={{ color: "var(--accent)" }}
        >
          {readLabel}
        </Link>
      </GlowCard>
    </article>
  );
}
