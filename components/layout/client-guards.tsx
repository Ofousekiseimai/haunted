"use client";

import { useEffect } from "react";

export function ClientGuards() {
  useEffect(() => {
    const preventImageDrag = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    document.addEventListener("dragstart", preventImageDrag, { passive: false });

    return () => {
      document.removeEventListener("dragstart", preventImageDrag);
    };
  }, []);

  return null;
}
