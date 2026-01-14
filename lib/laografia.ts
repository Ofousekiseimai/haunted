import {
  getAllArticleParamsForCategory,
  getAllSubcategories,
  getArticleFromCategory,
  getSubcategoryData,
  DEFAULT_LOCALE,
  type Locale,
  type SubcategoryData,
  type SubcategorySeo,
} from "./content";

export type LaografiaSeo = SubcategorySeo;
export type LaografiaSubcategory = SubcategoryData;

export type { Article, ArticleContentBlock, ArticleSeo } from "./content";

export async function getLaografiaSubcategory(slug: string, locale: Locale = DEFAULT_LOCALE) {
  return getSubcategoryData("laografia", slug, locale);
}

export async function getLaografiaArticle(
  subcategorySlug: string,
  articleSlug: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  return getArticleFromCategory("laografia", subcategorySlug, articleSlug, locale);
}

export async function getAllLaografiaSubcategories(locale: Locale = DEFAULT_LOCALE) {
  return getAllSubcategories("laografia", locale);
}

export async function getAllLaografiaSubcategoryParams(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllLaografiaSubcategories(locale);
  return subcategories.map((subcategory) => ({
    subcategory: subcategory.subcategorySlug ?? subcategory.slug,
  }));
}

export async function getAllLaografiaArticleParams(locale: Locale = DEFAULT_LOCALE) {
  return getAllArticleParamsForCategory("laografia", locale);
}
