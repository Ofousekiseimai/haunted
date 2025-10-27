import {
  getAllArticleParamsForCategory,
  getAllSubcategories,
  getArticleFromCategory,
  getSubcategoryData,
  type SubcategoryData,
  type SubcategorySeo,
} from "./content";

export type LaografiaSeo = SubcategorySeo;
export type LaografiaSubcategory = SubcategoryData;

export type { Article, ArticleContentBlock, ArticleSeo } from "./content";

export async function getLaografiaSubcategory(slug: string) {
  return getSubcategoryData("laografia", slug);
}

export async function getLaografiaArticle(subcategorySlug: string, articleSlug: string) {
  return getArticleFromCategory("laografia", subcategorySlug, articleSlug);
}

export async function getAllLaografiaSubcategories() {
  return getAllSubcategories("laografia");
}

export async function getAllLaografiaSubcategoryParams() {
  const subcategories = await getAllLaografiaSubcategories();
  return subcategories.map((subcategory) => ({
    subcategory: subcategory.subcategorySlug ?? subcategory.slug,
  }));
}

export async function getAllLaografiaArticleParams() {
  return getAllArticleParamsForCategory("laografia");
}
