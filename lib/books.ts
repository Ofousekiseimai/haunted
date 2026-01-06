import {
  DEFAULT_LOCALE,
  getAllSubcategories,
  getSubcategoryData,
  type Article,
  type Locale,
  type SubcategoryData,
} from "./content";

export type Book = Article & {
  purchaseUrl?: string;
  subcategory?: string;
  subcategorySlug?: string;
};

export type BooksSubcategory = SubcategoryData & {
  articles: Book[];
};

function normalizeBookSubcategory(data: SubcategoryData | null): BooksSubcategory | null {
  if (!data) {
    return null;
  }

  const subcategorySlug = data.subcategorySlug ?? data.slug;

  const articles = Array.isArray(data.articles)
    ? data.articles.map((article) => ({
        ...article,
        subcategory: data.subcategory,
        subcategorySlug,
        purchaseUrl:
          typeof (article as { purchaseUrl?: unknown }).purchaseUrl === "string"
            ? (article as { purchaseUrl?: string }).purchaseUrl
            : undefined,
      }))
    : [];

  return {
    ...data,
    subcategorySlug,
    articles,
  };
}

function sortByIdDescending(articles: Book[]) {
  return [...articles].sort((a, b) => {
    const normalizeId = (value: unknown) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === "string") {
        const match = value.match(/(\d+)/);
        if (match) {
          return Number.parseInt(match[1], 10);
        }
      }

      return 0;
    };

    const aId = normalizeId((a as { id?: string | number }).id);
    const bId = normalizeId((b as { id?: string | number }).id);
    return bId - aId;
  });
}

export async function getBooksSubcategory(slug: string, locale: Locale = DEFAULT_LOCALE) {
  const data = await getSubcategoryData("vivlia", slug, locale);
  return normalizeBookSubcategory(data);
}

export async function getAllBooksSubcategories(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllSubcategories("vivlia", locale);
  return subcategories
    .map((subcategory) => normalizeBookSubcategory(subcategory))
    .filter((entry): entry is BooksSubcategory => entry !== null);
}

export async function getAllBooksCollection(locale: Locale = DEFAULT_LOCALE): Promise<BooksSubcategory> {
  const subcategories = await getAllBooksSubcategories(locale);
  const articles = sortByIdDescending(
    subcategories.flatMap((subcategory) =>
      subcategory.articles.map((article) => ({
        ...article,
        subcategory: subcategory.subcategory,
        subcategorySlug: subcategory.subcategorySlug ?? subcategory.slug,
      })),
    ),
  );

  return {
    category: "Βιβλία",
    slug: "/vivlia",
    subcategory: "Όλα τα Βιβλία",
    subcategorySlug: "ola",
    seo: {
      metaTitle: "Βιβλία | haunted.gr",
      metaDescription:
        "Όλα τα βιβλία που σχετίζονται με λαογραφικά μυθιστορήματα, έρευνα και σκοτεινή φαντασία.",
      canonical: "https://haunted.gr/vivlia",
    },
    articles,
  };
}

export async function getAllBookSubcategoryParams(locale: Locale = DEFAULT_LOCALE) {
  const subcategories = await getAllBooksSubcategories(locale);

  return subcategories.map((subcategory) => ({
    subcategory: subcategory.subcategorySlug ?? subcategory.slug,
  }));
}

export async function getBooksForHome(limit = 8, locale: Locale = DEFAULT_LOCALE) {
  const allBooks = await getAllBooksCollection(locale);
  return allBooks.articles.slice(0, limit);
}
