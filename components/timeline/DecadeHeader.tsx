type DecadeHeaderProps = {
  decade: number;
  isActive?: boolean;
  anchorId: string;
};

export function DecadeHeader({ decade, isActive, anchorId }: DecadeHeaderProps) {
  return (
    <div
      id={anchorId}
      className={`relative overflow-hidden rounded-2xl border px-5 py-4 transition ${
        isActive
          ? "border-color-2/60 bg-gradient-to-r from-color-2/10 via-n-8 to-n-8 shadow-[0_15px_40px_-30px_rgba(0,0,0,0.8)]"
          : "border-white/5 bg-n-8/80"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,200,118,0.14),transparent_40%),radial-gradient(circle_at_70%_30%,rgba(134,109,255,0.16),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(255,119,111,0.1),transparent_42%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>
      <div className="relative flex items-baseline gap-3">
        <span className="text-xs uppercase tracking-[0.32em] text-zinc-500">Δεκαετία</span>
        <span className="text-3xl font-bold text-zinc-50 md:text-4xl">{decade}s</span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
          {decade}–{decade + 9}
        </span>
      </div>
    </div>
  );
}
