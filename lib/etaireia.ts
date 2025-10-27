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

function sortArticlesByRecency(articles: Article[]): EtaireiaArticle[] {
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
  }) as EtaireiaArticle[];
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
    articles: sortArticlesByRecency(data.articles ?? []),
  };
}

export async function getEtaireiaArticle(subcategorySlug: string, articleSlug: string) {
  return getArticleFromCategory(CATEGORY_KEY, subcategorySlug, articleSlug);
}

export async function getAllEtaireiaSubcategories(): Promise<EtaireiaSubcategory[]> {
  const subcategories = await getAllSubcategories(CATEGORY_KEY);
  return subcategories.map((entry) => ({
    ...entry,
    articles: sortArticlesByRecency(entry.articles ?? []),
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
