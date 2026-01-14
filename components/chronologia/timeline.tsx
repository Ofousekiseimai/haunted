"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
  if (Number.isNaN(date.getTime())) {
    return value;
  }

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

  const activeItems =
    grouped.find(([year]) => year === activeYear)?.[1] ?? (grouped[0]?.[1] ?? []);

  const goToPrev = () => {
    const index = years.indexOf(activeYear);
    if (index > 0) {
      setActiveYear(years[index - 1]);
    }
  };

  const goToNext = () => {
    const index = years.indexOf(activeYear);
    if (index >= 0 && index < years.length - 1) {
      setActiveYear(years[index + 1]);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border surface-border surface-card p-6 text-secondary">
        {copy.empty}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border surface-border surface-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-muted">{title}</p>
            <h2 className="text-2xl font-semibold text-zinc-50">
              {copy.yearLabel}: {activeYear} · {activeItems.length} {copy.recordsLabel}
            </h2>
            <p className="text-sm text-secondary">{copy.sliderHelp}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goToPrev}
              className="rounded-xl border surface-border bg-transparent px-3 py-2 text-sm text-n-1 transition hover:border-primary-400 hover:text-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={years.indexOf(activeYear) <= 0}
            >
              {copy.prev}
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="rounded-xl border surface-border bg-transparent px-3 py-2 text-sm text-n-1 transition hover:border-primary-400 hover:text-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={years.indexOf(activeYear) === years.length - 1}
            >
              {copy.next}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="range"
            min={years[0]}
            max={years[years.length - 1]}
            step={1}
            value={activeYear}
            readOnly
            disabled
            aria-hidden
            tabIndex={-1}
            className="w-full cursor-not-allowed opacity-50"
          />
          <span className="w-16 text-right text-sm text-secondary">{activeYear}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {activeItems.map((item) => (
          <Link
            href={item.path}
            key={`${item.year}-${item.slug}`}
            className="group rounded-2xl border surface-border surface-card p-4 transition hover:border-primary-400 hover:-translate-y-1"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              {item.year} · {item.subcategory}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-tight text-zinc-50 group-hover:text-primary-100">
              {item.title}
            </h3>
            {item.excerpt ? (
              <p className="mt-2 text-sm text-secondary line-clamp-3">{item.excerpt}</p>
            ) : null}
            <p className="mt-3 text-xs text-zinc-500">{formatDate(item.date)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
