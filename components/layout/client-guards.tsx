"use client";

import { useEffect } from "react";

export function ClientGuards() {
  useEffect(() => {
    const isMapEvent = (event: Event) => {
      const target = event.target;

      const matchesSelector = (node: EventTarget | null) =>
        node instanceof Element &&
        (node.closest(".map-leaflet, .map-container, .leaflet-container, .leaflet-pane") ||
          node.matches(".leaflet-pane, .leaflet-tile-pane, .leaflet-map-pane, .leaflet-marker-pane"));

      if (matchesSelector(target)) {
        return true;
      }

      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      return path.some((node) => matchesSelector(node));
    };

    const preventDefault = (event: Event) => {
      if (isMapEvent(event)) {
        return;
      }
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toUpperCase();
      const blockKey =
        key === "F12" ||
        (event.ctrlKey && event.shiftKey && ["I", "J", "C"].includes(key ?? "")) ||
        (event.ctrlKey && key === "U");

      if (blockKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventDefault, { passive: false });
    document.addEventListener("selectstart", preventDefault, { passive: false });
    document.addEventListener("dragstart", preventDefault, { passive: false });
    document.addEventListener("keydown", onKeyDown, { passive: false });

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
