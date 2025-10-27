import { getSubcategoryData, type Article } from "./content";
import { getSubcategoriesForCategory, type SubcategoryConfig } from "@/constants/categories";

export type ArticleSummary = Pick<
  Article,
  "id" | "slug" | "title" | "excerpt" | "image" | "author" | "date"
>;

type HomeSubcategory = {
  slug: string;
  displayName: string;
  description?: string;
  category: string;
  articles: ArticleSummary[];
  totalArticles: number;
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickArticlesForDisplay(articles: Article[], limit: number, seedKey: string) {
  if (articles.length <= limit) {
    return articles;
  }

  const seededRandom = mulberry32(hashString(seedKey));
  const shuffled = [...articles];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit);
}

async function loadSubcategoryForHome(
  categoryKey: string,
  config: SubcategoryConfig,
  limit: number,
): Promise<HomeSubcategory | null> {
  const data = await getSubcategoryData(categoryKey, config.slug);
  if (!data || !data.articles?.length) {
    return null;
  }

  return {
    slug: config.slug,
    displayName: config.displayName,
    description: config.description,
    category: config.category,
    totalArticles: data.articles.length,
    articles: pickArticlesForDisplay(data.articles, limit, config.slug).map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      image: article.image,
      author: article.author,
      date: article.date,
    })),
  };
}

export async function getHomeCategorySections(categoryKey: string, limit = 6) {
  const subcategories = getSubcategoriesForCategory(categoryKey);

  const results = await Promise.all(
    subcategories.map((config) => loadSubcategoryForHome(categoryKey, config, limit)),
  );

  return results.filter((entry): entry is HomeSubcategory => entry !== null);
}
