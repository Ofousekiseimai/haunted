import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { getAllChronologiaSubcategories, type ChronologiaSubcategory } from "@/lib/chronologia";
import { getRequestLocale } from "@/lib/locale-server";
import { translateCategoryLabel } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Χρονολόγια",
  description:
    "Οριζόντια χρονολόγια με τεκμήρια του ελληνικού Τύπου ταξινομημένα ανά θεματική.",
  alternates: {
    canonical: "https://haunted.gr/chronologia",
  },
};

function getYearRange(sub: ChronologiaSubcategory): string | null {
  const years = sub.timeline.map((t) => t.year).filter((y) => typeof y === "number" && y > 0);
  if (!years.length) return null;
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min} – ${max}`;
}

export default async function ChronologiaIndexPage() {
  const locale = await getRequestLocale();
  const subcategories = await getAllChronologiaSubcategories(locale);

  const total = subcategories.reduce((count, sub) => count + sub.articleCount, 0);
  const heading = locale === "en" ? "Timelines" : "Χρονολόγια";
  const title = locale === "en" ? "Thematic Timelines" : "Θεματικά Χρονολόγια Τύπου";
  const description =
    locale === "en"
      ? "Pick a theme and browse chronologically all records from the Greek press."
      : "Διάλεξε θεματική και περιηγήσου σε χρονολογική σειρά όλα τα τεκμήρια από τον ελληνικό Τύπο.";

  const featured = subcategories.find((s) => s.slug === "parafysiko");
  const rest = subcategories.filter((s) => s.slug !== "parafysiko");

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader eyebrow={heading} title={title} description={description} />

      <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">
        {locale === "en" ? "Total records" : "Συνολικά τεκμήρια"}: {total}
      </p>

      {featured && (() => {
        const yearRange = getYearRange(featured);
        return (
          <Link
            href={`/chronologia/${featured.slug}`}
            className="group flex flex-col gap-5 rounded-3xl border border-color-1/30 bg-gradient-to-br from-color-1/10 to-zinc-900/60 p-8 transition hover:border-color-1/60 hover:from-color-1/15 md:p-10"
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-color-1">
                {heading}
              </p>
              {yearRange && (
                <span className="rounded-full border border-color-1/30 bg-color-1/10 px-3 py-0.5 text-xs font-medium text-color-1">
                  {yearRange}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-zinc-100 transition group-hover:text-white md:text-4xl">
              {translateCategoryLabel(featured.slug, featured.title, locale)}
            </h2>
            {featured.description && (
              <p className="max-w-2xl text-base text-zinc-400">{featured.description}</p>
            )}
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-color-1 transition group-hover:text-color-1/80">
                {locale === "en" ? "Browse timeline →" : "Δείτε το χρονολόγιο →"}
              </span>
              <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                {featured.articleCount} {locale === "en" ? "records" : "τεκμήρια"}
              </span>
            </div>
          </Link>
        );
      })()}

      {rest.length > 0 && (
        <>
          <div className="relative" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-n-8 px-4 text-xs uppercase tracking-[0.28em] text-zinc-600">
                {locale === "en" ? "Thematic timelines" : "Θεματικά Χρονολόγια"}
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((sub) => {
              const yearRange = getYearRange(sub);
              return (
                <Link
                  key={sub.slug}
                  href={`/chronologia/${sub.slug}`}
                  className="group flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-primary-400/60 hover:bg-zinc-900"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">{heading}</p>
                    {yearRange && (
                      <span className="rounded-full border border-zinc-700 bg-zinc-800/60 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                        {yearRange}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-zinc-100 transition group-hover:text-white">
                      {translateCategoryLabel(sub.slug, sub.title, locale)}
                    </h2>
                    {sub.description && (
                      <p className="text-sm text-zinc-400 line-clamp-2">{sub.description}</p>
                    )}
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                      {sub.articleCount} {locale === "en" ? "records" : "τεκμήρια"}
                    </p>
                  </div>
                  <span className="mt-auto text-sm font-medium text-primary-300 transition group-hover:text-primary-200">
                    {locale === "en" ? "Browse timeline →" : "Δείτε το χρονολόγιο →"}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </Section>
  );
}
