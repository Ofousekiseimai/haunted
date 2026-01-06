"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import type { NormalizedTimelineItem, TimelineItemType } from "@/lib/timeline/types";

type ItemDrawerProps = {
  item: NormalizedTimelineItem | null;
  onClose: () => void;
};

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

export function ItemDrawer({ item, onClose }: ItemDrawerProps) {
  useEffect(() => {
    if (!item) return undefined;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-end bg-black/70 backdrop-blur-sm md:items-start md:justify-end"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Κλείσιμο"
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
      />

      <div className="relative z-[2001] w-full rounded-t-3xl border border-white/10 bg-n-9 shadow-2xl md:m-6 md:w-[520px] md:rounded-2xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl border-b border-white/10 md:rounded-t-2xl">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="520px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 space-y-1 text-white drop-shadow-lg">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-200">
              {TYPE_LABELS[item.type] ?? item.type}
            </p>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-sm text-zinc-200">{item.displayDate}</p>
          </div>
        </div>

        <div className="space-y-4 p-5 md:p-6">
          {item.creatorLabel ? (
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              {item.creatorLabel}
            </p>
          ) : null}
          {item.summary ? <p className="text-base leading-relaxed text-zinc-200">{item.summary}</p> : null}
          {item.tags && item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {item.links && item.links.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Πηγές</p>
              <div className="space-y-2">
                {item.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-color-2 transition hover:border-color-2 hover:bg-color-2/10"
                  >
                    <span>{link.label}</span>
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
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-white/10 px-5 py-3 md:px-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-color-2 hover:text-color-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Κλείσιμο
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
