import type { TimelineFilters, TimelineItemType } from "@/lib/timeline/types";

type TimelineToolbarProps = {
  filters: TimelineFilters;
  onFiltersChange: (next: TimelineFilters) => void;
  types: TimelineItemType[];
  decades: number[];
  onJumpToDecade: (decade: number) => void;
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

function TypeChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] transition ${
        active
          ? "border-color-2/80 bg-color-2/10 text-color-2"
          : "border-white/10 bg-white/5 text-n-2 hover:border-white/30 hover:text-n-1"
      }`}
    >
      {label}
    </button>
  );
}

export function TimelineToolbar({
  filters,
  onFiltersChange,
  types,
  decades,
  onJumpToDecade,
}: TimelineToolbarProps) {
  return (
    <div className="sticky top-[5.25rem] z-20 space-y-4 rounded-2xl border border-white/10 bg-n-9/80 px-4 py-4 backdrop-blur md:px-6 md:py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Χρονικά</p>
          <h2 className="text-2xl font-semibold text-zinc-50">Παραφυσικό στην Ελλάδα (1850–2025)</h2>
          <p className="text-sm text-zinc-400">
            Αναζήτησε, φιλτράρισε και κάνε jump σε δεκαετίες για ένα editorial timeline.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <label className="relative inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={filters.compact}
              onChange={(event) =>
                onFiltersChange({ ...filters, compact: event.target.checked })
              }
            />
            <div className="flex h-6 w-10 items-center rounded-full border border-white/10 bg-white/5 px-1 transition peer-checked:border-color-2 peer-checked:bg-color-2/25">
              <span className="h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4 peer-checked:bg-color-2 shadow-sm" />
            </div>
            <span className="text-xs uppercase tracking-[0.14em] text-zinc-400">
              Compact mode
            </span>
          </label>
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 outline-none transition hover:border-color-2/60 focus:border-color-2 focus:ring-2 focus:ring-color-2/30"
            onChange={(event) => {
              const value = Number.parseInt(event.target.value, 10);
              if (!Number.isNaN(value)) {
                onJumpToDecade(value);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Jump to decade
            </option>
            {decades.map((decade) => (
              <option key={decade} value={decade}>
                {decade}s
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.5 15.5 4 4" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Αναζήτηση σε τίτλο, δημιουργό ή tags..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 hover:border-color-2/50 focus:border-color-2 focus:ring-2 focus:ring-color-2/30"
              value={filters.search}
              onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TypeChip
            label="Όλα"
            active={filters.type === "all"}
            onClick={() => onFiltersChange({ ...filters, type: "all" })}
          />
          {types.map((type) => (
            <TypeChip
              key={type}
              label={TYPE_LABELS[type] ?? type}
              active={filters.type === type}
              onClick={() => onFiltersChange({ ...filters, type })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
