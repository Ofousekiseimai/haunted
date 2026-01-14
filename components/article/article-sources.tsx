import Link from "next/link";

import type { Locale } from "@/lib/locale";
import { getArticleCopy } from "@/lib/i18n/ui";

type LinkEntry = {
  title?: string | null;
  link?: string | null;
  url?: string | null;
  type?: string | null;
};

export type StructuredSource = {
  type?: string | null;
  name?: string | null;
  title?: string | null;
  provider?: string | null;
  archive?: string | null;
  year?: string | null;
  date?: string | null;
  eventDate?: string | null;
  issue?: string | null;
  pages?: string | null;
  page?: string | null;
  author?: string | null;
  journal?: string | null;
  volume?: string | null;
  details?: string | null;
  codex?: string | null;
  library?: string | null;
  role?: string | null;
  links?: LinkEntry[];
  [key: string]: unknown;
};

export type ArticleSource = string | StructuredSource | null | undefined;

type ArticleSourcesProps = {
  sources?: ArticleSource[];
  heading?: string;
  articleDate?: string | null;
  articleAuthor?: string | null;
  locale?: Locale;
};

function normalizeString(value?: string | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function resolveLink(entry: LinkEntry) {
  return normalizeString(entry.link ?? entry.url);
}

function SourceLine({ label, value }: { label: string; value?: string | null }) {
  const clean = normalizeString(value);
  if (!clean) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 text-sm text-n-3">
      <span className="font-medium text-n-2">{label}:</span>
      <span>{clean}</span>
    </div>
  );
}

function renderSourceDetails(entry: StructuredSource, copy: ReturnType<typeof getArticleCopy>) {
  const type = normalizeString(entry.type)?.toLowerCase();
  const L = copy.sources.labels;

  switch (type) {
    case "book":
      return (
        <div className="space-y-2">
          <SourceLine label={L.author} value={entry.name} />
          <SourceLine label={L.title} value={entry.title} />
          <div className="flex flex-wrap gap-6">
            <SourceLine label={L.year} value={entry.year} />
            <SourceLine label={L.pages} value={entry.pages} />
          </div>
        </div>
      );
    case "contributor":
      return (
        <div className="space-y-3">
          <SourceLine label={L.contributor} value={entry.name} />
          <SourceLine label={L.role} value={entry.role} />
          {entry.links && entry.links.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-n-4">
                {L.links}
              </p>
              <ul className="space-y-1">
                {entry.links.map((link, index) => {
                  const href = resolveLink(link);
                  const label = normalizeString(link.title) ?? href;
                  if (!href || !label) {
                    return null;
                  }

                  return (
                    <li key={`${href}-${index}`}>
                      <Link
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary-300 underline-offset-4 transition hover:text-primary-200 hover:underline"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      );
    case "efimerida":
    case "newspaper":
      return (
        <div className="space-y-2">
          <SourceLine label={copy.sources.typeLabels.newspaper} value={entry.name} />
          <SourceLine label={L.title} value={entry.title} />
          <div className="flex flex-wrap gap-6">
            <SourceLine label={L.author} value={entry.author} />
            <SourceLine label={L.date} value={entry.date ?? entry.eventDate} />
            <SourceLine label={L.year} value={entry.year} />
            <SourceLine label={L.issue} value={entry.issue} />
            <SourceLine label={L.pages} value={entry.pages ?? entry.page} />
          </div>
          <SourceLine label={L.provider} value={(entry as { provider?: string }).provider} />
        </div>
      );
    case "journal":
      return (
        <div className="space-y-2">
          <SourceLine label={L.journal} value={entry.journal ?? entry.name} />
          <SourceLine label={L.author} value={entry.author} />
          <div className="flex flex-wrap gap-6">
            <SourceLine label={L.volume} value={entry.volume} />
            <SourceLine label={L.year} value={entry.year} />
            <SourceLine label={L.pages} value={entry.pages ?? entry.page} />
          </div>
          <SourceLine label={L.title} value={entry.title} />
        </div>
      );
    case "manuscript":
      return (
        <div className="space-y-2">
          <SourceLine label={L.archive} value={entry.archive} />
          <SourceLine label={L.library} value={entry.library} />
          <div className="flex flex-wrap gap-6">
            <SourceLine label={L.codex} value={entry.codex} />
            <SourceLine label={L.year} value={entry.year} />
            <SourceLine label={L.pages} value={entry.pages ?? entry.page} />
          </div>
          <SourceLine label={L.details} value={entry.details} />
          <SourceLine label={L.date} value={entry.date ?? entry.eventDate} />
        </div>
      );
    case "web":
      return (
        <div className="space-y-2">
          <SourceLine label={L.website} value={entry.name} />
          {(() => {
            const href = normalizeString(
              typeof (entry as { url?: string; link?: string }).url === "string"
                ? (entry as { url?: string }).url
                : typeof (entry as { link?: string }).link === "string"
                  ? (entry as { link?: string }).link
                  : undefined,
            );
            const label = normalizeString(entry.title) ?? href;

            if (!href || !label) {
              return null;
            }

            return (
              <Link
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary-300 underline-offset-4 transition hover:text-primary-200 hover:underline"
              >
                {label}
              </Link>
            );
          })()}
        </div>
      );
    default: {
      const fallbackFields: Array<[string, string | null | undefined]> = [
        [L.name, entry.name],
        [L.title, entry.title],
        [L.author, entry.author],
        [L.year, entry.year],
        [L.date, entry.date ?? entry.eventDate],
        [L.pages, entry.pages ?? entry.page],
        [L.details, entry.details],
      ];

      return (
        <div className="space-y-2">
          {fallbackFields.map(([label, value]) => (
            <SourceLine key={label} label={label} value={value ?? undefined} />
          ))}
        </div>
      );
    }
  }
}

function getTypeLabel(entry: StructuredSource, copy: ReturnType<typeof getArticleCopy>) {
  const normalized = normalizeString(entry.type);
  if (!normalized) {
    return null;
  }

  switch (normalized.toLowerCase()) {
    case "book":
      return copy.sources.typeLabels.book;
    case "newspaper":
    case "efimerida":
      return copy.sources.typeLabels.newspaper;
    case "contributor":
      return copy.sources.typeLabels.contributor;
    case "journal":
      return copy.sources.typeLabels.journal;
    case "manuscript":
      return copy.sources.typeLabels.manuscript;
    case "web":
      return copy.sources.typeLabels.web;
    default:
      return normalized;
  }
}

function StandardSource({
  entry,
  index,
  copy,
}: {
  entry: StructuredSource;
  index: number;
  copy: ReturnType<typeof getArticleCopy>;
}) {
  const typeLabel = getTypeLabel(entry, copy);

  return (
    <li
      key={index}
      className="space-y-3 rounded-2xl border border-n-7 bg-n-8 p-5"
    >
      {typeLabel && (
        <p className="text-xs font-code uppercase tracking-[0.24em] text-n-4">
          {typeLabel}
        </p>
      )}
      {renderSourceDetails(entry, copy)}
    </li>
  );
}

function StringSource({ value }: { value: string }) {
  return (
    <li className="rounded-2xl border border-n-7 bg-n-8 p-5 text-sm text-n-3">
      {value}
    </li>
  );
}

export function ArticleSources({
  sources,
  heading,
  articleDate,
  articleAuthor,
  locale = "el",
}: ArticleSourcesProps) {
  const copy = getArticleCopy(locale);

  const normalizedSources = (sources ?? [])
    .map((entry) => {
      if (typeof entry === "string") {
        const clean = normalizeString(entry);
        return clean ?? null;
      }

      if (!entry || typeof entry !== "object") {
        return null;
      }

      return entry;
    })
    .filter((entry): entry is string | StructuredSource => Boolean(entry));

  if (normalizedSources.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-n-1">{heading ?? copy.sources.heading}</h2>
      {(articleDate || articleAuthor) && (
        <div className="rounded-2xl border border-n-7 bg-n-8 p-5">
          <div className="flex flex-wrap gap-6 text-sm text-n-3">
            {articleDate && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-n-2">{copy.sources.articleDate}:</span>
                <span>{articleDate}</span>
              </div>
            )}
            {articleAuthor && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-n-2">{copy.sources.articleAuthor}:</span>
                <span>{articleAuthor}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <ul className="space-y-4">
        {normalizedSources.map((entry, index) => {
          if (typeof entry === "string") {
            return <StringSource key={`string-${index}`} value={entry} />;
          }

          return (
            <StandardSource key={`source-${index}`} entry={entry} index={index} copy={copy} />
          );
        })}
      </ul>
    </section>
  );
}
