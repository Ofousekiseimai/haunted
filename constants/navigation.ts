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

export const navigation: NavigationItem[] = [
  {
    id: "0",
    title: "Αρχική",
    url: "/",
  },
  {
    id: "1",
    title: "Παραδόσεις",
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
    title: "Εταιρία Ψυχικών Ερευνών",
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
    title: "Εφημερίδες",
    url: "/efimerides",
    subitems: [
      { slug: "all", title: "Όλα", url: "/efimerides" },
      { slug: "egklimata", title: "Εγκλήματα", url: "/efimerides/egklimata" },
      { slug: "mageia", title: "Μαγεία", url: "/efimerides/mageia" },
      { slug: "teletes", title: "Τελετές", url: "/efimerides/teletes" },
      { slug: "satanismos", title: "Σατανισμός", url: "/efimerides/satanismos" },
      { slug: "fainomena", title: "Φαινόμενα", url: "/efimerides/fainomena" },
    ],
  },
  {
    id: "4",
    title: "Χάρτες",
    url: "/map2",
    subitems: [
      { slug: "laografia-map", title: "Χάρτης Λαογραφίας", url: "/map2" },
      { slug: "efimerides-map", title: "Χάρτης Εφημερίδων", url: "/map" },
    ],
  },
  {
    id: "5",
    title: "Σχετικά",
    url: "/about-us",
  },
  {
    id: "6",
    title: "Αναζήτηση",
    url: "/search",
  },
];
