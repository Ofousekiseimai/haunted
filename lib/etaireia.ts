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

export async function getEtaireiaSubcategory(slug: string): Promise<EtaireiaSubcategory | null> {
  const data = await getSubcategoryData(CATEGORY_KEY, slug);
  if (!data) {
    return null;
  }

  return {
    ...data,
    articles: sortArticlesByInsertionOrder(data.articles ?? []),
  };
}

export async function getEtaireiaArticle(subcategorySlug: string, articleSlug: string) {
  return getArticleFromCategory(CATEGORY_KEY, subcategorySlug, articleSlug);
}

export async function getAllEtaireiaSubcategories(): Promise<EtaireiaSubcategory[]> {
  const subcategories = await getAllSubcategories(CATEGORY_KEY);
  return subcategories.map((entry) => ({
    ...entry,
    articles: sortArticlesByInsertionOrder(entry.articles ?? []),
  }));
}

export async function getAllEtaireiaSubcategoryParams() {
  const subcategories = await getAllEtaireiaSubcategories();

  return subcategories.map((subcategory) => ({
    subcategory: subcategory.subcategorySlug ?? subcategory.slug,
  }));
}

export async function getAllEtaireiaArticleParams() {
  return getAllArticleParamsForCategory(CATEGORY_KEY);
}

export { type ArticleSeo } from "./content";
