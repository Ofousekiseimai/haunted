import Link from "next/link";

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

function renderSourceDetails(entry: StructuredSource) {
  const type = normalizeString(entry.type)?.toLowerCase();

  switch (type) {
    case "book":
      return (
        <div className="space-y-2">
          <SourceLine label="Συγγραφέας" value={entry.name} />
          <SourceLine label="Τίτλος" value={entry.title} />
          <div className="flex flex-wrap gap-6">
            <SourceLine label="Έτος" value={entry.year} />
            <SourceLine label="Σελίδες" value={entry.pages} />
          </div>
        </div>
      );
    case "contributor":
      return (
        <div className="space-y-3">
          <SourceLine label="Συντελεστής" value={entry.name} />
          <SourceLine label="Ρόλος" value={entry.role} />
          {entry.links && entry.links.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-n-4">
                Συνδέσεις
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
          <SourceLine label="Εφημερίδα" value={entry.name} />
          <SourceLine label="Τίτλος" value={entry.title} />
          <div className="flex flex-wrap gap-6">
            <SourceLine label="Ημερομηνία" value={entry.date ?? entry.eventDate} />
            <SourceLine label="Έτος" value={entry.year} />
            <SourceLine label="Έκδοση" value={entry.issue} />
            <SourceLine label="Σελίδες" value={entry.pages ?? entry.page} />
          </div>
          <SourceLine label="Πάροχος" value={(entry as { provider?: string }).provider} />
        </div>
      );
    case "journal":
      return (
        <div className="space-y-2">
          <SourceLine label="Περιοδικό" value={entry.journal ?? entry.name} />
          <SourceLine label="Συγγραφέας" value={entry.author} />
          <div className="flex flex-wrap gap-6">
            <SourceLine label="Τόμος" value={entry.volume} />
            <SourceLine label="Έτος" value={entry.year} />
            <SourceLine label="Σελίδες" value={entry.pages ?? entry.page} />
          </div>
          <SourceLine label="Τίτλος" value={entry.title} />
        </div>
      );
    case "manuscript":
      return (
        <div className="space-y-2">
          <SourceLine label="Αρχείο" value={entry.archive} />
          <SourceLine label="Βιβλιοθήκη" value={entry.library} />
          <div className="flex flex-wrap gap-6">
            <SourceLine label="Κώδικας" value={entry.codex} />
            <SourceLine label="Έτος" value={entry.year} />
            <SourceLine label="Σελίδες" value={entry.pages ?? entry.page} />
          </div>
          <SourceLine label="Λεπτομέρειες" value={entry.details} />
          <SourceLine label="Ημερομηνία" value={entry.date ?? entry.eventDate} />
        </div>
      );
    case "web":
      return (
        <div className="space-y-2">
          <SourceLine label="Ιστότοπος" value={entry.name} />
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
        ["Ονομασία", entry.name],
        ["Τίτλος", entry.title],
        ["Συγγραφέας", entry.author],
        ["Έτος", entry.year],
        ["Ημερομηνία", entry.date ?? entry.eventDate],
        ["Σελίδες", entry.pages ?? entry.page],
        ["Λεπτομέρειες", entry.details],
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

function getTypeLabel(entry: StructuredSource) {
  const normalized = normalizeString(entry.type);
  if (!normalized) {
    return null;
  }

  switch (normalized.toLowerCase()) {
    case "book":
      return "Βιβλιογραφική αναφορά";
    case "newspaper":
    case "efimerida":
      return "Αρχειακή καταγραφή";
    case "contributor":
      return "Συντελεστές";
    case "journal":
      return "Επιστημονική δημοσίευση";
    case "manuscript":
      return "Χειρόγραφο";
    case "web":
      return "Διαδικτυακή πηγή";
    default:
      return normalized;
  }
}

function StandardSource({ entry, index }: { entry: StructuredSource; index: number }) {
  const typeLabel = getTypeLabel(entry);

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
      {renderSourceDetails(entry)}
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

export function ArticleSources({ sources, heading = "Πηγές & Τεκμηρίωση" }: ArticleSourcesProps) {
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
      <h2 className="text-xl font-semibold text-n-1">{heading}</h2>
      <ul className="space-y-4">
        {normalizedSources.map((entry, index) => {
          if (typeof entry === "string") {
            return <StringSource key={`string-${index}`} value={entry} />;
          }

          return <StandardSource key={`source-${index}`} entry={entry} index={index} />;
        })}
      </ul>
    </section>
  );
}
