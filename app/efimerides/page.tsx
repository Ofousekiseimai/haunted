import type { Metadata } from "next";

import { CollectionPreview } from "@/components/category/collection-preview";
import { getAllEfimeridesSubcategories } from "@/lib/efimerides";
import { getRequestLocale } from "@/lib/locale-server";
import { translateSubcategoryLabel } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Αρχείο Εφημερίδων",
  description:
    "Εξερευνήστε τεκμήρια από τον ελληνικό Τύπο για παράξενα φαινόμενα, εγκλήματα, τελετές και μαγεία.",
  alternates: {
    canonical: "https://haunted.gr/efimerides",
  },
  openGraph: {
    title: "Αρχείο Εφημερίδων",
    description:
      "Αρχειακά δημοσιεύματα με παράξενα φαινόμενα, εγκλήματα και τελετές από όλη την Ελλάδα.",
    url: "https://haunted.gr/efimerides",
  },
  twitter: {
    card: "summary_large_image",
    title: "Αρχείο Εφημερίδων",
    description:
      "Αρχειακά δημοσιεύματα με παράξενα φαινόμενα, εγκλήματα και τελετές από όλη την Ελλάδα.",
  },
};

/** How many records each collection shows before the button through. */
const PREVIEW = 3;

export default async function EfimeridesIndexPage() {
  const locale = await getRequestLocale();
  const subcategories = await getAllEfimeridesSubcategories(locale);
  const totalArticles = subcategories.reduce(
    (count, subcategory) => count + (subcategory.articles?.length ?? 0),
    0,
  );

  return (
    <>
      <div className="frame page-head">
        <div className="shead">
          <div>
            <div className="shead__kicker">
              <span className="mark" aria-hidden="true" />
              <span className="mono">{locale === "en" ? "The press" : "Εφημερίδες"}</span>
            </div>
            <h1 className="shead__title">
              {locale === "en" ? "Newspaper Archive" : "Αρχείο Εφημερίδων"}
            </h1>
          </div>
          <p className="shead__desc">
            {locale === "en"
              ? `${totalArticles} records from the Greek press: strange phenomena, crimes and rituals as they were reported.`
              : `${totalArticles} τεκμήρια από τον ελληνικό Τύπο: παράξενα φαινόμενα, εγκλήματα και τελετές όπως καταγράφηκαν.`}
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
              href={`/efimerides/${slug}`}
              articles={(subcategory.articles ?? []).slice(0, PREVIEW)}
              total={subcategory.articles?.length ?? 0}
              variant="plates"
              locale={locale}
            />
          );
        })}
      </div>
    </>
  );
}
