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

function sortArticlesByInsertionOrder(articles: Article[]): EfimeridesArticle[] {
  return [...articles]
    .map((article, index) => {
      const numericId =
        typeof article.id === "number"
          ? article.id
          : typeof article.id === "string"
            ? Number.parseInt(article.id, 10)
            : Number.NaN;

      return {
        article,
        index,
        numericId: Number.isFinite(numericId) ? numericId : null,
      };
    })
    .sort((a, b) => {
      if (a.numericId !== null && b.numericId !== null && a.numericId !== b.numericId) {
        return b.numericId - a.numericId;
      }

      if (a.numericId !== null && b.numericId === null) {
        return -1;
      }

      if (a.numericId === null && b.numericId !== null) {
        return 1;
      }

      return b.index - a.index;
    })
    .map(({ article }) => article as EfimeridesArticle);
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
  locale: Locale = DEFAULT_LOCALE,
): Promise<EfimeridesSubcategory | null> {
  const data = await getSubcategoryData(CATEGORY_KEY, slug, locale);
  if (!data) {
    return null;
  }

  return {
    ...data,
    articles: sortArticlesByInsertionOrder(data.articles ?? []),
  };
}

export async function getEfimeridesArticle(
  subcategorySlug: string,
  articleSlug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  return getArticleFromCategory(CATEGORY_KEY, subcategorySlug, articleSlug, locale);
}

export async function getAllEfimeridesSubcategories(
  locale: Locale = DEFAULT_LOCALE,
): Promise<EfimeridesSubcategory[]> {
  const subcategories = await getAllSubcategories(CATEGORY_KEY, locale);

  return subcategories.map((subcategory) => ({
    ...subcategory,
    articles: sortArticlesByInsertionOrder(subcategory.articles ?? []),
  }));
}

export async function getAllEfimeridesSubcategoryParams(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllEfimeridesSubcategories(locale);

  return subcategories.map((subcategory) => ({
    subcategory: subcategory.subcategorySlug ?? subcategory.slug,
  }));
}

export async function getAllEfimeridesArticleParams(locale: Locale = DEFAULT_LOCALE) {
  return getAllArticleParamsForCategory(CATEGORY_KEY, locale);
}

export { type ArticleSeo } from "./content";
