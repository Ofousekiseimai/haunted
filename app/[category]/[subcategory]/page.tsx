import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryFilteredList } from "@/components/category/category-filtered-list";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import {
  getAllGenericCategorySubcategoryParams,
  getGenericCategoryCopy,
  getGenericCategorySubcategory,
  isGenericCategoryKey,
  toCategoryArticleSummaries,
} from "@/lib/generic-category";
import { getRequestLocale } from "@/lib/locale-server";

type PageParams = {
  category: string;
  subcategory: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const SITE_BASE_URL = "https://haunted.gr";

export async function generateStaticParams() {
  return getAllGenericCategorySubcategoryParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  if (!isGenericCategoryKey(category)) {
    return {};
  }

  const copy = getGenericCategoryCopy(category);
  const locale = await getRequestLocale();
  const data = await getGenericCategorySubcategory(category, subcategory, locale);

  if (!data) {
    return {};
  }

  const title = data.seo?.metaTitle ?? data.subcategory ?? copy.label;
  const description =
    data.seo?.metaDescription ??
    `Δες ${data.articles.length} τεκμήρια από την ενότητα ${data.subcategory}.`;
  const canonical =
    data.seo?.canonical ?? `${SITE_BASE_URL}/${category}/${data.subcategorySlug ?? subcategory}`;
  const keywords = data.seo?.keywords;

  return {
    title,
    description,
    keywords,
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
      card: "summary",
      title,
      description,
    },
  };
}

export default async function GenericCategorySubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  if (!isGenericCategoryKey(category)) {
    notFound();
  }

  const locale = await getRequestLocale();
  const data = await getGenericCategorySubcategory(category, subcategory, locale);
  if (!data) {
    notFound();
  }

  const copy = getGenericCategoryCopy(category);
  const articles = toCategoryArticleSummaries(data.articles);
  const subcategorySlug = data.subcategorySlug ?? subcategory;

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow={copy.label}
        title={data.subcategory}
        description={
          data.seo?.metaDescription ??
          `Επιλεγμένα τεκμήρια από το αρχείο ${data.subcategory}.`
        }
      />

      <CategoryFilteredList
        categoryKey={category}
        subcategorySlug={subcategorySlug}
        articles={articles}
        locale={locale}
      />

      {data.seo?.structuredData && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.seo.structuredData),
          }}
        />
      )}
    </Section>
  );
}
