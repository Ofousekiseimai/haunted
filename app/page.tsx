import type { Metadata } from "next";

import { HomeHero } from "@/components/home/hero";
import {
  HomeCategorySection,
  type HomeCategorySubsection,
} from "@/components/home/category-section";
import { YoutubeSection } from "@/components/home/youtube-section";
import { getHomeCategorySections } from "@/lib/home";
import { getYoutubeData } from "@/lib/youtube";
import { getAllEtaireiaSubcategories } from "@/lib/etaireia";

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
  const [laografia, efimerides, etaireia, etaireiaFull, youtubeData] = await Promise.all([
    getHomeCategorySections("laografia"),
    getHomeCategorySections("efimerides"),
    getHomeCategorySections("etaireia-psychikon-ereynon"),
    getAllEtaireiaSubcategories(),
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
      <HomeHero />

      <div className="container space-y-20 py-16">
        {hasArticles(laografia) && (
          <HomeCategorySection
            id="laografia"
            heading="Άρθρα Παραδόσεις / Λαογραφία"
            description="Συλλογές για στοιχειά, νεράιδες, βρυκόλακες και πλάσματα της ελληνικής παράδοσης."
            categorySlug="laografia"
            subcategories={laografia}
            defaultSubcategorySlug="vrikolakes"
          />
        )}

        {hasArticles(efimerides) && (
          <HomeCategorySection
            id="efimerides"
            heading="Άρθρα Εφημερίδων"
            description="Παράξενα φαινόμενα, εγκλήματα και τελετές όπως καταγράφηκαν στον ελληνικό Τύπο."
            categorySlug="efimerides"
            subcategories={efimerides}
            defaultSubcategorySlug="fainomena"
          />
        )}

        {hasArticles(etaireia) && (
          <HomeCategorySection
            id="etaireia-psychikon-ereynon"
            heading="Εταιρεία Ψυχικών Ερευνών"
            description="Έρευνες, πειράματα και δημοσιεύσεις από τα αρχεία της Εταιρίας Ψυχικών Ερευνών."
            categorySlug="etaireia-psychikon-ereynon"
            subcategories={etaireia}
            spotlight={etaireiaSpotlight}
          />
        )}
      </div>

      {youtubeData && <YoutubeSection data={youtubeData} />}
    </>
  );
}
