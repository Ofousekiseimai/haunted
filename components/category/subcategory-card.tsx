import Link from "next/link";

import { GlowCard } from "@/components/ui/glow-card";

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
    <Link href={href} className="group block">
      <GlowCard className="flex flex-col gap-4">
        {categoryLabel && (
          <p
            className="uppercase"
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "var(--fs-meta)",
              letterSpacing: "0.22em",
              color: "var(--accent)",
            }}
          >
            {categoryLabel}
          </p>
        )}

        <div className="space-y-3">
          <h2
            className="text-2xl font-semibold transition group-hover:text-[var(--accent-bright)]"
            style={{ color: "var(--bone)" }}
          >
            {title}
          </h2>
          {description && (
            <p className="text-sm" style={{ color: "var(--ash)" }}>
              {description}
            </p>
          )}
          {details.length > 0 && (
            <p
              className="uppercase"
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "var(--fs-meta)",
                letterSpacing: "0.18em",
                color: "var(--ash-dim)",
              }}
            >
              {details.join(" · ")}
            </p>
          )}
        </div>

        <span
          className="mt-auto text-sm font-medium transition group-hover:text-[var(--accent-bright)]"
          style={{ color: "var(--accent)" }}
        >
          {ctaLabel}
        </span>
      </GlowCard>
    </Link>
  );
}
