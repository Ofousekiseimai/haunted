import type { Metadata } from "next";

import { CollectionPreview } from "@/components/category/collection-preview";
import { getAllLaografiaSubcategories } from "@/lib/laografia";
import { getRequestLocale } from "@/lib/locale-server";
import { translateSubcategoryLabel } from "@/lib/translations";

/** How many records each collection shows before the button through. */
const PREVIEW = 3;

export const metadata: Metadata = {
  title: "Λαογραφικές παραδόσεις",
  description:
    "Εξερεύνησε κατηγορίες λαογραφικών ιστοριών από όλη την Ελλάδα: στοιχειά, νεράιδες, βρικόλακες και πολλά ακόμη.",
  alternates: {
    canonical: "https://haunted.gr/laografia",
  },
};

export default async function LaografiaIndexPage() {
  const locale = await getRequestLocale();
  const subcategories = await getAllLaografiaSubcategories(locale);
  const totalArticles = subcategories.reduce(
    (count, entry) => count + (entry.articles?.length ?? 0),
    0,
  );

  return (
    <>
      <div className="frame page-head">
        <div className="shead">
          <div>
            <div className="shead__kicker">
              <span className="mark" aria-hidden="true" />
              <span className="mono">{locale === "en" ? "Folklore" : "Λαογραφία"}</span>
            </div>
            <h1 className="shead__title">
              {locale === "en" ? "Folk traditions" : "Λαογραφικές παραδόσεις"}
            </h1>
          </div>
          <p className="shead__desc">
            {locale === "en"
              ? `${totalArticles} records of haunted places, folk beliefs and stories passed down through generations.`
              : `${totalArticles} τεκμήρια: στοιχειωμένοι τόποι, λαϊκές δοξασίες και ιστορίες που ταξιδεύουν από γενιά σε γενιά.`}
          </p>
        </div>
      </div>

      <div className="frame">
        {subcategories.map((subcategory) => {
          const slug = subcategory.subcategorySlug ?? subcategory.slug;
          return (
            <CollectionPreview
              key={slug}
              title={translateSubcategoryLabel(slug, subcategory.subcategory, locale)}
              href={`/laografia/${slug}`}
              articles={(subcategory.articles ?? []).slice(0, PREVIEW)}
              total={subcategory.articles?.length ?? 0}
              variant="gallery"
              locale={locale}
            />
          );
        })}
      </div>
    </>
  );
}
