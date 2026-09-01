"use client";

import { useState, type ReactNode } from "react";

import { GreeceMap } from "./greece-map";
import type { MapArticle } from "@/lib/maps";

type MapExplorerProps = {
  filters: ReactNode;
  articles: MapArticle[];
  totalCount: number;
  /** Plural noun for the counter, e.g. "τεκμήρια" / "καταγραφές". */
  unit?: string;
};

function year(article: MapArticle) {
  return article.date?.match(/(1[5-9]\d{2}|20[0-2]\d)/)?.[1] ?? "—";
}

/**
 * Filters and record list on the left, map plate on the right.
 *
 * Greece is a tall country and a full-bleed map is a wide box, so fitting the
 * data to a 1440×700 frame lands at a zoom where Sicily and Anatolia take more
 * room than the archive does. Giving the width to a control rail fixes the
 * aspect the map has to work in *and* turns the page from a picture of dots
 * into something you can actually search: the list is the same filtered set,
 * and picking a row flies the plate to it.
 */
export function MapExplorer({ filters, articles, totalCount, unit = "τεκμήρια" }: MapExplorerProps) {
  const [focused, setFocused] = useState<MapArticle | null>(null);

  return (
    <div className="map-split">
      <aside className="map-panel">
        <div className="map-panel__controls">{filters}</div>

        <div className="map-panel__count">
          <span className="mono mono--lit">{articles.length}</span>
          {articles.length !== totalCount && (
            <span className="mono mono--micro map-panel__total">/ {totalCount}</span>
          )}
          <span className="mono mono--micro">{unit}</span>
        </div>

        <div className="map-panel__list">
          {articles.length === 0 && (
            <p className="map-panel__empty mono">Κανένα τεκμήριο για αυτά τα φίλτρα</p>
          )}
          {articles.map((article) => (
            <button
              key={`${article.id}-${article.slug}`}
              type="button"
              className="map-item"
              data-active={focused?.id === article.id && focused?.slug === article.slug}
              onClick={() => setFocused(article)}
            >
              <span className="map-item__year">{year(article)}</span>
              <span>
                <span className="map-item__title">{article.title}</span>
                <span className="map-item__place">
                  {article.mainArea ?? article.subLocations[0] ?? article.subcategoryLabel}
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <GreeceMap articles={articles} focused={focused} />
    </div>
  );
}
