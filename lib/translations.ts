import { DEFAULT_LOCALE, type Locale } from "./locale";

const CATEGORY_TRANSLATIONS: Record<string, { en?: string }> = {
  laografia: { en: "Folklore" },
  "etaireia-psychikon-ereynon": { en: "Greek Society for Psychical Research" },
  efimerides: { en: "Newspapers" },
  vivlia: { en: "Books" },
  chronologia: { en: "Timelines" },
  parafysiko: { en: "Paranormal Timeline" },
  map: { en: "Maps" },
  map2: { en: "Maps" },
  about: { en: "About Us" },
  home: { en: "Home" },
  search: { en: "Search" },
};

const SUBCATEGORY_TRANSLATIONS: Record<string, { en?: string }> = {
  all: { en: "All Articles" },
  allBooks: { en: "All Books" },
  // Λαογραφία
  aerika: { en: "Aerika" },
  zoudiaredes: { en: "Zoudiaredes - Savvatianoi" },
  kalikatzaroi: { en: "Kalikantzaroi" },
  ksotika: { en: "Ksotika" },
  lamies: { en: "Lamies - Strigles" },
  telonia: { en: "Telonia" },
  xamodrakia: { en: "Chamodrakia - Smerdakia" },
  vrikolakes: { en: "Vampires" },
  gigantes: { en: "Giants" },
  daimones: { en: "Demons" },
  drakospita: { en: "Dragon Houses" },
  drakontes: { en: "Dragons" },
  neraides: { en: "Fairies" },
  limnes: { en: "Lakes & Rivers" },
  moires: { en: "Fates" },
  stoixeia: { en: "Spirits & Hauntings" },
  fantasmata: { en: "Ghosts" },
  // Εταιρία Ψυχικών Ερευνών
  "erevnes-fainomena": { en: "Phenomena & Investigations" },
  "medium-etaireias": { en: "GSPR Mediums" },
  "arthra-dialexeis": { en: "Articles & Lectures" },
  peiramata: { en: "Experiments" },
  // Εφημερίδες
  egklimata: { en: "Criminal Cases" },
  mageia: { en: "Magic" },
  pnevmatismos: { en: "Spiritualism & Seances" },
  fainomena: { en: "Phenomena" },
  // Βιβλία
  "laografika-mythistorimata": { en: "Folklore Novels" },
  erevna: { en: "Research" },
  "skoteini-fantasia": { en: "Dark Fantasy" },
  // Χάρτες
  "laografia-map": { en: "Folklore Map" },
  "efimerides-map": { en: "Articles Map" },
  // Χρονολόγια (timeline nav subitems)
  parafysiko: { en: "Paranormal Timeline" },
  "etaireia-psychikon-ereynon": { en: "GSPR Timeline" },
};

function isEnglish(locale: Locale) {
  return locale === "en";
}

export function translateCategoryLabel(
  categoryKey: string,
  fallback: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  if (!isEnglish(locale)) {
    return fallback;
  }

  return CATEGORY_TRANSLATIONS[categoryKey]?.en ?? fallback;
}

export function translateSubcategoryLabel(
  subcategorySlug: string,
  fallback: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  if (!isEnglish(locale)) {
    return fallback;
  }

  return SUBCATEGORY_TRANSLATIONS[subcategorySlug]?.en ?? fallback;
}
