import type { Metadata } from "next";

import { CategorySubcategoryCard } from "@/components/category/subcategory-card";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { getAllChronologiaSubcategories } from "@/lib/chronologia";
import { getRequestLocale } from "@/lib/locale-server";
import { translateCategoryLabel } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Χρονολόγια",
  description:
    "Οριζόντια χρονολόγια με τεκμήρια του ελληνικού Τύπου ταξινομημένα ανά θεματική.",
  alternates: {
    canonical: "https://haunted.gr/chronologia",
  },
};

export default async function ChronologiaIndexPage() {
  const locale = await getRequestLocale();
  const subcategories = await getAllChronologiaSubcategories(locale);

  const total = subcategories.reduce((count, sub) => count + sub.articleCount, 0);
  const heading = locale === "en" ? "Timelines" : "Χρονολόγια";
  const title = locale === "en" ? "Thematic Timelines" : "Θεματικά Χρονολόγια Τύπου";
  const description =
    locale === "en"
      ? "Pick a theme and browse chronologically all records from the Greek press."
      : "Διάλεξε θεματική και περιηγήσου σε χρονολογική σειρά όλα τα τεκμήρια από τον ελληνικό Τύπο.";

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow={heading}
        title={title}
        description={description}
      />

      <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">
        {locale === "en" ? "Total records" : "Συνολικά τεκμήρια"}: {total}
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {subcategories.map((subcategory) => (
          <CategorySubcategoryCard
            key={subcategory.slug}
            href={`/chronologia/${subcategory.slug}`}
            categoryLabel={heading}
            title={translateCategoryLabel(subcategory.slug, subcategory.title, locale)}
            description={
              subcategory.description ??
              `Χρονολόγιο με ${subcategory.articleCount} τεκμήρια για ${subcategory.title}.`
            }
            articleCount={subcategory.articleCount}
            ctaLabel="Δείτε το χρονολόγιο →"
          />
        ))}
      </div>
    </Section>
  );
}
