import { getAllEfimeridesSubcategories } from "./efimerides";
import { getAllEtaireiaSubcategories } from "./etaireia";
import { getAllLaografiaSubcategories } from "./laografia";
import { DEFAULT_LOCALE, type Article, type Locale } from "./content";
import {
  GENERIC_CATEGORY_KEYS,
  getAllGenericCategorySubcategories,
  getGenericCategoryCopy,
} from "./generic-category";

const CATEGORY_LABELS: Record<string, string> = {
  laografia: "Παραδόσεις",
  efimerides: "Εφημερίδες",
  "etaireia-psychikon-ereynon": "Εταιρεία Ψυχικών Ερευνών",
  prosopa: "Πρόσωπα",
  entipa: "Έντυπα",
};

type SearchDocument = SearchResult & {
  searchText: string;
};

export type SearchResult = {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  categoryKey: string;
  categoryLabel: string;
  subcategorySlug: string;
  subcategoryLabel: string;
  imageSrc?: string;
  imageAlt?: string;
  date?: string;
  locationTags: string[];
  mainArea?: string;
};

const cachedDocumentsByLocale: Partial<Record<Locale, SearchDocument[]>> = {};

function normalizeString(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function extractContentText(article: Article) {
  if (!Array.isArray(article.content)) {
    return "";
  }

  return article.content
    .map((block) => {
      if (typeof block.value === "string") {
        return block.value;
      }
      if (Array.isArray(block.items)) {
        return block.items.join(" ");
      }
      return "";
    })
    .join(" ");
}

function collectLocationTags(article: Article) {
  const output: string[] = [];

  const withMeta = article as {
    locationTags?: string[];
    subLocation?: string | string[];
    subLocation2?: string | string[];
  };

  const addEntry = (value: unknown) => {
    if (typeof value === "string") {
      const normalized = value.trim();
      if (normalized.length > 0 && !output.includes(normalized)) {
        output.push(normalized);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(addEntry);
    }
  };

  addEntry(withMeta.locationTags);
  addEntry(withMeta.subLocation);
  addEntry(withMeta.subLocation2);

  return output;
}

function deriveMainArea(article: Article) {
  const value = (article as { mainArea?: string }).mainArea;
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }
  return undefined;
}

function buildDocument(
  article: Article,
  subcategorySlug: string,
  subcategoryLabel: string,
  categoryKey: string,
  categoryLabel: string,
): SearchDocument | null {
  if (!article.slug || !article.title) {
    return null;
  }

  const locationTags = collectLocationTags(article);
  const searchParts = [
    article.title,
    typeof article.excerpt === "string" ? article.excerpt : "",
    extractContentText(article),
    locationTags.join(" "),
    categoryLabel,
    subcategoryLabel,
    deriveMainArea(article) ?? "",
  ];

  return {
    id: String(article.id),
    title: article.title,
    excerpt: typeof article.excerpt === "string" ? article.excerpt : undefined,
    slug: article.slug,
    categoryKey,
    categoryLabel,
    subcategorySlug,
    subcategoryLabel,
    imageSrc: article.image?.src,
    imageAlt: article.image?.alt,
    date: typeof article.date === "string" ? article.date : undefined,
    locationTags,
    mainArea: deriveMainArea(article),
    searchText: normalizeString(searchParts.join(" ")),
  };
}

async function loadDocuments(locale: Locale = DEFAULT_LOCALE): Promise<SearchDocument[]> {
  if (cachedDocumentsByLocale[locale]) {
    return cachedDocumentsByLocale[locale] as SearchDocument[];
  }

  const documents: SearchDocument[] = [];

  const laografia = await getAllLaografiaSubcategories(locale);
  laografia.forEach((subcategory) => {
    subcategory.articles.forEach((article) => {
      const doc = buildDocument(
        article,
        subcategory.subcategorySlug ?? subcategory.slug,
        subcategory.subcategory,
        "laografia",
        CATEGORY_LABELS.laografia,
      );
      if (doc) {
        documents.push(doc);
      }
    });
  });

  const efimerides = await getAllEfimeridesSubcategories(locale);
  efimerides.forEach((subcategory) => {
    subcategory.articles.forEach((article) => {
      const doc = buildDocument(
        article,
        subcategory.subcategorySlug ?? subcategory.slug,
        subcategory.subcategory,
        "efimerides",
        CATEGORY_LABELS.efimerides,
      );
      if (doc) {
        documents.push(doc);
      }
    });
  });

  const etaireia = await getAllEtaireiaSubcategories(locale);
  etaireia.forEach((subcategory) => {
    subcategory.articles.forEach((article) => {
      const doc = buildDocument(
        article,
        subcategory.subcategorySlug ?? subcategory.slug,
        subcategory.subcategory,
        "etaireia-psychikon-ereynon",
        CATEGORY_LABELS["etaireia-psychikon-ereynon"],
      );
      if (doc) {
        documents.push(doc);
      }
    });
  });

  for (const categoryKey of GENERIC_CATEGORY_KEYS) {
    const copy = getGenericCategoryCopy(categoryKey);
    const subcategories = await getAllGenericCategorySubcategories(categoryKey, locale);
    subcategories.forEach((subcategory) => {
      subcategory.articles.forEach((article) => {
        const doc = buildDocument(
          article,
          subcategory.subcategorySlug ?? subcategory.slug,
          subcategory.subcategory,
          categoryKey,
          copy.label,
        );
        if (doc) {
          documents.push(doc);
        }
      });
    });
  }

  cachedDocumentsByLocale[locale] = documents;
  return documents;
}

export async function searchArticles(
  query: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<SearchResult[]> {
  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) {
    return [];
  }

  const documents = await loadDocuments(locale);

  return documents.filter((document) => document.searchText.includes(normalizedQuery));
}
