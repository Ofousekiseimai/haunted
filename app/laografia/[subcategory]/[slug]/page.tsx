import type { Metadata } from "next";

import { ArticleView } from "@/components/article/article-view";
import { notFound } from "next/navigation";

import { LocationDetails } from "@/components/article/location-details";
import { ArticleSources, type ArticleSource } from "@/components/article/article-sources";
import { RelatedArticles } from "@/components/article/related-articles";
import { SameAreaArticles } from "@/components/article/same-area-articles";
import { RandomArticles } from "@/components/article/random-articles";
import { getAllLaografiaArticleParams, getLaografiaArticle } from "@/lib/laografia";
import { getRequestLocale } from "@/lib/locale-server";
import { translateCategoryLabel, translateSubcategoryLabel } from "@/lib/translations";

const SITE_BASE_URL = "https://haunted.gr";

type PageParams = {
  subcategory: string;
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

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
  return getAllLaografiaArticleParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory: subcategorySlug, slug } = await params;
  const locale = await getRequestLocale();
  const data = await getLaografiaArticle(subcategorySlug, slug, locale);

  if (!data) {
    return {};
  }

  const { article, subcategory } = data;
  const articleSeo = article.seo ?? {};
  const title = articleSeo.metaTitle ?? article.title;
  const description =
    articleSeo.metaDescription ??
    article.excerpt ??
    subcategory.seo?.metaDescription ??
    `Άρθρο από την ενότητα ${subcategory.subcategory}.`;
  const canonicalUrl =
    articleSeo.canonical ??
    `/laografia/${subcategory.subcategorySlug}/${article.slug}`;
  const absoluteCanonical = toAbsoluteUrl(canonicalUrl);
  const imageUrl = toAbsoluteUrl(article.image?.src);
  const keywords = articleSeo.keywords ?? subcategory.seo?.keywords;

  const mainArea = (article as { mainArea?: string }).mainArea;
  const latRaw = (article as { lat?: number | string }).lat;
  const lngRaw = (article as { lng?: number | string }).lng;
  const latitude = typeof latRaw === "number" ? latRaw : typeof latRaw === "string" ? Number(latRaw) : undefined;
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
    alternates: absoluteCanonical
      ? {
          canonical: absoluteCanonical,
        }
      : undefined,
    keywords,
    openGraph: {
      type: "article",
      title,
      description,
      url: absoluteCanonical,
      images: imageUrl
        ? [
            {
              url: imageUrl,
            },
          ]
        : undefined,
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

export default async function LaografiaArticlePage({ params }: PageProps) {
  const { subcategory: subcategorySlug, slug } = await params;
  const locale = await getRequestLocale();
  const data = await getLaografiaArticle(subcategorySlug, slug, locale);

  if (!data) {
    notFound();
  }

  const { article, subcategory } = data;
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

  const localizedCategory = translateCategoryLabel(subcategory.category, subcategory.category, locale);
  const localizedSubcategory = translateSubcategoryLabel(
    subcategory.subcategorySlug ?? subcategory.slug,
    subcategory.subcategory,
    locale,
  );

  const mainArea = (article as { mainArea?: string }).mainArea;
  const subLocation = (article as { subLocation?: string }).subLocation;
  const subLocation2 = (article as { subLocation2?: string }).subLocation2;
  const latRaw = (article as { lat?: number | string }).lat;
  const lngRaw = (article as { lng?: number | string }).lng;
  const latitude = typeof latRaw === "number" ? latRaw : typeof latRaw === "string" ? Number(latRaw) : undefined;
  const longitude =
    typeof lngRaw === "number" ? lngRaw : typeof lngRaw === "string" ? Number(lngRaw) : undefined;

  const canonicalPath = `/laografia/${subcategory.subcategorySlug ?? subcategory.slug}/${article.slug}`;
  const canonicalUrl = toAbsoluteUrl(canonicalPath) ?? canonicalPath;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Αρχική",
        item: "https://haunted.gr/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: subcategory.category,
        item: `https://haunted.gr/${subcategory.category}`,
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
          subcategory.seo?.metaDescription ??
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
            url: "https://haunted.gr/haunted-logo.webp",
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
      categoryLabel={localizedCategory}
      subcategoryLabel={localizedSubcategory}
      title={article.title}
      author={typeof article.author === "string" ? article.author : undefined}
      date={typeof article.date === "string" ? article.date : undefined}
      excerpt={article.excerpt}
      image={article.image?.src ? { src: article.image.src, alt: article.image?.alt } : undefined}
      content={article.content}
      variant="gallery"
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
        subcategorySlug={subcategory.subcategorySlug ?? subcategory.slug}
        currentArticleId={article.id}
      />

      <SameAreaArticles mainArea={mainArea} currentArticleId={article.id} />

      <RandomArticles currentArticleId={article.id} />

      {article.seo?.structuredData && (
        <script
          type="application/ld+json"
          // Prevent hydration mismatch for pre-serialized JSON-LD.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(article.seo.structuredData),
          }}
        />
      )}
    </ArticleView>
  );
}
