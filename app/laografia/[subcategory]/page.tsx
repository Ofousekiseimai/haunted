import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import {
  getAllLaografiaSubcategoryParams,
  getLaografiaSubcategory,
  type LaografiaSubcategory,
} from "@/lib/laografia";
import { translateCategoryLabel, translateSubcategoryLabel } from "@/lib/translations";
import { formatCollectionDescription } from "@/lib/description";
import { getRequestLocale } from "@/lib/locale-server";
import { SectionHeader } from "@/components/section-header";
import { CategoryArticleCard } from "@/components/category/article-card";

type PageProps = {
  params: Promise<{
    subcategory: string;
  }>;
};

export async function generateStaticParams() {
  return getAllLaografiaSubcategoryParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory: subcategorySlug } = await params;
  const locale = await getRequestLocale();
  const subcategory = await getLaografiaSubcategory(subcategorySlug, locale);

  if (!subcategory) {
    return {};
  }

  const title = subcategory.seo?.metaTitle ?? subcategory.subcategory;
  const description = formatCollectionDescription(
    subcategory.seo?.metaDescription,
    subcategory.articles.length,
    `Συλλογή ιστοριών για την ενότητα ${subcategory.subcategory}.`,
  );
  const canonical =
    subcategory.seo?.canonical ?? `/laografia/${subcategory.subcategorySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    keywords: subcategory.seo?.keywords,
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

function getLocationLabel(article: LaografiaSubcategory["articles"][number]) {
  if (Array.isArray(article.locationTags) && article.locationTags.length > 0) {
    const fromTags = article.locationTags.find(
      (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
    );
    if (fromTags) {
      return fromTags;
    }
  }

  const candidates = [
    (article as { mainArea?: string }).mainArea,
    (article as { subLocation?: string }).subLocation,
    (article as { subLocation2?: string }).subLocation2,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return undefined;
}

function getTags(article: LaografiaSubcategory["articles"][number]) {
  if (!Array.isArray((article as { tags?: unknown }).tags)) {
    return undefined;
  }

  const tags = (article as { tags?: unknown }).tags as unknown[];
  const filtered = tags.filter(
    (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
  );

  return filtered.length ? filtered : undefined;
}

export default async function LaografiaSubcategoryPage({ params }: PageProps) {
  const { subcategory: subcategorySlug } = await params;
  const locale = await getRequestLocale();
  const subcategory = await getLaografiaSubcategory(subcategorySlug, locale);

  if (!subcategory) {
    notFound();
  }

  const localizedCategory = translateCategoryLabel(subcategory.category, subcategory.category, locale);
  const localizedSubcategory = translateSubcategoryLabel(
    subcategory.subcategorySlug ?? subcategory.slug,
    subcategory.subcategory,
    locale,
  );

  return (
    <Section className="container space-y-12">
      <SectionHeader
        eyebrow={localizedCategory}
        title={localizedSubcategory}
        description={formatCollectionDescription(
          subcategory.seo?.metaDescription,
          subcategory.articles.length,
          locale === "en"
            ? `See ${subcategory.articles.length} stories and testimonies for ${localizedSubcategory}.`
            : `Δες ${subcategory.articles.length} ιστορίες και μαρτυρίες για την ενότητα ${subcategory.subcategory}.`,
        )}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {subcategory.articles.map((article) => (
          <CategoryArticleCard
            key={`${article.id}-${article.slug}`}
            href={`/laografia/${subcategory.subcategorySlug}/${article.slug}`}
            title={article.title}
            excerpt={article.excerpt}
            date={article.date as string | undefined}
            author={article.author as string | undefined}
            location={getLocationLabel(article)}
            tags={getTags(article)}
            image={article.image}
            locale={locale}
          />
        ))}
      </div>
    </Section>
  );
}
