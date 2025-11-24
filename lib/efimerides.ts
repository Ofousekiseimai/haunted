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
): Promise<EfimeridesSubcategory | null> {
  const data = await getSubcategoryData(CATEGORY_KEY, slug);
  if (!data) {
    return null;
  }

  return {
    ...data,
    articles: sortArticlesByInsertionOrder(data.articles ?? []),
  };
}

export async function getEfimeridesArticle(subcategorySlug: string, articleSlug: string) {
  return getArticleFromCategory(CATEGORY_KEY, subcategorySlug, articleSlug);
}

export async function getAllEfimeridesSubcategories(): Promise<EfimeridesSubcategory[]> {
  const subcategories = await getAllSubcategories(CATEGORY_KEY);

  return subcategories.map((subcategory) => ({
    ...subcategory,
    articles: sortArticlesByInsertionOrder(subcategory.articles ?? []),
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
