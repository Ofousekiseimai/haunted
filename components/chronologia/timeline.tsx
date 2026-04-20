"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";

export type TimelineItem = {
  id: string;
  title: string;
  slug: string;
  subcategory: string;
  subcategorySlug: string;
  path: string;
  date: string;
  year: number;
  excerpt?: string;
  imageSrc?: string;
};

type ChronologioTimelineProps = {
  items: TimelineItem[];
  title?: string;
  locale?: "el" | "en";
};

import { getTimelineCopy } from "@/lib/i18n/ui";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ChronologioTimeline({
  items,
  title = "Χρονολόγιο",
  locale = "el",
}: ChronologioTimelineProps) {
  const copy = getTimelineCopy(locale);

  const grouped = useMemo(() => {
    const map = new Map<number, TimelineItem[]>();
    items.forEach((item) => {
      const existing = map.get(item.year) ?? [];
      existing.push(item);
      map.set(item.year, existing);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, entries]) => [
        year,
        entries.sort((a, b) => Date.parse(a.date) - Date.parse(b.date)),
      ]) as Array<[number, TimelineItem[]]>;
  }, [items]);

  const years = useMemo(() => grouped.map(([year]) => year), [grouped]);
  const [activeYear, setActiveYear] = useState<number>(() => years[0] ?? 0);
  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const scrollNavToYear = useCallback((year: number) => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector<HTMLElement>(`[data-year="${year}"]`);
    if (!btn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const offset = btnRect.left - navRect.left - navRect.width / 2 + btnRect.width / 2;
    nav.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  const jumpToYear = useCallback(
    (year: number) => {
      setActiveYear(year);
      scrollNavToYear(year);
      const el = document.getElementById(`year-section-${year}`);
      if (!el) return;
      isScrollingRef.current = true;
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(() => { isScrollingRef.current = false; }, 800);
    },
    [scrollNavToYear],
  );

  useEffect(() => {
    const sectionEls = years
      .map((year) => document.getElementById(`year-section-${year}`))
      .filter(Boolean) as HTMLElement[];

    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        const year = Number(visible[0].target.getAttribute("data-year"));
        if (year && year !== activeYear) {
          setActiveYear(year);
          scrollNavToYear(year);
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [years, activeYear, scrollNavToYear]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-400">
        {copy.empty}
      </div>
    );
  }

  const minYear = years[0];
  const maxYear = years[years.length - 1];

  return (
    <div className="space-y-0">
      {/* Header bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{title}</p>
          <p className="mt-1 text-sm text-zinc-400">
            {minYear} – {maxYear} · {items.length} {copy.recordsLabel}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
          {years.length} {locale === "en" ? "years" : "έτη"}
        </span>
      </div>

      {/* Sticky year navigation */}
      <div className="sticky top-[5.25rem] z-20 -mx-1 mb-8">
        <div className="rounded-2xl border border-white/10 bg-n-9/95 px-3 py-2.5 backdrop-blur-md">
          <div
            ref={navRef}
            className="flex gap-1 overflow-x-auto scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {years.map((year) => (
              <button
                key={year}
                type="button"
                data-year={year}
                onClick={() => jumpToYear(year)}
                className={`flex-shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-150 ${
                  activeYear === year
                    ? "bg-color-1 text-white shadow-sm"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline body */}
      <div className="relative">
        {/* Vertical line */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[11px] top-2 h-full w-px bg-gradient-to-b from-white/25 via-white/10 to-transparent md:left-[13px]"
        />

        <div className="space-y-14">
          {grouped.map(([year, yearItems]) => (
            <div
              key={year}
              id={`year-section-${year}`}
              data-year={year}
              className="relative pl-8 md:pl-10"
            >
              {/* Year dot */}
              <div
                aria-hidden
                className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-color-1/70 bg-n-9 md:h-7 md:w-7"
              >
                <div className="h-2 w-2 rounded-full bg-color-1" />
              </div>

              {/* Year header */}
              <div className="mb-5 flex items-baseline gap-3">
                <h2 className="text-2xl font-bold text-zinc-50 md:text-3xl">{year}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {yearItems.length} {copy.recordsLabel}
                </span>
              </div>

              {/* Articles for this year */}
              <div className="space-y-2.5">
                {yearItems.map((item) => (
                  <Link
                    key={`${item.year}-${item.slug}`}
                    href={item.path}
                    className="group relative block rounded-xl border border-white/5 bg-white/[0.02] p-4 transition duration-200 hover:border-color-1/40 hover:bg-white/[0.05] active:scale-[0.99]"
                  >
                    {/* Date + subcategory row */}
                    <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs tabular-nums text-zinc-500">
                        {formatDate(item.date)}
                      </span>
                      <span aria-hidden className="text-zinc-700">·</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                        {item.subcategory}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold leading-snug text-zinc-100 transition group-hover:text-color-1 md:text-lg">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    {item.excerpt && (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                        {item.excerpt}
                      </p>
                    )}

                    {/* Arrow */}
                    <span
                      aria-hidden
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-color-1"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
