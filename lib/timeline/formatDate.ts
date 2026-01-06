import type { TimelineItem } from "./types";

const dayFormatter = new Intl.DateTimeFormat("el-GR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("el-GR", {
  month: "long",
  year: "numeric",
});

const yearFormatter = new Intl.DateTimeFormat("el-GR", {
  year: "numeric",
});

const monthShortFormatter = new Intl.DateTimeFormat("el-GR", {
  month: "2-digit",
  year: "numeric",
});

export function formatTimelineDate(date: string, precision: TimelineItem["datePrecision"]) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  if (precision === "day") {
    return dayFormatter.format(parsed);
  }

  if (precision === "month") {
    return `${monthFormatter.format(parsed)} (${monthShortFormatter.format(parsed)})`;
  }

  return yearFormatter.format(parsed);
}

export function formatDecade(decade: number) {
  const normalized = Math.floor(decade / 10) * 10;
  return `${normalized}s`;
}
