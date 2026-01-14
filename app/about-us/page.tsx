import type { Metadata } from "next";

import { Section } from "@/components/section";

import { getRequestLocale } from "@/lib/locale-server";

type LocalizedSection = {
  title: string;
  paragraphs: string[];
};

function getSections(locale: "el" | "en"): LocalizedSection[] {
  const baseIntro =
    "Το Haunted.gr είναι μια ανεξάρτητη, ψηφιακή πλατφόρμα αφιερωμένη στην ανάδειξη, καταγραφή και διατήρηση της ελληνικής λαογραφίας και του παραφυσικού στοιχείου που διατρέχει την ιστορία του τόπου μας. Στόχος μας είναι να προσφέρουμε πρόσβαση σε έναν θησαυρό γνώσης που, αν και συχνά παραγκωνισμένος, αποτελεί βασικό κομμάτι της πολιτισμικής μας ταυτότητας. Όλες οι καταγραφές είναι αποκλειστικά από πιστοποιημένες πηγές.";
  const baseIntroEn =
    "Haunted.gr is an independent digital platform dedicated to highlighting, recording, and preserving Greek folklore and the paranormal threads that run through our history. We provide access to a body of knowledge that is often overlooked, yet remains a core part of our cultural identity. All entries originate from verified sources.";

  if (locale === "en") {
    return [
      {
        title: "About Haunted.gr",
        paragraphs: [baseIntroEn],
      },
      {
        title: "Our Mission",
        paragraphs: [
          "We connect audiences to Greek folklore, a rich yet often forgotten part of our identity, and to the extensive work of the Greek Society for Psychical Research. Beyond traditions, the archive spans newspaper records, psychical investigations, and contemporary reports related to the paranormal.",
        ],
      },
      {
        title: "1. Folklore Records",
        paragraphs: [
          "Based on respected Greek folklorists and researchers, from ancient to modern times. Most entries are paraphrased for clarity while honoring the original work, with full sources and bibliography.",
        ],
      },
      {
        title: "2. Interactive Folklore Map",
        paragraphs: [
          "Google Maps–style browsing of phenomena by area and category—from folk beliefs to sightings of beings and unexplained events.",
        ],
      },
      {
        title: "3. Newspaper Archive",
        paragraphs: [
          "Press reports from the 19th century onward on rituals, unexplained events, and crimes with a paranormal angle. Preserved for research and easy access.",
        ],
      },
      {
        title: "4. Archive of the Greek Society for Psychical Research",
        paragraphs: [
          "Digitized materials, experiments, and publications from the Society’s work, unifying all subcategories into a single accessible archive and timeline.",
        ],
      },
      {
        title: "5. Events & Timelines",
        paragraphs: [
          "Horizontal timelines and event maps to explore key cases, decades, and themes across folklore, press, and psychical research.",
        ],
      },
      {
        title: "Rights & Source Respect",
        paragraphs: [
          "We respect intellectual property and credit authors and researchers. Where possible, we provide links to official book purchases. Rights remain with the creators.",
        ],
      },
      {
        title: "Why We Built This",
        paragraphs: [
          "As everything goes digital, safeguarding cultural heritage matters. Haunted.gr bridges place, history, and today’s reader—researcher, traveler, or anyone seeking their roots.",
        ],
      },
      {
        title: "Map Disclaimer",
        paragraphs: [
          "Haunted.gr does not encourage visiting locations on the maps, especially where risk, abandonment, difficult access, or legal issues may exist. Many locations are approximate due to limited testimony precision.",
          "The maps are informational and archival, not visit guides. Visitors act at their own risk; Haunted.gr bears no responsibility for incidents arising from visits.",
        ],
      },
    ];
  }

  return [
    {
      title: "Σχετικά με το Haunted.gr",
      paragraphs: [baseIntro],
    },
    {
      title: "Η Αποστολή μας",
      paragraphs: [
        "Κύριος σκοπός μας είναι να προσφέρουμε στο ευρύ κοινό τη δυνατότητα να έρθει σε επαφή με την ελληνική λαογραφία – μια πλούσια, ζωντανή και, δυστυχώς, συχνά ξεχασμένη πτυχή της ταυτότητάς μας – καθώς και με το εκτενές έργο της Εταιρείας Ψυχικών Ερευνών και τις σύγχρονες αναφορές στο παραφυσικό.",
      ],
    },
    {
      title: "1. Λαογραφικές καταγραφές",
      paragraphs: [
        "Βασισμένες σε έργα καταξιωμένων Ελλήνων λαογράφων και ερευνητών, από την αρχαία Ελλάδα έως τη σύγχρονη εποχή. Οι περισσότερες παρουσιάζονται σε παραφρασμένη και κατανοητή μορφή, με σεβασμό στο αρχικό έργο. Κάθε άρθρο συνοδεύεται από αναλυτικές πηγές και βιβλιογραφικές αναφορές.",
      ],
    },
    {
      title: "2. Διαδραστικός Λαογραφικός Χάρτης",
      paragraphs: [
        "Παρόμοιο σε λειτουργία με το Google Maps, όπου οι χρήστες μπορούν να εξερευνήσουν φαινόμενα ανά περιοχή και κατηγορία – από λαϊκές δοξασίες έως αναφορές σε πλάσματα και ανεξήγητα περιστατικά.",
      ],
    },
    {
      title: "3. Παραφυσικό Αρχείο Εφημερίδων",
      paragraphs: [
        "Γεγονότα του Ελλαδικού χώρου που έχουν καταγραφεί σε εφημερίδες, στις οποίες εμπλέκονται τελετές, ανεξήγητα φαινόμενα, εταιρίες και καταγραφές. Σκοπός είναι η διαφύλαξη και η εύκολη πρόσβαση σε γεγονότα, παρατηρήσεις και συμβάντα που σχετίζονται με το μεταφυσικό από τον ελληνικό Τύπο του 19ου και 20ού αιώνα μέχρι σήμερα.",
      ],
    },
    {
      title: "4. Αρχείο Εταιρείας Ψυχικών Ερευνών",
      paragraphs: [
        "Ψηφιοποιημένο υλικό, πειράματα και δημοσιεύσεις από το έργο της ιστορικής Εταιρείας Ψυχικών Ερευνών, συγκεντρωμένα σε ενιαίο αρχείο και χρονολόγιο.",
      ],
    },
    {
      title: "5. Χρονολόγια & Γεγονότα",
      paragraphs: [
        "Οριζόντια χρονολόγια και θεματικοί χάρτες για να εξερευνάς κομβικές υποθέσεις, δεκαετίες και θεματικές σε λαογραφία, Τύπο και ψυχικές έρευνες.",
      ],
    },
    {
      title: "Πνευματικά Δικαιώματα & Σεβασμός στην Πηγή",
      paragraphs: [
        "Το Haunted.gr λειτουργεί με απόλυτο σεβασμό προς τα πνευματικά δικαιώματα. Όλες οι αναφορές σε έργα, συγγραφείς και λαογράφους συνοδεύονται από πλήρη τεκμηρίωση, ενώ – όπου είναι διαθέσιμο – παρέχονται σύνδεσμοι για την επίσημη αγορά των βιβλίων. Τα πνευματικά δικαιώματα ανήκουν αποκλειστικά στους δημιουργούς τους.",
      ],
    },
    {
      title: "Γιατί Δημιουργήθηκε",
      paragraphs: [
        "Σε μια εποχή όπου τα πάντα ψηφιοποιούνται, είναι κρίσιμο να διασφαλίσουμε ότι η πολιτιστική μας κληρονομιά δεν θα μείνει πίσω. Θέλουμε το Haunted.gr να αποτελέσει γέφυρα ανάμεσα στον τόπο, την ιστορία του και τον σημερινό επισκέπτη – είτε είναι ερευνητής, είτε περίεργος ταξιδιώτης, είτε απλώς ένας άνθρωπος που αναζητά τις ρίζες του.",
      ],
    },
    {
      title: "Disclaimer για τις Τοποθεσίες του Χάρτη",
      paragraphs: [
        "Το Haunted.gr δεν ενθαρρύνει, προτείνει ή προωθεί με κανέναν τρόπο την επίσκεψη σε τοποθεσίες που αναφέρονται στους χάρτες, ειδικά αν αυτές ενδέχεται να εμπεριέχουν φυσικούς κινδύνους, εγκατάλειψη, δύσβατη πρόσβαση ή νομικές απαγορεύσεις. Πολλές από τις τοποθεσίες δεν είναι ακριβείς πάνω στον χάρτη και έχουν χρησιμοποιηθεί ως κεντρικές περιοχές, μιας και είναι αδύνατος ή σχεδόν αδύνατος ο εντοπισμός τους βάσει των μαρτυριών που υπάρχουν.",
        "Ο χάρτης έχει δημιουργηθεί με καθαρά πληροφοριακό και λαογραφικό σκοπό, με γνώμονα την τεκμηρίωση φαινομένων που έχουν καταγραφεί στην προφορική ή γραπτή παράδοση. Αποτελεί προσέγγιση και όχι οδηγό επίσκεψης, και δεν αντικαθιστά σε καμία περίπτωση την κρίση, την ασφάλεια ή την υπευθυνότητα του κάθε επισκέπτη.",
        "Σε περίπτωση που κάποιο άτομο επιλέξει να επισκεφθεί μια περιοχή που εμφανίζεται στον χάρτη, το πράττει με δική του πρωτοβουλία και ευθύνη, και το Haunted.gr δεν φέρει καμία απολύτως ευθύνη για οποιοδήποτε περιστατικό προκύψει.",
      ],
    },
  ];
}

export const metadata: Metadata = {
  title: "Haunted.gr - Σχετικά με εμάς",
  description:
    "Διαβάστε για την αποστολή, το περιεχόμενο και τους στόχους του Haunted.gr.",
  alternates: {
    canonical: "https://haunted.gr/about-us",
  },
  openGraph: {
    title: "Haunted.gr - Σχετικά με εμάς",
    description:
      "Ενημερωθείτε για την αποστολή και τα αρχεία της κοινότητας Haunted.gr.",
    url: "https://haunted.gr/about-us",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haunted.gr - Σχετικά με εμάς",
    description:
      "Ενημερωθείτε για την αποστολή και τα αρχεία της κοινότητας Haunted.gr.",
  },
};

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const localizedSections = getSections(locale);
  const heading =
    locale === "en" ? "About Haunted.gr" : "Σχετικά με το Haunted.gr";
  const subheading =
    locale === "en"
      ? "A digital archive of Greek folklore, paranormal cases, and historical records."
      : "Ένα αρχείο ελληνικής λαογραφίας, παραφυσικών ιστοριών και ιστορικών τεκμηρίων.";

  return (
    <Section className="container max-w-3xl space-y-12" customPaddings="py-12 lg:py-20">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-n-1">{heading}</h1>
        <p className="text-base text-n-3">{subheading}</p>
      </header>

      <div className="space-y-8">
        {localizedSections.map((section) => (
          <section
            key={section.title}
            className="space-y-4 border-b border-n-7 pb-8 last:border-none last:pb-0"
          >
            <h2 className="text-2xl font-semibold text-n-1">{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base leading-7 text-n-3">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </Section>
  );
}
