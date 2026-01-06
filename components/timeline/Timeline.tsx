"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { DecadeHeader } from "./DecadeHeader";
import { ItemDrawer } from "./ItemDrawer";
import { TimelineCard } from "./TimelineCard";
import { TimelineToolbar } from "./TimelineToolbar";
import type { NormalizedTimelineItem, TimelineItemType, TimelineFilters } from "@/lib/timeline/types";

type TimelineRow =
  | { kind: "decade"; decade: number; anchorId: string }
  | { kind: "item"; item: NormalizedTimelineItem; anchorId: string; positionIndex: number };

type TimelineProps = {
  items: NormalizedTimelineItem[];
  types: TimelineItemType[];
};

export function Timeline({ items, types }: TimelineProps) {
  const [filters, setFilters] = useState<TimelineFilters>({ search: "", type: "all", compact: false });
  const [selected, setSelected] = useState<NormalizedTimelineItem | null>(null);
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);

  const parentRef = useRef<HTMLDivElement | null>(null);

  const decades = useMemo(
    () => Array.from(new Set(items.map((item) => item.decade))).sort((a, b) => a - b),
    [items],
  );

  const filteredItems = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return items.filter((item) => {
      if (filters.type !== "all" && item.type !== filters.type) {
        return false;
      }

      if (!q) {
        return true;
      }

      const haystack = [item.title, item.creatorLabel ?? "", ...(item.tags ?? [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [filters.search, filters.type, items]);

  const rows: TimelineRow[] = useMemo(() => {
    const result: TimelineRow[] = [];
    let lastDecade: number | null = null;
    let itemPosition = 0;

    filteredItems.forEach((item) => {
      if (lastDecade === null || item.decade !== lastDecade) {
        result.push({ kind: "decade", decade: item.decade, anchorId: `decade-${item.decade}` });
        lastDecade = item.decade;
      }
      result.push({ kind: "item", item, anchorId: item.anchorId, positionIndex: itemPosition });
      itemPosition += 1;
    });

    return result;
  }, [filteredItems]);

  const anchorIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((row, index) => {
      const anchor = row.kind === "decade" ? `decade-${row.decade}` : row.anchorId;
      map.set(anchor, index);
    });
    return map;
  }, [rows]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack virtualizer is safe to opt out of React Compiler memoization.
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => (filters.compact ? 170 : 240), [filters.compact]),
    overscan: 12,
    measureElement: useCallback((el: Element) => (el as HTMLElement).getBoundingClientRect().height, []),
  });

  const scrollToAnchor = useCallback(
    (anchor: string, behavior: "auto" | "smooth" = "smooth") => {
      const index = anchorIndexMap.get(anchor);
      if (index === undefined) {
        return;
      }

      virtualizer.scrollToIndex(index, { align: "start", behavior });
    },
    [anchorIndexMap, virtualizer],
  );

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        scrollToAnchor(hash, "auto");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [scrollToAnchor]);

  useEffect(() => {
    const element = parentRef.current;
    if (!element) return undefined;

    const handleScroll = () => {
      const viewportMiddle = element.scrollTop + element.clientHeight / 2;
      const virtualItems = virtualizer.getVirtualItems();

      let closestAnchor: string | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      virtualItems.forEach((virtualRow) => {
        const center = virtualRow.start + virtualRow.size / 2;
        const distance = Math.abs(center - viewportMiddle);
        if (distance < closestDistance) {
          const row = rows[virtualRow.index];
          closestAnchor = row?.kind === "decade" ? `decade-${row.decade}` : row?.anchorId ?? null;
          closestDistance = distance;
        }
      });

      setActiveAnchor(closestAnchor);
    };

    handleScroll();
    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, [rows, virtualizer]);

  useEffect(() => {
    if (!activeAnchor) return;
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash !== activeAnchor) {
      window.history.replaceState(null, "", `${window.location.pathname}#${activeAnchor}`);
    }
  }, [activeAnchor]);

  useEffect(() => {
    virtualizer.measure();
  }, [rows, virtualizer]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(134,109,255,0.1),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,200,118,0.12),transparent_28%),radial-gradient(circle_at_40%_80%,rgba(122,219,120,0.08),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:4px_4px]" />
      </div>

      <TimelineToolbar
        filters={filters}
        onFiltersChange={setFilters}
        types={types}
        decades={decades}
        onJumpToDecade={(decade) => scrollToAnchor(`decade-${decade}`)}
      />

      <div
        ref={parentRef}
        className="relative mt-6 h-[calc(100vh-240px)] overflow-y-auto rounded-3xl border border-white/5 bg-black/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-lg md:p-6"
        style={{ scrollPaddingTop: "120px" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,200,118,0.05),transparent_30%),radial-gradient(circle_at_80%_60%,rgba(124,179,255,0.08),transparent_32%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_20%),radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.05),transparent_30%)] mix-blend-overlay" />
        </div>

        <div className="pointer-events-none absolute left-[18px] top-0 z-0 h-full w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0 md:left-1/2" />

        {rows.length === 0 ? (
          <div className="relative z-10 flex h-full items-center justify-center">
            <p className="text-sm text-zinc-400">
              Δεν βρέθηκαν αποτελέσματα με αυτά τα φίλτρα. Δοκίμασε άλλη λέξη ή τύπο.
            </p>
          </div>
        ) : (
          <div
            style={{
              height: virtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              const anchorId = row.kind === "decade" ? `decade-${row.decade}` : row.anchorId;
              const isActive = activeAnchor === anchorId;

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="px-2 py-2 md:px-4 timeline-fade"
                >
                  {row.kind === "decade" ? (
                    <div className="grid grid-cols-[24px_1fr] items-center gap-4 md:grid-cols-[1fr_100px_1fr]">
                      <div className="hidden md:block" />
                      <DecadeHeader decade={row.decade} anchorId={anchorId} isActive={isActive} />
                      <div className="hidden md:block" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-[28px_1fr] items-center gap-4 md:grid-cols-[1fr_110px_1fr]">
                      <div className="relative flex h-full items-center justify-center md:order-none">
                        <span
                          className={`relative inline-flex h-3 w-3 -translate-x-[1px] items-center justify-center rounded-full border border-white/40 bg-n-8 transition md:-translate-x-1/2 ${
                            isActive
                              ? "shadow-[0_0_0_8px_rgba(255,200,118,0.08)]"
                              : "shadow-[0_0_0_6px_rgba(255,255,255,0.03)]"
                          }`}
                        >
                          <span
                            className={`block h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-color-2" : "bg-white/70"
                            }`}
                          />
                        </span>
                      </div>

                      <div
                        className={`md:col-span-1 ${
                          row.positionIndex % 2 === 0
                            ? "md:col-start-1 md:pr-6"
                            : "md:col-start-3 md:pl-6"
                        }`}
                      >
                        <TimelineCard
                          item={row.item}
                          compact={filters.compact}
                          isActive={isActive}
                          align={row.positionIndex % 2 === 0 ? "left" : "right"}
                          onOpen={setSelected}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ItemDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
