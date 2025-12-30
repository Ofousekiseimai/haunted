import type { Metadata } from "next";

import { CategorySubcategoryCard } from "@/components/category/subcategory-card";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import {
  getAllEtaireiaSubcategories,
  getEtaireiaOverview,
  type EtaireiaOverview,
} from "@/lib/etaireia";
import { formatCollectionDescription } from "@/lib/description";
import { getRequestLocale } from "@/lib/locale-server";

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
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow="Εταιρεία Ψυχικών Ερευνών"
        title="Αρχείο Εταιρείας Ψυχικών Ερευνών"
        description={formatCollectionDescription(
          overview?.seo?.metaDescription,
          totalArticles,
          "Πειράματα τηλεψυχίας, δημοσιεύσεις και τεκμήρια από την ιστορική Εταιρεία Ψυχικών Ερευνών.",
        )}
      />

      {typeof totalArticles === "number" && (
        <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">
          Συνολικά τεκμήρια: {totalArticles}
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {subcategories.map((subcategory) => (
          <CategorySubcategoryCard
            key={subcategory.subcategorySlug}
            href={`/etaireia-psychikon-ereynon/${subcategory.subcategorySlug ?? subcategory.slug}`}
            categoryLabel="Εταιρεία Ψυχικών Ερευνών"
            title={subcategory.subcategory}
            description={formatCollectionDescription(
              subcategory.seo?.metaDescription,
              subcategory.articles.length,
              `Συλλογή ${subcategory.articles.length} τεκμηρίων από το αρχείο της Εταιρείας Ψυχικών Ερευνών.`,
            )}
            articleCount={subcategory.articles.length}
            ctaLabel="Δείτε τα τεκμήρια →"
          />
        ))}
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
    </Section>
  );
}
