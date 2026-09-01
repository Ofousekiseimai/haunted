import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionPreview } from "@/components/category/collection-preview";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import {
  getAllGenericCategorySubcategories,
  getGenericCategoryCopy,
  getGenericCategoryOverview,
  isGenericCategoryAvailable,
  isGenericCategoryKey,
  listAvailableGenericCategoryKeys,
} from "@/lib/generic-category";
import { getRequestLocale } from "@/lib/locale-server";

type PageParams = {
  category: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const SITE_BASE_URL = "https://haunted.gr";

export async function generateStaticParams() {
  const categories = await listAvailableGenericCategoryKeys();
  return categories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isGenericCategoryKey(category)) {
    return {};
  }

  if (!(await isGenericCategoryAvailable(category))) {
    return {};
  }

  const copy = getGenericCategoryCopy(category);
  const overview = await getGenericCategoryOverview(category);

  const title = overview?.seo?.metaTitle ?? copy.label;
  const description =
    overview?.seo?.metaDescription ?? overview?.description ?? copy.description;
  const canonical = overview?.seo?.canonical ?? `${SITE_BASE_URL}/${category}`;
  const keywords = overview?.seo?.keywords;

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
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GenericCategoryIndexPage({ params }: PageProps) {
  const { category } = await params;
  if (!isGenericCategoryKey(category)) {
    notFound();
  }

  if (!(await isGenericCategoryAvailable(category))) {
    notFound();
  }

  const locale = await getRequestLocale();
  const [overview, subcategories] = await Promise.all([
    getGenericCategoryOverview(category),
    getAllGenericCategorySubcategories(category, locale),
  ]);

  const copy = getGenericCategoryCopy(category);
  const totalArticles =
    overview?.totalArticles ??
    subcategories.reduce((count, subcategory) => count + (subcategory.articles?.length ?? 0), 0);

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={overview?.title ?? copy.label}
        description={
          overview?.seo?.metaDescription ??
          overview?.description ??
          copy.description
        }
        actions={
          totalArticles > 0 ? (
            <span className="mono">
              {totalArticles} {locale === "en" ? "records" : "τεκμήρια"}
            </span>
          ) : undefined
        }
      />

      <div>
        {subcategories.map((subcategory) => {
          const slug = subcategory.subcategorySlug ?? subcategory.slug;
          return (
            <CollectionPreview
              key={slug}
              title={subcategory.subcategory}
              href={`/${category}/${slug}`}
              articles={(subcategory.articles ?? []).slice(0, 3)}
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
    </Section>
  );
}
