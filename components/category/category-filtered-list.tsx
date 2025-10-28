"use client";

import { useMemo, useState } from "react";

import { CategoryArticleCard } from "./article-card";
import type { CategoryArticleSummary, GenericCategoryKey } from "@/lib/generic-category";

type FilterOption = {
  value: string;
  label: string;
};

type CategoryFilteredListProps = {
  categoryKey: GenericCategoryKey;
  subcategorySlug: string;
  articles: CategoryArticleSummary[];
};

function toOption(value: string | null | undefined, fallbackLabel?: string): FilterOption | null {
  if (!value) {
    return null;
  }

  return {
    value,
    label: fallbackLabel ?? value,
  };
}

function sortOptions(options: FilterOption[]) {
  return [...options].sort((a, b) => a.label.localeCompare(b.label, "el-GR"));
}

function sortYearOptions(options: FilterOption[]) {
  return [...options].sort((a, b) => Number(b.value) - Number(a.value));
}

export function CategoryFilteredList({
  categoryKey,
  subcategorySlug,
  articles,
}: CategoryFilteredListProps) {
  const [selectedMainArea, setSelectedMainArea] = useState("all");
  const [selectedSubLocationRaw, setSelectedSubLocationRaw] = useState("all");
  const [selectedYearRaw, setSelectedYearRaw] = useState("all");

  const mainAreaOptions = useMemo(() => {
    const options = articles
      .map((article) => article.mainArea)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .map((value) => toOption(value))
      .filter((option): option is FilterOption => Boolean(option));

    const unique = new Map<string, FilterOption>();
    options.forEach((option) => {
      if (!unique.has(option.value)) {
        unique.set(option.value, option);
      }
    });

    return [{ value: "all", label: "Όλες οι περιοχές" }, ...sortOptions(Array.from(unique.values()))];
  }, [articles]);

  const subLocationOptions = useMemo(() => {
    const filtered = selectedMainArea === "all"
      ? articles
      : articles.filter((article) => article.mainArea === selectedMainArea);

    const options = filtered
      .flatMap((article) => article.subLocations)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .map((value) => toOption(value))
      .filter((option): option is FilterOption => Boolean(option));

    const unique = new Map<string, FilterOption>();
    options.forEach((option) => {
      if (!unique.has(option.value)) {
        unique.set(option.value, option);
      }
    });

    return [
      { value: "all", label: "Όλες οι τοποθεσίες" },
      ...sortOptions(Array.from(unique.values())),
    ];
  }, [articles, selectedMainArea]);

  const resolvedSubLocation = useMemo(() => {
    return subLocationOptions.some((option) => option.value === selectedSubLocationRaw)
      ? selectedSubLocationRaw
      : "all";
  }, [selectedSubLocationRaw, subLocationOptions]);

  const yearOptions = useMemo(() => {
    const filteredByArea =
      selectedMainArea === "all"
        ? articles
        : articles.filter((article) => article.mainArea === selectedMainArea);

    const filteredByLocation =
      resolvedSubLocation === "all"
        ? filteredByArea
        : filteredByArea.filter((article) => article.subLocations.includes(resolvedSubLocation));

    const options = filteredByLocation
      .map((article) => article.year)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .map((value) => toOption(value))
      .filter((option): option is FilterOption => Boolean(option));

    const unique = new Map<string, FilterOption>();
    options.forEach((option) => {
      if (!unique.has(option.value)) {
        unique.set(option.value, option);
      }
    });

    return [
      { value: "all", label: "Όλες οι χρονιές" },
      ...sortYearOptions(Array.from(unique.values())),
    ];
  }, [articles, selectedMainArea, resolvedSubLocation]);

  const resolvedYear = useMemo(() => {
    return yearOptions.some((option) => option.value === selectedYearRaw) ? selectedYearRaw : "all";
  }, [selectedYearRaw, yearOptions]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesArea =
        selectedMainArea === "all" || article.mainArea === selectedMainArea;
      const matchesLocation =
        resolvedSubLocation === "all" || article.subLocations.includes(resolvedSubLocation);
      const matchesYear = resolvedYear === "all" || article.year === resolvedYear;
      return matchesArea && matchesLocation && matchesYear;
    });
  }, [articles, selectedMainArea, resolvedSubLocation, resolvedYear]);

  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
          <span>Περιοχή</span>
          <select
            value={selectedMainArea}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedMainArea(value);
              setSelectedSubLocationRaw("all");
              setSelectedYearRaw("all");
            }}
            className="rounded-xl border surface-border surface-input px-3 py-2 text-sm text-n-1 focus:border-primary-400 focus:outline-none"
          >
            {mainAreaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
          <span>Οικισμός / Τοποθεσία</span>
          <select
            value={resolvedSubLocation}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedSubLocationRaw(value);
              setSelectedYearRaw("all");
            }}
            className="rounded-xl border surface-border surface-input px-3 py-2 text-sm text-n-1 focus:border-primary-400 focus:outline-none"
          >
            {subLocationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
          <span>Έτος</span>
          <select
            value={resolvedYear}
            onChange={(event) => setSelectedYearRaw(event.target.value)}
            className="rounded-xl border surface-border surface-input px-3 py-2 text-sm text-n-1 focus:border-primary-400 focus:outline-none"
          >
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-zinc-400">
        Εμφανίζονται {filteredArticles.length} από {articles.length} τεκμήρια.
      </p>

      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
          Δεν βρέθηκαν άρθρα με τα επιλεγμένα φίλτρα.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <CategoryArticleCard
              key={`${article.id}-${article.slug}`}
              href={`/${categoryKey}/${subcategorySlug}/${article.slug}`}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date}
              author={article.author}
              location={article.mainArea ?? article.subLocations[0]}
              tags={article.locationTags}
              image={article.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}
