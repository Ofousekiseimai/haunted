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
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">{eyebrow}</p>
          )}
          <h1 className="text-4xl font-bold text-zinc-50">{title}</h1>
          {description && <p className="max-w-2xl text-lg text-zinc-400">{description}</p>}
        </div>
        {actions ? <div className="mt-2 flex-shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
