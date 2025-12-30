import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CategoryArticleCard } from "@/components/category/article-card";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import {
  getAllEtaireiaSubcategoryParams,
  getEtaireiaSubcategory,
  type EtaireiaSubcategory,
} from "@/lib/etaireia";
import { formatCollectionDescription } from "@/lib/description";
import { getRequestLocale } from "@/lib/locale-server";

type PageProps = {
  params: Promise<{
    subcategory: string;
  }>;
};

function getCanonicalSlug(subcategory: EtaireiaSubcategory) {
  return (
    subcategory.seo?.canonical ??
    `/etaireia-psychikon-ereynon/${subcategory.subcategorySlug ?? subcategory.slug}`
  );
}

function getLocationLabel(article: EtaireiaSubcategory["articles"][number]) {
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
  return getAllEtaireiaSubcategoryParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory: subcategorySlug } = await params;
  const locale = await getRequestLocale();
  const subcategory = await getEtaireiaSubcategory(subcategorySlug, locale);

  if (!subcategory) {
    return {};
  }

  const title = subcategory.seo?.metaTitle ?? subcategory.subcategory;
  const description = formatCollectionDescription(
    subcategory.seo?.metaDescription,
    subcategory.articles.length,
    `Τεκμήρια, άρθρα και πειράματα για την ενότητα ${subcategory.subcategory}.`,
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

export default async function EtaireiaSubcategoryPage({ params }: PageProps) {
  const { subcategory: subcategorySlug } = await params;

  if (subcategorySlug === "index") {
    redirect("/etaireia-psychikon-ereynon");
  }

  const locale = await getRequestLocale();
  const subcategory = await getEtaireiaSubcategory(subcategorySlug, locale);

  if (!subcategory) {
    notFound();
  }

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow="Εταιρεία Ψυχικών Ερευνών"
        title={subcategory.subcategory}
        description={formatCollectionDescription(
          subcategory.seo?.metaDescription,
          subcategory.articles.length,
          `Συλλογή ${subcategory.articles.length} τεκμηρίων για ${subcategory.subcategory}.`,
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
              href={`/etaireia-psychikon-ereynon/${subcategory.subcategorySlug ?? subcategory.slug}/${article.slug}`}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date as string | undefined}
              author={article.author as string | undefined}
              location={location}
              tags={tags}
              image={article.image}
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
