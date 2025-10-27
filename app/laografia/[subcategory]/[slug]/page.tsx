import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationDetails } from "@/components/article/location-details";
import { ArticleSources, type ArticleSource } from "@/components/article/article-sources";
import { RelatedArticles } from "@/components/article/related-articles";
import { SameAreaArticles } from "@/components/article/same-area-articles";
import { RandomArticles } from "@/components/article/random-articles";
import { Section } from "@/components/section";
import { getAllLaografiaArticleParams, getLaografiaArticle, type ArticleContentBlock } from "@/lib/laografia";

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

  if (/^https?:\/\//.test(url)) {
    return url;
  }

  try {
    return new URL(url, SITE_BASE_URL).toString();
  } catch {
    return undefined;
  }
}

function renderContentBlock(block: ArticleContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2 key={index} className="mt-10 text-2xl font-semibold text-n-1">
          {block.value ?? block.heading}
        </h2>
      );
    case "list":
      if (!block.items?.length) {
        return null;
      }
      return (
        <ul key={index} className="mt-6 list-disc space-y-2 pl-6 text-base text-n-2">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="quote mt-8 border-l-4 border-color-1/40 pl-4 text-n-1"
        >
          {block.value}
        </blockquote>
      );
    case "image": {
      const payload = block.value as
        | {
            src?: string;
            alt?: string;
            caption?: string;
          }
        | null
        | undefined;

      if (!payload || typeof payload !== "object" || typeof payload.src !== "string") {
        return null;
      }

      return (
        <figure key={index} className="mt-10 space-y-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-n-7 bg-n-8">
            <Image
              src={payload.src}
              alt={payload.alt ?? "Εικόνα άρθρου"}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 720px, 100vw"
            />
          </div>
          {payload.caption && (
            <figcaption className="text-sm italic text-n-4">{payload.caption}</figcaption>
          )}
        </figure>
      );
    }
    case "text":
      return (
        <p key={index} className="mt-6 text-base leading-7 text-n-2">
          {block.value}
        </p>
      );
    default:
      if (block.value) {
        return (
          <p key={index} className="mt-6 text-base leading-7 text-n-2">
            {block.value}
          </p>
        );
      }
      return null;
  }
}

export async function generateStaticParams() {
  return getAllLaografiaArticleParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory: subcategorySlug, slug } = await params;
  const data = await getLaografiaArticle(subcategorySlug, slug);

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
  const data = await getLaografiaArticle(subcategorySlug, slug);

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

  const rawTags = (article as { tags?: string[] }).tags;
  const tags =
    Array.isArray(rawTags) && rawTags.length > 0
      ? rawTags.filter((tag): tag is string => typeof tag === "string")
      : null;
  const mainArea = (article as { mainArea?: string }).mainArea;
  const subLocation = (article as { subLocation?: string }).subLocation;
  const subLocation2 = (article as { subLocation2?: string }).subLocation2;
  const locationTags = (article as { locationTags?: string[] }).locationTags;
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
            url: "https://haunted.gr/logo.png",
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
    <Section className="container max-w-4xl space-y-10" customPaddings="py-12 lg:py-20">
      <header className="flex flex-col gap-6">
        <span className="text-xs font-code uppercase tracking-widest text-n-4">
          {subcategory.category} · {subcategory.subcategory}
        </span>
        <h1 className="text-4xl font-bold text-n-1">
          {article.title}
        </h1>
        {(article.author || article.date) && (
          <p className="text-sm text-n-4">
            {article.author && <span>{article.author}</span>}
            {article.author && article.date && <span> · </span>}
            {article.date && <span>{article.date}</span>}
          </p>
        )}
        {article.excerpt && (
          <p className="text-lg text-n-2">{article.excerpt}</p>
        )}
        {imageUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-n-7 bg-n-8">
            <Image
              src={imageUrl}
              alt={article.image?.alt ?? article.title}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
            />
          </div>
        )}
      </header>

      <div className="mt-10 space-y-6 text-base leading-7 text-n-2">
        {article.content.map((block, index) => renderContentBlock(block, index))}
      </div>

      <LocationDetails
        mainArea={mainArea}
        subLocation={subLocation}
        subLocation2={subLocation2}
        locationTags={locationTags}
      />

      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-n-7 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-n-3"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <ArticleSources sources={sources} />

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
    </Section>
  );
}
