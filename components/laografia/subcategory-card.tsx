import Link from "next/link";

import type { LaografiaSubcategory } from "@/lib/laografia";
import { formatCollectionDescription } from "@/lib/description";

type SubcategoryCardProps = {
  subcategory: LaografiaSubcategory;
};

export function SubcategoryCard({ subcategory }: SubcategoryCardProps) {
  return (
    <Link
      href={`/laografia/${subcategory.subcategorySlug}`}
      className="group flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-primary-400/60 hover:bg-zinc-900"
    >
      <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">{subcategory.category}</p>
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 transition group-hover:text-white">
          {subcategory.subcategory}
        </h2>
        <p className="mt-3 text-sm text-zinc-400">
          {formatCollectionDescription(
            subcategory.seo?.metaDescription,
            subcategory.articles.length,
            `Συλλογή ${subcategory.articles.length} ιστοριών για ${subcategory.subcategory}.`,
          )}
        </p>
      </div>
      <span className="mt-auto text-sm font-medium text-primary-300 transition group-hover:text-primary-200">
        Εξερεύνησε →
      </span>
    </Link>
  );
}
