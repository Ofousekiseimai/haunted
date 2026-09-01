import type { Metadata } from "next";

import { ArticleView } from "@/components/article/article-view";
import { notFound } from "next/navigation";

import { ArticleSources, type ArticleSource } from "@/components/article/article-sources";
import { LocationDetails } from "@/components/article/location-details";
import { RandomArticles } from "@/components/article/random-articles";
import { RelatedArticles } from "@/components/article/related-articles";
import { SameAreaArticles } from "@/components/article/same-area-articles";
import {
  getAllGenericCategoryArticleParams,
  getGenericCategoryArticle,
  getGenericCategoryCopy,
  isGenericCategoryKey,
} from "@/lib/generic-category";
import { getRequestLocale } from "@/lib/locale-server";

type PageParams = {
  category: string;
  subcategory: string;
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const SITE_BASE_URL = "https://haunted.gr";

function toAbsoluteUrl(url?: string | null) {
  if (!url) {
    return undefined;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith("/")) {
    return new URL(trimmed, SITE_BASE_URL).toString();
  }

  if (/^https?:\/\//.test(trimmed)) {
    return trimmed;
  }

  try {
    return new URL(trimmed, SITE_BASE_URL).toString();
  } catch {
    return undefined;
  }
}


export async function generateStaticParams() {
  return getAllGenericCategoryArticleParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory, slug } = await params;
  if (!isGenericCategoryKey(category)) {
    return {};
  }

  const locale = await getRequestLocale();
  const data = await getGenericCategoryArticle(category, subcategory, slug, locale);
  if (!data) {
    return {};
  }

  const { article, subcategory: subcategoryData } = data;

  const seo = article.seo ?? {};
  const title = seo.metaTitle ?? article.title;
  const description =
    seo.metaDescription ??
    article.excerpt ??
    subcategoryData.seo?.metaDescription ??
    `Άρθρο από την ενότητα ${subcategoryData.subcategory}.`;
  const canonical =
    seo.canonical ??
    `${SITE_BASE_URL}/${category}/${subcategoryData.subcategorySlug ?? subcategory}/${article.slug}`;
  const imageUrl = toAbsoluteUrl(article.image?.src);
  const keywords = seo.keywords ?? subcategoryData.seo?.keywords;

  const mainArea = (article as { mainArea?: string }).mainArea;
  const latRaw = (article as { lat?: number | string }).lat;
  const lngRaw = (article as { lng?: number | string }).lng;
  const latitude =
    typeof latRaw === "number" ? latRaw : typeof latRaw === "string" ? Number(latRaw) : undefined;
  const longitude =
    typeof lngRaw === "number" ? lngRaw : typeof lngRaw === "string" ? Number(lngRaw) : undefined;

  const otherMeta: Record<string, string> = { "geo.region": "GR" };
  if (typeof mainArea === "string" && mainArea.trim().length > 0) {
    otherMeta["geo.placename"] = mainArea.trim();
  }
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    otherMeta["geo.position"] = `${latitude};${longitude}`;
    otherMeta["ICBM"] = `${latitude}, ${longitude}`;
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    other: otherMeta,
  };
}

export default async function GenericCategoryArticlePage({ params }: PageProps) {
  const { category, subcategory, slug } = await params;
  if (!isGenericCategoryKey(category)) {
    notFound();
  }

  const locale = await getRequestLocale();
  const data = await getGenericCategoryArticle(category, subcategory, slug, locale);
  if (!data) {
    notFound();
  }

  const { article, subcategory: subcategoryData } = data;
  const copy = getGenericCategoryCopy(category);
  const imageUrl = toAbsoluteUrl(article.image?.src);

  const sources: ArticleSource[] = [];
  if (Array.isArray(article.sources)) {
    sources.push(...(article.sources as ArticleSource[]));
  } else if (article.sources) {
    sources.push(article.sources as ArticleSource);
  }
  if (article.source) {
    sources.push(article.source as ArticleSource);
  }

  const mainArea = (article as { mainArea?: string }).mainArea;
  const subLocation = (article as { subLocation?: string }).subLocation;
  const subLocation2 = (article as { subLocation2?: string }).subLocation2;
  const latRaw = (article as { lat?: number | string }).lat;
  const lngRaw = (article as { lng?: number | string }).lng;
  const latitude =
    typeof latRaw === "number" ? latRaw : typeof latRaw === "string" ? Number(latRaw) : undefined;
  const longitude =
    typeof lngRaw === "number" ? lngRaw : typeof lngRaw === "string" ? Number(lngRaw) : undefined;

  const subcategorySlug = subcategoryData.subcategorySlug ?? subcategory;
  const canonicalPath = `/${category}/${subcategorySlug}/${article.slug}`;
  const canonicalUrl = toAbsoluteUrl(canonicalPath) ?? canonicalPath;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Αρχική",
        item: `${SITE_BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.label,
        item: `${SITE_BASE_URL}/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  const fallbackArticleStructuredData = article.seo?.structuredData
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description:
          article.excerpt ??
          article.seo?.metaDescription ??
          subcategoryData.seo?.metaDescription ??
          undefined,
        datePublished: article.date,
        author: article.author
          ? {
              "@type": "Person",
              name: article.author,
            }
          : undefined,
        publisher: {
          "@type": "Organization",
          name: "haunted.gr",
          logo: {
            "@type": "ImageObject",
            url: `${SITE_BASE_URL}/haunted-logo.webp`,
            width: 300,
            height: 60,
          },
        },
        image: imageUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        spatialCoverage:
          typeof mainArea === "string" && mainArea.trim().length > 0
            ? {
                "@type": "Place",
                name: mainArea,
                geo:
                  Number.isFinite(latitude) && Number.isFinite(longitude)
                    ? {
                        "@type": "GeoCoordinates",
                        latitude,
                        longitude,
                      }
                    : undefined,
              }
            : undefined,
      };

  return (
    <ArticleView
      categoryLabel={copy.label}
      subcategoryLabel={subcategoryData.subcategory}
      title={article.title}
      author={typeof article.author === "string" ? article.author : undefined}
      date={typeof article.date === "string" ? article.date : undefined}
      excerpt={article.excerpt}
      image={imageUrl ? { src: imageUrl, alt: article.image?.alt } : undefined}
      content={article.content}
      variant="plates"
      locale={locale}
    >

      {/* Sources, location and JSON-LD stay in the reading column;
          the card grids below are wider on purpose. */}
      <div className="article__col">
        <LocationDetails
          mainArea={mainArea}
          subLocation={subLocation}
          subLocation2={subLocation2}
          locale={locale}
        />

        <ArticleSources
          sources={sources}
          articleDate={typeof article.date === "string" ? article.date : undefined}
          articleAuthor={typeof article.author === "string" ? article.author : undefined}
          locale={locale}
        />

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />

        {fallbackArticleStructuredData && (
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(fallbackArticleStructuredData),
            }}
          />
        )}

      </div>

      <RelatedArticles
        subcategorySlug={subcategorySlug}
        currentArticleId={article.id}
      />

      <SameAreaArticles mainArea={mainArea} currentArticleId={article.id} />

      <RandomArticles currentArticleId={article.id} />

      {article.seo?.structuredData && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(article.seo.structuredData),
          }}
        />
      )}
    </ArticleView>
  );
}
