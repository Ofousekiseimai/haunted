import { promises as fs } from "fs";
import path from "path";

import { ensureSlug } from "./slug";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const DATA_ROOT = path.join(process.cwd(), "public", "data");
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const SITE_BASE_URL = "https://haunted.gr";

export type Locale = "el" | "en";
export const DEFAULT_LOCALE: Locale = "el";

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

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveImageSrc(rawSrc?: string | null) {
  if (!rawSrc || typeof rawSrc !== "string") {
    return null;
  }

  const trimmed = rawSrc.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const relativePath = normalized.replace(/^\/+/, "");
  const absolutePath = path.join(PUBLIC_ROOT, relativePath);

  if (await fileExists(absolutePath)) {
    return normalized;
  }

  const parsed = path.parse(relativePath);
  const basePath = path.join(parsed.dir, parsed.name);
  const candidateExts = [".webp", ".jpg", ".jpeg", ".png", ".gif", ".avif"];

  for (const ext of candidateExts) {
    const candidateRelative = `${basePath}${ext}`;
    const candidateAbsolute = path.join(PUBLIC_ROOT, candidateRelative);
    if (await fileExists(candidateAbsolute)) {
      return candidateRelative.startsWith("/") ? candidateRelative : `/${candidateRelative}`;
    }
  }

  try {
    const dirEntries = await fs.readdir(path.join(PUBLIC_ROOT, parsed.dir), { withFileTypes: true });
    const match = dirEntries.find((entry) => entry.isFile() &&
      candidateExts.some((ext) => entry.name.toLowerCase() === `${parsed.name.toLowerCase()}${ext}`));

    if (match) {
      const candidateRelative = path.join(parsed.dir, match.name);
      return candidateRelative.startsWith("/") ? candidateRelative : `/${candidateRelative}`;
    }
  } catch {
    // ignore
  }

  return normalized;
}

async function normalizeArticleImage(image: unknown): Promise<ArticleImage | undefined> {
  if (!image || typeof image !== "object" || typeof (image as { src?: string }).src !== "string") {
    return undefined;
  }

  const src = await resolveImageSrc((image as { src?: string }).src);
  if (!src) {
    return undefined;
  }

  const alt = typeof (image as { alt?: string }).alt === "string" ? (image as { alt?: string }).alt : undefined;
  return {
    ...(image as { alt?: string }),
    src,
    alt,
  };
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
  locale: Locale = DEFAULT_LOCALE,
): Promise<SubcategoryData | null> {
  const localeSuffix = locale === "el" ? "" : `.${locale}`;
  const baseDir = path.join(DATA_ROOT, categoryKey);

  const readWithFallback = async (slug: string) => {
    const primary = await readJsonFile<SubcategoryData>(path.join(baseDir, `${slug}${localeSuffix}.json`));
    if (primary) {
      return primary;
    }

    return readJsonFile<SubcategoryData>(path.join(baseDir, `${slug}.json`));
  };

  let data = await readWithFallback(subcategorySlug);

  if (!data) {
    const fallbackSlug = ensureSlug(subcategorySlug, subcategorySlug);
    if (fallbackSlug !== subcategorySlug) {
      data = await readWithFallback(fallbackSlug);
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
    ? await Promise.all(
        data.articles.map(async (article, index) => {
          const slug = ensureSlug(
            typeof article.slug === "string" ? article.slug : undefined,
            `${article.title ?? "article"}-${article.id ?? index + 1}`,
          );

          const image = await normalizeArticleImage(article.image);

          const normalizedArticle: Article = {
            ...article,
            slug,
            image,
          };

          return applyArticleSeoDefaults(normalizedArticle, {
            canonicalBasePath,
            fallbackKeywords,
          });
        }),
      )
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
  locale: Locale = "el",
) {
  const subcategory = await getSubcategoryData(categoryKey, subcategorySlug, locale);
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

export async function getAllSubcategories(categoryKey: string, locale: Locale = "el") {
  try {
    const dir = path.join(DATA_ROOT, categoryKey);
    const files = (await fs.readdir(dir)).filter((file) => file.endsWith(".json"));

    // Group by base slug so we can pick the locale-specific file when available.
    const grouped = new Map<string, { base?: string; locales: Record<string, string> }>();

    for (const file of files) {
      const localeMatch = file.match(/\.([a-z]{2})\.json$/i);
      const fileLocale = localeMatch?.[1];
      const baseSlug = localeMatch
        ? file.replace(new RegExp(`\\.${fileLocale}\\.json$`, "i"), "")
        : file.replace(/\.json$/, "");

      const entry = grouped.get(baseSlug) ?? { locales: {} };
      if (fileLocale) {
        entry.locales[fileLocale] = file;
      } else {
        entry.base = file;
      }
      grouped.set(baseSlug, entry);
    }

    const selectedFiles: string[] = [];
    grouped.forEach((value) => {
      if (locale !== DEFAULT_LOCALE && value.locales[locale]) {
        selectedFiles.push(value.locales[locale]);
        return;
      }

      if (value.base) {
        selectedFiles.push(value.base);
        return;
      }

      // As a last resort, if no base file exists, fall back to any locale-specific file that matches.
      if (value.locales[DEFAULT_LOCALE]) {
        selectedFiles.push(value.locales[DEFAULT_LOCALE]);
      } else if (locale !== DEFAULT_LOCALE && value.locales[locale]) {
        selectedFiles.push(value.locales[locale]);
      }
    });

    const entries = await Promise.all(
      selectedFiles.map(async (file) => {
        const fileSlug = file.replace(/\.json$/, "");
        const entry = await getSubcategoryData(categoryKey, fileSlug, locale);
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

export async function getAllArticleParamsForCategory(categoryKey: string, locale: Locale = "el") {
  const subcategories = await getAllSubcategories(categoryKey, locale);
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
