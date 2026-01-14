import { readFile } from "fs/promises";
import path from "path";
import { cache } from "react";

import { formatTimelineDate } from "./formatDate";
import type { NormalizedTimelineItem, TimelineDataset, TimelineItem, TimelineItemType } from "./types";

const DATA_PATH = path.join(process.cwd(), "public", "data", "paranormal_gr", "items.json");

export type TimelineData = {
  range: TimelineDataset["range"];
  items: NormalizedTimelineItem[];
  types: TimelineItemType[];
};

function normalizeItem(item: TimelineItem): NormalizedTimelineItem | null {
  const parsedDate = Date.parse(item.date);
  if (!Number.isFinite(parsedDate)) {
    return null;
  }

  const year = new Date(parsedDate).getFullYear();
  const decade = Math.floor(year / 10) * 10;

  return {
    ...item,
    parsedDate,
    year,
    decade,
    anchorId: item.id,
    displayDate: formatTimelineDate(item.date, item.datePrecision),
    links: item.links ?? [],
    tags: item.tags ?? [],
  };
}

export const loadTimelineItems = cache(async (): Promise<TimelineData> => {
  const file = await readFile(DATA_PATH, "utf8");
  const dataset = JSON.parse(file) as TimelineDataset;

  const items = (dataset.items ?? [])
    .map(normalizeItem)
    .filter(Boolean)
    .sort((a, b) => {
      if (!a || !b) {
        return 0;
      }
      if (a.parsedDate !== b.parsedDate) {
        return a.parsedDate - b.parsedDate;
      }
      return a.title.localeCompare(b.title, "el-GR");
    }) as NormalizedTimelineItem[];

  const types = Array.from(new Set(items.map((item) => item.type))) as TimelineItemType[];
  types.sort();

  return {
    range: dataset.range,
    items,
    types,
  };
});

export function groupByDecade(items: NormalizedTimelineItem[]) {
  const map = new Map<number, NormalizedTimelineItem[]>();

  items.forEach((item) => {
    const group = map.get(item.decade) ?? [];
    group.push(item);
    map.set(item.decade, group);
  });

  return map;
}
