import type { Metadata } from "next";

import { HomeHero } from "@/components/home/hero";
import {
  HomeCategorySection,
  type HomeCategorySubsection,
} from "@/components/home/category-section";
import { HomeBooksSection } from "@/components/home/books-section";
import { YoutubeSection } from "@/components/home/youtube-section";
import { getHomeCopy } from "@/lib/i18n/ui";
import { getBooksForHome } from "@/lib/books";
import { getHomeCategorySections } from "@/lib/home";
import { getYoutubeData } from "@/lib/youtube";
import { getAllEtaireiaSubcategories } from "@/lib/etaireia";
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

function hasArticles(subcategories: HomeCategorySubsection[]) {
  return subcategories.some((entry) => entry.articles.length);
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

  const genericMatch = trimmed.match(/(\d{1,2})[\/.-](\d{1,2})$/);
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

export default async function HomePage() {
  const locale = await getRequestLocale();
  const homeCopy = getHomeCopy(locale);
  const [laografia, efimerides, etaireia, etaireiaFull, books, youtubeData] = await Promise.all([
    getHomeCategorySections("laografia", 6, locale),
    getHomeCategorySections("efimerides", 6, locale),
    getHomeCategorySections("etaireia-psychikon-ereynon", 6, locale),
    getAllEtaireiaSubcategories(locale),
    getBooksForHome(8, locale),
    getYoutubeData(),
  ]);

  const today = new Date();
  const target: MonthDay = {
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  const sanSimeraArticles = etaireiaFull
    .flatMap((subcategory) => {
      const subcategorySlug = subcategory.subcategorySlug ?? subcategory.slug;
      return (subcategory.articles ?? []).map((article) => ({
        article,
        subcategorySlug,
      }));
    })
    .filter(({ article }) => {
      const match = extractMonthDay(article.date as string | undefined);
      if (!match) {
        return false;
      }
      return match.month === target.month && match.day === target.day;
    })
    .slice(0, 3)
    .map(({ article, subcategorySlug }) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      image: article.image,
      author: article.author,
      date: article.date as string | undefined,
      subcategorySlug,
      href: `/etaireia-psychikon-ereynon/${subcategorySlug}/${article.slug}`,
    }));

  const etaireiaSpotlight = sanSimeraArticles.length
    ? {
        label: "Σαν σήμερα",
        articles: sanSimeraArticles,
      }
    : undefined;

  return (
    <>
      <HomeHero locale={locale} />

      <div className="container space-y-20 py-16">
        {hasArticles(laografia) && (
          <HomeCategorySection
            id="laografia"
            heading={homeCopy.sections.laografia.heading}
            description={homeCopy.sections.laografia.description}
            categorySlug="laografia"
            subcategories={laografia}
            defaultSubcategorySlug={homeCopy.sections.laografia.defaultSub}
            locale={locale}
          />
        )}

        {hasArticles(efimerides) && (
          <HomeCategorySection
            id="efimerides"
            heading={homeCopy.sections.efimerides.heading}
            description={homeCopy.sections.efimerides.description}
            categorySlug="efimerides"
            subcategories={efimerides}
            defaultSubcategorySlug={homeCopy.sections.efimerides.defaultSub}
            locale={locale}
          />
        )}

        {hasArticles(etaireia) && (
          <HomeCategorySection
            id="etaireia-psychikon-ereynon"
            heading={homeCopy.sections.etaireia.heading}
            description={homeCopy.sections.etaireia.description}
            categorySlug="etaireia-psychikon-ereynon"
            subcategories={etaireia}
            spotlight={etaireiaSpotlight}
            locale={locale}
          />
        )}
      </div>

      {books.length > 0 && <HomeBooksSection books={books} locale={locale} />}

      {youtubeData && <YoutubeSection data={youtubeData} locale={locale} />}
    </>
  );
}
