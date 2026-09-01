"use client";

import Link from "next/link";

import { GreeceMap } from "@/components/maps/greece-map";
import { Reveal } from "@/components/ui/reveal";
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
    <Reveal>
      <section id="map" className="space-y-8">
        <div className="space-y-3 text-center">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-h2)",
              fontWeight: 300,
              color: "var(--bone)",
            }}
          >
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-sm md:text-base" style={{ color: "var(--ash)" }}>
            {description}
          </p>
        </div>

        <div className="rounded-[2.125rem] shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)]">
          <GreeceMap articles={articles} />
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/map2"
            className="inline-flex items-center justify-center border px-6 py-3 font-semibold transition hover:border-[var(--hairline-strong)] hover:text-[var(--accent-bright)]"
            style={{
              borderColor: "var(--hairline)",
              color: "var(--bone)",
              fontFamily: "var(--font-code)",
              fontSize: "var(--fs-meta)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {translateSubcategoryLabel("laografia-map", "Χάρτης Λαογραφίας", locale)}
          </Link>
          <Link
            href="/map"
            className="inline-flex items-center justify-center border px-6 py-3 font-semibold transition hover:border-[var(--hairline-strong)] hover:text-[var(--accent-bright)]"
            style={{
              borderColor: "var(--hairline)",
              color: "var(--bone)",
              fontFamily: "var(--font-code)",
              fontSize: "var(--fs-meta)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {translateSubcategoryLabel("efimerides-map", "Χάρτης Εφημερίδων", locale)}
          </Link>
        </div>
      </section>
    </Reveal>
  );
}
