export type TimelineLink = {
  label: string;
  url: string;
};

export type TimelineItemType =
  | "book"
  | "newspaper_article"
  | "tv_episode"
  | "magazine_issue"
  | "event"
  | "radio"
  | "documentary"
  | "article"
  | "other";

export type TimelineItem = {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  datePrecision: "day" | "month" | "year";
  type: TimelineItemType;
  title: string;
  creatorLabel?: string;
  summary?: string;
  thumbnail: string;
  tags?: string[];
  links?: TimelineLink[];
};

export type TimelineDataset = {
  schemaVersion: number;
  range: { from: string; to: string };
  items: TimelineItem[];
};

export type NormalizedTimelineItem = TimelineItem & {
  parsedDate: number;
  year: number;
  decade: number;
  displayDate: string;
  anchorId: string;
};

export type TimelineFilters = {
  search: string;
  type: TimelineItemType | "all";
  compact: boolean;
};
