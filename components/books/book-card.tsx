import Link from "next/link";

import { PlateImage } from "@/components/ui/plate-image";
import type { Book } from "@/lib/books";
import type { Locale } from "@/lib/locale";

type BookCardProps = {
  book: Book;
  href?: string;
  showPurchaseButton?: boolean;
  showLinkCta?: boolean;
  locale?: Locale;
};

/**
 * A book in the catalogue. Covers are portrait, so unlike an article plate
 * they get a taller aspect and are contained rather than cropped — a cropped
 * book cover loses the thing that identifies it.
 */
export function BookCard({
  book,
  href,
  showPurchaseButton = false,
  showLinkCta = true,
  locale = "el",
}: BookCardProps) {
  const { title, excerpt, author, image, purchaseUrl, subcategory } = book;
  const moreLabel = locale === "en" ? "More" : "Περισσότερα";

  const body = (
    <>
      <div className="book__cover">
        {image?.src ? (
          <PlateImage
            src={image.src}
            alt={image.alt ?? title}
            width={480}
            height={720}
            sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
          />
        ) : (
          <span className="mono mono--micro">—</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {subcategory && <span className="mono mono--micro">{subcategory}</span>}
        <h3 className="rec__title">{title}</h3>
        {author && <span className="mono mono--micro">{author}</span>}
        {excerpt && <p className="rec__excerpt">{excerpt}</p>}
      </div>
    </>
  );

  if (showPurchaseButton && purchaseUrl) {
    return (
      <article className="rec group">
        {body}
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mono tlink mt-1 self-start"
        >
          {moreLabel} &rarr;
        </a>
      </article>
    );
  }

  if (href && showLinkCta) {
    return (
      <Link href={href} className="rec group">
        {body}
      </Link>
    );
  }

  return <article className="rec">{body}</article>;
}
