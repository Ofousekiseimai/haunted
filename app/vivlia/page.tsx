import type { Metadata } from "next";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { getRequestLocale } from "@/lib/locale-server";

export const metadata: Metadata = {
  title: "Βιβλία",
  description:
    "Όλα τα βιβλία που ξεχωρίσαμε για λαογραφικά μυθιστορήματα, ερευνητικές εκδόσεις και σκοτεινή φαντασία.",
  alternates: {
    canonical: "https://haunted.gr/vivlia",
  },
};

export default async function BooksIndexPage() {
  const locale = await getRequestLocale();
  const copy =
    locale === "en"
      ? {
          eyebrow: "Books",
          title: "All Books",
          description: "Coming soon. We’re preparing a full catalogue of books.",
          note: "The books section will return with curated folklore novels, research, and dark fantasy.",
        }
      : {
          eyebrow: "Βιβλία",
          title: "Όλα τα βιβλία",
          description: "Έρχεται σύντομα. Ετοιμάζουμε έναν πλήρη κατάλογο βιβλίων.",
          note: "Η ενότητα βιβλίων ετοιμάζεται με επιλεγμένα λαογραφικά μυθιστορήματα, έρευνες και σκοτεινή φαντασία.",
        };

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <div className="rounded-2xl border surface-border surface-card p-6 text-secondary">
        {copy.note}
      </div>
    </Section>
  );
}
