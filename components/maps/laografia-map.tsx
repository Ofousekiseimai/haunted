"use client";

import { useMemo, useState } from "react";

import { GreeceMap } from "./greece-map";
import type { MapArticle, SubcategoryOption } from "@/lib/maps";

type LaografiaMapProps = {
  articles: MapArticle[];
  subcategories: SubcategoryOption[];
  initialSubcategory?: string;
};

function getMainAreaOptions(articles: MapArticle[]) {
  const options = new Map<string, string>();

  articles.forEach((article) => {
    if (article.mainArea && !options.has(article.mainArea)) {
      options.set(article.mainArea, article.mainArea);
    }
  });

  return Array.from(options.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "el-GR"));
}

function getSubLocationOptions(articles: MapArticle[]) {
  const options = new Map<string, string>();

  articles.forEach((article) => {
    article.subLocations.forEach((location) => {
      if (!options.has(location)) {
        options.set(location, location);
      }
    });
  });

  return Array.from(options.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "el-GR"));
}

function matchesSubLocation(article: MapArticle, selectedLocation: string) {
  if (selectedLocation === "all") {
    return true;
  }

  if (article.subLocations.includes(selectedLocation)) {
    return true;
  }

  return article.locationTags.includes(selectedLocation);
}

export function LaografiaInteractiveMap({
  articles,
  subcategories,
  initialSubcategory,
}: LaografiaMapProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    initialSubcategory ?? "all",
  );
  const [selectedMainAreaRaw, setSelectedMainAreaRaw] = useState<string>("all");
  const [selectedSubLocationRaw, setSelectedSubLocationRaw] = useState<string>("all");

  const filteredBySubcategory = useMemo(() => {
    if (selectedSubcategory === "all") {
      return articles;
    }
    return articles.filter((article) => article.subcategorySlug === selectedSubcategory);
  }, [articles, selectedSubcategory]);

  const mainAreaOptions = useMemo(() => {
    return [
      { value: "all", label: "Όλες οι περιφέρειες" },
      ...getMainAreaOptions(filteredBySubcategory),
    ];
  }, [filteredBySubcategory]);

  const resolvedMainArea = useMemo(() => {
    return mainAreaOptions.some((option) => option.value === selectedMainAreaRaw)
      ? selectedMainAreaRaw
      : "all";
  }, [selectedMainAreaRaw, mainAreaOptions]);

  const filteredByMainArea = useMemo(() => {
    if (resolvedMainArea === "all") {
      return filteredBySubcategory;
    }
    return filteredBySubcategory.filter((article) => article.mainArea === resolvedMainArea);
  }, [filteredBySubcategory, resolvedMainArea]);

  const subLocationOptions = useMemo(() => {
    return [
      { value: "all", label: "Όλοι οι οικισμοί" },
      ...getSubLocationOptions(filteredByMainArea),
    ];
  }, [filteredByMainArea]);

  const resolvedSubLocation = useMemo(() => {
    return subLocationOptions.some((option) => option.value === selectedSubLocationRaw)
      ? selectedSubLocationRaw
      : "all";
  }, [selectedSubLocationRaw, subLocationOptions]);

  const filteredArticles = useMemo(() => {
    return filteredByMainArea.filter((article) => matchesSubLocation(article, resolvedSubLocation));
  }, [filteredByMainArea, resolvedSubLocation]);

  const totalArticles = articles.length;
  const filteredCount = filteredArticles.length;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-black/20 bg-black p-6 text-white">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-white">
            <span>Κατηγορία</span>
            <select
              value={selectedSubcategory}
              onChange={(event) => {
                setSelectedSubcategory(event.target.value);
                setSelectedMainAreaRaw("all");
                setSelectedSubLocationRaw("all");
              }}
              className="rounded-xl border border-black/20 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none"
            >
              <option value="all">Όλες οι κατηγορίες</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.value} value={subcategory.value}>
                  {subcategory.label} ({subcategory.articleCount})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-black">
            <span>Περιφέρεια</span>
            <select
              value={resolvedMainArea}
              onChange={(event) => {
                setSelectedMainAreaRaw(event.target.value);
                setSelectedSubLocationRaw("all");
              }}
              className="rounded-xl border border-black/20 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none"
            >
              {mainAreaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-black">
            <span>Οικισμός / Τοποθεσία</span>
            <select
              value={resolvedSubLocation}
              onChange={(event) => setSelectedSubLocationRaw(event.target.value)}
              className="rounded-xl border border-black/20 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none"
            >
              {subLocationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-4 text-sm text-black">
          Εμφανίζονται {filteredCount} από {totalArticles} καταγραφές.
        </p>
      </div>

      <GreeceMap articles={filteredArticles} />
    </div>
  );
}
