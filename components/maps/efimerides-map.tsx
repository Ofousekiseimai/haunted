"use client";

import { useMemo, useState } from "react";

import { MapExplorer } from "./map-explorer";
import { MapField } from "./map-field";
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

  return (
    <MapExplorer
      totalCount={totalArticles}
      articles={filteredArticles}
      unit="τεκμήρια"
      filters={
        <div className="map-filters">
          <MapField
            id="ef-subcategory"
            label="Θεματική ενότητα"
            value={selectedSubcategory}
            onChange={(value) => {
              setSelectedSubcategory(value);
              setSelectedLocation("all");
            }}
            options={[
              { value: "all", label: "Όλες οι κατηγορίες" },
              ...subcategories.map((subcategory) => ({
                value: subcategory.value,
                label: `${subcategory.label} (${subcategory.articleCount})`,
              })),
            ]}
          />

          <MapField
            id="ef-location"
            label="Περιοχή"
            value={selectedLocation}
            onChange={setSelectedLocation}
            options={locationOptions}
          />
        </div>
      }
    />
  );
}
