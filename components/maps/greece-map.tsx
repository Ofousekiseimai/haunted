"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { MapArticle } from "@/lib/maps";
import "leaflet/dist/leaflet.css";
import type { DivIcon, LatLngBoundsExpression, Map as LeafletMap, MapOptions } from "leaflet";

type GreeceMapProps = {
  articles: MapArticle[];
  /** When set, the plate flies to this record and opens its popup. */
  focused?: MapArticle | null;
};

/** Greece, with just enough sea around it. Panning stops here — the old map
 *  opened on a frame in which Italy, Tunisia and Anatolia took more room than
 *  the country the archive is about. */
const MAX_BOUNDS: LatLngBoundsExpression = [
  [33.6, 18.2],
  [42.4, 30.4],
];
const FALLBACK_BOUNDS: LatLngBoundsExpression = [
  [34.8, 19.3],
  [41.8, 28.4],
];

/** Grid cell for clustering, in screen pixels at the current zoom. */
const CELL = 66;

type Cluster = {
  key: string;
  lat: number;
  lng: number;
  articles: MapArticle[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Grid clustering in projected world pixels.
 *
 * 301 records were being dropped on the map as 301 identical stock pins, which
 * at country zoom is a solid wall of markers: nothing is readable and only the
 * topmost of any overlapping group can ever be clicked. Clustering in *world*
 * pixels rather than container pixels means the grouping depends only on zoom,
 * so it stays put while you pan instead of reshuffling under the cursor.
 */
function clusterArticles(
  map: LeafletMap,
  L: typeof import("leaflet"),
  articles: MapArticle[],
): Cluster[] {
  const zoom = map.getZoom();
  const cells = new Map<string, MapArticle[]>();

  for (const article of articles) {
    const point = map.project(L.latLng(article.lat, article.lng), zoom);
    const key = `${Math.floor(point.x / CELL)}:${Math.floor(point.y / CELL)}`;
    const bucket = cells.get(key);
    if (bucket) bucket.push(article);
    else cells.set(key, [article]);
  }

  return Array.from(cells.entries()).map(([key, group]) => {
    // Centroid in projected space, so the marker sits where the mass is.
    let x = 0;
    let y = 0;
    for (const article of group) {
      const point = map.project(L.latLng(article.lat, article.lng), zoom);
      x += point.x;
      y += point.y;
    }
    const centre = map.unproject(L.point(x / group.length, y / group.length), zoom);
    return { key, lat: centre.lat, lng: centre.lng, articles: group };
  });
}

function recordIcon(L: typeof import("leaflet")): DivIcon {
  return L.divIcon({
    className: "mk",
    html: '<span class="mk__halo"></span><span class="mk__dot"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

function clusterIcon(L: typeof import("leaflet"), count: number): DivIcon {
  // Three size bands, not a continuous scale: a continuous scale reads as
  // noise, three sizes read as a legend.
  const size = count < 5 ? 30 : count < 20 ? 38 : 48;
  return L.divIcon({
    className: "mk mk--cluster",
    html: `<span class="mk__ring"></span><span class="mk__n">${count}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function popupHtml(article: MapArticle) {
  const title = escapeHtml(article.title);
  const category = escapeHtml(article.subcategoryLabel || article.categoryLabel);
  const href = `/${escapeHtml(article.categoryKey)}/${escapeHtml(article.subcategorySlug)}/${escapeHtml(article.slug)}`;
  const year = article.date?.match(/(1[5-9]\d{2}|20[0-2]\d)/)?.[1];
  const meta = [category, year].filter(Boolean).join(" · ");
  const image = article.imageSrc
    ? `<span class="map-popup-image"><img src="${escapeHtml(article.imageSrc)}" alt="${escapeHtml(article.imageAlt ?? article.title)}" /></span>`
    : "";

  return `<span class="map-popup-card">
      ${image}
      <span class="map-popup-body">
        <span class="map-popup-meta">${meta}</span>
        <span class="map-popup-title">${title}</span>
      </span>
      <a class="map-popup-link" href="${href}">Δείτε το τεκμήριο &rarr;</a>
    </span>`;
}

/** A stack of records sharing one spot — the popup becomes a short index. */
function stackPopupHtml(articles: MapArticle[]) {
  const rows = articles
    .slice(0, 8)
    .map((article) => {
      const href = `/${escapeHtml(article.categoryKey)}/${escapeHtml(article.subcategorySlug)}/${escapeHtml(article.slug)}`;
      const year = article.date?.match(/(1[5-9]\d{2}|20[0-2]\d)/)?.[1] ?? "";
      return `<a class="map-stack__row" href="${href}">
          <span class="map-stack__year">${escapeHtml(year)}</span>
          <span class="map-stack__title">${escapeHtml(article.title)}</span>
        </a>`;
    })
    .join("");
  const more =
    articles.length > 8
      ? `<span class="map-stack__more">+${articles.length - 8} ακόμη — κάντε zoom</span>`
      : "";

  return `<span class="map-stack">
      <span class="map-stack__head">${articles.length} τεκμήρια σε αυτό το σημείο</span>
      ${rows}${more}
    </span>`;
}

export function GreeceMap({ articles, focused }: GreeceMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [leaflet, setLeaflet] = useState<typeof import("leaflet") | null>(null);
  const [ready, setReady] = useState(false);

  const bounds = useMemo<LatLngBoundsExpression>(() => {
    if (!articles.length) return FALLBACK_BOUNDS;
    let minLat = 90;
    let maxLat = -90;
    let minLng = 180;
    let maxLng = -180;
    for (const article of articles) {
      minLat = Math.min(minLat, article.lat);
      maxLat = Math.max(maxLat, article.lat);
      minLng = Math.min(minLng, article.lng);
      maxLng = Math.max(maxLng, article.lng);
    }
    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }, [articles]);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      if (!cancelled) setLeaflet(mod);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Map instance ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!leaflet || !containerRef.current || mapRef.current) return;

    const options: MapOptions & { tap?: boolean } = {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false, // the page scrolls; ctrl+wheel zooms
      dragging: true,
      touchZoom: true,
      tap: false,
      minZoom: 6,
      maxZoom: 16,
      maxBounds: MAX_BOUNDS,
      maxBoundsViscosity: 0.85,
      // Whole-step snapping threw away most of a zoom level on every fit
      // (6.72 floored to 6, which is the difference between "Greece" and
      // "the eastern Mediterranean"). Halves are close enough to keep the
      // frame tight without the sub-pixel tile seams that quarter-steps show.
      zoomSnap: 0.5,
    };

    const map = leaflet.map(containerRef.current, options);

    leaflet
      .tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 16,
      })
      .addTo(map);

    map.attributionControl.setPrefix(false);
    mapRef.current = map;

    // Leaflet takes the container's size at construction. Inside a CSS grid
    // that size is not final on the frame this effect runs in, so the very
    // first fitBounds was solving for a much smaller box and settling on a
    // zoom that showed Libya and Lebanon. Measure once layout has settled,
    // then frame the data — and keep measuring as the column resizes.
    const settle = () => {
      map.invalidateSize({ animate: false });
      map.fitBounds(bounds, { padding: [24, 24], animate: false });
      setReady(true);
    };
    const raf = requestAnimationFrame(settle);

    const observer = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    observer.observe(containerRef.current);
    observerRef.current = observer;

    return () => {
      cancelAnimationFrame(raf);
    };
    // `bounds` intentionally omitted: this effect builds the map once, and the
    // effect below re-fits it whenever the filtered set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaflet]);

  // ── Markers, re-clustered on every zoom ─────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!leaflet || !map || !ready) return;

    const L = leaflet;
    const single = recordIcon(L);

    const draw = () => {
      layerRef.current?.remove();
      const layer = L.layerGroup();

      for (const cluster of clusterArticles(map, L, articles)) {
        const count = cluster.articles.length;
        const marker = L.marker([cluster.lat, cluster.lng], {
          icon: count === 1 ? single : clusterIcon(L, count),
          riseOnHover: true,
          keyboard: true,
          title: count === 1 ? cluster.articles[0].title : `${count} τεκμήρια`,
        });

        if (count === 1) {
          marker.bindPopup(popupHtml(cluster.articles[0]), {
            closeButton: false,
            className: "map-popup",
            autoPanPadding: [56, 56],
            maxWidth: 260,
          });
        } else {
          const spread = new Set(
            cluster.articles.map((a) => `${a.lat.toFixed(3)},${a.lng.toFixed(3)}`),
          );
          if (spread.size === 1 || map.getZoom() >= 13) {
            // Genuinely the same place — zooming further will never separate
            // them, so show the stack as a short index instead.
            marker.bindPopup(stackPopupHtml(cluster.articles), {
              closeButton: true,
              className: "map-popup map-popup--stack",
              autoPanPadding: [56, 56],
              maxWidth: 300,
            });
          } else {
            marker.on("click", () => {
              const group = L.latLngBounds(
                cluster.articles.map((a) => L.latLng(a.lat, a.lng)),
              );
              map.flyToBounds(group, { padding: [64, 64], maxZoom: 13, duration: 0.6 });
            });
          }
        }

        marker.addTo(layer);
      }

      layer.addTo(map);
      layerRef.current = layer;
    };

    draw();
    map.on("zoomend", draw);
    return () => {
      map.off("zoomend", draw);
      layerRef.current?.remove();
      layerRef.current = null;
    };
  }, [leaflet, ready, articles]);

  // ── Re-frame when the filtered set changes ──────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !articles.length) return;
    map.flyToBounds(bounds, { padding: [24, 24], maxZoom: 12, duration: 0.7 });
  }, [bounds, ready, articles.length]);

  // ── Fly to a record picked from the list ───────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !leaflet || !ready || !focused) return;
    const target = leaflet.latLng(focused.lat, focused.lng);
    map.flyTo(target, Math.max(map.getZoom(), 11), { duration: 0.8 });
    const popup = leaflet
      .popup({ closeButton: false, className: "map-popup", autoPanPadding: [56, 56], maxWidth: 260 })
      .setLatLng(target)
      .setContent(popupHtml(focused));
    const show = () => popup.openOn(map);
    map.once("moveend", show);
    return () => {
      map.off("moveend", show);
    };
  }, [focused, leaflet, ready]);

  useEffect(
    () => () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      layerRef.current?.remove();
      layerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    },
    [],
  );

  const zoomBy = useCallback((delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom(map.getZoom() + delta);
  }, []);

  const resetView = useCallback(() => {
    mapRef.current?.flyToBounds(bounds, { padding: [24, 24], maxZoom: 12, duration: 0.7 });
  }, [bounds]);

  return (
    <div className="map-frame">
      <div ref={containerRef} className="map-leaflet" />

      {/* Vignette, so the plate has an edge and the chrome has something to
          sit on. Purely decorative and never intercepts pointer events. */}
      <div className="map-fog-overlay" aria-hidden="true" />

      <div className="map-zoom">
        <button type="button" className="map-zoom__btn" onClick={() => zoomBy(1)} aria-label="Μεγέθυνση">
          +
        </button>
        <button type="button" className="map-zoom__btn" onClick={() => zoomBy(-1)} aria-label="Σμίκρυνση">
          −
        </button>
        <button type="button" className="map-zoom__btn map-zoom__btn--reset" onClick={resetView} aria-label="Επαναφορά προβολής">
          ⤾
        </button>
      </div>

    </div>
  );
}
