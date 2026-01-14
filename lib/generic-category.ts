import { promises as fs } from "fs";
import path from "path";

import {
  getAllArticleParamsForCategory,
  getAllSubcategories,
  getArticleFromCategory,
  getSubcategoryData,
  readJsonFile,
  DEFAULT_LOCALE,
  type Locale,
  type Article,
  type ArticleImage,
  type SubcategoryData,
  type SubcategorySeo,
} from "./content";

export const GENERIC_CATEGORY_KEYS = ["prosopa", "entipa"] as const;

export type GenericCategoryKey = (typeof GENERIC_CATEGORY_KEYS)[number];

export type GenericCategoryOverview = {
  title?: string;
  description?: string;
  totalArticles?: number;
  seo?: SubcategorySeo;
};

export type GenericCategoryArticle = Article & {
  mainArea?: string;
  subLocation?: string;
  subLocation2?: string;
  locationTags?: string[];
  year?: string | number;
};

export type GenericCategorySubcategory = SubcategoryData & {
  articles: GenericCategoryArticle[];
};

const DATA_ROOT = path.join(process.cwd(), "public", "data");

const CATEGORY_COPY: Record<
  GenericCategoryKey,
  {
    label: string;
    eyebrow: string;
    description: string;
    articleCta: string;
  }
> = {
  prosopa: {
    label: "Πρόσωπα",
    eyebrow: "Αρχείο Βιογραφιών",
    description:
      "Βιογραφικά στιγμιότυπα, ερευνητές και μάρτυρες που διαμόρφωσαν την ιστορία του μεταφυσικού στην Ελλάδα.",
    articleCta: "Δείτε το αρχείο →",
  },
  entipa: {
    label: "Έντυπα",
    eyebrow: "Σπάνιες Εκδόσεις",
    description:
      "Συλλογή από περιοδικά, φυλλάδια και εκδόσεις που κατέγραψαν ανεξήγητα φαινόμενα, λαογραφικά μοτίβα και αποκρυφιστικές έρευνες.",
    articleCta: "Εξερευνήστε τα έντυπα →",
  },
};

function getDataDir(categoryKey: GenericCategoryKey) {
  return path.join(DATA_ROOT, categoryKey);
}

function sortArticlesByIdDescending<T extends Article>(articles: T[]) {
  return [...articles].sort((a, b) => {
    const aId = Number((a as { id?: string | number }).id ?? 0);
    const bId = Number((b as { id?: string | number }).id ?? 0);
    return bId - aId;
  });
}

export function isGenericCategoryKey(value: string): value is GenericCategoryKey {
  return (GENERIC_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function getGenericCategoryCopy(categoryKey: GenericCategoryKey) {
  return CATEGORY_COPY[categoryKey];
}

export async function getGenericCategoryOverview(
  categoryKey: GenericCategoryKey,
): Promise<GenericCategoryOverview | null> {
  const indexFile = path.join(getDataDir(categoryKey), "index.json");

  try {
    await fs.access(indexFile);
  } catch {
    return null;
  }

  return readJsonFile<GenericCategoryOverview>(indexFile);
}

export async function getGenericCategorySubcategory(
  categoryKey: GenericCategoryKey,
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<GenericCategorySubcategory | null> {
  if (!(await subcategoryFileExists(categoryKey, slug))) {
    return null;
  }

  const data = await getSubcategoryData(categoryKey, slug, locale);
  if (!data) {
    return null;
  }

  return {
    ...data,
    articles: sortArticlesByIdDescending(data.articles ?? []) as GenericCategoryArticle[],
  };
}

export async function getAllGenericCategorySubcategories(
  categoryKey: GenericCategoryKey,
  locale: Locale = DEFAULT_LOCALE,
) {
  if (!(await categoryDataDirExists(categoryKey))) {
    return [];
  }

  const subcategories = await getAllSubcategories(categoryKey, locale);
  return subcategories.map((subcategory) => ({
    ...subcategory,
    articles: sortArticlesByIdDescending(
      subcategory.articles ?? [],
    ) as GenericCategoryArticle[],
  }));
}

export async function getGenericCategoryArticle(
  categoryKey: GenericCategoryKey,
  subcategorySlug: string,
  articleSlug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  return getArticleFromCategory(categoryKey, subcategorySlug, articleSlug, locale);
}

export async function getAllGenericCategorySubcategoryParams(locale: Locale = DEFAULT_LOCALE) {
  const params: Array<{ category: GenericCategoryKey; subcategory: string }> = [];

  for (const categoryKey of GENERIC_CATEGORY_KEYS) {
    if (!(await categoryDataDirExists(categoryKey))) {
      continue;
    }

    const subcategories = await getAllGenericCategorySubcategories(categoryKey, locale);
    for (const subcategory of subcategories) {
      params.push({
        category: categoryKey,
        subcategory: subcategory.subcategorySlug ?? subcategory.slug,
      });
    }
  }

  return params;
}

export async function getAllGenericCategoryArticleParams(locale: Locale = DEFAULT_LOCALE) {
  const params: Array<{ category: GenericCategoryKey; subcategory: string; slug: string }> = [];

  for (const categoryKey of GENERIC_CATEGORY_KEYS) {
    if (!(await categoryDataDirExists(categoryKey))) {
      continue;
    }

    const entries = await getAllArticleParamsForCategory(categoryKey, locale);
    entries.forEach((entry) => {
      params.push({
        category: categoryKey,
        subcategory: entry.subcategory,
        slug: entry.slug,
      });
    });
  }

  return params;
}

function addSubLocation(target: string[], value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length > 0 && !target.includes(trimmed)) {
      target.push(trimmed);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => addSubLocation(target, entry));
  }
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .flatMap((entry) => {
      if (typeof entry !== "string") {
        return [];
      }

      const trimmed = entry.trim();
      return trimmed.length > 0 ? [trimmed] : [];
    })
    .filter((entry, index, array) => array.indexOf(entry) === index);
}

function extractYear(value?: string | number | null) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const yearMatch = trimmed.match(/(\d{4})/);
  if (yearMatch) {
    return yearMatch[1];
  }

  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    try {
      return new Intl.DateTimeFormat("el-GR", {
        year: "numeric",
      }).format(parsed);
    } catch {
      return new Date(parsed).getFullYear().toString();
    }
  }

  return null;
}

export type CategoryArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image?: ArticleImage;
  date?: string;
  author?: string;
  mainArea?: string;
  subLocations: string[];
  locationTags: string[];
  year?: string;
};

export function toCategoryArticleSummaries(articles: Article[]): CategoryArticleSummary[] {
  return articles
    .filter((article) => Boolean(article.slug) && Boolean(article.title))
    .map((article) => {
      const mainArea = (() => {
        const value = (article as GenericCategoryArticle).mainArea;
        if (typeof value === "string") {
          const trimmed = value.trim();
          return trimmed.length > 0 ? trimmed : undefined;
        }
        return undefined;
      })();

      const subLocations: string[] = [];
      const withMeta = article as GenericCategoryArticle;
      addSubLocation(subLocations, withMeta.subLocation);
      addSubLocation(subLocations, withMeta.subLocation2);

      const yearValue = withMeta.year ?? article.date;
      const year = extractYear(yearValue);

      return {
        id: String(article.id),
        slug: article.slug,
        title: article.title,
        excerpt: typeof article.excerpt === "string" ? article.excerpt : undefined,
        image: article.image,
        date: typeof article.date === "string" ? article.date : undefined,
        author: typeof article.author === "string" ? article.author : undefined,
        mainArea,
        subLocations,
        locationTags: normalizeTags(withMeta.locationTags),
        year: year ?? undefined,
      };
    });
}

export async function findGenericCategorySubcategoryBySlug(
  subcategorySlug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  for (const categoryKey of GENERIC_CATEGORY_KEYS) {
    const subcategory = await getGenericCategorySubcategory(categoryKey, subcategorySlug, locale);
    if (subcategory) {
      return {
        categoryKey,
        subcategory,
      };
    }
  }

  return null;
}
async function categoryDataDirExists(categoryKey: GenericCategoryKey) {
  try {
    await fs.access(getDataDir(categoryKey));
    return true;
  } catch {
    return false;
  }
}

async function subcategoryFileExists(categoryKey: GenericCategoryKey, slug: string) {
  const filePath = path.join(getDataDir(categoryKey), `${slug}.json`);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function isGenericCategoryAvailable(categoryKey: GenericCategoryKey) {
  return categoryDataDirExists(categoryKey);
}

export async function listAvailableGenericCategoryKeys() {
  const keys: GenericCategoryKey[] = [];
  for (const categoryKey of GENERIC_CATEGORY_KEYS) {
    if (await categoryDataDirExists(categoryKey)) {
      keys.push(categoryKey);
    }
  }
  return keys;
}
