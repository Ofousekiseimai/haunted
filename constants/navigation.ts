import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";
import { translateCategoryLabel, translateSubcategoryLabel } from "@/lib/translations";

export type NavigationSubitem = {
  slug: string;
  title: string;
  url: string;
};

export type NavigationItem = {
  id: string;
  title: string;
  url: string;
  onlyMobile?: boolean;
  subitems?: NavigationSubitem[];
};

const navigationBase: NavigationItem[] = [
  {
    id: "0",
    title: "Αρχικη",
    url: "/",
  },
  {
    id: "1",
    title: "Παραδοσεις",
    url: "/laografia",
    subitems: [
      { slug: "all", title: "Όλα", url: "/laografia" },
      { slug: "aerika", title: "Αερικά", url: "/laografia/aerika" },
      { slug: "vrikolakes", title: "Βρυκόλακες", url: "/laografia/vrikolakes" },
      { slug: "zoudiaredes", title: "Ζουδιάρηδες - Σαββατιανοί", url: "/laografia/zoudiaredes" },
      { slug: "gigantes", title: "Γίγαντες", url: "/laografia/gigantes" },
      { slug: "daimones", title: "Δαίμονες", url: "/laografia/daimones" },
      { slug: "drakospita", title: "Δρακόσπιτα", url: "/laografia/drakospita" },
      { slug: "drakontes", title: "Δράκοντες", url: "/laografia/drakontes" },
      { slug: "neraides", title: "Νεράιδες", url: "/laografia/neraides" },
      { slug: "kalikatzaroi", title: "Καλικάντζαροι", url: "/laografia/kalikatzaroi" },
      { slug: "ksotika", title: "Ξωτικά", url: "/laografia/ksotika" },
      { slug: "lamies", title: "Λάμιες - Στρίγκλες", url: "/laografia/lamies" },
      { slug: "limnes", title: "Λίμνες - Ποταμοί", url: "/laografia/limnes" },
      { slug: "moires", title: "Μοίρες", url: "/laografia/moires" },
      { slug: "stoixeia", title: "Στοιχειά - Στοιχειώματα", url: "/laografia/stoixeia" },
      { slug: "telonia", title: "Τελώνια", url: "/laografia/telonia" },
      { slug: "fantasmata", title: "Φαντάσματα", url: "/laografia/fantasmata" },
      { slug: "xamodrakia", title: "Χαμοδράκια - Σμερδάκια", url: "/laografia/xamodrakia" },
    ],
  },
  {
    id: "2",
    title: "Εταιρια Ψυχικων Ερευνων",
    url: "/etaireia-psychikon-ereynon",
    subitems: [
      { slug: "all", title: "Όλα", url: "/etaireia-psychikon-ereynon" },
      {
        slug: "fainomena",
        title: "Φαινόμενα - Έρευνες",
        url: "/etaireia-psychikon-ereynon/erevnes-fainomena",
      },
      {
        slug: "medium-etaireias",
        title: "Τα Μέντιουμ της Εταιρίας",
        url: "/etaireia-psychikon-ereynon/medium-etaireias",
      },
      {
        slug: "arthra-dialexeis",
        title: "Άρθρα - Διαλέξεις",
        url: "/etaireia-psychikon-ereynon/arthra-dialexeis",
      },
      { slug: "peiramata", title: "Πειράματα", url: "/etaireia-psychikon-ereynon/peiramata" },
    ],
  },
  {
    id: "3",
    title: "Εφημεριδες",
    url: "/efimerides",
    subitems: [
      { slug: "all", title: "Όλα", url: "/efimerides" },
      { slug: "egklimata", title: "Εγκλήματα", url: "/efimerides/egklimata" },
      { slug: "mageia", title: "Μαγεία", url: "/efimerides/mageia" },
      { slug: "pnevmatismos", title: "Πνευματισμός", url: "/efimerides/pnevmatismos" },
      { slug: "fainomena", title: "Φαινόμενα", url: "/efimerides/fainomena" },
    ],
  },
  {
    id: "7",
    title: "Χρονολογια",
    url: "/chronologia",
    subitems: [
      { slug: "all", title: "Όλα", url: "/chronologia" },
      { slug: "egklimata", title: "Χρονολόγιο του Παραφυσικού", url: "/chronologia/parafysiko" },
      { slug: "etaireia-psychikon-ereynon", title: "Χρονολόγιο Εταιρίας Ψυχικών Ερευνών", url: "/chronologia/etaireia-psychikon-ereynon" },
    ],
    
  },
  {
    id: "4",
    title: "Χαρτες",
    url: "/map2",
    subitems: [
      { slug: "laografia-map", title: "Χάρτης Λαογραφίας", url: "/map2" },
      { slug: "efimerides-map", title: "Χάρτης Εφημερίδων", url: "/map" },
    ],
  },
  {
    id: "8",
    title: "Βιβλια",
    url: "/vivlia",
   // subitems: [
    //  { slug: "all-books", title: "Όλα", url: "/vivlia" },
     // {
     //   slug: "laografika-mythistorimata",
     //   title: "Λαογραφικά Μυθιστορήματα",
     //   url: "/vivlia/laografika-mythistorimata",
     // },
     // { slug: "erevna", title: "Έρευνα", url: "/vivlia/erevna" },
     // { slug: "skoteini-fantasia", title: "Σκοτεινή Φαντασία", url: "/vivlia/skoteini-fantasia" },
    //],
  },
  
  
  {
    id: "5",
    title: "Σχετικα",
    url: "/about-us",
  },
  {
    id: "6",
    title: "Αναζήτηση",
    url: "/search",
  },
];

function localizeTitle(item: NavigationItem, locale: Locale) {
  switch (item.id) {
    case "0":
      return translateCategoryLabel("home", item.title, locale);
    case "1":
      return translateCategoryLabel("laografia", item.title, locale);
    case "2":
      return translateCategoryLabel("etaireia-psychikon-ereynon", item.title, locale);
    case "3":
      return translateCategoryLabel("efimerides", item.title, locale);
    case "4":
      return translateCategoryLabel("map", item.title, locale);
    case "5":
      return translateCategoryLabel("about", item.title, locale);
    case "6":
      return translateCategoryLabel("search", item.title, locale);
    case "7":
      return translateCategoryLabel("chronologia", item.title, locale);
    case "8":
      return translateCategoryLabel("vivlia", item.title, locale);
    default:
      return item.title;
  }
}

function localizeSubitemTitle(slug: string, title: string, locale: Locale) {
  if (slug === "all") {
    return translateSubcategoryLabel("all", title, locale);
  }
  if (slug === "all-books") {
    return translateSubcategoryLabel("allBooks", title, locale);
  }
  return translateSubcategoryLabel(slug, title, locale);
}

export function getNavigation(locale: Locale = DEFAULT_LOCALE): NavigationItem[] {
  return navigationBase.map((item) => {
    const localizedItem: NavigationItem = {
      ...item,
      title: localizeTitle(item, locale),
    };

    if (item.subitems) {
      localizedItem.subitems = item.subitems.map((subitem) => ({
        ...subitem,
        title: localizeSubitemTitle(subitem.slug, subitem.title, locale),
      }));
    }

    return localizedItem;
  });
}
