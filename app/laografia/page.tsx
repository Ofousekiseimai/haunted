import type { Metadata } from "next";

import { Section } from "@/components/section";
import { getAllLaografiaSubcategories } from "@/lib/laografia";
import { SectionHeader } from "@/components/section-header";
import { SubcategoryCard } from "@/components/laografia/subcategory-card";
import { formatCollectionDescription } from "@/lib/description";
import { getRequestLocale } from "@/lib/locale-server";

export const metadata: Metadata = {
  title: "Λαογραφία",
  description:
    "Εξερεύνησε κατηγορίες λαογραφικών ιστοριών από όλη την Ελλάδα: στοιχειά, νεράιδες, βρικόλακες και πολλά ακόμη.",
};

export default async function LaografiaIndexPage() {
  const locale = await getRequestLocale();
  const subcategories = await getAllLaografiaSubcategories(locale);

  return (
    <Section className="container space-y-12">
      <SectionHeader
        eyebrow="Λαογραφία"
        title="Μύθοι και παραδόσεις της Ελλάδας"
        description={formatCollectionDescription(
          undefined,
          subcategories.reduce((count, entry) => count + entry.articles.length, 0),
          "Στα αρχεία μας θα βρεις καταγραφές στοιχειωμένων τόπων, λαϊκές δοξασίες και ιστορίες που ταξιδεύουν από γενιά σε γενιά.",
        )}
      />

      <div className="grid gap-8 md:grid-cols-2">
        {subcategories.map((subcategory) => (
          <SubcategoryCard key={subcategory.subcategorySlug} subcategory={subcategory} />
        ))}
      </div>
    </Section>
  );
}
