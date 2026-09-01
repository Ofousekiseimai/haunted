import Link from "next/link";

import { BookCard } from "../books/book-card";
import type { Book } from "@/lib/books";
import type { Locale } from "@/lib/locale";
import { getBooksCopy } from "@/lib/i18n/ui";

type HomeBooksSectionProps = {
  books: Book[];
  allBooksHref?: string;
  locale?: Locale;
};

export function HomeBooksSection({
  books,
  allBooksHref = "/vivlia",
  locale = "el",
}: HomeBooksSectionProps) {
  // Temporarily disable books section on home until catalog is ready
  return null;

  const copy = getBooksCopy(locale);

  const displayedBooks = books.slice(0, 8);

  if (!displayedBooks.length) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container space-y-8">
        <div className="text-center">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-h2)",
              fontWeight: 300,
              color: "var(--bone)",
            }}
          >
            {copy.heading}
          </h2>
          <p className="mt-2" style={{ color: "var(--ash)" }}>
            {copy.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedBooks.map((book) => (
            <BookCard
              key={`${book.id}-${book.slug}`}
              book={book}
              href={allBooksHref}
              showPurchaseButton={false}
              showLinkCta={false}
              locale={locale}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href={allBooksHref}
            className="border px-6 py-2 transition duration-300 hover:border-[var(--hairline-strong)] hover:text-[var(--accent-bright)]"
            style={{
              borderColor: "var(--hairline)",
              color: "var(--bone)",
              fontFamily: "var(--font-code)",
              fontSize: "var(--fs-meta)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {copy.moreButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
