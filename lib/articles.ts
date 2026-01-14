import { SUBCATEGORY_MAP } from "@/constants/categories";
import {
  getSubcategoryData,
  type Article,
  type ArticleImage,
  type SubcategoryData,
  DEFAULT_LOCALE,
  type Locale,
} from "./content";
import {
  GENERIC_CATEGORY_KEYS,
  getAllGenericCategorySubcategories,
  findGenericCategorySubcategoryBySlug,
  type GenericCategoryKey,
} from "./generic-category";

export type SuggestionArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image?: ArticleImage;
  date?: string;
  author?: string;
  mainArea?: string;
  subLocation?: string;
  subLocation2?: string;
  locationTags?: string[];
  addedAt?: number;
  categoryKey: string;
  categoryLabel: string;
  subcategorySlug: string;
  subcategoryLabel: string;
};

type LoadOptions = {
  excludeArticleId?: string | null;
  limit?: number;
};

function toTimestamp(date?: string | null) {
  if (!date) {
    return null;
  }

  const parsed = Date.parse(date);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  return null;
}

function sortByRecency(articles: SuggestionArticle[]) {
  return [...articles].sort((a, b) => {
    const aAddedAt = typeof a.addedAt === "number" ? a.addedAt : null;
    const bAddedAt = typeof b.addedAt === "number" ? b.addedAt : null;

    if (aAddedAt !== null || bAddedAt !== null) {
      if (aAddedAt === null) {
        return 1;
      }

      if (bAddedAt === null) {
        return -1;
      }

      if (aAddedAt !== bAddedAt) {
        return bAddedAt - aAddedAt;
      }
    }

    const aDate = toTimestamp(a.date);
    const bDate = toTimestamp(b.date);

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
  });
}

function mapArticleToSuggestion(
  article: Article,
  subcategory: SubcategoryData,
  categoryKey: string,
  addedAt?: number,
): SuggestionArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    image: article.image,
    date: typeof article.date === "string" ? article.date : undefined,
    author: typeof article.author === "string" ? article.author : undefined,
    mainArea: typeof (article as { mainArea?: string }).mainArea === "string"
      ? (article as { mainArea?: string }).mainArea
      : undefined,
    subLocation: typeof (article as { subLocation?: string }).subLocation === "string"
      ? (article as { subLocation?: string }).subLocation
      : undefined,
    subLocation2: typeof (article as { subLocation2?: string }).subLocation2 === "string"
      ? (article as { subLocation2?: string }).subLocation2
      : undefined,
    locationTags: Array.isArray((article as { locationTags?: string[] }).locationTags)
      ? ((article as { locationTags?: string[] }).locationTags ?? []).filter(
          (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
        )
      : undefined,
    addedAt,
    categoryKey,
    categoryLabel: subcategory.category,
    subcategorySlug: subcategory.subcategorySlug ?? subcategory.slug,
    subcategoryLabel: subcategory.subcategory ?? subcategory.slug,
  };
}

function isExcluded(article: Article, excludeArticleId?: string | null) {
  if (!excludeArticleId) {
    return false;
  }

  return article.id === excludeArticleId;
}

async function loadSubcategoryArticles(categoryKey: string, slug: string, locale: Locale) {
  const data = await getSubcategoryData(categoryKey, slug, locale);
  if (!data?.articles?.length) {
    return null;
  }

  return data;
}

export type SuggestionResult = SuggestionArticle[];

export async function getRelatedArticlesBySubcategory(
  subcategorySlug: string,
  { excludeArticleId, limit = 6 }: LoadOptions = {},
  locale: Locale = DEFAULT_LOCALE,
): Promise<SuggestionResult> {
  const config = SUBCATEGORY_MAP[subcategorySlug];
  if (config) {
    const data = await getSubcategoryData(config.category, config.slug, locale);
    if (!data) {
      return [];
    }

    const filtered = data.articles
      .map((article, index) => ({ article, index }))
      .filter(
        ({ article }) => !isExcluded(article, excludeArticleId) && article.slug && article.title,
      )
      .map(({ article, index }) => mapArticleToSuggestion(article, data, config.category, index));

    return sortByRecency(filtered).slice(0, limit);
  }

  const fallback = await findGenericCategorySubcategoryBySlug(subcategorySlug, locale);
  if (!fallback) {
    return [];
  }

  const filtered = fallback.subcategory.articles
    .map((article, index) => ({ article, index }))
    .filter(
      ({ article }) => !isExcluded(article, excludeArticleId) && article.slug && article.title,
    )
    .map(({ article, index }) =>
      mapArticleToSuggestion(article, fallback.subcategory, fallback.categoryKey, index),
    );

  return sortByRecency(filtered).slice(0, limit);
}

export async function getArticlesByMainArea(
  area: string,
  { excludeArticleId, limit = 6 }: LoadOptions = {},
  locale: Locale = DEFAULT_LOCALE,
): Promise<SuggestionResult> {
  const cleanArea = area?.trim().toLowerCase();
  if (!cleanArea) {
    return [];
  }

  const baseEntries = await Promise.all(
    Object.values(SUBCATEGORY_MAP).map(async (config) => {
      const data = await loadSubcategoryArticles(config.category, config.slug, locale);
      if (!data) {
        return [];
      }

      return data.articles
        .map((article, index) => ({ article, index }))
        .filter(({ article }) => {
          if (isExcluded(article, excludeArticleId) || !article.slug || !article.title) {
            return false;
          }

          const mainArea = (article as { mainArea?: string }).mainArea;
          if (typeof mainArea !== "string") {
            return false;
          }

          return mainArea.trim().toLowerCase() === cleanArea;
        })
        .map(({ article }) => mapArticleToSuggestion(article, data, config.category));
    }),
  );

  const genericEntries = await Promise.all(
    GENERIC_CATEGORY_KEYS.map(async (categoryKey: GenericCategoryKey) => {
      const subcategories = await getAllGenericCategorySubcategories(categoryKey, locale);
      return subcategories.flatMap((subcategory) =>
        subcategory.articles
          .map((article, index) => ({ article, index }))
          .filter(({ article }) => {
            if (isExcluded(article, excludeArticleId) || !article.slug || !article.title) {
              return false;
            }

            const mainArea = (article as { mainArea?: string }).mainArea;
            if (typeof mainArea !== "string") {
              return false;
            }

            return mainArea.trim().toLowerCase() === cleanArea;
          })
          .map(({ article }) => mapArticleToSuggestion(article, subcategory, categoryKey)),
      );
    }),
  );

  const flattened = [...baseEntries.flat(), ...genericEntries.flat()];
  return sortByRecency(flattened).slice(0, limit);
}

export async function getRandomArticles(
  { excludeArticleId, limit = 5 }: LoadOptions = {},
  locale: Locale = DEFAULT_LOCALE,
): Promise<SuggestionResult> {
  const entriesFromMap = await Promise.all(
    Object.values(SUBCATEGORY_MAP).map(async (config) => {
      const data = await loadSubcategoryArticles(config.category, config.slug, locale);
      if (!data) {
        return [];
      }
      return data.articles
        .filter((article) => !isExcluded(article, excludeArticleId) && article.slug && article.title)
        .map((article) => mapArticleToSuggestion(article, data, config.category));
    }),
  );

  const genericEntries = await Promise.all(
    GENERIC_CATEGORY_KEYS.map(async (categoryKey: GenericCategoryKey) => {
      const subcategories = await getAllGenericCategorySubcategories(categoryKey, locale);
      return subcategories.flatMap((subcategory) =>
        subcategory.articles
          .filter((article) => !isExcluded(article, excludeArticleId) && article.slug && article.title)
          .map((article) => mapArticleToSuggestion(article, subcategory, categoryKey)),
      );
    }),
  );

  const pool = [...entriesFromMap.flat(), ...genericEntries.flat()];
  if (pool.length <= limit) {
    return pool;
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit);
}
