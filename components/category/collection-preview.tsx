import Link from "next/link";

import { PlateImage } from "@/components/ui/plate-image";
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
  return date.trim().match(/(1[5-9]\d{2}|20[0-2]\d)/)?.[1] ?? null;
}

export type PreviewArticle = {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  image?: { src: string; alt?: string };
};

type CollectionPreviewProps = {
  /** Subcategory display name — the heading of the block. */
  title: string;
  href: string;
  articles: PreviewArticle[];
  total: number;
  /** `gallery` for commissioned illustration, `plates` for paper scans. */
  variant?: "gallery" | "plates";
  locale?: Locale;
};

/**
 * One subcategory, previewed.
 *
 * The three category landing pages used to be walls of text: a card per
 * subcategory carrying an auto-generated sentence ("Συλλογή 38 αρχειακών
 * τεκμηρίων για Άρθρα & Διαλέξεις από την Εταιρεία Ψυχικών Ερευνών"), the same
 * shape repeated with the numbers swapped, and not one picture on the page.
 * Showing three actual records instead means the collection is judged on what
 * is in it.
 */
export function CollectionPreview({
  title,
  href,
  articles,
  total,
  variant = "gallery",
  locale = "el",
}: CollectionPreviewProps) {
  if (!articles.length) return null;

  const isPlates = variant === "plates";
  const countLabel =
    locale === "en"
      ? `${total} ${total === 1 ? "record" : "records"}`
      : `${total} ${total === 1 ? "τεκμήριο" : "τεκμήρια"}`;

  return (
    <section className="collection">
      <div className="collection__head">
        <h2 className="collection__title">{title}</h2>
        <span className="mono">{countLabel}</span>
      </div>

      <div className={isPlates ? "clips" : "recs"}>
        {articles.map((article) => {
          const src = toAbsoluteUrl(article.image?.src);
          const year = toYear(article.date);

          return (
            <Link
              key={`${article.id ?? article.slug}-${article.slug}`}
              href={`${href}/${article.slug}`}
              className={isPlates ? "clip group" : "rec group"}
            >
              <div className={isPlates ? "clip__mat" : "rec__plate"}>
                {src &&
                  (isPlates ? (
                    <PlateImage
                      src={src}
                      alt={article.image?.alt ?? article.title}
                      width={640}
                      height={480}
                      sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                    />
                  ) : (
                    <PlateImage
                      src={src}
                      alt={article.image?.alt ?? article.title}
                      fill
                      sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                    />
                  ))}
              </div>
              <div className="flex flex-col gap-2">
                {year && <span className="mono mono--micro">{year}</span>}
                <h3 className={isPlates ? "clip__title" : "rec__title"}>{article.title}</h3>
                {!isPlates && article.excerpt && (
                  <p className="rec__excerpt">{article.excerpt}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="collection__cta">
        <Link href={href} className="btn">
          {locale === "en" ? "Records" : "Τεκμήρια"}
          <span className="btn__arrow" aria-hidden="true">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
