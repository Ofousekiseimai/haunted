import type { Metadata } from "next";

import { CollectionPreview } from "@/components/category/collection-preview";
import {
  getAllEtaireiaSubcategories,
  getEtaireiaOverview,
  type EtaireiaOverview,
} from "@/lib/etaireia";
import { getRequestLocale } from "@/lib/locale-server";
import { translateSubcategoryLabel } from "@/lib/translations";

function toMetadata(overview: EtaireiaOverview | null): Metadata {
  if (!overview?.seo) {
    return {
      title: "Εταιρεία Ψυχικών Ερευνών",
      description:
        "Αρχειακό υλικό, πειράματα και δημοσιεύσεις της Εταιρείας Ψυχικών Ερευνών με τεκμήρια από την Ελλάδα και το εξωτερικό.",
      alternates: {
        canonical: "https://haunted.gr/etaireia-psychikon-ereynon",
      },
    };
  }

  const { seo } = overview;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: seo.canonical
      ? {
          canonical: seo.canonical,
        }
      : undefined,
    openGraph: {
      type: "website",
      title: seo.metaTitle ?? "Εταιρεία Ψυχικών Ερευνών",
      description:
        seo.metaDescription ??
        "Αρχειακό υλικό, πειράματα και δημοσιεύσεις της Εταιρείας Ψυχικών Ερευνών.",
      url: seo.canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle ?? "Εταιρεία Ψυχικών Ερευνών",
      description:
        seo.metaDescription ??
        "Αρχειακό υλικό, πειράματα και δημοσιεύσεις της Εταιρείας Ψυχικών Ερευνών.",
    },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const overview = await getEtaireiaOverview();
  return toMetadata(overview);
}

/** How many records each collection shows before the button through. */
const PREVIEW = 3;

export default async function EtaireiaIndexPage() {
  const locale = await getRequestLocale();
  const [overview, subcategories] = await Promise.all([
    getEtaireiaOverview(),
    getAllEtaireiaSubcategories(locale),
  ]);

  const totalArticles =
    overview?.totalArticles ??
    subcategories.reduce((count, subcategory) => count + (subcategory.articles?.length ?? 0), 0);

  return (
    <>
      <div className="frame page-head">
        <div className="shead">
          <div>
            <div className="shead__kicker">
              <span className="mark" aria-hidden="true" />
              <span className="mono">
                {locale === "en" ? "Psychical research" : "Ψυχικές έρευνες"}
              </span>
            </div>
            <h1 className="shead__title">
              {locale === "en"
                ? "Society for Psychical Research"
                : "Αρχείο Εταιρείας Ψυχικών Ερευνών"}
            </h1>
          </div>
          <p className="shead__desc">
            {locale === "en"
              ? `${totalArticles} records: psi experiments, publications and correspondence from the historical Society.`
              : `${totalArticles} τεκμήρια: πειράματα, δημοσιεύσεις και αλληλογραφία από την ιστορική Εταιρεία Ψυχικών Ερευνών.`}
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
              href={`/etaireia-psychikon-ereynon/${slug}`}
              articles={(subcategory.articles ?? []).slice(0, PREVIEW)}
              total={subcategory.articles?.length ?? 0}
              variant="plates"
              locale={locale}
            />
          );
        })}
      </div>

      {overview?.seo?.structuredData && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(overview.seo.structuredData),
          }}
        />
      )}
    </>
  );
}
