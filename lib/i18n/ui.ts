import type { Locale } from "@/lib/locale";

type LocaleString = {
  el: string;
  en: string;
};

function pick(copy: LocaleString, locale: Locale) {
  return locale === "en" ? copy.en : copy.el;
}

export function getHomeCopy(locale: Locale) {
  return {
    heroTagline: pick(
      { el: "Αρχείο του Ελληνικού Παραφυσικού", en: "Archive of the Greek Paranormal" },
      locale,
    ),
    sections: {
      laografia: {
        heading: pick(
          { el: "Άρθρα Παραδόσεις / Λαογραφία", en: "Folklore Articles" },
          locale,
        ),
        description: pick(
          {
            el: "Συλλογές για στοιχειά, νεράιδες, βρυκόλακες και πλάσματα της ελληνικής παράδοσης.",
            en: "Collections about spirits, fairies, vampires, and creatures from Greek folklore.",
          },
          locale,
        ),
        defaultSub: "vrikolakes",
      },
      efimerides: {
        heading: pick({ el: "Άρθρα Εφημερίδων", en: "Newspaper Articles" }, locale),
        description: pick(
          {
            el: "Παράξενα φαινόμενα, εγκλήματα και τελετές όπως καταγράφηκαν στον ελληνικό Τύπο.",
            en: "Strange phenomena, crimes, and rituals as recorded in the Greek press.",
          },
          locale,
        ),
        defaultSub: "fainomena",
      },
      etaireia: {
        heading: pick(
          { el: "Εταιρεία Ψυχικών Ερευνών", en: "Greek Society for Psychical Research" },
          locale,
        ),
        description: pick(
          {
            el: "Έρευνες, πειράματα και δημοσιεύσεις από τα αρχεία της Εταιρίας Ψυχικών Ερευνών.",
            en: "Research, experiments, and publications from the archives of the Society.",
          },
          locale,
        ),
      },
    },
  };
}

export function getCategorySectionUi(locale: Locale) {
  return {
    readMore: pick({ el: "Διαβάστε περισσότερα", en: "Read more" }, locale),
    viewAllPrefix: pick({ el: "Δες όλα τα άρθρα στην κατηγορία", en: "See all articles in" }, locale),
    noArticles: pick(
      { el: "Δεν υπάρχουν διαθέσιμα άρθρα για την επιλεγμένη υποκατηγορία.", en: "No articles for the selected subcategory." },
      locale,
    ),
  };
}

export function getYoutubeCopy(locale: Locale) {
  return {
    heading: pick(
      { el: "Σχετικά Βίντεο Δημιουργών στο YouTube", en: "Related Creator Videos on YouTube" },
      locale,
    ),
    channelPrefix: pick({ el: "Κανάλι", en: "Channel" }, locale),
    visitChannel: pick({ el: "Επίσκεψη καναλιού →", en: "Visit channel →" }, locale),
    seeMoreFrom: pick(
      { el: "Δείτε περισσότερα από", en: "See more from" },
      locale,
    ),
  };
}



export function getFiltersCopy(locale: Locale) {
  return {
    area: pick({ el: "Περιοχή", en: "Area" }, locale),
    location: pick({ el: "Οικισμός / Τοποθεσία", en: "Settlement / Location" }, locale),
    year: pick({ el: "Έτος", en: "Year" }, locale),
    allAreas: pick({ el: "Όλες οι περιοχές", en: "All areas" }, locale),
    allLocations: pick({ el: "Όλες οι τοποθεσίες", en: "All locations" }, locale),
    allYears: pick({ el: "Όλες οι χρονιές", en: "All years" }, locale),
    showing: pick({ el: "Εμφανίζονται", en: "Showing" }, locale),
    of: pick({ el: "από", en: "of" }, locale),
    noResults: pick(
      { el: "Δεν βρέθηκαν άρθρα με τα επιλεγμένα φίλτρα.", en: "No articles found for the selected filters." },
      locale,
    ),
  };
}

export function getTimelineCopy(locale: Locale) {
  return {
    empty: pick({ el: "Δεν βρέθηκαν τεκμήρια με ημερομηνία.", en: "No dated records found." }, locale),
    sliderHelp: pick(
      {
        el: "Χρησιμοποίησε τα βέλη για περιήγηση.",
        en: "Use the arrows to browse.",
      },
      locale,
    ),
    prev: pick({ el: "← Προηγούμενο", en: "← Previous" }, locale),
    next: pick({ el: "Επόμενο →", en: "Next →" }, locale),
    yearLabel: pick({ el: "Έτος", en: "Year" }, locale),
    recordsLabel: pick({ el: "τεκμήρια", en: "records" }, locale),
  };
}

export function getArticleCopy(locale: Locale) {
  return {
    location: {
      heading: pick({ el: "Τοποθεσία", en: "Location" }, locale),
      mainArea: pick({ el: "Κύρια περιοχή", en: "Main area" }, locale),
      subLocations: pick({ el: "Υπο-τοποθεσίες", en: "Sub-locations" }, locale),
    },
    sources: {
      heading: pick({ el: "Πηγές & Τεκμηρίωση", en: "Sources & Documentation" }, locale),
      articleDate: pick({ el: "Ημερομηνία άρθρου", en: "Article date" }, locale),
      articleAuthor: pick({ el: "Συγγραφέας άρθρου", en: "Article author" }, locale),
      typeLabels: {
        book: pick({ el: "Βιβλιογραφική αναφορά", en: "Book reference" }, locale),
        newspaper: pick({ el: "Αρχειακή καταγραφή", en: "Newspaper record" }, locale),
        contributor: pick({ el: "Συντελεστής", en: "Contributor" }, locale),
        journal: pick({ el: "Επιστημονική δημοσίευση", en: "Journal publication" }, locale),
        manuscript: pick({ el: "Χειρόγραφο", en: "Manuscript" }, locale),
        web: pick({ el: "Διαδικτυακή πηγή", en: "Web source" }, locale),
      },
      labels: {
        author: pick({ el: "Συγγραφέας", en: "Author" }, locale),
        title: pick({ el: "Τίτλος", en: "Title" }, locale),
        year: pick({ el: "Έτος", en: "Year" }, locale),
        pages: pick({ el: "Σελίδες", en: "Pages" }, locale),
        issue: pick({ el: "Έκδοση", en: "Issue" }, locale),
        date: pick({ el: "Ημερομηνία", en: "Date" }, locale),
        provider: pick({ el: "Πάροχος", en: "Provider" }, locale),
        journal: pick({ el: "Περιοδικό", en: "Journal" }, locale),
        volume: pick({ el: "Τόμος", en: "Volume" }, locale),
        archive: pick({ el: "Αρχείο", en: "Archive" }, locale),
        library: pick({ el: "Βιβλιοθήκη", en: "Library" }, locale),
        codex: pick({ el: "Κώδικας", en: "Codex" }, locale),
        details: pick({ el: "Λεπτομέρειες", en: "Details" }, locale),
        website: pick({ el: "Ιστότοπος", en: "Website" }, locale),
        links: pick({ el: "Συνδέσεις", en: "Links" }, locale),
        contributor: pick({ el: "Συντελεστής", en: "Contributor" }, locale),
        role: pick({ el: "Ρόλος", en: "Role" }, locale),
        name: pick({ el: "Ονομασία", en: "Name" }, locale),
      },
    },
  };
}

export function getFooterCopy(locale: Locale) {
  return {
    categoriesLabel: pick({ el: "Κατηγορίες", en: "Categories" }, locale),
    resourcesLabel: pick({ el: "Προσανατολισμός", en: "Explore" }, locale),
    brandLabel: "Haunted.gr",
    brandDescription: pick(
      {
        el: "Αρχείο λαογραφίας, ιστορικών τεκμηρίων και παραφυσικών ερευνών από κάθε γωνιά της Ελλάδας.",
        en: "Archive of folklore, historical records, and psychical research from across Greece.",
      },
      locale,
    ),
    maps: pick({ el: "Χάρτες", en: "Maps" }, locale),
    folkloreMap: pick({ el: "Χάρτης Λαογραφίας", en: "Folklore Map" }, locale),
    articlesMap: pick({ el: "Χάρτης Εφημερίδων", en: "Articles Map" }, locale),
    terms: pick({ el: "Όροι Χρήσης", en: "Terms of Use" }, locale),
    privacy: pick({ el: "Πολιτική Απορρήτου", en: "Privacy Policy" }, locale),
    about: pick({ el: "Σχετικά", en: "About Us" }, locale),
    search: pick({ el: "Αναζήτηση", en: "Search" }, locale),
    allRights: pick(
      { el: "— Όλα τα δικαιώματα διατηρούνται.", en: "— All rights reserved." },
      locale,
    ),
  };
}
