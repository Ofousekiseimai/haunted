import type { Metadata } from "next";

import { Timeline } from "@/components/timeline/Timeline";
import { Section } from "@/components/section";
import { loadTimelineItems } from "@/lib/timeline/loadItems";

export const metadata: Metadata = {
  title: "Χρονικά",
  description:
    "Premium timeline για την ιστορία του παραφυσικού στην Ελλάδα (1850–2025) με αναζήτηση, φίλτρα και deep links.",
  alternates: {
    canonical: "https://haunted.gr/chronika",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ChronikaPage() {
  const data = await loadTimelineItems();
  const fromYear = new Date(data.range.from).getFullYear();
  const toYear = new Date(data.range.to).getFullYear();

  return (
    <Section className="container space-y-10" customPaddings="py-12 lg:py-20">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Timeline</p>
        <h1 className="text-4xl font-bold text-zinc-50 md:text-5xl">Χρονικά</h1>
        <p className="max-w-3xl text-lg text-zinc-300">
          Ένα editorial, σκοτεινό χρονολόγιο που συνδυάζει εφημερίδες, βιβλία, εκπομπές και γεγονότα
          του παραφυσικού στην Ελλάδα. Scroll, φίλτρα, quick jumps σε δεκαετίες και λεπτομέρειες σε
          drawer.
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
          <span className="rounded-full border border-white/10 px-3 py-1">
            Περίοδος: {fromYear} → {toYear}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            Συνολικά τεκμήρια: {data.items.length}
          </span>
        </div>
      </div>

      <Timeline items={data.items} types={data.types} />

      <div className="rounded-2xl border border-white/10 bg-n-9/70 p-6">
        <h2 className="text-lg font-semibold text-zinc-50">Οδηγίες καταχώρησης</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          <li>➤ Νέα εγγραφή: πρόσθεσε αντικείμενο στο `public/data/paranormal_gr/items.json`.</li>
          <li>➤ Thumbnail: ανέβασε εικόνα στο `public/images/paranormal/thumbs/` και βάλε το path.</li>
          <li>
            ➤ Πεδίο `type`: book | newspaper_article | tv_episode | magazine_issue | event | radio |
            documentary | article | other.
          </li>
          <li>➤ `datePrecision`: day | month | year. Για year-only γράψε YYYY-01-01 με precision year.</li>
        </ul>
      </div>
    </Section>
  );
}
