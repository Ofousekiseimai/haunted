import type { Metadata } from "next";

import { CategorySubcategoryCard } from "@/components/category/subcategory-card";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { getAllEfimeridesSubcategories } from "@/lib/efimerides";
import { formatCollectionDescription } from "@/lib/description";
import { getRequestLocale } from "@/lib/locale-server";

export const metadata: Metadata = {
  title: "Άρθρα Εφημερίδων",
  description:
    "Εξερευνήστε τεκμήρια από τον ελληνικό Τύπο για παράξενα φαινόμενα, εγκλήματα, τελετές και μαγεία.",
  alternates: {
    canonical: "https://haunted.gr/efimerides",
  },
  openGraph: {
    title: "Άρθρα Εφημερίδων",
    description:
      "Αρχειακά δημοσιεύματα με παράξενα φαινόμενα, εγκλήματα και τελετές από όλη την Ελλάδα.",
    url: "https://haunted.gr/efimerides",
  },
  twitter: {
    card: "summary_large_image",
    title: "Άρθρα Εφημερίδων",
    description:
      "Αρχειακά δημοσιεύματα με παράξενα φαινόμενα, εγκλήματα και τελετές από όλη την Ελλάδα.",
  },
};

export default async function EfimeridesIndexPage() {
  const locale = await getRequestLocale();
  const subcategories = await getAllEfimeridesSubcategories(locale);
  const totalArticles = subcategories.reduce(
    (count, subcategory) => count + (subcategory.articles?.length ?? 0),
    0,
  );

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow="Εφημερίδες"
        title="Παραφυσικός Αρχείο Εφημερίδων"
        description={formatCollectionDescription(
          undefined,
          totalArticles,
          "Καταγεγραμμένες ιστορίες και τεκμήρια από τον ελληνικό Τύπο που φωτίζουν παράξενα φαινόμενα, εγκλήματα και τελετές.",
        )}
      />

      <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">
        Συνολικά τεκμήρια: {totalArticles}
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {subcategories.map((subcategory) => (
          <CategorySubcategoryCard
            key={subcategory.subcategorySlug}
            href={`/efimerides/${subcategory.subcategorySlug ?? subcategory.slug}`}
            categoryLabel="Εφημερίδες"
            title={subcategory.subcategory}
            description={formatCollectionDescription(
              subcategory.seo?.metaDescription,
              subcategory.articles.length,
              `Συλλογή ${subcategory.articles.length} άρθρων από τον ελληνικό Τύπο για ${subcategory.subcategory}.`,
            )}
            articleCount={subcategory.articles.length}
          />
        ))}
      </div>
    </Section>
  );
}
