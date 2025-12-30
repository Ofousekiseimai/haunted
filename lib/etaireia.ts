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

const CATEGORY_KEY = "etaireia-psychikon-ereynon";

export type EtaireiaArticle = Article & {
  mainArea?: string;
  subLocation?: string;
  subLocation2?: string;
  locationTags?: string[];
  tags?: string[];
};

export type EtaireiaSubcategory = SubcategoryData & {
  articles: EtaireiaArticle[];
};

export type EtaireiaOverview = {
  category: string;
  slug: string;
  subcategories?: Array<{
    slug: string;
    title: string;
    count?: number;
    canonical?: string;
  }>;
  totalArticles?: number;
  keywords?: string[];
  seo?: SubcategoryData["seo"];
};

const DATA_ROOT = path.join(process.cwd(), "public", "data", CATEGORY_KEY);
const INDEX_FILE = path.join(DATA_ROOT, "index.json");

function sortArticlesByInsertionOrder(articles: Article[]): EtaireiaArticle[] {
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
    .map(({ article }) => article as EtaireiaArticle);
}

export async function getEtaireiaOverview(): Promise<EtaireiaOverview | null> {
  try {
    await fs.access(INDEX_FILE);
  } catch {
    return null;
  }

  return readJsonFile<EtaireiaOverview>(INDEX_FILE);
}

export async function getEtaireiaSubcategory(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<EtaireiaSubcategory | null> {
  const data = await getSubcategoryData(CATEGORY_KEY, slug, locale);
  if (!data) {
    return null;
  }

  return {
    ...data,
    articles: sortArticlesByInsertionOrder(data.articles ?? []),
  };
}

export async function getEtaireiaArticle(
  subcategorySlug: string,
  articleSlug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  return getArticleFromCategory(CATEGORY_KEY, subcategorySlug, articleSlug, locale);
}

export async function getAllEtaireiaSubcategories(
  locale: Locale = DEFAULT_LOCALE,
): Promise<EtaireiaSubcategory[]> {
  const subcategories = await getAllSubcategories(CATEGORY_KEY, locale);
  return subcategories.map((entry) => ({
    ...entry,
    articles: sortArticlesByInsertionOrder(entry.articles ?? []),
  }));
}

export async function getAllEtaireiaSubcategoryParams(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllEtaireiaSubcategories(locale);

  return subcategories.map((subcategory) => ({
    subcategory: subcategory.subcategorySlug ?? subcategory.slug,
  }));
}

export async function getAllEtaireiaArticleParams(locale: Locale = DEFAULT_LOCALE) {
  return getAllArticleParamsForCategory(CATEGORY_KEY, locale);
}

export { type ArticleSeo } from "./content";
