import Link from "next/link";

import { GlowCard } from "@/components/ui/glow-card";
import type { LaografiaSubcategory } from "@/lib/laografia";
import { formatCollectionDescription } from "@/lib/description";
import { translateCategoryLabel, translateSubcategoryLabel } from "@/lib/translations";
import type { Locale } from "@/lib/locale";

type SubcategoryCardProps = {
  subcategory: LaografiaSubcategory;
  locale?: Locale;
};

export function SubcategoryCard({ subcategory, locale = "el" }: SubcategoryCardProps) {
  const localizedCategory = translateCategoryLabel(subcategory.category, subcategory.category, locale);
  const localizedSubcategory = translateSubcategoryLabel(
    subcategory.subcategorySlug ?? subcategory.slug,
    subcategory.subcategory,
    locale,
  );

  return (
    <Link href={`/laografia/${subcategory.subcategorySlug}`} className="group block">
      <GlowCard className="flex flex-col gap-4">
        <p
          className="uppercase"
          style={{
            fontFamily: "var(--font-code)",
            fontSize: "var(--fs-meta)",
            letterSpacing: "0.22em",
            color: "var(--accent)",
          }}
        >
          {localizedCategory}
        </p>
        <div>
          <h2
            className="text-2xl font-semibold transition group-hover:text-[var(--accent-bright)]"
            style={{ color: "var(--bone)" }}
          >
            {localizedSubcategory}
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--ash)" }}>
            {formatCollectionDescription(
              subcategory.seo?.metaDescription,
              subcategory.articles.length,
              locale === "en"
                ? `Collection of ${subcategory.articles.length} stories about ${localizedSubcategory}.`
                : `Συλλογή ${subcategory.articles.length} ιστοριών για ${subcategory.subcategory}.`,
            )}
          </p>
        </div>
        <span
          className="mt-auto text-sm font-medium transition group-hover:text-[var(--accent-bright)]"
          style={{ color: "var(--accent)" }}
        >
          {locale === "en" ? "Explore →" : "Εξερεύνησε →"}
        </span>
      </GlowCard>
    </Link>
  );
}
