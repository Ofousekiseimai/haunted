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
    <section className="bg-n-8 py-12">
      <div className="container space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-n-1 md:text-4xl">{copy.heading}</h2>
          <p className="mt-2 text-n-3">{copy.description}</p>
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
            className="rounded-lg bg-gradient-to-r from-color-5 via-color-1 to-color-6 p-[2px] text-n-1 transition duration-300 hover:scale-[1.03]"
          >
            <span className="block rounded-md bg-n-8 px-6 py-2">{copy.moreButton}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
