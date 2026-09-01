"use client";

import Link from "next/link";
import { PlateImage } from "@/components/ui/plate-image";

import { Reveal } from "@/components/ui/reveal";
import type { ArticleSummary } from "@/lib/home";
import type { Locale } from "@/lib/locale";

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

function toYear(date?: string | null) {
  if (!date) return null;
  const match = date.trim().match(/(1[5-9]\d{2}|20[0-2]\d)/);
  return match ? match[1] : null;
}

const copy = {
  el: {
    onThisDay: "Σαν σήμερα",
    fromArchive: "Από το αρχείο",
    press: "Από τον ελληνικό Τύπο",
  },
  en: {
    onThisDay: "On this day",
    fromArchive: "From the archive",
    press: "From the Greek press",
  },
} as const;

type SanSimeraSectionProps = {
  articles: Array<ArticleSummary & { href: string; subcategoryLabel?: string }>;
  /** Formatted day-and-month, e.g. "1 Σεπτεμβρίου". */
  dateLabel: string;
  /**
   * True when nothing in the archive matches today's date. The section then
   * shows a seeded selection instead of disappearing — the old build simply
   * rendered nothing, so on most days the homepage silently lost its opening
   * module and began on a full-bleed image with no heading above it.
   */
  fallback?: boolean;
  locale?: Locale;
};

export function SanSimeraSection({
  articles,
  dateLabel,
  fallback = false,
  locale = "el",
}: SanSimeraSectionProps) {
  const t = locale === "en" ? copy.en : copy.el;

  if (!articles.length) return null;

  return (
    <Reveal>
      <section>
        <div className="shead">
          <div>
            <div className="shead__kicker">
              <span className="mark" aria-hidden="true" />
              <span className="mono">{fallback ? t.fromArchive : t.onThisDay}</span>
            </div>
            <h2 className="shead__title">{fallback ? t.press : dateLabel}</h2>
          </div>
          {!fallback && <p className="shead__desc">{t.press}</p>}
        </div>

        <div>
          {articles.map((article) => {
            const src = toAbsoluteUrl(article.image?.src);
            const year = toYear(article.date as string | undefined);

            return (
              <Link
                key={`${article.id}-${article.slug}`}
                href={article.href}
                className="strip__row group"
              >
                <div className="strip__thumb">
                  {src && (
                    <PlateImage
                      src={src}
                      alt={article.image?.alt ?? article.title}
                      fill
                      sizes="(min-width: 40rem) 168px, 96px"
                    />
                  )}
                </div>
                <div className="strip__body flex flex-col gap-2">
                  <h3 className="strip__title">{article.title}</h3>
                  {article.excerpt && <p className="rec__excerpt">{article.excerpt}</p>}
                </div>
                <div className="strip__aside">
                  {year && <span className="mono mono--micro">{year}</span>}
                  {article.subcategoryLabel && (
                    <span className="mono mono--micro">{article.subcategoryLabel}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </Reveal>
  );
}
