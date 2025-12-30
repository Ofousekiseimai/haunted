export interface CategoryConfig {
  path: string;
  dataPath: string;
  indexComponent: string;
  category: string;
}

export interface SubcategoryImage {
  src: string;
  alt?: string;
}

export interface SubcategoryConfig {
  displayName: string;
  description?: string;
  category: string;
  slug: string;
  image?: SubcategoryImage;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  laografia: {
    path: "/laografia",
    dataPath: "/data/laografia/",
    indexComponent: "Laografia",
    category: "laografia",
  },
  "etaireia-psychikon-ereynon": {
    path: "/etaireia-psychikon-ereynon",
    dataPath: "/data/etaireia-psychikon-ereynon/",
    indexComponent: "EtaireiaPsychikonEreynon",
    category: "etaireia-psychikon-ereynon",
  },
  prosopa: {
    path: "/prosopa",
    dataPath: "/data/prosopa/",
    indexComponent: "Prosopa",
    category: "prosopa",
  },
  efimerides: {
    path: "/efimerides",
    dataPath: "/data/efimerides/",
    indexComponent: "Efimerides",
    category: "efimerides",
  },
  entipa: {
    path: "/entipa",
    dataPath: "/data/entipa/",
    indexComponent: "Entipa",
    category: "entipa",
  },
};

export const SUBCATEGORY_MAP: Record<string, SubcategoryConfig> = {
  aerika: {
    displayName: "Αερικά",
    description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τα Αερικά ",
    category: "laografia",
    slug: "aerika",
    image: {
      src: "/images/katigories/aerika.webp",
      alt: "Αερικά ",
    },
  },
  daimones: {
    displayName: "Δαίμονες",
    description:
      "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τους Δαίμονες και τις Δαιμονικές οντότητες",
    category: "laografia",
    slug: "daimones",
    image: {
      src: "/images/katigories/daimones.webp",
      alt: "Δαίμονες",
    },
  },
  drakospita: {
    displayName: "Δρακόσπιτα",
    description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τα Δρακόσπιτα",
    category: "laografia",
    slug: "drakospita",
    image: {
      src: "/images/katigories/drakospita.webp",
      alt: "Δρακόσπιτα",
    },
  },
  drakontes: {
    displayName: "Δράκοντες",
    description:
      "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Δράκοντες, Δρακονοκτόνους και Δρακομαχίες",
    category: "laografia",
    slug: "drakontes",
    image: {
      src: "/images/katigories/drakontes.webp",
      alt: "Δρακοντες ",
    },
  },
  gigantes: {
    displayName: "Γίγαντες",
    description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Γίγαντες",
    category: "laografia",
    slug: "gigantes",
    image: {
      src: "/images/katigories/gigantes.webp",
      alt: "Γίγαντες",
    },
  },
  limnes: {
    displayName: "Λίμνες - Ποταμοί",
    description:
      "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Λίμνες, Ποταμούς και Πλάσματα",
    category: "laografia",
    slug: "limnes",
    image: {
      src: "/images/katigories/limnes.webp",
      alt: "Λίμνες",
    },
  },
  kalikatzaroi: {
    displayName: "Καλικάντζαροι",
    description:
      "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τους Καλικάντζαρους, τα έθιμα, την αποτροπή και την καταπολέμηση τους",
    category: "laografia",
    slug: "kalikatzaroi",
    image: {
      src: "/images/katigories/kalikatzaroi.webp",
      alt: "Καλικάντζαροι",
    },
  },
  ksotika: {
    displayName: "Ξωτικά",
    description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Ξωτικά απο όλη την Ελλάδα ",
    category: "laografia",
    slug: "ksotika",
    image: {
      src: "/images/katigories/ksotika.webp",
      alt: "Ξωτικά",
    },
  },
  lamies: {
    displayName: "Λαμιές - Στρίγκλες",
    description:
      "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Λαμιές στην Ελληνική ύπαιθρο",
    category: "laografia",
    slug: "lamies",
    image: {
      src: "/images/katigories/lamies.webp",
      alt: "Λαμιές Στρίγκλες",
    },
  },
  moires: {
    displayName: "Μοίρες",
    description:
      "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τις Μοίρες και την πίστη γύρω απο αυτές",
    category: "laografia",
    slug: "moires",
    image: {
      src: "/images/katigories/moires.webp",
      alt: "Μοίρες",
    },
  },
  neraides: {
    displayName: "Νεράιδες",
    description:
      "Παραδόσεις, Αφηγήσεις και Διηγήσεις που σχετίζονται με τις Νεράιδες και την επαφή ανθρώπων με αυτές. ",
    category: "laografia",
    slug: "neraides",
    image: {
      src: "/images/katigories/neraides.webp",
      alt: "Νεράιδες",
    },
  },
  vrikolakes: {
    displayName: "Βρυκόλακες",
    description:
      "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τους Βρυκόλακες, τα έθιμα και την αποτροπή τους",
    category: "laografia",
    slug: "vrikolakes",
    image: {
      src: "/images/katigories/vrikolakes.webp",
      alt: "Βρυκόλακες",
    },
  },
  stoixeia: {
    category: "laografia",
    displayName: "Στοιχειά",
    description:
      "Παραδόσεις, Αφηγήσεις και Ερμηνείες που σχετίζονται με τα Στοιχειά στην Ελληνική ύπαιθρο",
    slug: "stoixeia",
    image: {
      src: "/images/katigories/stoixeia.webp",
      alt: "Στοιχειά",
    },
  },
  telonia: {
    displayName: "Τελώνια",
    description: "Παραδόσεις, Αφηγήσεις και Ερμηνείες που σχετίζονται με τα Τελώνια ",
    category: "laografia",
    slug: "telonia",
    image: {
      src: "/images/katigories/telonia.webp",
      alt: "Τελώνια",
    },
  },
  fantasmata: {
    displayName: "Φαντάσματα",
    description:
      "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Φαντάσματα στον Ελληνικό χώρο",
    category: "laografia",
    slug: "fantasmata",
    image: {
      src: "/images/katigories/fantasmata.webp",
      alt: "Φαντάσματα",
    },
  },
  xamodrakia: {
    displayName: "Χαμοδράκια - Σμερδάκια",
    description:
      "Παραδόσεις, Αφηγήσεις και Ερμηνείες που σχετίζονται με τα Χαμοδράκια και τα Σμερδάκια",
    category: "laografia",
    slug: "xamodrakia",
    image: {
      src: "/images/katigories/xamodrakia.webp",
      alt: "Χαμοδράκια - Σμερδάκια",
    },
  },
  zoudiaredes: {
    category: "laografia",
    displayName: "Ζουδιάρηδες - Σαββατιανοί",
    description:
      "Παραδόσεις για τους Ζουδιάρηδες, τους Έλληνες Γητευτές που καταπολεμούν υπερφυσικά όντα",
    slug: "zoudiaredes",
    image: {
      src: "/images/katigories/zoudiaredes.webp",
      alt: "Ζουδιάρηδες - Σαββατιανοί",
    },
  },
  satanismos: {
    displayName: "Σατανισμός",
    description: "Σατανισμός, Σατανιστικές τελετές και Εγκλήματα απο όλη την Ελλάδα",
    category: "efimerides",
    slug: "satanismos",
    image: {
      src: "/images/katigories/satanismos.webp",
      alt: "Σατανισμός",
    },
  },
  mageia: {
    displayName: "Μαγεία",
    description: "Μαγεία, Μαγικές τελετές και Εγκλήματα απο όλη την Ελλάδα",
    category: "efimerides",
    slug: "mageia",
    image: {
      src: "/images/katigories/mageia.webp",
      alt: "Μαγεία",
    },
  },
  egklimata: {
    displayName: "Εγκλήματα",
    description: "Εγκλήματα και εγκληματικές ενέργειες που σχετίζονται με το Μεταφυσικό",
    category: "efimerides",
    slug: "egklimata",
    image: {
      src: "/images/katigories/egklimata.webp",
      alt: "Εγκλήματα",
    },
  },
  teletes: {
    displayName: "Τελετές",
    description: "Ίχνη Τελετών και Μαγείας στην Ελλάδα",
    category: "efimerides",
    slug: "teletes",
    image: {
      src: "/images/katigories/teletes.webp",
      alt: "Τελετές",
    },
  },
  fainomena: {
    displayName: "Φαινόμενα",
    description: "Παράξενα Φαινόμενα μέσα απο αρχείο Εφημερίδων στην Ελλάδα",
    category: "efimerides",
    slug: "fainomena",
    image: {
      src: "/images/katigories/fainomena.webp",
      alt: "Φαινόμενα",
    },
  },
  pnevmatismos: {
    displayName: "Πνευματισμός",
    description: "Δημοσιεύματα για πνευματισμό και την επικοινωνία με τους νεκρούς στον ελληνικό Τύπο",
    category: "efimerides",
    slug: "pnevmatismos",
    image: {
      src: "/images/efimerides/epikoinonia-me-nekrous-1935.webp",
      alt: "Πνευματισμός",
    },
  },
  "erevnes-fainomena": {
    displayName: "Φαινόμενα - Ερευνες",
    description:
      "Τηλεκίνηση, ψυχοκίνηση και παραψυχικά φαινόμενα που μελετήθηκαν από την Εταιρία Ψυχικών Ερευνών",
    category: "etaireia-psychikon-ereynon",
    slug: "erevnes-fainomena",
    image: {
      src: "/images/katigories/telekinetika.webp",
      alt: "Φαινόμενα - Ερευνες",
    },
  },
  "medium-etaireias": {
    displayName: "Τα Μέντιουμ της Εταιρίας",
    description: "Τα μέντιουμ της Εταιρία Ψυχικών Ερευνών",
    category: "etaireia-psychikon-ereynon",
    slug: "medium-etaireias",
    image: {
      src: "/images/katigories/medium-etaireias.webp",
      alt: "Tα Μέντιουμ της Εταιρίας",
    },
  },
  "arthra-dialexeis": {
    displayName: "Άρθρα - Διαλέξεις",
    description: "Επιστημονικά άρθρα, διαλέξεις και δημοσιεύσεις της Εταιρίας Ψυχικών Ερευνών",
    category: "etaireia-psychikon-ereynon",
    slug: "arthra-dialexeis",
    image: {
      src: "/images/katigories/arthra-dialexeis.webp",
      alt: "Άρθρα - Διαλέξεις",
    },
  },
  peiramata: {
    displayName: "Πειράματα",
    description: "Επιστημονικά πειράματα που πραγματοποίησε η Εταιρία Ψυχικών Ερευνών",
    category: "etaireia-psychikon-ereynon",
    slug: "peiramata",
    image: {
      src: "/images/katigories/peiramata.webp",
      alt: "Πειράματα",
    },
  },
};

export function getRouteConfig(pathSegments: string[]) {
  const [mainCategory, subcategory] = pathSegments;

  if (CATEGORY_CONFIG[mainCategory] && !subcategory) {
    return {
      ...CATEGORY_CONFIG[mainCategory],
      isIndex: true,
      subcategory: "",
    };
  }

  const mappedSub = SUBCATEGORY_MAP[subcategory ?? mainCategory];
  if (mappedSub) {
    return {
      ...CATEGORY_CONFIG[mappedSub.category],
      subcategory: mappedSub.slug,
      isIndex: false,
    };
  }

  return null;
}

export function getSubcategoriesForCategory(categoryKey: string) {
  return Object.entries(SUBCATEGORY_MAP)
    .filter(([, value]) => value.category === categoryKey)
    .map(([slug, value]) => {
      const { slug: existingSlug, ...rest } = value;
      return {
        slug: existingSlug ?? slug,
        ...rest,
      };
    });
}
