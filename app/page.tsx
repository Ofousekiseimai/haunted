import type { Metadata } from "next";

import { HomeHero } from "@/components/home/hero";
import {
  HomeCategorySection,
  type HomeCategorySubsection,
} from "@/components/home/category-section";
import { YoutubeSection } from "@/components/home/youtube-section";
import { getHomeCategorySections } from "@/lib/home";
import { getYoutubeData } from "@/lib/youtube";

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

export default async function HomePage() {
  const [laografia, efimerides, etaireia, youtubeData] = await Promise.all([
    getHomeCategorySections("laografia"),
    getHomeCategorySections("efimerides"),
    getHomeCategorySections("etaireia-psychikon-ereynon"),
    getYoutubeData(),
  ]);

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
          />
        )}

        {hasArticles(efimerides) && (
          <HomeCategorySection
            id="efimerides"
            heading="Άρθρα Εφημερίδων"
            description="Παράξενα φαινόμενα, εγκλήματα και τελετές όπως καταγράφηκαν στον ελληνικό Τύπο."
            categorySlug="efimerides"
            subcategories={efimerides}
          />
        )}

        {hasArticles(etaireia) && (
          <HomeCategorySection
            id="etaireia-psychikon-ereynon"
            heading="Εταιρεία Ψυχικών Ερευνών"
            description="Έρευνες, πειράματα και δημοσιεύσεις από τα αρχεία της Εταιρίας Ψυχικών Ερευνών."
            categorySlug="etaireia-psychikon-ereynon"
            subcategories={etaireia}
          />
        )}
      </div>

      {youtubeData && <YoutubeSection data={youtubeData} />}
    </>
  );
}
