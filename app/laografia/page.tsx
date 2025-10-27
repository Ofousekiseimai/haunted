import type { Metadata } from "next";

import { Section } from "@/components/section";
import { getAllLaografiaSubcategories } from "@/lib/laografia";
import { SectionHeader } from "@/components/section-header";
import { SubcategoryCard } from "@/components/laografia/subcategory-card";

export const metadata: Metadata = {
  title: "Λαογραφία",
  description:
    "Εξερεύνησε κατηγορίες λαογραφικών ιστοριών από όλη την Ελλάδα: στοιχειά, νεράιδες, βρικόλακες και πολλά ακόμη.",
};

export default async function LaografiaIndexPage() {
  const subcategories = await getAllLaografiaSubcategories();

  return (
    <Section className="container space-y-12">
      <SectionHeader
        eyebrow="Λαογραφία"
        title="Μύθοι και παραδόσεις της Ελλάδας"
        description="Στα αρχεία μας θα βρεις καταγραφές στοιχειωμένων τόπων, λαϊκές δοξασίες και ιστορίες που ταξιδεύουν από γενιά σε γενιά."
      />

      <div className="grid gap-8 md:grid-cols-2">
        {subcategories.map((subcategory) => (
          <SubcategoryCard key={subcategory.subcategorySlug} subcategory={subcategory} />
        ))}
      </div>
    </Section>
  );
}
