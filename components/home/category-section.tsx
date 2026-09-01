"use client";

import { useMemo, useState } from "react";
import { PlateImage } from "@/components/ui/plate-image";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import type { ArticleSummary } from "@/lib/home";
import type { Locale } from "@/lib/locale";
import { getCategorySectionUi } from "@/lib/i18n/ui";

const SITE_BASE_URL = "https://haunted.gr";

function toAbsoluteUrl(url?: string | null) {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  try {
    return new URL(trimmed, SITE_BASE_URL).toString();
  } catch {
    return undefined;
  }
}

/** Just the year — the metadata voice wants a datum, not a formatted date. */
function toYear(date?: string | null) {
  if (!date) return null;
  const match = date.trim().match(/(1[5-9]\d{2}|20[0-2]\d)/);
  return match ? match[1] : null;
}

export type HomeCategorySubsection = {
  slug: string;
  displayName: string;
  description?: string;
  category: string;
  articles: ArticleSummary[];
  totalArticles: number;
};

/**
 * Each category holds a different KIND of document, so each gets its own
 * visual language. Running all three through one image grid is what made the
 * old page feel like the same module repeated down a very long scroll.
 *
 *  gallery — commissioned illustrations. Crop freely, they are pictures.
 *  plates  — newspaper scans. Matted whole on a dark well, never cropped and
 *            never used as a bed for overlaid type.
 *  index   — testimony and correspondence. Text records, so a numbered index.
 */
export type CategoryVariant = "gallery" | "plates" | "index";

type HomeCategorySectionProps = {
  id: string;
  heading: string;
  description?: string;
  kicker?: string;
  categorySlug: string;
  subcategories: HomeCategorySubsection[];
  defaultSubcategorySlug?: string;
  variant?: CategoryVariant;
  locale?: Locale;
};

function Meta({ label, year }: { label?: string; year?: string | null }) {
  return (
    <span className="mono mono--micro">
      {[label, year].filter(Boolean).join(" · ")}
    </span>
  );
}

function FeaturedRecord({
  article,
  href,
  label,
  variant,
}: {
  article: ArticleSummary;
  href: string;
  label?: string;
  variant: CategoryVariant;
}) {
  const src = toAbsoluteUrl(article.image?.src);
  const year = toYear(article.date as string | undefined);

  return (
    <Link href={href} className="feat group">
      <div className="feat__media">
        {src && (
          <PlateImage
            src={src}
            alt={article.image?.alt ?? article.title}
            fill
            sizes="(min-width: 56rem) 60vw, 100vw"
            style={{
              objectFit: variant === "plates" ? "contain" : "cover",
              padding: variant === "plates" ? "1.5rem" : undefined,
              filter: variant === "plates" ? "var(--img-scan)" : undefined,
            }}
            priority
          />
        )}
      </div>
      <div className="feat__body">
        <div className="rec__meta">
          <span className="mark" aria-hidden="true" />
          <Meta label={label} year={year} />
        </div>
        <h3 className="feat__title">{article.title}</h3>
        {article.excerpt && <p className="feat__excerpt">{article.excerpt}</p>}
        {article.author && (
          <span className="mono mono--micro">{article.author}</span>
        )}
      </div>
    </Link>
  );
}

function GalleryCard({
  article,
  href,
  label,
}: {
  article: ArticleSummary;
  href: string;
  label?: string;
}) {
  const src = toAbsoluteUrl(article.image?.src);
  const year = toYear(article.date as string | undefined);

  return (
    <Link href={href} className="rec group">
      <div className="rec__plate">
        {src && (
          <PlateImage
            src={src}
            alt={article.image?.alt ?? article.title}
            fill
            sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
          />
        )}
      </div>
      <div className="rec__meta">
        <Meta label={label} year={year} />
      </div>
      <h3 className="rec__title">{article.title}</h3>
      {article.excerpt && <p className="rec__excerpt">{article.excerpt}</p>}
    </Link>
  );
}

function ClippingPlate({
  article,
  href,
  label,
}: {
  article: ArticleSummary;
  href: string;
  label?: string;
}) {
  const src = toAbsoluteUrl(article.image?.src);
  const year = toYear(article.date as string | undefined);

  return (
    <Link href={href} className="clip group">
      <div className="clip__mat">
        {src && (
          <PlateImage
            src={src}
            alt={article.image?.alt ?? article.title}
            width={640}
            height={480}
            sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Meta label={label} year={year} />
        <h3 className="clip__title">{article.title}</h3>
      </div>
    </Link>
  );
}

function IndexRow({
  article,
  href,
  label,
  n,
}: {
  article: ArticleSummary;
  href: string;
  label?: string;
  n: number;
}) {
  const year = toYear(article.date as string | undefined);

  return (
    <Link href={href} className="index__row group">
      <span className="index__n">{String(n).padStart(3, "0")}</span>
      <span>
        <span className="index__title">{article.title}</span>
        {article.excerpt && <span className="index__excerpt">{article.excerpt}</span>}
      </span>
      <span className="index__aside">
        {label && <span className="mono mono--micro">{label}</span>}
        {year && <span className="mono mono--micro">{year}</span>}
      </span>
    </Link>
  );
}

export function HomeCategorySection({
  id,
  heading,
  description,
  kicker,
  categorySlug,
  subcategories,
  defaultSubcategorySlug,
  variant = "gallery",
  locale = "el",
}: HomeCategorySectionProps) {
  const ui = getCategorySectionUi(locale);

  const fallbackSlug = subcategories[0]?.slug ?? "";
  const resolvedDefaultSlug = useMemo(() => {
    if (!defaultSubcategorySlug) return fallbackSlug;
    return subcategories.some((e) => e.slug === defaultSubcategorySlug)
      ? defaultSubcategorySlug
      : fallbackSlug;
  }, [defaultSubcategorySlug, fallbackSlug, subcategories]);

  const [selectedSlug, setSelectedSlug] = useState(resolvedDefaultSlug);

  const selected = useMemo(() => {
    const active = subcategories.some((e) => e.slug === selectedSlug)
      ? selectedSlug
      : resolvedDefaultSlug;
    return subcategories.find((e) => e.slug === active) ?? subcategories[0];
  }, [resolvedDefaultSlug, selectedSlug, subcategories]);

  if (!subcategories.length) return null;

  const articles = selected?.articles ?? [];
  const label = selected?.displayName;
  const hrefFor = (article: ArticleSummary) =>
    `/${categorySlug}/${article.subcategorySlug ?? selected?.slug}/${article.slug}`;

  // The index variant is a list all the way down; the other two lead with a
  // featured record. Splitting here keeps the grids full — the old build
  // always took 1 + 5 into a 3-column grid and left a hole in every section.
  const isIndex = variant === "index";
  const featured = isIndex ? undefined : articles[0];
  const rest = isIndex ? articles : articles.slice(1);

  return (
    <Reveal>
      <section id={id}>
        <div className="shead">
          <div>
            {kicker && (
              <div className="shead__kicker">
                <span className="mark" aria-hidden="true" />
                <span className="mono">{kicker}</span>
              </div>
            )}
            <h2 className="shead__title">{heading}</h2>
          </div>
          {description && <p className="shead__desc">{description}</p>}
        </div>

        {subcategories.length > 1 && (
          <>
            <div className="md:hidden mb-8">
              <label className="sr-only" htmlFor={`${id}-sub`}>
                {heading}
              </label>
              <select
                id={`${id}-sub`}
                className="select"
                value={selected?.slug}
                onChange={(event) => setSelectedSlug(event.target.value)}
              >
                {subcategories.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.displayName} ({sub.totalArticles})
                  </option>
                ))}
              </select>
            </div>

            <div className="tabs hidden md:flex" role="tablist">
              {subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  type="button"
                  role="tab"
                  aria-selected={sub.slug === selected?.slug}
                  data-active={sub.slug === selected?.slug}
                  className="tab"
                  onClick={() => setSelectedSlug(sub.slug)}
                >
                  {sub.displayName}
                  <span className="tab__n">{sub.totalArticles}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {articles.length ? (
          <div className="flex flex-col gap-10">
            {featured && (
              <FeaturedRecord
                article={featured}
                href={hrefFor(featured)}
                label={label}
                variant={variant}
              />
            )}

            {rest.length > 0 && variant === "gallery" && (
              <div className="recs">
                {rest.map((article) => (
                  <GalleryCard
                    key={`${article.id}-${article.slug}`}
                    article={article}
                    href={hrefFor(article)}
                    label={label}
                  />
                ))}
              </div>
            )}

            {rest.length > 0 && variant === "plates" && (
              <div className="clips">
                {rest.map((article) => (
                  <ClippingPlate
                    key={`${article.id}-${article.slug}`}
                    article={article}
                    href={hrefFor(article)}
                    label={label}
                  />
                ))}
              </div>
            )}

            {rest.length > 0 && isIndex && (
              <div className="index">
                {rest.map((article, i) => (
                  <IndexRow
                    key={`${article.id}-${article.slug}`}
                    article={article}
                    href={hrefFor(article)}
                    label={label}
                    n={i + 1}
                  />
                ))}
              </div>
            )}

            <div>
              <Link href={`/${categorySlug}/${selected?.slug}`} className="btn">
                {ui.viewAllPrefix} · {selected?.displayName}
                <span className="btn__arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <p className="mono">{ui.noArticles}</p>
        )}
      </section>
    </Reveal>
  );
}
