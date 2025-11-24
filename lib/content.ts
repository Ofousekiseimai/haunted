import { promises as fs } from "fs";
import path from "path";

import { ensureSlug } from "./slug";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const DATA_ROOT = path.join(process.cwd(), "public", "data");
const SITE_BASE_URL = "https://haunted.gr";

export interface ArticleImage {
  src: string;
  alt?: string;
}

export interface ArticleContentBlock {
  type: string;
  value?: string;
  heading?: string;
  items?: string[];
}

export interface ArticleSeo {
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  keywords?: string[];
  structuredData?: JsonValue;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  author?: string;
  date?: string;
  excerpt?: string;
  image?: ArticleImage;
  content: ArticleContentBlock[];
  seo?: ArticleSeo;
  [key: string]: JsonValue | ArticleImage | ArticleContentBlock[] | ArticleSeo | undefined;
}

export type SubcategorySeo = ArticleSeo;

export interface SubcategoryData {
  category: string;
  slug: string;
  subcategory: string;
  subcategorySlug: string;
  seo?: SubcategorySeo;
  articles: Article[];
}

export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to read JSON file at ${filePath}:`, error);
    return null;
  }
}

export async function getSubcategoryData(
  categoryKey: string,
  subcategorySlug: string,
): Promise<SubcategoryData | null> {
  let data = await readJsonFile<SubcategoryData>(
    path.join(DATA_ROOT, categoryKey, `${subcategorySlug}.json`),
  );

  if (!data) {
    const fallbackSlug = ensureSlug(subcategorySlug, subcategorySlug);
    if (fallbackSlug !== subcategorySlug) {
      data = await readJsonFile<SubcategoryData>(
        path.join(DATA_ROOT, categoryKey, `${fallbackSlug}.json`),
      );
    }
  }

  if (!data) {
    return null;
  }

  const sanitizedSubcategorySlug = ensureSlug(
    data.subcategorySlug ?? subcategorySlug,
    data.subcategory ?? subcategorySlug,
  );

  const canonicalBasePath = resolveCanonicalBasePath(data.slug, categoryKey, sanitizedSubcategorySlug);
  const fallbackKeywords = data.seo?.keywords;

  const articles = Array.isArray(data.articles)
    ? data.articles.map((article, index) => {
        const slug = ensureSlug(
          typeof article.slug === "string" ? article.slug : undefined,
          `${article.title ?? "article"}-${article.id ?? index + 1}`,
        );

        const image =
          article.image && typeof article.image === "object" && typeof article.image.src === "string"
            ? {
                ...article.image,
                src: article.image.src.startsWith("/") ? article.image.src : `/${article.image.src}`,
              }
            : undefined;

        const normalizedArticle: Article = {
          ...article,
          slug,
          image,
        };

        return applyArticleSeoDefaults(normalizedArticle, {
          canonicalBasePath,
          fallbackKeywords,
        });
      })
    : [];

  return {
    ...data,
    subcategorySlug: sanitizedSubcategorySlug,
    articles,
  };
}

export async function getArticleFromCategory(
  categoryKey: string,
  subcategorySlug: string,
  articleSlug: string,
) {
  const subcategory = await getSubcategoryData(categoryKey, subcategorySlug);
  if (!subcategory) {
    return null;
  }

  const normalizedSlug = ensureSlug(articleSlug, articleSlug);
  const article = subcategory.articles.find((entry) => ensureSlug(entry.slug) === normalizedSlug);
  if (!article) {
    return null;
  }

  return { subcategory, article };
}

export async function getAllSubcategories(categoryKey: string) {
  try {
    const dir = path.join(DATA_ROOT, categoryKey);
    const files = await fs.readdir(dir);

    const entries = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const fileSlug = file.replace(/\.json$/, "");
          const entry = await getSubcategoryData(categoryKey, fileSlug);
          return {
            entry,
            fileSlug,
          };
        }),
    );

    return entries
      .filter(
        (item): item is { entry: SubcategoryData; fileSlug: string } =>
          item.entry !== null &&
          Array.isArray(item.entry.articles) &&
          item.entry.articles.length > 0,
      )
      .map(({ entry }) => entry);
  } catch (error) {
    console.warn(`Failed to enumerate subcategories for ${categoryKey}:`, error);
    return [];
  }
}

export async function getAllArticleParamsForCategory(categoryKey: string) {
  const subcategories = await getAllSubcategories(categoryKey);
  const params: Array<{ subcategory: string; slug: string }> = [];

  subcategories.forEach((subcategory) => {
    subcategory.articles.forEach((article) => {
      params.push({
        subcategory: subcategory.subcategorySlug ?? subcategory.slug,
        slug: article.slug,
      });
    });
  });

  return params;
}

function resolveCanonicalBasePath(
  dataSlug: JsonValue | undefined,
  categoryKey: string,
  subcategorySlug: string,
) {
  const fallback = `/${[categoryKey, subcategorySlug].map(trimSlashes).join("/")}`;

  if (typeof dataSlug !== "string") {
    return fallback;
  }

  const trimmed = dataSlug.trim();
  if (!trimmed) {
    return fallback;
  }

  if (/^https?:\/\//.test(trimmed)) {
    return trimmed.replace(/\/+$/, "");
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return normalized.replace(/\/+$/, "");
}

function buildArticleCanonicalUrl(basePath: string, articleSlug: string) {
  const normalizedSlug = trimSlashes(articleSlug);
  if (!normalizedSlug) {
    return basePath.startsWith("http") ? basePath : `${SITE_BASE_URL}${basePath}`;
  }

  if (basePath.startsWith("http://") || basePath.startsWith("https://")) {
    const prefix = basePath.replace(/\/+$/, "");
    return `${prefix}/${normalizedSlug}`;
  }

  const cleanedBase = basePath ? basePath.replace(/\/+$/, "") : "";
  const normalizedBase = cleanedBase.startsWith("/") ? cleanedBase : `/${trimSlashes(cleanedBase)}`;
  const relativePath = normalizedBase === "/" ? `/${normalizedSlug}` : `${normalizedBase}/${normalizedSlug}`;
  return `${SITE_BASE_URL}${relativePath}`;
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function normalizeKeywordsList(keywords?: JsonValue) {
  if (!Array.isArray(keywords)) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  keywords.forEach((keyword) => {
    if (typeof keyword !== "string") {
      return;
    }
    const trimmed = keyword.trim();
    if (!trimmed || seen.has(trimmed)) {
      return;
    }
    seen.add(trimmed);
    normalized.push(trimmed);
  });

  return normalized;
}

function applyArticleSeoDefaults(
  article: Article,
  options: { canonicalBasePath: string; fallbackKeywords?: JsonValue },
) {
  const rawSeo = article.seo;
  const normalizedSeo: ArticleSeo = rawSeo ? { ...rawSeo } : {};
  let changed = false;

  if (!normalizedSeo.canonical) {
    normalizedSeo.canonical = buildArticleCanonicalUrl(options.canonicalBasePath, article.slug);
    changed = true;
  }

  const articleKeywords = normalizeKeywordsList(normalizedSeo.keywords);
  const fallbackKeywords = normalizeKeywordsList(options.fallbackKeywords);

  if (articleKeywords.length > 0) {
    if (
      !normalizedSeo.keywords ||
      normalizedSeo.keywords.length !== articleKeywords.length ||
      normalizedSeo.keywords.some((value, index) => value !== articleKeywords[index])
    ) {
      normalizedSeo.keywords = articleKeywords;
      changed = true;
    }
  } else if (fallbackKeywords.length > 0) {
    normalizedSeo.keywords = fallbackKeywords;
    changed = true;
  } else if (normalizedSeo.keywords) {
    delete normalizedSeo.keywords;
    changed = true;
  }

  if (!changed) {
    return article;
  }

  return {
    ...article,
    seo: normalizedSeo,
  };
}
