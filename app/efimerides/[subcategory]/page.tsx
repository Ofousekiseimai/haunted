import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryArticleCard } from "@/components/category/article-card";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import {
  getAllEfimeridesSubcategoryParams,
  getEfimeridesSubcategory,
  type EfimeridesSubcategory,
} from "@/lib/efimerides";
import { formatCollectionDescription } from "@/lib/description";
import { getRequestLocale } from "@/lib/locale-server";
import { translateCategoryLabel, translateSubcategoryLabel } from "@/lib/translations";

type PageProps = {
  params: Promise<{
    subcategory: string;
  }>;
};

function getCanonicalSlug(subcategory: EfimeridesSubcategory) {
  return subcategory.seo?.canonical ?? `/efimerides/${subcategory.subcategorySlug ?? subcategory.slug}`;
}

function getLocationLabel(article: EfimeridesSubcategory["articles"][number]) {
  if (Array.isArray(article.locationTags)) {
    const fromTags = article.locationTags.find(
      (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
    );
    if (fromTags) {
      return fromTags;
    }
  }

  const candidates = [article.mainArea, article.subLocation, article.subLocation2];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return undefined;
}

export async function generateStaticParams() {
  return getAllEfimeridesSubcategoryParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory: subcategorySlug } = await params;
  const locale = await getRequestLocale();
  const subcategory = await getEfimeridesSubcategory(subcategorySlug, locale);

  if (!subcategory) {
    return {};
  }

  const title =
    subcategory.seo?.metaTitle ??
    translateSubcategoryLabel(subcategory.subcategorySlug ?? subcategory.slug, subcategory.subcategory, locale);
  const description = formatCollectionDescription(
    subcategory.seo?.metaDescription,
    subcategory.articles.length,
    locale === "en"
      ? `Press records and articles for the section ${translateSubcategoryLabel(
          subcategory.subcategorySlug ?? subcategory.slug,
          subcategory.subcategory,
          locale,
        )}.`
      : `Αρχειακά τεκμήρια και άρθρα από τον ελληνικό Τύπο για την ενότητα ${subcategory.subcategory}.`,
  );
  const canonical = getCanonicalSlug(subcategory);

  return {
    title,
    description,
    keywords: subcategory.seo?.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function EfimeridesSubcategoryPage({ params }: PageProps) {
  const { subcategory: subcategorySlug } = await params;
  const locale = await getRequestLocale();
  const subcategory = await getEfimeridesSubcategory(subcategorySlug, locale);

  if (!subcategory) {
    notFound();
  }

  const categoryLabel = translateCategoryLabel("efimerides", "Εφημερίδες", locale);
  const subLabel = translateSubcategoryLabel(
    subcategory.subcategorySlug ?? subcategory.slug,
    subcategory.subcategory,
    locale,
  );

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow={categoryLabel}
        title={subLabel}
        description={formatCollectionDescription(
          subcategory.seo?.metaDescription,
          subcategory.articles.length,
          locale === "en"
            ? `Collection of ${subcategory.articles.length} press articles.`
            : `Συλλογή ${subcategory.articles.length} άρθρων και τεκμηρίων από τον ελληνικό Τύπο.`,
        )}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {subcategory.articles.map((article) => {
          const location = getLocationLabel(article);
          const tags = Array.isArray(article.tags)
            ? article.tags.filter((tag): tag is string => typeof tag === "string")
            : undefined;

          return (
            <CategoryArticleCard
              key={`${article.id}-${article.slug}`}
              href={`/efimerides/${subcategory.subcategorySlug ?? subcategory.slug}/${article.slug}`}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date as string | undefined}
              author={article.author as string | undefined}
              location={location}
              tags={tags}
              image={article.image}
              locale={locale}
            />
          );
        })}
      </div>

      {subcategory.seo?.structuredData && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(subcategory.seo.structuredData),
          }}
        />
      )}
    </Section>
  );
}
