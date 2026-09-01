import type { ReactNode } from "react";

import { PlateImage } from "@/components/ui/plate-image";
import type { ArticleContentBlock } from "@/lib/content";
import type { Locale } from "@/lib/locale";

type ArticleImage = { src: string; alt?: string };

type ArticleViewProps = {
  categoryLabel: string;
  subcategoryLabel: string;
  title: string;
  author?: string;
  date?: string;
  excerpt?: string;
  image?: ArticleImage;
  content: ArticleContentBlock[];
  /** Scans are matted whole; illustration is cropped. */
  variant?: "gallery" | "plates";
  locale?: Locale;
  children?: ReactNode;
};

/**
 * The reading page.
 *
 * The four article routes carried ~400 near-identical lines each — the same
 * block renderer and the same header, diverged just enough to drift. The
 * presentation now lives here once.
 *
 * The old layout set body copy in the UI sans at 16px across a 896px column.
 * For an archive of folk narrative and pre-1982 press transcriptions that is
 * the wrong instrument twice over: the measure runs past the point where the
 * eye reliably finds the next line, and a UI grotesque has nothing to say
 * about a document from 1892. It reads in the display serif now, which is
 * already loaded and carries greek-ext for the polytonic.
 */

function formatDate(date: string | undefined, locale: Locale) {
  if (!date) return null;
  const iso = date.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!iso) return date.trim();
  const parsed = new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
  if (Number.isNaN(parsed.getTime())) return date.trim();
  // A day-precision date of 1 January is almost always "we only know the
  // year", so it is shown as the year alone rather than as a false precision.
  if (Number(iso[2]) === 1 && Number(iso[3]) === 1) return iso[1];
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "el-GR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function ContentBlock({ block }: { block: ArticleContentBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="article__h2">{block.value ?? block.heading}</h2>;

    case "list":
      if (!block.items?.length) return null;
      return (
        <ul className="article__list">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      );

    case "quote":
      return <blockquote className="article__quote">{block.value}</blockquote>;

    case "image": {
      const payload = block.value as
        | { src?: string; alt?: string; caption?: string }
        | null
        | undefined;
      if (!payload || typeof payload !== "object" || typeof payload.src !== "string") {
        return null;
      }
      return (
        <figure className="article__figure">
          <div className="article__mat">
            <PlateImage
              src={payload.src}
              alt={payload.alt ?? ""}
              width={1200}
              height={900}
              sizes="(min-width: 64rem) 720px, 100vw"
            />
          </div>
          {payload.caption && (
            <figcaption className="article__caption">{payload.caption}</figcaption>
          )}
        </figure>
      );
    }

    case "text":
    default:
      return block.value ? <p className="article__p">{block.value}</p> : null;
  }
}

export function ArticleView({
  categoryLabel,
  subcategoryLabel,
  title,
  author,
  date,
  excerpt,
  image,
  content,
  variant = "gallery",
  locale = "el",
  children,
}: ArticleViewProps) {
  const displayDate = formatDate(date, locale);
  const byline = [author, displayDate].filter(Boolean);

  return (
    <article className="article">
      <div className="frame">
        <header className="article__head">
          <div className="article__kicker">
            <span className="mark" aria-hidden="true" />
            <span className="mono">
              {categoryLabel} · {subcategoryLabel}
            </span>
          </div>

          <h1 className="article__title">{title}</h1>

          {byline.length > 0 && (
            <p className="mono mono--micro article__byline">{byline.join(" · ")}</p>
          )}

          {excerpt && <p className="article__lede">{excerpt}</p>}
        </header>

        {image?.src && (
          <div className="article__lead">
            <div className={variant === "plates" ? "article__mat" : "article__crop"}>
              <PlateImage
                src={image.src}
                alt={image.alt ?? title}
                width={1600}
                height={variant === "plates" ? 1200 : 900}
                sizes="(min-width: 64rem) 900px, 100vw"
                priority
              />
            </div>
          </div>
        )}

        <div className="article__body">
          {content.map((block, index) => (
            <ContentBlock key={index} block={block} />
          ))}
        </div>

        {children}
      </div>
    </article>
  );
}
