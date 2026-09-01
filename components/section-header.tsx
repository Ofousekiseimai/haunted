import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Renders the title as h1. Use on a page's own heading block. */
  as?: "h1" | "h2";
};

/**
 * The shared page/section heading, in the site vocabulary.
 *
 * It used to hand-roll its own inline styles and emit an <h1> wherever it was
 * dropped, which put several h1s on pages that already had one.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  as: Heading = "h1",
}: SectionHeaderProps) {
  return (
    <header className="shead">
      <div>
        {eyebrow && (
          <div className="shead__kicker">
            <span className="mark" aria-hidden="true" />
            <span className="mono">{eyebrow}</span>
          </div>
        )}
        <Heading className="shead__title">{title}</Heading>
      </div>

      {(description || actions) && (
        <div className="shead__side">
          {description && <p className="shead__desc">{description}</p>}
          {actions}
        </div>
      )}
    </header>
  );
}
