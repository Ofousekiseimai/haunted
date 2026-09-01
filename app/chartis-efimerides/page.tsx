import type { Metadata } from "next";

import { EfimeridesMapShell } from "@/components/maps/efimerides-map-shell";
import { getEfimeridesMapData } from "@/lib/maps";
import { getRequestLocale } from "@/lib/locale-server";

const CANONICAL_URL = "https://haunted.gr/chartis-efimerides";

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
    <>
      <div className="frame page-head">
        <div className="shead">
          <div>
            <div className="shead__kicker">
              <span className="mark" aria-hidden="true" />
              <span className="mono">Εφημερίδες</span>
            </div>
            <h1 className="shead__title">Χάρτης Συμβάντων</h1>
          </div>
          <p className="shead__desc">
            Δημοσιεύματα του ελληνικού Τύπου, τοποθετημένα εκεί όπου καταγράφηκαν.
            Φιλτράρετε ανά θεματική ενότητα και περιοχή.
          </p>
        </div>
      </div>

      <EfimeridesMapShell articles={articles} subcategories={subcategories} />
    </>
  );
}
