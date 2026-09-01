"use client";

import { useMemo, useState } from "react";

import { MapExplorer } from "./map-explorer";
import { MapField } from "./map-field";
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

  return (
    <MapExplorer
      totalCount={totalArticles}
      articles={filteredArticles}
      unit="καταγραφές"
      filters={
        <div className="map-filters">
          <MapField
            id="la-subcategory"
            label="Κατηγορία"
            value={selectedSubcategory}
            onChange={(value) => {
              setSelectedSubcategory(value);
              setSelectedMainAreaRaw("all");
              setSelectedSubLocationRaw("all");
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
            id="la-mainarea"
            label="Περιφέρεια"
            value={resolvedMainArea}
            onChange={(value) => {
              setSelectedMainAreaRaw(value);
              setSelectedSubLocationRaw("all");
            }}
            options={mainAreaOptions}
          />

          <MapField
            id="la-sublocation"
            label="Τοποθεσία"
            value={resolvedSubLocation}
            onChange={setSelectedSubLocationRaw}
            options={subLocationOptions}
          />
        </div>
      }
    />
  );
}
