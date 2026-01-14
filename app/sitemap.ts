import type { MetadataRoute } from "next";

import { getAllSubcategories } from "@/lib/content";

const BASE_URL = "https://haunted.gr";

type StaticRoute = {
  path: string;
  priority?: number;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", priority: 1 },
  { path: "/laografia", priority: 0.9 },
  { path: "/etaireia-psychikon-ereynon", priority: 0.9 },
  { path: "/efimerides", priority: 0.9 },
  { path: "/map", priority: 0.6 },
  { path: "/map2", priority: 0.6 },
  { path: "/about-us", priority: 0.5 },
  { path: "/terms", priority: 0.3 },
  { path: "/privacy", priority: 0.3 },
];

const CATEGORY_KEYS = [
  "laografia",
  "efimerides",
  "etaireia-psychikon-ereynon",
] as const;

function toAbsoluteUrl(pathname: string) {
  if (!pathname) {
    return BASE_URL;
  }

  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${BASE_URL}${normalized.replace(/\/{2,}/g, "/")}`;
}

function parseDate(value: unknown): Date | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return undefined;
}

function getLatestArticleDate(
  articles: Array<{ date?: unknown; updatedAt?: unknown }> = [],
): Date | undefined {
  let latest: Date | undefined;

  for (const article of articles) {
    const candidates = [article.updatedAt, article.date];

    for (const candidate of candidates) {
      const parsed = parseDate(candidate);
      if (!parsed) {
        continue;
      }

      if (!latest || parsed > latest) {
        latest = parsed;
      }
    }
  }

  return latest;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date();
  const items: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: toAbsoluteUrl(route.path),
    lastModified: today,
    priority: route.priority,
    changeFrequency: route.changeFrequency,
  }));

  for (const categoryKey of CATEGORY_KEYS) {
    const subcategories = await getAllSubcategories(categoryKey);

    subcategories.forEach((subcategory) => {
      const subcategorySlug =
        subcategory.subcategorySlug ?? subcategory.slug ?? "";
      const subcategoryPath =
        typeof subcategory.slug === "string" && subcategory.slug.length > 0
          ? subcategory.slug
          : `/${categoryKey}/${subcategorySlug}`;

      const subcategoryLastModified =
        getLatestArticleDate(subcategory.articles) ?? today;

      items.push({
        url: toAbsoluteUrl(subcategoryPath),
        lastModified: subcategoryLastModified,
        priority: 0.6,
      });

      subcategory.articles.forEach((article) => {
        const articleSlug = typeof article.slug === "string" ? article.slug : "";
        if (!articleSlug) {
          return;
        }

        const articlePath = `/${categoryKey}/${subcategorySlug}/${articleSlug}`;
        const articleLastModified =
          parseDate(article.updatedAt) ??
          parseDate(article.date) ??
          subcategoryLastModified;

        const imageSrc =
          article.image && typeof article.image.src === "string"
            ? toAbsoluteUrl(article.image.src)
            : undefined;

        items.push({
          url: toAbsoluteUrl(articlePath),
          lastModified: articleLastModified ?? subcategoryLastModified,
          priority: 0.7,
          images: imageSrc ? [imageSrc] : undefined,
        });
      });
    });
  }

  return items;
}
