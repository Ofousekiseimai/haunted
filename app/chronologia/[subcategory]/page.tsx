import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ChronologioTimeline } from "@/components/chronologia/timeline";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { getChronologiaSubcategory } from "@/lib/chronologia";
import { getRequestLocale } from "@/lib/locale-server";
import { translateCategoryLabel } from "@/lib/translations";

type PageProps = {
  params: Promise<{
    subcategory: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory } = await params;
  const locale = await getRequestLocale();
  const data = await getChronologiaSubcategory(subcategory, locale);

  if (!data) {
    return {};
  }

  return {
    title: `Χρονολόγιο | ${data.title}`,
    description:
      data.description ??
      `Χρονολογική προβολή ${data.articleCount} τεκμηρίων για ${data.title} από τον ελληνικό Τύπο.`,
    alternates: {
      canonical: `https://haunted.gr/chronologia/${subcategory}`,
    },
  };
}

export default async function ChronologiaSubcategoryPage({ params }: PageProps) {
  const { subcategory } = await params;
  const locale = await getRequestLocale();
  const data = await getChronologiaSubcategory(subcategory, locale);

  if (!data) {
    notFound();
  }

  const title = translateCategoryLabel(data.slug, data.title, locale);
  const description =
    data.description ??
    (locale === "en"
      ? "Horizontal timeline with press articles ordered by date."
      : "Οριζόντιο χρονολόγιο με δημοσιεύματα του ελληνικού Τύπου ταξινομημένα ανά ημερομηνία.");

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow={locale === "en" ? "Timelines" : "Χρονολόγια"}
        title={title}
        description={description}
      />

      <ChronologioTimeline
        items={data.timeline}
        title={`${locale === "en" ? "Timeline" : "Χρονολόγιο"} · ${title}`}
        locale={locale}
      />
    </Section>
  );
}
