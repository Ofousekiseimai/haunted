import { promises as fs } from "fs";
import path from "path";

import {
  getAllArticleParamsForCategory,
  getAllSubcategories,
  getArticleFromCategory,
  getSubcategoryData,
  readJsonFile,
  type Article,
  type SubcategoryData,
} from "./content";

const CATEGORY_KEY = "efimerides";

export type EfimeridesArticle = Article & {
  mainArea?: string;
  subLocation?: string;
  subLocation2?: string;
  locationTags?: string[];
};

export type EfimeridesSubcategory = SubcategoryData & {
  articles: EfimeridesArticle[];
};

export type EfimeridesIndex = {
  seo?: SubcategoryData["seo"];
  totalArticles?: number;
};

const DATA_ROOT = path.join(process.cwd(), "public", "data", CATEGORY_KEY);
const INDEX_FILE = path.join(DATA_ROOT, "index.json");

function toTimestamp(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  const yearMatch = value.match(/(\d{4})/);
  if (yearMatch) {
    const coerced = `${yearMatch[1]}-01-01`;
    const coercedParsed = Date.parse(coerced);
    if (!Number.isNaN(coercedParsed)) {
      return coercedParsed;
    }
  }

  return null;
}

function sortArticlesByRecency(articles: Article[]): EfimeridesArticle[] {
  return [...articles].sort((a, b) => {
    const aDate = toTimestamp(a.date as string | undefined);
    const bDate = toTimestamp(b.date as string | undefined);

    if (aDate && bDate) {
      return bDate - aDate;
    }

    if (aDate) {
      return -1;
    }

    if (bDate) {
      return 1;
    }

    const aId = Number(a.id ?? 0);
    const bId = Number(b.id ?? 0);
    return bId - aId;
  }) as EfimeridesArticle[];
}

export async function getEfimeridesIndex(): Promise<EfimeridesIndex | null> {
  try {
    await fs.access(INDEX_FILE);
  } catch {
    return null;
  }

  return readJsonFile<EfimeridesIndex>(INDEX_FILE);
}

export async function getEfimeridesSubcategory(
  slug: string,
): Promise<EfimeridesSubcategory | null> {
  const data = await getSubcategoryData(CATEGORY_KEY, slug);
  if (!data) {
    return null;
  }

  return {
    ...data,
    articles: sortArticlesByRecency(data.articles ?? []),
  };
}

export async function getEfimeridesArticle(subcategorySlug: string, articleSlug: string) {
  return getArticleFromCategory(CATEGORY_KEY, subcategorySlug, articleSlug);
}

export async function getAllEfimeridesSubcategories(): Promise<EfimeridesSubcategory[]> {
  const subcategories = await getAllSubcategories(CATEGORY_KEY);

  return subcategories.map((subcategory) => ({
    ...subcategory,
    articles: sortArticlesByRecency(subcategory.articles ?? []),
  }));
}

export async function getAllEfimeridesSubcategoryParams() {
  const subcategories = await getAllEfimeridesSubcategories();

  return subcategories.map((subcategory) => ({
    subcategory: subcategory.subcategorySlug ?? subcategory.slug,
  }));
}

export async function getAllEfimeridesArticleParams() {
  return getAllArticleParamsForCategory(CATEGORY_KEY);
}

export { type ArticleSeo } from "./content";
