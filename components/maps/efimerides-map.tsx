"use client";

import { useMemo, useState } from "react";

import { GreeceMap } from "./greece-map";
import type { MapArticle, SubcategoryOption } from "@/lib/maps";

type EfimeridesMapProps = {
  articles: MapArticle[];
  subcategories: SubcategoryOption[];
};

function getLocationOptions(articles: MapArticle[]) {
  const options = new Map<string, string>();

  articles.forEach((article) => {
    const tags = article.locationTags.length > 0 ? article.locationTags : article.subLocations;
    tags.forEach((tag) => {
      if (!options.has(tag)) {
        options.set(tag, tag);
      }
    });
  });

  return Array.from(options.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "el-GR"));
}

function matchesLocation(article: MapArticle, selectedLocation: string) {
  if (selectedLocation === "all") {
    return true;
  }

  if (article.locationTags.includes(selectedLocation)) {
    return true;
  }

  if (article.subLocations.includes(selectedLocation)) {
    return true;
  }

  return false;
}

export function EfimeridesInteractiveMap({ articles, subcategories }: EfimeridesMapProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  const filteredBySubcategory = useMemo(() => {
    if (selectedSubcategory === "all") {
      return articles;
    }
    return articles.filter((article) => article.subcategorySlug === selectedSubcategory);
  }, [articles, selectedSubcategory]);

  const locationOptions = useMemo(() => {
    return [
      { value: "all", label: "Όλες οι περιοχές" },
      ...getLocationOptions(filteredBySubcategory),
    ];
  }, [filteredBySubcategory]);

  const filteredArticles = useMemo(() => {
    return filteredBySubcategory.filter((article) => matchesLocation(article, selectedLocation));
  }, [filteredBySubcategory, selectedLocation]);

  const totalArticles = articles.length;
  const filteredCount = filteredArticles.length;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border surface-border surface-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-muted">
            <span>Θεματική ενότητα</span>
            <select
              value={selectedSubcategory}
              onChange={(event) => {
                setSelectedSubcategory(event.target.value);
                setSelectedLocation("all");
              }}
              className="rounded-xl border surface-border surface-input px-3 py-2 text-sm text-n-1 focus:border-primary-400 focus:outline-none"
            >
              <option value="all">Όλες οι κατηγορίες</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.value} value={subcategory.value}>
                  {subcategory.label} ({subcategory.articleCount})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-muted">
            <span>Περιοχή</span>
            <select
              value={selectedLocation}
              onChange={(event) => setSelectedLocation(event.target.value)}
              className="rounded-xl border surface-border surface-input px-3 py-2 text-sm text-n-1 focus:border-primary-400 focus:outline-none"
            >
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-4 text-sm text-secondary">
          Εμφανίζονται {filteredCount} από {totalArticles} τεκμήρια.
        </p>
      </div>

      <GreeceMap articles={filteredArticles} />
    </div>
  );
}
