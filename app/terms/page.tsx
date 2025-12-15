import type { Metadata } from "next";

import { Section } from "@/components/section";

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  paragraphsAfterBullets?: string[];
};

const sections: TermsSection[] = [
  {
    title: "1. Πνευματικά Δικαιώματα",
    paragraphs: [
      "Όλο το περιεχόμενο του Haunted.gr (άρθρα, εικόνες, γραφικά, χάρτες, διαδραστικά στοιχεία, κείμενα) προστατεύεται από την ελληνική και διεθνή νομοθεσία περί πνευματικής ιδιοκτησίας. Η αντιγραφή, αναδημοσίευση, διανομή ή τροποποίηση χωρίς προηγούμενη έγγραφη άδεια απαγορεύεται αυστηρά.",
      "Εξαίρεση αποτελούν τα αποσπάσματα που αναφέρονται σε πηγές, τα οποία παρατίθενται με σεβασμό στους δημιουργούς και όπου είναι δυνατόν, παραπέμπουν σε σύνδεσμο αγοράς των πρωτότυπων έργων.",
    ],
  },
  {
    title: "2. Αποποίηση Ευθύνης",
    paragraphs: [
      "Το περιεχόμενο του Haunted.gr βασίζεται σε ιστορικές πηγές, λαογραφικές καταγραφές, δημοσιευμένα βιβλία και εφημερίδες, καθώς και μαρτυρίες του παρελθόντος. Δεν φέρουμε καμία ευθύνη για την ακρίβεια ή την απόλυτη τεκμηρίωση των πληροφοριών, καθώς μεγάλο μέρος αφορά παραδόσεις, προφορικές αφηγήσεις και μη αποδείξιμα φαινόμενα.",
      "Το Haunted.gr δεν προωθεί ή ενθαρρύνει την πίστη σε μεταφυσικά φαινόμενα, ούτε την υιοθέτηση επικίνδυνων συμπεριφορών που σχετίζονται με αυτά. Η χρήση της πληροφορίας γίνεται αποκλειστικά με ευθύνη του επισκέπτη.",
    ],
  },
  {
    title: "3. Πολιτική για τις Τοποθεσίες του Χάρτη",
    paragraphs: [
      "Ο «Παραφυσικός Χάρτης» της Ελλάδας αποτελεί καλλιτεχνική και λαογραφική απεικόνιση των περιοχών που σχετίζονται με τοπικές παραδόσεις, θρύλους, ιστορίες ή μαρτυρίες μεταφυσικού χαρακτήρα. Δεν πρόκειται για οδηγό επίσκεψης ή σύσταση μετακίνησης σε συγκεκριμένα μέρη.",
      "Το Haunted.gr δεν φέρει καμία ευθύνη για οποιοδήποτε ατύχημα, παραβίαση ή πρόβλημα προκύψει από την επίσκεψη σε τοποθεσίες που αναφέρονται στον χάρτη. Η χρήση του χάρτη γίνεται με αποκλειστική ευθύνη του χρήστη.",
    ],
  },
  {
    title: "4. Υποβολή Περιεχομένου από Χρήστες (μόνο για mobile app)",
    paragraphs: [
      "Η δυνατότητα αποστολής προσωπικών εμπειριών ή ιστοριών από χρήστες θα είναι διαθέσιμη μέσω του επερχόμενου mobile app. Το Haunted.gr διατηρεί το δικαίωμα να εξετάζει, τροποποιεί ή απορρίπτει οποιοδήποτε περιεχόμενο κριθεί:",
    ],
    bullets: ["Ανακριβές", "Παραπλανητικό", "Μη συμβατό με τους σκοπούς της πλατφόρμας"],
    paragraphsAfterBullets: [
      "Η αποστολή περιεχομένου ισοδυναμεί με παραχώρηση άδειας χρήσης και δημοσίευσης στο Haunted.gr, χωρίς οικονομική ή άλλη απαίτηση εκ μέρους του αποστολέα.",
    ],
  },
  {
    title: "5. Περιορισμός Πρόσβασης",
    paragraphs: ["Το Haunted.gr διατηρεί το δικαίωμα να αναστείλει προσωρινά ή μόνιμα την πρόσβαση χρηστών που:"],
    bullets: [
      "Παραβιάζουν τους όρους χρήσης",
      "Χρησιμοποιούν καταχρηστικά τις υπηρεσίες",
      "Επιχειρούν να υπονομεύσουν την ομαλή λειτουργία της πλατφόρμας",
    ],
  },
  {
    title: "6. Τροποποιήσεις Όρων",
    paragraphs: [
      "Το Haunted.gr διατηρεί το δικαίωμα να τροποποιεί οποιονδήποτε από τους παραπάνω όρους χωρίς προηγούμενη ειδοποίηση. Συνιστούμε την τακτική ανασκόπηση αυτής της σελίδας. Η συνέχιση χρήσης της ιστοσελίδας μετά από αλλαγές στους όρους συνεπάγεται την αποδοχή τους.",
    ],
  },
];

export const metadata: Metadata = {
  title: "Haunted.gr - Όροι Χρήσης",
  description: "Διαβάστε τους όρους χρήσης και τις προϋποθέσεις του Haunted.gr.",
  alternates: {
    canonical: "https://haunted.gr/terms",
  },
  openGraph: {
    title: "Haunted.gr - Όροι Χρήσης",
    description: "Οι όροι λειτουργίας και χρήσης της πλατφόρμας Haunted.gr.",
    url: "https://haunted.gr/terms",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haunted.gr - Όροι Χρήσης",
    description: "Οι όροι λειτουργίας και χρήσης της πλατφόρμας Haunted.gr.",
  },
};

export default function TermsPage() {
  return (
    <Section className="container max-w-3xl space-y-12" customPaddings="py-12 lg:py-20">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-n-1">Όροι Χρήσης &amp; Προϋποθέσεις</h1>
        <p className="text-base text-n-3">
          Πλαίσιο λειτουργίας, αποποίησης ευθύνης και προστασίας της κοινότητας Haunted.gr.
        </p>
      </header>

      <div className="space-y-8">
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
          </section>
        ))}
      </div>
    </Section>
  );
}
