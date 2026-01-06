import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookCard } from "@/components/books/book-card";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { getAllBookSubcategoryParams, getBooksSubcategory } from "@/lib/books";
import { getRequestLocale } from "@/lib/locale-server";

type PageParams = {
  subcategory: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export async function generateStaticParams() {
  return getAllBookSubcategoryParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory } = await params;
  const locale = await getRequestLocale();
  const data = await getBooksSubcategory(subcategory, locale);

  if (!data) {
    return {};
  }

  const title = data.seo?.metaTitle ?? data.subcategory;
  const description =
    data.seo?.metaDescription ??
    `Δες ${data.articles.length} βιβλία από την κατηγορία ${data.subcategory}.`;
  const canonical = data.seo?.canonical ?? `/vivlia/${data.subcategorySlug ?? subcategory}`;
  const keywords = data.seo?.keywords;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function BooksSubcategoryPage({ params }: PageProps) {
  const { subcategory } = await params;
  const locale = await getRequestLocale();
  const data = await getBooksSubcategory(subcategory, locale);

  if (!data) {
    notFound();
  }

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow="Βιβλία"
        title={data.subcategory}
        description={
          data.seo?.metaDescription ??
          `Εξερεύνησε επιλεγμένα βιβλία για την ενότητα ${data.subcategory}.`
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.articles.map((book) => (
          <BookCard key={`${book.id}-${book.slug}`} book={book} showPurchaseButton />
        ))}
      </div>
    </Section>
  );
}
