"use client";

import Link from "next/link";

import { GreeceMap } from "@/components/maps/greece-map";
import type { MapArticle } from "@/lib/maps";
import type { Locale } from "@/lib/locale";
import { translateSubcategoryLabel } from "@/lib/translations";

type HomeMapSectionProps = {
  articles: MapArticle[];
  locale?: Locale;
};

export function HomeMapSection({ articles, locale = "el" }: HomeMapSectionProps) {
  if (!articles?.length) {
    return null;
  }

  const heading =
    locale === "en" ? "Interactive Folklore Map" : "Διαδραστικός Λαογραφικός Χάρτης";
  const description =
    locale === "en"
      ? "Discover folklore, testimonies, and paranormal phenomena on the map of Greece."
      : "Ανακαλύψτε παραδόσεις, μαρτυρίες και υπερφυσικά φαινόμενα μέσα από τη γεωγραφική απεικόνιση των καταγραφών σε όλη την Ελλάδα.";

  return (
    <section id="map" className="space-y-8">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-semibold text-n-1 md:text-4xl">{heading}</h2>
        <p className="mx-auto max-w-2xl text-sm text-n-3 md:text-base">{description}</p>
      </div>

      <div className="rounded-[2.125rem] bg-n-8/80 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)]">
        <GreeceMap articles={articles} />
      </div>

      <div className="flex flex-col items-center gap-3 text-sm uppercase tracking-[0.28em] text-n-3 sm:flex-row sm:justify-center">
        <Link
          href="/map2"
          className="inline-flex items-center justify-center rounded-full border border-n-6 px-6 py-3 font-semibold text-n-1 transition hover:border-color-1 hover:text-color-1"
        >
          {translateSubcategoryLabel("laografia-map", "Χάρτης Λαογραφίας", locale)}
        </Link>
        <Link
          href="/map"
          className="inline-flex items-center justify-center rounded-full border border-n-6 px-6 py-3 font-semibold text-n-1 transition hover:border-color-1 hover:text-color-1"
        >
          {translateSubcategoryLabel("efimerides-map", "Χάρτης Εφημερίδων", locale)}
        </Link>
      </div>
    </section>
  );
}
