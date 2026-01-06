import type { TimelineItem } from "@/components/chronologia/timeline";

import { getAllEfimeridesSubcategories, getEfimeridesTimeline } from "./efimerides";
import { getEtaireiaTimeline } from "./etaireia";
import { DEFAULT_LOCALE, type Locale } from "./content";

export type ChronologiaSubcategory = {
  slug: string;
  title: string;
  description?: string;
  timeline: TimelineItem[];
  articleCount: number;
};

function sortTimelineItems(items: TimelineItem[]) {
  return [...items].sort((a, b) => {
    const aTime = Date.parse(a.date);
    const bTime = Date.parse(b.date);
    if (aTime !== bTime) {
      return aTime - bTime;
    }
    return a.title.localeCompare(b.title, "el-GR");
  });
}

async function buildEfimeridesChronologia(locale: Locale) {
  const efimerides = await getAllEfimeridesSubcategories(locale);

  return efimerides.map((subcategory) => {
    const timeline = (subcategory.articles ?? [])
      .filter((article) => typeof article.date === "string" && Number.isFinite(Date.parse(article.date)))
      .map((article) => {
        const date = article.date as string;
        const year = new Date(date).getFullYear();
        return {
          id: String(article.id),
          title: article.title,
          slug: article.slug,
          subcategory: subcategory.subcategory,
          subcategorySlug: subcategory.subcategorySlug ?? subcategory.slug,
          path: `/efimerides/${subcategory.subcategorySlug ?? subcategory.slug}/${article.slug}`,
          date,
          year,
          excerpt: typeof article.excerpt === "string" ? article.excerpt : undefined,
          imageSrc: article.image?.src,
        };
      })
      .filter((entry): entry is TimelineItem => Boolean(entry))
      .map((entry) => entry as TimelineItem);

    return {
      slug: subcategory.subcategorySlug ?? subcategory.slug,
      title: subcategory.subcategory,
      description: subcategory.seo?.metaDescription,
      timeline: sortTimelineItems(timeline),
      articleCount: timeline.length,
    } as ChronologiaSubcategory;
  });
}

async function buildEtaireiaChronologia(locale: Locale) {
  const timeline = await getEtaireiaTimeline(locale);

  return {
    slug: "etaireia-psychikon-ereynon",
    title: "Χρονολόγιο Εταιρίας Ψυχικών Ερευνών",
    description:
      "Όλα τα άρθρα και οι δημοσιεύσεις της Εταιρίας Ψυχικών Ερευνών σε ένα ενιαίο χρονολόγιο",
    timeline,
    articleCount: timeline.length,
  } as ChronologiaSubcategory;
}

async function buildParafysikoChronologia(locale: Locale) {
  const [efimeridesTimeline, etaireiaTimeline] = await Promise.all([
    getEfimeridesTimeline(locale),
    getEtaireiaTimeline(locale),
  ]);

  const combined = sortTimelineItems([...efimeridesTimeline, ...etaireiaTimeline]);

  return {
    slug: "parafysiko",
    title: "Χρονολόγιο του Παραφυσικού",
    description:
      "Ενιαίο χρονολόγιο με όλες τις δημοσιεύσεις εφημερίδων και της Εταιρίας Ψυχικών Ερευνών για το παραφυσικό.",
    timeline: combined,
    articleCount: combined.length,
  } as ChronologiaSubcategory;
}

export async function getAllChronologiaSubcategories(locale: Locale = DEFAULT_LOCALE) {
  const [parafysiko, efimerides, etaireia] = await Promise.all([
    buildParafysikoChronologia(locale),
    buildEfimeridesChronologia(locale),
    buildEtaireiaChronologia(locale),
  ]);

  return [parafysiko, etaireia, ...efimerides];
}

export async function getChronologiaSubcategory(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<ChronologiaSubcategory | null> {
  const subcategories = await getAllChronologiaSubcategories(locale);
  return subcategories.find((entry) => entry.slug === slug) ?? null;
}
