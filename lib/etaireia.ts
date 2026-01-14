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

export type EtaireiaTimelineItem = {
  id: string;
  title: string;
  slug: string;
  subcategory: string;
  subcategorySlug: string;
  path: string;
  date: string;
  year: number;
  excerpt?: string;
  imageSrc?: string;
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
      return {
        article,
        index,
      };
    })
    .sort((a, b) => {
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

export async function getEtaireiaTimeline(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllEtaireiaSubcategories(locale);

  const items: EtaireiaTimelineItem[] = [];

  subcategories.forEach((subcategory) => {
    const subcategorySlug = subcategory.subcategorySlug ?? subcategory.slug;
    subcategory.articles.forEach((article) => {
      if (!article.date || typeof article.date !== "string") {
        return;
      }

      const parsed = Date.parse(article.date);
      if (!Number.isFinite(parsed)) {
        return;
      }

      const year = new Date(parsed).getFullYear();

      items.push({
        id: String(article.id),
        title: article.title,
        slug: article.slug,
        subcategory: subcategory.subcategory,
        subcategorySlug,
        path: `/etaireia-psychikon-ereynon/${subcategorySlug}/${article.slug}`,
        date: article.date,
        year,
        excerpt: typeof article.excerpt === "string" ? article.excerpt : undefined,
        imageSrc: article.image?.src,
      });
    });
  });

  return items.sort((a, b) => {
    const aTime = Date.parse(a.date);
    const bTime = Date.parse(b.date);
    if (aTime !== bTime) {
      return aTime - bTime;
    }
    return a.title.localeCompare(b.title, "el-GR");
  });
}

export { type ArticleSeo } from "./content";
