import Link from "next/link";

type LinkedArticleEntry = {
  slug?: string;
  subcategorySlug?: string;
  categoryKey?: string;
  href?: string;
  url?: string;
  title?: string;
  label?: string;
  description?: string;
  note?: string;
};

type Props = {
  entries?: unknown;
  fallbackCategoryKey: string;
  fallbackSubcategorySlug: string;
  heading?: string;
};

const normalizeString = (value?: unknown) =>
  typeof value === "string" ? value.trim() : undefined;

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

function resolveHref(
  entry: LinkedArticleEntry,
  fallbackCategoryKey: string,
  fallbackSubcategorySlug: string,
) {
  const directUrl = normalizeString(entry.href ?? entry.url);
  if (directUrl) {
    return directUrl.startsWith("http") || directUrl.startsWith("/")
      ? directUrl
      : `/${directUrl}`;
  }

  const slug = normalizeString(entry.slug);
  if (!slug) {
    return null;
  }

  if (slug.startsWith("/")) {
    return slug;
  }

  const category = normalizeString(entry.categoryKey ?? (entry as { category?: string }).category)
    ?? fallbackCategoryKey;
  const subcategory =
    normalizeString(
      entry.subcategorySlug ??
        (entry as { subcategory?: string }).subcategory ??
        (entry as { subCategory?: string }).subCategory,
    ) ?? fallbackSubcategorySlug;

  const path = [category, subcategory, slug].map(trimSlashes).filter(Boolean).join("/");
  return `/${path}`;
}

function normalizeEntries(
  entries: unknown,
  fallbackCategoryKey: string,
  fallbackSubcategorySlug: string,
) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map((entry) => {
      if (typeof entry === "string") {
        const value = entry.trim();
        if (!value) {
          return null;
        }

        return {
          href: value.startsWith("http") || value.startsWith("/") ? value : `/${value}`,
          title: value,
        };
      }

      if (!entry || typeof entry !== "object") {
        return null;
      }

      const linkedEntry = entry as LinkedArticleEntry;
      const href = resolveHref(linkedEntry, fallbackCategoryKey, fallbackSubcategorySlug);
      if (!href) {
        return null;
      }

      return {
        href,
        title:
          normalizeString(linkedEntry.title) ??
          normalizeString(linkedEntry.label) ??
          href,
        description: normalizeString(
          linkedEntry.description ?? linkedEntry.note ?? (linkedEntry as { text?: string }).text,
        ),
      };
    })
    .filter((item): item is { href: string; title: string; description?: string } => Boolean(item));
}

export function LinkedArticles({
  entries,
  fallbackCategoryKey,
  fallbackSubcategorySlug,
  heading = "Συνδέεται με",
}: Props) {
  const normalized = normalizeEntries(entries, fallbackCategoryKey, fallbackSubcategorySlug);
  if (!normalized.length) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-xl border border-n-7 bg-n-8/80 p-6">
      <h3 className="text-xl font-semibold text-n-1">{heading}</h3>
      <ul className="space-y-3">
        {normalized.map((item, index) => (
          <li key={`${item.href}-${index}`} className="space-y-1">
            <Link
              href={item.href}
              className="text-base font-semibold text-primary-300 hover:text-primary-200"
            >
              {item.title}
            </Link>
            {item.description && <p className="text-sm text-n-4">{item.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
