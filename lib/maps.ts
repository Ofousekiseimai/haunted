import {
  getAllEfimeridesSubcategories,
  type EfimeridesArticle,
} from "./efimerides";
import {
  getAllLaografiaSubcategories,
  type LaografiaSubcategory,
} from "./laografia";
import { DEFAULT_LOCALE, type Locale } from "./content";

const LATITUDE_BOUNDS = {
  min: 34.8,
  max: 41.7,
} as const;

const LONGITUDE_BOUNDS = {
  min: 19.4,
  max: 29.6,
} as const;

export type MapArticle = {
  id: string;
  title: string;
  slug: string;
  categoryKey: "efimerides" | "laografia";
  categoryLabel: string;
  subcategorySlug: string;
  subcategoryLabel: string;
  lat: number;
  lng: number;
  excerpt?: string;
  imageSrc?: string;
  imageAlt?: string;
  mainArea?: string;
  subLocations: string[];
  locationTags: string[];
  date?: string;
};

export type SubcategoryOption = {
  value: string;
  label: string;
  articleCount: number;
};

function isValidCoordinate(lat?: number, lng?: number) {
  if (typeof lat !== "number" || Number.isNaN(lat)) {
    return false;
  }
  if (typeof lng !== "number" || Number.isNaN(lng)) {
    return false;
  }

  return (
    lat >= LATITUDE_BOUNDS.min &&
    lat <= LATITUDE_BOUNDS.max &&
    lng >= LONGITUDE_BOUNDS.min &&
    lng <= LONGITUDE_BOUNDS.max
  );
}

function parseCoordinate(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function coerceString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function collectSubLocations(article: EfimeridesArticle | LaografiaSubcategory["articles"][number]) {
  const output: string[] = [];

  const maybeArrayOrString = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        const normalized = coerceString(entry);
        if (normalized && !output.includes(normalized)) {
          output.push(normalized);
        }
      });
    } else {
      const normalized = coerceString(value);
      if (normalized && !output.includes(normalized)) {
        output.push(normalized);
      }
    }
  };

  const withMeta = article as {
    subLocation?: string | string[];
    subLocation2?: string | string[];
  };

  maybeArrayOrString(withMeta.subLocation);
  maybeArrayOrString(withMeta.subLocation2);

  return output;
}

function collectLocationTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .flatMap((entry) => {
      const normalized = coerceString(entry);
      return normalized ? [normalized] : [];
    })
    .filter((entry, index, array) => array.indexOf(entry) === index);
}

export async function getEfimeridesMapData(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllEfimeridesSubcategories(locale);

  const articles: MapArticle[] = [];
  const options: SubcategoryOption[] = [];

  subcategories.forEach((subcategory) => {
    options.push({
      value: subcategory.subcategorySlug ?? subcategory.slug,
      label: subcategory.subcategory,
      articleCount: subcategory.articles.length,
    });

    subcategory.articles.forEach((article) => {
      const lat = parseCoordinate((article as EfimeridesArticle).lat);
      const lng = parseCoordinate((article as EfimeridesArticle).lng);

      if (!isValidCoordinate(lat ?? undefined, lng ?? undefined)) {
        return;
      }

      articles.push({
        id: String(article.id),
        title: article.title,
        slug: article.slug,
        categoryKey: "efimerides",
        categoryLabel: "Εφημερίδες",
        subcategorySlug: subcategory.subcategorySlug ?? subcategory.slug,
        subcategoryLabel: subcategory.subcategory,
        lat: lat!,
        lng: lng!,
        excerpt: typeof article.excerpt === "string" ? article.excerpt : undefined,
        imageSrc: article.image?.src,
        imageAlt: article.image?.alt,
        mainArea: coerceString((article as { mainArea?: string }).mainArea) ?? undefined,
        subLocations: collectSubLocations(article),
        locationTags: collectLocationTags((article as { locationTags?: string[] }).locationTags),
        date: typeof article.date === "string" ? article.date : undefined,
      });
    });
  });

  return {
    articles,
    subcategories: options,
  };
}

export async function getLaografiaMapData(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllLaografiaSubcategories(locale);

  const articles: MapArticle[] = [];
  const options: SubcategoryOption[] = [];

  subcategories.forEach((subcategory) => {
    options.push({
      value: subcategory.subcategorySlug ?? subcategory.slug,
      label: subcategory.subcategory,
      articleCount: subcategory.articles.length,
    });

    subcategory.articles.forEach((article) => {
      const lat = parseCoordinate((article as { lat?: number | string }).lat);
      const lng = parseCoordinate((article as { lng?: number | string }).lng);

      if (!isValidCoordinate(lat ?? undefined, lng ?? undefined)) {
        return;
      }

      articles.push({
        id: String(article.id),
        title: article.title,
        slug: article.slug,
        categoryKey: "laografia",
        categoryLabel: "Παραδόσεις",
        subcategorySlug: subcategory.subcategorySlug ?? subcategory.slug,
        subcategoryLabel: subcategory.subcategory,
        lat: lat!,
        lng: lng!,
        excerpt: typeof article.excerpt === "string" ? article.excerpt : undefined,
        imageSrc: article.image?.src,
        imageAlt: article.image?.alt,
        mainArea: coerceString((article as { mainArea?: string }).mainArea) ?? undefined,
        subLocations: collectSubLocations(article),
        locationTags: collectLocationTags((article as { locationTags?: string[] }).locationTags),
        date: typeof article.date === "string" ? article.date : undefined,
      });
    });
  });

  return {
    articles,
    subcategories: options,
  };
}
