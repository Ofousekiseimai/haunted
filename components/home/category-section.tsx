"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ArticleSummary } from "@/lib/home";

const SITE_BASE_URL = "https://haunted.gr";

function toAbsoluteUrl(url?: string | null) {
  if (!url) {
    return undefined;
  }

  if (/^https?:\/\//.test(url)) {
    return url.trim();
  }

  try {
    return new URL(url.trim(), SITE_BASE_URL).toString();
  } catch {
    return undefined;
  }
}

export type HomeCategorySubsection = {
  slug: string;
  displayName: string;
  description?: string;
  category: string;
  articles: ArticleSummary[];
  totalArticles: number;
};

type HomeCategorySectionProps = {
  id: string;
  heading: string;
  description?: string;
  categorySlug: string;
  subcategories: HomeCategorySubsection[];
  defaultSubcategorySlug?: string;
};

function ArticleCard({
  article,
  href,
}: {
  article: ArticleSummary;
  href: string;
}) {
  const imageSrc = toAbsoluteUrl(article.image?.src);

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-n-7 bg-n-8/60 p-4 shadow-lg transition duration-300 hover:scale-[1.02]"
    >
      {imageSrc && (
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={article.image?.alt ?? article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-n-1 transition group-hover:text-color-1">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="mt-3 line-clamp-3 text-sm text-n-3">{article.excerpt}</p>
      )}
      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-n-1/80 transition group-hover:text-color-1 group-hover:opacity-100">
        Διαβάστε περισσότερα <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

export function HomeCategorySection({
  id,
  heading,
  description,
  categorySlug,
  subcategories,
  defaultSubcategorySlug,
}: HomeCategorySectionProps) {
  const fallbackSlug = subcategories[0]?.slug ?? "";
  const resolvedDefaultSlug = useMemo(() => {
    if (!defaultSubcategorySlug) {
      return fallbackSlug;
    }

    return subcategories.some((entry) => entry.slug === defaultSubcategorySlug)
      ? defaultSubcategorySlug
      : fallbackSlug;
  }, [defaultSubcategorySlug, fallbackSlug, subcategories]);

  const [selectedSlug, setSelectedSlug] = useState(resolvedDefaultSlug);

  useEffect(() => {
    setSelectedSlug((current) => {
      if (subcategories.some((entry) => entry.slug === current)) {
        return current;
      }

      return resolvedDefaultSlug;
    });
  }, [resolvedDefaultSlug, subcategories]);

  const selectedSubcategory = useMemo(
    () => subcategories.find((entry) => entry.slug === selectedSlug) ?? subcategories[0],
    [selectedSlug, subcategories],
  );

  if (!subcategories.length) {
    return null;
  }

  return (
    <section id={id} className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-n-1 md:text-4xl">{heading}</h2>
        {description && <p className="mt-2 text-n-3">{description}</p>}
      </div>

      <div className="md:hidden">
        <label className="sr-only" htmlFor={`mobile-select-${id}`}>
          Επιλογή υποκατηγορίας
        </label>
        <select
          id={`mobile-select-${id}`}
          value={selectedSlug}
          onChange={(event) => setSelectedSlug(event.target.value)}
          className="w-full rounded-lg border border-n-7 bg-n-8 p-3 text-n-1"
        >
          {subcategories.map((subcategory) => (
            <option key={subcategory.slug} value={subcategory.slug}>
              {subcategory.displayName}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden flex-wrap justify-center gap-3 md:flex">
        {subcategories.map((subcategory) => {
          const isActive = subcategory.slug === selectedSubcategory?.slug;
          return (
            <button
              key={subcategory.slug}
              type="button"
              onClick={() => setSelectedSlug(subcategory.slug)}
              className={`rounded-lg px-4 py-2 transition-all duration-200 ${
                isActive
                  ? "bg-color-1 p-[2px]"
                  : "bg-n-8 hover:bg-n-7"
              }`}
            >
              <span className="block rounded-md px-3 py-1">
                {subcategory.displayName}
              </span>
            </button>
          );
        })}
      </div>

      {selectedSubcategory?.articles.length ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {selectedSubcategory.articles.map((article) => (
              <ArticleCard
                key={`${article.id}-${article.slug}`}
                article={article}
                href={`/${categorySlug}/${selectedSubcategory.slug}/${article.slug}`}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href={`/${categorySlug}/${selectedSubcategory.slug}`}
              className="rounded-lg bg-gradient-to-r from-color-5 via-color-1 to-color-6 p-[2px] font-medium text-n-1 transition duration-300 hover:scale-[1.03]"
            >
              <span className="block rounded-md bg-n-8 px-6 py-2">
                Δες όλα τα άρθρα στην κατηγορία “{selectedSubcategory.displayName}”
              </span>
            </Link>
          </div>
        </>
      ) : (
        <p className="text-center text-n-3">
          Δεν υπάρχουν διαθέσιμα άρθρα για την επιλεγμένη υποκατηγορία.
        </p>
      )}
    </section>
  );
}
