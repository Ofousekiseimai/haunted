// categories.js
export const CATEGORY_CONFIG = {
    laografia: {
      path: '/laografia',
      dataPath: '/data/laografia/',
      indexComponent: 'Laografia',
      category: 'laografia' // Special component for index
    },
    prosopa: {
      path: '/prosopa',
      dataPath: '/data/prosopa/',
      indexComponent: 'Prosopa' 
    },
    efimerides: {
      path: '/efimerides',
      dataPath: '/data/efimerides/',
      indexComponent: 'Efimerides' 
    },
    entipa: {
      path: '/entipa',
      dataPath: '/data/entipa/',
      indexComponent: 'Entipa' 
    }
  };
  
  // categories.js
  export const SUBCATEGORY_MAP = {
    // Main categories
  
     
    
    
  
    // Λαογραφία Subcategories
    'aerika': { 
      displayName: 'Αερικά',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τα Αερικά ",
      category: 'laografia', 
      slug: 'aerika',
      image: {
        src: '/images/katigories/aerika.webp',
        alt: 'Αερικά '
      }
    },
    'daimones': { 
      displayName: 'Δαίμονες',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τους Δαίμονες και τις Δαιμονικές οντότητες",
      category: 'laografia', 
      slug: 'daimones',
      image: {
        src: '/images/katigories/daimones.webp',
        alt: 'Δαίμονες'
      }
    },
    'drakospita': { 
      displayName: 'Δρακόσπιτα',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τα Δρακόσπιτα",
      category: 'laografia', 
      slug: 'drakospita',
      image: {
        src: '/images/katigories/drakospita.webp',
        alt: 'Δρακόσπιτα'
      }
    },
    'drakontes': { 
      displayName: 'Δράκοντες',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Δράκοντες, Δρακονοκτόνους και Δρακομαχίες",
      category: 'laografia', 
      slug: 'drakontes',
      image: {
        src: '/images/katigories/drakontes.webp',
        alt: 'Δρακοντες '
      }
    },
    
    
    'giteies': { 
      displayName: 'Γητείες',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Γητείες και μαγικές πρακτικές",
      category: 'laografia', 
      slug: 'giteies',
      image: {
        src: '/images/katigories/giteies.webp',
        alt: 'Γητείες'
      }
    },
    
    'gigantes': {
      displayName: 'Γίγαντες',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Γίγαντες",
      category: 'laografia', 
      slug: 'gigantes',
      image: {
        src: '/images/katigories/gigantes.webp',
        alt: 'Γίγαντες'
      }
    },

      
    'limnes': {
      displayName: 'Λίμνες - Ποταμοί',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Λίμνες, Ποταμούς και Πλάσματα",
      category: 'laografia', 
      slug: 'limnes',
      image: {
        src: '/images/katigories/limnes.webp',
        alt: 'Λίμνες'
      }
    },
    
    'kalikatzaroi': { 
      displayName: 'Καλικάντζαροι',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τους Καλικάντζαρους, τα έθιμα, την αποτροπή και την καταπολέμηση τους",
      category: 'laografia', 
      slug: 'kalikatzaroi',
      image: {
        src: '/images/katigories/kalikatzaroi.webp',
        alt: 'Καλικάντζαροι'
      }
    },
    'ksotika': { 
      displayName: 'Ξωτικά',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Ξωτικά απο όλη την Ελλάδα ",
      category: 'laografia', 
      slug: 'ksotika',
      image: {
        src: '/images/katigories/ksotika.webp',
        alt: 'Ξωτικά'
      }
    },
    'lamies': { 
      displayName: 'Λαμιές - Στρίγκλες',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Λαμιές στην Ελληνική ύπαιθρο",
      category: 'laografia', 
      slug: 'lamies',
      image: {
        src: '/images/katigories/lamies.webp',
        alt: 'Λαμιές Στρίγκλες'
      }
    
    },
    'moires': { 
      displayName: 'Μοίρες',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τις Μοίρες και την πίστη γύρω απο αυτές",
      category: 'laografia', 
      slug: 'moires',
      image: {
        src: '/images/katigories/moires.webp',
        alt: 'Μοίρες'
      }
    },
    'neraides': { 
      displayName: 'Νεράιδες',
      description: "Παραδόσεις, Αφηγήσεις και Διηγήσεις που σχετίζονται με τις Νεράιδες και την επαφή ανθρώπων με αυτές. ",
      category: 'laografia', 
      slug: 'neraides',
      image: {
        src: '/images/katigories/neraides.webp',
        alt: 'Νεράιδες'
      }
    },
    'vrikolakes': { 
      displayName: 'Βρυκόλακες',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με τους Βρυκόλακες, τα έθιμα και την αποτροπή τους",
      category: 'laografia', 
      slug: 'vrikolakes',
      image: {
        src: '/images/katigories/vrikolakes.webp',
        alt: 'Βρυκόλακες'
      }
    },
    'stoixeia': { 
      category: 'laografia', 
      displayName: 'Στοιχειά',
      description: "Παραδόσεις, Αφηγήσεις και Ερμηνείες που σχετίζονται με τα Στοιχειά στην Ελληνική ύπαιθρο",
      slug: 'stoixeia',
      image: {
        src: '/images/katigories/stoixeia.webp',
        alt: 'Στοιχειά'
      } 
      
    },
    
    'telonia': { 
      displayName: 'Τελώνια',
      description: "Παραδόσεις, Αφηγήσεις και Ερμηνείες που σχετίζονται με τα Τελώνια ",
      category: 'laografia', 
      slug: 'telonia',
      image: {
        src: '/images/katigories/telonia.webp',
        alt: 'Τελώνια'
      } 
      
    },
    'fylakta': { 
      displayName: 'Φυλακτά',
      description: "Παραδόσεις, Αφηγήσεις και Μύθοι που σχετίζονται με Φυλακτά και μαγικά αντικείμενα",
      category: 'laografia', 
      slug: 'fylakta',
      image: {
        src: '/images/katigories/fylakta.webp',
        alt: 'Φυλακτά'
      }
    },
    'xamodrakia': { 
      displayName: 'Χαμοδράκια - Σμερδάκια',
      description: "Παραδόσεις, Αφηγήσεις και Ερμηνείες που σχετίζονται με τα Χαμοδράκια και τα Σμερδάκια",
      category: 'laografia', 
      slug: 'xamodrakia',
      image: {
        src: '/images/katigories/xamodrakia.webp',
        alt: 'Χαμοδράκια - Σμερδάκια'
      }
      
    },
 
'zoudiaredes': { 
  category: 'laografia', 
  displayName: 'Ζουδιάρηδες - Γητευτές',
  description: "Παραδόσεις για τους Ζουδιάρηδες, τους Έλληνες Γητευτές που καταπολεμούν υπερφυσικά όντα",
  slug: 'zoudiaredes',
  image: {
    src: '/images/katigories/zoudiaredes.webp',
    alt: 'Ζουδιάρηδες - Γητευτές'
  }
},
    // Εφημερίδες Subcategories
    'satanismos': { 
      displayName: 'Σατανισμός',
      description: "Σατανισμός, Σατανιστικές τελετές και Εγκλήματα απο όλη την Ελλάδα",
      category: 'efimerides', 
      slug: 'satanismos',
      image: {
        src: '/images/katigories/satanismos.webp',
        alt: 'Σατανισμός'
      }
    },
    'mageia': { 
      displayName: 'Μαγεία',
      description: "Μαγεία, Μαγικές τελετές και Εγκλήματα απο όλη την Ελλάδα",
      category: 'efimerides', 
      slug: 'mageia',
      image: {
        src: '/images/katigories/mageia.webp',
        alt: 'Μαγεία'
      }
    },
    'egklimata': { 
      displayName: 'Εγκλήματα',
      description: "Εγκλήματα και εγκληματικές ενέργειες που σχετίζονται με το Μεταφυσικό",
      category: 'efimerides', 
      slug: 'egklimata',
      image: {
        src: '/images/katigories/egklimata.webp',
        alt: 'Εγκλήματα'
      }
    },
    'emfaniseis-panagias': { 
      displayName: 'Εμφανίσεις Παναγίας',
      description: "Παράξενες καταγεγραμένες εμφανίσεις Παναγίας και άλλων Αγίων στην Ελλάδα",
      category: 'efimerides', 
      slug: 'emfaniseis-panagias',
      image: {
        src: '/images/katigories/emfaniseis-panagias.webp',
        alt: 'Εμφανίσεις Παναγίας'
      }
    },
    'teletes': { 
      displayName: 'Τελετές',
      description: "Ίχνη Τελετών και Μαγείας στην Ελλάδα",
      category: 'efimerides', 
      slug: 'teletes',
      image: {
        src: '/images/katigories/teletes.webp',
        alt: 'Τελετές'
      }
    },
    'lithovroxes': {
      displayName: 'Λιθοβροχές',
      description: "Λιθοβροχές και άλλες παράξενες βροχές στην Ελλάδα",
      category: 'efimerides', 
      slug: 'lithovroxes',
      image: {
        src: '/images/katigories/lithovroxes.webp',
        alt: 'Λιθοβροχές'
      }
    },
    'fainomena': {
      displayName: 'Φαινόμενα',
      description: "Παράξενα Φαινόμενα μέσα απο αρχείο Εφημερίδων στην Ελλάδα",
      category: 'efimerides', 
      slug: 'fainomena',
      image: {
        src: '/images/katigories/fainomena.webp',
        alt: 'Φαινόμενα'
      }
    },
    
    'medium': {
      displayName: 'Μέντιουμ - Τηλεκίνηση - Eταιρία Ψυχικών Ερευνών',
      description: "Το έργο της Εταιριας Ψυχικών Ερευνών Ελλάδας - Μέντιουμ, Τηλεκινητικά φαινόμενα, Φαινόμενα Τηλεπάθειας κ.α, μέσα απο αρχείο Εφημερίδων στην Ελλάδα",
      category: 'efimerides', 
      slug: 'medium',
      image: {
        src: '/images/katigories/medium.webp',
        alt: 'Μέντιουμ - Τηλεκίνηση - Eταιρία Ψυχικών Ερευνών'
      }
    },
    // Πρόσωπα Subcategories
   
  };
  
  export const getRouteConfig = (pathSegments) => {
    const [mainCategory, subcategory] = pathSegments;
    
    // Check for main category index
    if (CATEGORY_CONFIG[mainCategory] && !subcategory) {
      return {
        ...CATEGORY_CONFIG[mainCategory],
        isIndex: true,
        subcategory: ''
      };
    }
  
    // Check for mapped subcategory
    const mappedSub = SUBCATEGORY_MAP[subcategory || mainCategory];
    if (mappedSub) {
      return {
        ...CATEGORY_CONFIG[mappedSub.category],
        subcategory: mappedSub.slug,
        isIndex: false
      };
    }
  
    return null;
  };