import type { Metadata } from "next";

import { LaografiaMapShell } from "@/components/maps/laografia-map-shell";
import { Section } from "@/components/section";
import { SectionHeader } from "@/components/section-header";
import { getLaografiaMapData } from "@/lib/maps";
import { getRequestLocale } from "@/lib/locale-server";

const CANONICAL_URL = "https://haunted.gr/map2";

export const metadata: Metadata = {
  title: "Λαογραφικός Χάρτης Ελλάδας",
  description:
    "Χαρτογράφηση παραδόσεων, αφηγήσεων και μαρτυριών για παράξενα φαινόμενα ανά την Ελλάδα.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    title: "Λαογραφικός Χάρτης Ελλάδας",
    description:
      "Πλοήγηση σε λαογραφικές καταγραφές με φίλτρα κατηγοριών και γεωγραφικών περιοχών.",
    url: CANONICAL_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Λαογραφικός Χάρτης Ελλάδας",
    description:
      "Πλοήγηση σε λαογραφικές καταγραφές με φίλτρα κατηγοριών και γεωγραφικών περιοχών.",
  },
};

type PageProps = {
  searchParams: Promise<{
    subcategory?: string;
  }>;
};

export default async function LaografiaMapPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const locale = await getRequestLocale();
  const { articles, subcategories } = await getLaografiaMapData(locale);

  const initialSubcategory =
    params?.subcategory && subcategories.some((option) => option.value === params.subcategory)
      ? params.subcategory
      : undefined;

  return (
    <Section className="container space-y-12" customPaddings="py-12 lg:py-20">
      <SectionHeader
        eyebrow="Παραδόσεις"
        title="Διαδραστικός Λαογραφικός Χάρτης"
        description="Ανακαλύψτε τοπικές παραδόσεις, μαρτυρίες και μύθους μέσα από γεωγραφική απεικόνιση των καταγραφών."
      />

      <LaografiaMapShell
        articles={articles}
        subcategories={subcategories}
        initialSubcategory={initialSubcategory}
      />
    </Section>
  );
}
