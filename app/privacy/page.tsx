import type { Metadata } from "next";

import { Section } from "@/components/section";

type PrivacySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  footerNote?: string;
  paragraphsAfterBullets?: string[];
};

const sections: PrivacySection[] = [
  {
    title: "1. Τι Δεδομένα Συλλέγουμε",
    paragraphs: [
      "Κατά την επίσκεψή σας στην ιστοσελίδα ή τη χρήση της mobile εφαρμογής μας, ενδέχεται να συλλέγονται:",
    ],
    bullets: [
      "Διεύθυνση IP",
      "Πληροφορίες συσκευής και browser",
      "Cookies και παρόμοιες τεχνολογίες",
      "Τοποθεσία (μόνο με ρητή άδεια)",
      "Φόρμες υποβολής εμπειριών ή επαφής",
      "Ανώνυμα στατιστικά χρήσης",
    ],
    paragraphsAfterBullets: [
      "Δεν συλλέγουμε ποτέ δεδομένα ευαίσθητου χαρακτήρα όπως τραπεζικές πληροφορίες, αριθμούς ταυτότητας ή υγειονομικά στοιχεία.",
    ],
  },
  {
    title: "2. Χρήση Δεδομένων",
    paragraphs: ["Τα δεδομένα που συλλέγουμε χρησιμοποιούνται αποκλειστικά για:"],
    bullets: [
      "Ανάλυση επισκεψιμότητας",
      "Βελτιστοποίηση εμπειρίας χρήστη",
      "Λειτουργία βασικών χαρακτηριστικών",
      "Διαχείριση υποβολών περιεχομένου",
    ],
    paragraphsAfterBullets: ["Δεν πουλάμε, ενοικιάζουμε ή μεταβιβάζουμε δεδομένα σε τρίτους."],
  },
  {
    title: "3. Cookies",
    paragraphs: ["Χρησιμοποιούμε cookies για:"],
    bullets: ["Λειτουργικότητα του site", "Ανάλυση (Google Analytics)", "Γεωεντοπισμό (με άδεια)"],
    paragraphsAfterBullets: ["Μπορείτε να ρυθμίσετε τον browser σας ώστε να απορρίπτει cookies."],
  },
  {
    title: "4. Τοποθεσία Χρήστη",
    paragraphs: [
      "Η εφαρμογή ζητά πρόσβαση στην τοποθεσία σας μόνο με ρητή άδεια. Τα δεδομένα τοποθεσίας:",
    ],
    bullets: [
      "Χρησιμοποιούνται τοπικά στη συσκευή",
      "Δεν αποθηκεύονται στους servers μας",
      "Δεν κοινοποιούνται σε τρίτους",
    ],
  },
  {
    title: "5. Υποβολή Περιεχομένου",
    paragraphs: ["Όταν υποβάλλετε περιεχόμενο:"],
    bullets: [
      "Χρησιμοποιούμε μόνο τα απαραίτητα δεδομένα",
      "Διατηρούμε δικαίωμα δημοσίευσης",
      "Προστατεύουμε τα προσωπικά σας στοιχεία",
    ],
  },
  {
    title: "6. Αποθήκευση και Ασφάλεια",
    paragraphs: ["Χρησιμοποιούμε:"],
    bullets: ["Ασφαλείς servers", "Σύγχρονη κρυπτογράφηση", "Firewall προστασία"],
  },
  {
    title: "7. Δικαιώματα Χρηστών",
    paragraphs: ["Έχετε δικαίωμα να:"],
    bullets: ["Προβάλετε τα δεδομένα σας", "Ενημερώσετε ή διορθώσετε", "Διαγράψετε"],
  },
  {
    title: "8. Τρίτοι Πάροχοι",
    paragraphs: ["Χρησιμοποιούμε υπηρεσίες όπως:"],
    bullets: ["Google Analytics", "Cloudflare", "Vercel"],
    paragraphsAfterBullets: ["Κάθε πάροχος έχει τη δική του πολιτική απορρήτου."],
  },
  {
    title: "9. Αλλαγές στην Πολιτική",
    paragraphs: ["Διατηρούμε το δικαίωμα τροποποιήσεων. Τελευταία ενημέρωση:"],
    footerNote: "Μάιος 2025",
  },
];

export const metadata: Metadata = {
  title: "Haunted.gr - Πολιτική Απορρήτου",
  description: "Διαβάστε την πολιτική απορρήτου και προστασίας δεδομένων του Haunted.gr.",
  alternates: {
    canonical: "https://haunted.gr/privacy",
  },
  openGraph: {
    title: "Haunted.gr - Πολιτική Απορρήτου",
    description: "Πληροφορίες για τη συλλογή, χρήση και προστασία δεδομένων στο Haunted.gr.",
    url: "https://haunted.gr/privacy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haunted.gr - Πολιτική Απορρήτου",
    description: "Πληροφορίες για τη συλλογή, χρήση και προστασία δεδομένων στο Haunted.gr.",
  },
};

export default function PrivacyPage() {
  return (
    <Section className="container max-w-3xl space-y-12" customPaddings="py-12 lg:py-20">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-n-1">Πολιτική Απορρήτου</h1>
        <p className="text-base text-n-3">
          Διασφαλίζουμε ότι τα δεδομένα της κοινότητας Haunted.gr αντιμετωπίζονται με υπευθυνότητα,
          διαφάνεια και σεβασμό.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4 border-b border-n-7 pb-8">
          <p className="text-base leading-7 text-n-3">
            Η προστασία των προσωπικών σας δεδομένων είναι εξαιρετικά σημαντική για εμάς. Στο Haunted.gr
            δεσμευόμαστε να διασφαλίζουμε ότι κάθε πληροφορία που συλλέγεται μέσω της ιστοσελίδας ή των
            εφαρμογών μας χρησιμοποιείται με υπευθυνότητα, διαφάνεια και με σεβασμό προς την ιδιωτικότητά
            σας.
          </p>
        </section>

        {sections.map((section) => (
          <section
            key={section.title}
            className="space-y-4 border-b border-n-7 pb-8 last:border-none last:pb-0"
          >
            <h2 className="text-2xl font-semibold text-n-1">{section.title}</h2>
            {section.paragraphs?.map((paragraph, index) => (
              <p key={`p-${index}`} className="text-base leading-7 text-n-3">
                {paragraph}
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="list-disc space-y-2 pl-6 text-base text-n-3">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {section.paragraphsAfterBullets?.map((paragraph, index) => (
              <p key={`ap-${index}`} className="text-base leading-7 text-n-3">
                {paragraph}
              </p>
            ))}
            {section.footerNote && (
              <p className="text-center text-sm uppercase tracking-[0.24em] text-n-4">
                {section.footerNote}
              </p>
            )}
          </section>
        ))}
      </div>
    </Section>
  );
}
