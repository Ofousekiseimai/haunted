import type { Metadata } from "next";

import { CategoryArticleCard } from "@/components/category/article-card";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { searchArticles } from "@/lib/search";
import { getRequestLocale } from "@/lib/locale-server";
import { translateCategoryLabel } from "@/lib/translations";

const CANONICAL_URL = "https://haunted.gr/search";

type PageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q?.trim();

  const baseTitle = "Αναζήτηση";
  const title = query ? `${baseTitle} για «${query}»` : baseTitle;
  const description = query
    ? `Αποτελέσματα αναζήτησης για «${query}» από το αρχείο του haunted.gr.`
    : "Αναζήτηση σε όλα τα άρθρα, παραδόσεις και τεκμήρια του haunted.gr.";

  return {
    title,
    description,
    alternates: {
      canonical: CANONICAL_URL,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: CANONICAL_URL,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params?.q?.trim() ?? "";
  const locale = await getRequestLocale();
  const results = query ? await searchArticles(query, locale) : [];
  const eyebrow = locale === "en" ? "Archive" : "Αρχείο";
  const title = locale === "en" ? "Search content" : "Αναζήτηση περιεχομένου";
  const description =
    locale === "en"
      ? "Search articles, folklore, and records using keywords or locations."
      : "Αναζητήστε άρθρα, παραδόσεις και τεκμήρια χρησιμοποιώντας λέξεις-κλειδιά ή τοπωνύμια.";

  return (
    <Section className="container space-y-10" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <form
        method="get"
        className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-lg shadow-black/20"
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
          <span>{locale === "en" ? "Word or phrase" : "Λέξη ή φράση"}</span>
          <div className="flex gap-3">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={
                locale === "en" ? "e.g. vampire, Athens, testimony" : "π.χ. βρυκόλακας, Αθήνα, μαρτυρία"
              }
              className="flex-1 rounded-xl border surface-border surface-input px-4 py-2 text-base text-n-1 focus:border-primary-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-400"
            >
              {locale === "en" ? "Search" : "Αναζήτηση"}
            </button>
          </div>
        </label>
      </form>

      {query.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-sm text-zinc-400">
          {locale === "en"
            ? "Type a term above and press “Search” to see results from all categories."
            : "Πληκτρολογήστε ένα όρο παραπάνω και πατήστε «Αναζήτηση» για να δείτε αποτελέσματα από όλες τις κατηγορίες."}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-sm text-zinc-400">
          {locale === "en" ? `No results found for “${query}”.` : `Δεν βρέθηκαν αποτελέσματα για «${query}».`}
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-zinc-400">
            {locale === "en"
              ? `${results.length} results found for “${query}”.`
              : `Βρέθηκαν ${results.length} αποτελέσματα για «${query}».`}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((article) => (
              <CategoryArticleCard
                key={`${article.categoryKey}-${article.id}`}
                href={`/${article.categoryKey}/${article.subcategorySlug}/${article.slug}`}
                title={article.title}
                excerpt={article.excerpt}
                date={article.date}
                location={article.mainArea ?? article.locationTags[0]}
                tags={article.locationTags.slice(0, 4)}
                image={
                  article.imageSrc
                    ? {
                        src: article.imageSrc,
                        alt: article.imageAlt ?? article.title,
                      }
                    : undefined
                }
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
