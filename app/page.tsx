import type { Metadata } from "next";

import { HomeHero, type ArchiveStats } from "@/components/home/hero";
import { SanSimeraSection } from "@/components/home/san-simera-section";
import {
  HomeCategorySection,
  type HomeCategorySubsection,
} from "@/components/home/category-section";
import { YoutubeSection } from "@/components/home/youtube-section";
import { getHomeCopy } from "@/lib/i18n/ui";
import { getHomeCategorySections } from "@/lib/home";
import { getYoutubeData } from "@/lib/youtube";
import { getAllEfimeridesSubcategories } from "@/lib/efimerides";
import { getRequestLocale } from "@/lib/locale-server";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Haunted Greece",
  description:
    "Εξερευνήστε την ελληνική λαογραφία, ιστορίες από εφημερίδες και τα αρχεία της Εταιρείας Ψυχικών Ερευνών.",
  alternates: {
    canonical: "https://haunted.gr",
  },
  openGraph: {
    title: "Haunted Greece",
    description:
      "Παραδόσεις, παραφυσικές μαρτυρίες και ιστορικά αρχεία από όλη την Ελλάδα.",
    url: "https://haunted.gr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haunted Greece",
    description:
      "Παραδόσεις, παραφυσικές μαρτυρίες και ιστορικά αρχεία από όλη την Ελλάδα.",
  },
};

/**
 * One featured record plus a grid that divides exactly: six cards fill 3 × 2
 * on desktop and 2 × 3 on tablet with no hole in the last row. The index
 * variant is a list, so it can carry more.
 */
const GRID_LIMIT = 7;
const INDEX_LIMIT = 9;

function hasArticles(subcategories: HomeCategorySubsection[]) {
  return subcategories.some((entry) => entry.articles.length);
}

function countRecords(...groups: HomeCategorySubsection[][]) {
  return groups
    .flat()
    .reduce((total, subcategory) => total + (subcategory.totalArticles ?? 0), 0);
}

function countCollections(...groups: HomeCategorySubsection[][]) {
  return groups.flat().length;
}

type MonthDay = {
  month: number;
  day: number;
};

function extractMonthDay(date?: string | null): MonthDay | null {
  if (!date) {
    return null;
  }

  const trimmed = date.trim();
  if (!trimmed) {
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return {
      month: Number.parseInt(isoMatch[2], 10),
      day: Number.parseInt(isoMatch[3], 10),
    };
  }

  const genericMatch = trimmed.match(/(\d{1,2})[/.-](\d{1,2})$/);
  if (genericMatch) {
    const first = Number.parseInt(genericMatch[1], 10);
    const second = Number.parseInt(genericMatch[2], 10);
    if (first > 12 && second <= 12) {
      return { day: first, month: second };
    }
    if (second > 12 && first <= 12) {
      return { day: second, month: first };
    }
    return { day: second, month: first };
  }

  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) {
    return null;
  }

  const result = new Date(parsed);
  return {
    month: result.getUTCMonth() + 1,
    day: result.getUTCDate(),
  };
}

function extractYear(date?: string | null) {
  if (!date) return null;
  const match = date.trim().match(/(1[5-9]\d{2}|20[0-2]\d)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

/** Deterministic per-day shuffle, so the fallback selection is stable for a
 *  given date but not the same three records every day of the year. */
function seededOrder<T>(items: T[], seed: number) {
  let state = seed >>> 0;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return [...items].sort(() => next() - 0.5);
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const homeCopy = getHomeCopy(locale);
  const [laografia, efimerides, etaireia, efimeridesAll, youtubeData] = await Promise.all([
    getHomeCategorySections("laografia", GRID_LIMIT, locale),
    getHomeCategorySections("efimerides", GRID_LIMIT, locale),
    getHomeCategorySections("etaireia-psychikon-ereynon", INDEX_LIMIT, locale),
    getAllEfimeridesSubcategories(locale),
    getYoutubeData(),
  ]);

  const today = new Date();
  const target: MonthDay = {
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  const todayFormatted = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "el-GR", {
    day: "numeric",
    month: "long",
  }).format(today);

  const pressArticles = efimeridesAll.flatMap((subcategory) => {
    const subcategorySlug = subcategory.subcategorySlug ?? subcategory.slug;
    const subcategoryLabel = subcategory.subcategory ?? subcategorySlug;
    return (subcategory.articles ?? []).map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      image: article.image,
      author: article.author,
      date: article.date as string | undefined,
      subcategorySlug,
      subcategoryLabel,
      href: `/efimerides/${subcategorySlug}/${article.slug}`,
    }));
  });

  const onThisDay = pressArticles
    .filter((article) => {
      const match = extractMonthDay(article.date);
      return match ? match.month === target.month && match.day === target.day : false;
    })
    .slice(0, 3);

  // Most days nothing in the press archive falls on today's date. Rather than
  // drop the opening module entirely — which is what the old page did, so the
  // homepage usually began on a full-bleed image with no heading — fall back
  // to a stable selection drawn from the same body of material.
  const isFallback = onThisDay.length === 0;
  const strip = isFallback
    ? seededOrder(
        pressArticles.filter((article) => article.image?.src),
        target.month * 100 + target.day,
      ).slice(0, 3)
    : onThisDay;

  // The year range is read off the press archive rather than asserted, so the
  // number in the hero is always true.
  const years = pressArticles
    .map((article) => extractYear(article.date))
    .filter((year): year is number => year !== null);
  const span =
    years.length > 1
      ? `${Math.min(...years)}–${Math.max(...years)}`
      : undefined;

  const stats: ArchiveStats = {
    records: countRecords(laografia, efimerides, etaireia),
    collections: countCollections(laografia, efimerides, etaireia),
    span,
  };

  return (
    <>
      <HomeHero stats={stats} locale={locale} />

      {strip.length > 0 && (
        <div className="band">
          <div className="frame band--tight">
            <SanSimeraSection
              articles={strip}
              dateLabel={todayFormatted}
              fallback={isFallback}
              locale={locale}
            />
          </div>
        </div>
      )}

      {/* Λαογραφία — commissioned illustration. A gallery. */}
      {hasArticles(laografia) && (
        <div className="band">
          <div className="frame band--pad">
            <HomeCategorySection
              id="laografia"
              kicker={locale === "en" ? "Collection 01" : "Συλλογή 01"}
              heading={homeCopy.sections.laografia.heading}
              description={homeCopy.sections.laografia.description}
              categorySlug="laografia"
              subcategories={laografia}
              defaultSubcategorySlug={homeCopy.sections.laografia.defaultSub}
              variant="gallery"
              locale={locale}
            />
          </div>
        </div>
      )}

      {/* Εφημερίδες — scanned paper. Matted plates, never cropped. */}
      {hasArticles(efimerides) && (
        <div className="band">
          <div className="frame band--pad">
            <HomeCategorySection
              id="efimerides"
              kicker={locale === "en" ? "Collection 02" : "Συλλογή 02"}
              heading={homeCopy.sections.efimerides.heading}
              description={homeCopy.sections.efimerides.description}
              categorySlug="efimerides"
              subcategories={efimerides}
              defaultSubcategorySlug={homeCopy.sections.efimerides.defaultSub}
              variant="plates"
              locale={locale}
            />
          </div>
        </div>
      )}

      {/* Εταιρεία Ψυχικών Ερευνών — testimony and correspondence. An index. */}
      {hasArticles(etaireia) && (
        <div className="band">
          <div className="frame band--pad">
            <HomeCategorySection
              id="etaireia-psychikon-ereynon"
              kicker={locale === "en" ? "Collection 03" : "Συλλογή 03"}
              heading={homeCopy.sections.etaireia.heading}
              description={homeCopy.sections.etaireia.description}
              categorySlug="etaireia-psychikon-ereynon"
              subcategories={etaireia}
              variant="index"
              locale={locale}
            />
          </div>
        </div>
      )}

      {youtubeData && (
        <div className="band">
          <div className="frame band--pad">
            <YoutubeSection data={youtubeData} locale={locale} />
          </div>
        </div>
      )}
    </>
  );
}
