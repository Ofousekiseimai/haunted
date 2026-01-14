import Link from "next/link";

type CategorySubcategoryCardProps = {
  href: string;
  categoryLabel?: string;
  title: string;
  description?: string;
  articleCount?: number;
  ctaLabel?: string;
};

export function CategorySubcategoryCard({
  href,
  categoryLabel,
  title,
  description,
  articleCount,
  ctaLabel = "Εξερεύνησε →",
}: CategorySubcategoryCardProps) {
  const details: string[] = [];
  if (typeof articleCount === "number" && articleCount >= 0) {
    details.push(`${articleCount} άρθρα`);
  }

  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-primary-400/60 hover:bg-zinc-900"
    >
      {categoryLabel && (
        <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">{categoryLabel}</p>
      )}

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-zinc-100 transition group-hover:text-white">
          {title}
        </h2>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
        {details.length > 0 && (
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {details.join(" · ")}
          </p>
        )}
      </div>

      <span className="mt-auto text-sm font-medium text-primary-300 transition group-hover:text-primary-200">
        {ctaLabel}
      </span>
    </Link>
  );
}
