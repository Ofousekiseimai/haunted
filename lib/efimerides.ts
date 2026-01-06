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

export type EfimeridesTimelineItem = {
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

export async function getEfimeridesTimeline(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllEfimeridesSubcategories(locale);

  const items: EfimeridesTimelineItem[] = [];

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
        path: `/efimerides/${subcategorySlug}/${article.slug}`,
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
