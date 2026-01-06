import Image from "next/image";

import type { NormalizedTimelineItem, TimelineItemType } from "@/lib/timeline/types";

const TYPE_LABELS: Record<TimelineItemType, string> = {
  book: "Book",
  newspaper_article: "Newspaper",
  tv_episode: "TV",
  magazine_issue: "Magazine",
  event: "Event",
  radio: "Radio",
  documentary: "Documentary",
  article: "Article",
  other: "Other",
};

type TimelineCardProps = {
  item: NormalizedTimelineItem;
  compact?: boolean;
  isActive?: boolean;
  align?: "left" | "right" | "full";
  onOpen: (item: NormalizedTimelineItem) => void;
};

export function TimelineCard({ item, compact, isActive, align = "full", onOpen }: TimelineCardProps) {
  return (
    <article
      id={item.anchorId}
      className={`group relative ${align === "full" ? "w-full" : "w-full md:w-[96%]"}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur transition-all duration-300 ${
          isActive
            ? "border-color-2/70 from-white/8 via-white/5 to-color-2/5 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.95)]"
            : "border-white/10 from-white/5 via-white/0 to-white/5 opacity-90 hover:border-color-2/50 hover:shadow-[0_20px_55px_-40px_rgba(0,0,0,0.9)]"
        } ${compact ? "p-4 md:p-4" : "p-5 md:p-6"}`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(172,106,255,0.26),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,200,118,0.2),transparent_32%),radial-gradient(circle_at_30%_90%,rgba(122,219,120,0.15),transparent_40%)]" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />
        </div>

        <div className="relative flex gap-4 md:gap-5">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-n-8 shadow-inner md:h-[4.5rem] md:w-[4.5rem]">
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              sizes="96px"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
              priority={false}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                {TYPE_LABELS[item.type] ?? item.type}
              </span>
              <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                {item.displayDate}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold leading-tight text-zinc-50 md:text-xl">
                {item.title}
              </h3>
              {item.creatorLabel ? (
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {item.creatorLabel}
                </p>
              ) : null}
              {item.summary && !compact ? (
                <p className="text-sm leading-relaxed text-zinc-300">{item.summary}</p>
              ) : null}
            </div>

            {item.tags && item.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="hidden md:flex">
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="group/button mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition hover:border-color-2 hover:text-color-2 hover:shadow-[0_0_0_6px_rgba(255,200,118,0.08)]"
              aria-label={`Περισσότερα για ${item.title}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 transition group-hover/button:translate-x-0.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen(item)}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:border-color-2 hover:text-color-2 md:hidden"
          aria-label={`Περισσότερα για ${item.title}`}
        >
          <span>Προβολή λεπτομερειών</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </article>
  );
}
