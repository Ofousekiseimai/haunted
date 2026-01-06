import Link from "next/link";

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
    <Link
      href={`/laografia/${subcategory.subcategorySlug}`}
      className="group flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-primary-400/60 hover:bg-zinc-900"
    >
      <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">{localizedCategory}</p>
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 transition group-hover:text-white">
          {localizedSubcategory}
        </h2>
        <p className="mt-3 text-sm text-zinc-400">
          {formatCollectionDescription(
            subcategory.seo?.metaDescription,
            subcategory.articles.length,
            locale === "en"
              ? `Collection of ${subcategory.articles.length} stories about ${localizedSubcategory}.`
              : `Συλλογή ${subcategory.articles.length} ιστοριών για ${subcategory.subcategory}.`,
          )}
        </p>
      </div>
      <span className="mt-auto text-sm font-medium text-primary-300 transition group-hover:text-primary-200">
        {locale === "en" ? "Explore →" : "Εξερεύνησε →"}
      </span>
    </Link>
  );
}
