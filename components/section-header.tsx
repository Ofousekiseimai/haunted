import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, actions }: SectionHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          {eyebrow && (
            <p
              className="uppercase"
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "var(--fs-meta)",
                letterSpacing: "0.22em",
                color: "var(--accent)",
              }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="font-light"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--fs-h2)",
              color: "var(--bone)",
            }}
          >
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-lg" style={{ color: "var(--ash)" }}>
              {description}
            </p>
          )}
        </div>
        {actions ? <div className="mt-2 flex-shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
