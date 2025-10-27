"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { MapArticle } from "@/lib/maps";
import "leaflet/dist/leaflet.css";
import type { Icon, IconOptions } from "leaflet";

type GreeceMapProps = {
  articles: MapArticle[];
};

const CENTER: [number, number] = [39.0, 22.0];
const BOUNDS: [[number, number], [number, number]] = [
  [34.8, 19.4],
  [41.7, 29.6],
];
const ICON_OPTIONS: IconOptions = {
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};

type SpreadArticle = MapArticle & {
  lat: number;
  lng: number;
};

function spreadCoordinates(articles: MapArticle[]): SpreadArticle[] {
  const groups = new Map<string, MapArticle[]>();

  articles.forEach((article) => {
    const key = `${article.lat.toFixed(4)}_${article.lng.toFixed(4)}`;
    const current = groups.get(key);
    if (current) {
      current.push(article);
    } else {
      groups.set(key, [article]);
    }
  });

  const radius = 0.002;

  return Array.from(groups.values()).flatMap((group) => {
    if (group.length === 1) {
      return group as SpreadArticle[];
    }

    return group.map((article, index) => {
      const angle = (index * (2 * Math.PI)) / group.length;
      const lat = article.lat + radius * Math.cos(angle);
      const lng = article.lng + radius * Math.sin(angle);

      return {
        ...article,
        lat: Math.min(BOUNDS[1][0], Math.max(BOUNDS[0][0], lat)),
        lng: Math.min(BOUNDS[1][1], Math.max(BOUNDS[0][1], lng)),
      };
    });
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function GreeceMap({ articles }: GreeceMapProps) {
  const [height, setHeight] = useState("600px");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [leaflet, setLeaflet] = useState<typeof import("leaflet") | null>(null);
  const iconRef = useRef<Icon | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerWidth < 768 ? "70vh" : "600px");
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((mod) => {
      if (!cancelled) {
        setLeaflet(mod);
        if (!iconRef.current) {
          iconRef.current = new mod.Icon(ICON_OPTIONS);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const markers = useMemo(() => spreadCoordinates(articles), [articles]);
  const tileUrl = useMemo(
    () => "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    [],
  );

  useEffect(() => {
    if (!leaflet || !containerRef.current) {
      return;
    }

    if (!mapRef.current) {
      const map = leaflet.map(containerRef.current, {
        center: CENTER,
        zoom: 6,
        minZoom: 6,
        maxBounds: BOUNDS,
        scrollWheelZoom: true,
        attributionControl: true,
      });

      leaflet
        .tileLayer(tileUrl, {
          attribution:
            '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors · <a href="https://carto.com/attributions">CARTO</a>',
        })
        .addTo(map);

      mapRef.current = map;
    }

    const mapInstance = mapRef.current;
    if (!mapInstance) {
      return;
    }

    if (markersLayerRef.current) {
      markersLayerRef.current.remove();
      markersLayerRef.current = null;
    }

    const layer = leaflet.layerGroup();
    markers.forEach((article) => {
      const marker = leaflet.marker([article.lat, article.lng], {
        icon: iconRef.current ?? undefined,
      });

      const popup = leaflet.popup({ closeButton: false, className: "map-popup" });
      const safeTitle = escapeHtml(article.title);
      const safeCategory = escapeHtml(article.categoryLabel);
      const safeSubcategory = escapeHtml(article.subcategoryLabel);
      const safeHref = `/${escapeHtml(article.categoryKey)}/${escapeHtml(article.subcategorySlug)}/${escapeHtml(article.slug)}`;
      const safeAlt = escapeHtml(article.imageAlt ?? article.title);
      const imageMarkup = article.imageSrc
        ? `<div class="map-popup-image"><img src="${escapeHtml(article.imageSrc)}" alt="${safeAlt}" /></div>`
        : "";

      popup.setContent(
        `<div class="map-popup-card">
            ${imageMarkup}
            <div class="map-popup-body">
              <p class="map-popup-meta">${safeCategory} · ${safeSubcategory}</p>
              <h3 class="map-popup-title">${safeTitle}</h3>
            </div>
            <a class="map-popup-link" href="${safeHref}" target="_blank" rel="noopener noreferrer">Δείτε το άρθρο →</a>
          </div>`
      );

      marker.bindPopup(popup);
      marker.addTo(layer);
    });

    layer.addTo(mapInstance);
    markersLayerRef.current = layer;

    return () => {
      layer.remove();
      markersLayerRef.current = null;
    };
  }, [leaflet, markers, tileUrl]);

  useEffect(() => {
    return () => {
      markersLayerRef.current?.remove();
      markersLayerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="map-container" style={{ height }}>
      <div ref={containerRef} className="map-leaflet" style={{ height, width: "100%" }} />
      <div className="map-fog-overlay" aria-hidden="true" />
    </div>
  );
}
