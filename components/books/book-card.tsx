import Image from "next/image";
import Link from "next/link";

import type { Book } from "@/lib/books";
import type { Locale } from "@/lib/locale";

type BookCardProps = {
  book: Book;
  href?: string;
  showPurchaseButton?: boolean;
  showLinkCta?: boolean;
  locale?: Locale;
};

export function BookCard({
  book,
  href,
  showPurchaseButton = false,
  showLinkCta = true,
  locale = "el",
}: BookCardProps) {
  const { title, excerpt, author, image, purchaseUrl, subcategory } = book;
  const moreLabel = locale === "en" ? "More →" : "Περισσότερα →";

  const cardCta =
    showPurchaseButton && purchaseUrl ? (
      <a
        href={purchaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center text-sm font-semibold text-primary-300 transition hover:text-primary-200"
      >
        {moreLabel}
      </a>
    ) : href && showLinkCta ? (
      <Link
        href={href}
        className="mt-auto inline-flex items-center text-sm font-semibold text-primary-300 transition hover:text-primary-200"
      >
        {moreLabel}
      </Link>
    ) : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border surface-border surface-card transition hover:border-primary-400 hover:bg-zinc-900">
      {image?.src ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b surface-border surface-card-strong">
          <Image
            src={image.src}
            alt={image.alt ?? title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1280px) 360px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center border-b surface-border surface-card-strong text-sm text-muted">
          Χωρίς εικόνα
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        {subcategory && (
          <p className="text-xs uppercase tracking-[0.28em] text-muted">
            {subcategory}
          </p>
        )}

        {href ? (
          <Link href={href} className="block">
            <h3 className="text-2xl font-semibold text-n-1 transition group-hover:text-primary-300">
              {title}
            </h3>
          </Link>
        ) : (
          <h3 className="text-2xl font-semibold text-n-1 transition group-hover:text-primary-300">
            {title}
          </h3>
        )}

        {author && <p className="text-sm text-muted">Συγγραφέας: {author}</p>}

        {excerpt && <p className="text-sm leading-6 text-secondary">{excerpt}</p>}

        {cardCta}
      </div>
    </article>
  );
}
