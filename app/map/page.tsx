import type { Metadata } from "next";

import { EfimeridesMapShell } from "@/components/maps/efimerides-map-shell";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { getEfimeridesMapData } from "@/lib/maps";
import { getRequestLocale } from "@/lib/locale-server";

const CANONICAL_URL = "https://haunted.gr/map";

export const metadata: Metadata = {
  title: "Διαδραστικός Χάρτης Εφημερίδων",
  description:
    "Περιηγηθείτε σε αρχειακά δημοσιεύματα από τον ελληνικό Τύπο με γεωγραφικά φίλτρα και θεματικές ενότητες.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    title: "Διαδραστικός Χάρτης Εφημερίδων",
    description:
      "Γεωγραφική χαρτογράφηση δημοσιευμάτων για μεταφυσικά φαινόμενα, εγκλήματα και τελετές από τον ελληνικό Τύπο.",
    url: CANONICAL_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Διαδραστικός Χάρτης Εφημερίδων",
    description:
      "Γεωγραφική χαρτογράφηση δημοσιευμάτων για μεταφυσικά φαινόμενα, εγκλήματα και τελετές από τον ελληνικό Τύπο.",
  },
};

export default async function EfimeridesMapPage() {
  const locale = await getRequestLocale();
  const { articles, subcategories } = await getEfimeridesMapData(locale);

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow="Εφημερίδες"
        title="Διαδραστικός Χάρτης Συμβάντων"
        description="Φιλτράρετε δημοσιεύματα ανά κατηγορία και γεωγραφική περιοχή για να ανακαλύψετε το αρχείο παράξενων γεγονότων στον ελληνικό Τύπο."
      />

      <EfimeridesMapShell articles={articles} subcategories={subcategories} />
    </Section>
  );
}
