

export const navigation = [
  {
    id: '0',
    title: ' Αρχική',
    url: '/',
    onlyMobile: false
  },
  {
    id: '1',
    title: 'Παραδοσεις',
    url: '/laografia',
    subitems: [
      { 
        slug: 'all', 
        title: 'Όλα', 
        url: '/laografia' 
      },
      { 
        slug: 'aerika', 
        title: 'Αερικά',
        url: '/laografia/aerika'  
         
      },
      { 
        slug: 'vrikolakes', 
        title: 'Βρυκόλακες', 
        url: '/laografia/vrikolakes' 
      },
      
      
      
      { 
        slug: 'zoudiaredes', 
        title: 'Ζουδιάρηδες - Σαββατιανοί', 
        url: '/laografia/zoudiaredes' 
      },
      { 
        slug: 'gigantes', 
        title: 'Γιγαντες',
        url: '/laografia/gigantes'  
         
      },
      { 
        slug: 'daimones', 
        title: 'Δαίμονες', 
        url: '/laografia/daimones' 
      },
      { 
        slug: 'drakospita', 
        title: 'Δρακόσπιτα', 
        url: '/laografia/drakospita' 
      },
      { 
        slug: 'drakontes', 
        title: 'Δράκοντες', 
        url: '/laografia/drakontes' 
      },
      
      { 
        slug: 'neraides', 
        title: 'Νεράιδες', 
        url: '/laografia/neraides' 
      },
      { 
        slug: 'kalikatzaroi', 
        title: 'Καλικάντζαροι',  
        url: '/laografia/kalikatzaroi' 
      },
      { 
        slug: 'ksotika', 
        title: 'Ξωτικά',
        url: '/laografia/ksotika'  
         
      },
      { 
        slug: 'lamies', 
        title: 'Λάμιες - Στρίγκλες',
        url: '/laografia/lamies'         
      },
      { 
        slug: 'limnes',
        title: 'Λίμνες - Ποταμοι',
        url: '/laografia/limnes' 
              
      },
      { 
        slug: 'moires', 
        title: 'Μοίρες',
        url: '/laografia/moires'         
      },
              
     
      
      { 
        slug: 'stoixeia', 
        title: 'Στοιχειά - Στοιχειώματα',
        url: '/laografia/stoixeia'
          
         
      },
      { 
        slug: 'telonia', 
        title: 'Τελώνια',
        url: '/laografia/telonia'
          
         
      },
      { 
        slug: 'fantasmata', 
        title: 'Φαντάσματα',
        url: '/laografia/fantasmata'
        
          
         
      },

      { 
        slug: 'xamodrakia', 
        title: 'Χαμοδράκια - Σμερδάκια',
        url: '/laografia/xamodrakia'
        
          
         
      },
    ]
  },
  {
    id: '2', // New ID for the new category
    title: 'Εταιρία Ψυχικών Ερευνών',
    url: '/etaireia-psychikon-ereynon',
    subitems: [
      { 
        slug: 'all', 
        title: 'Όλα', 
        url: '/etaireia-psychikon-ereynon' 
      },
      { 
        slug: 'fainomena', 
        title: 'Φαινόμενα - Ερευνες', 
        url: '/etaireia-psychikon-ereynon/erevnes-fainomena' 
      },
      { 
        slug: 'medium-etaireias', 
        title: 'Τα Μέντιουμ της Εταιρίας', 
        url: '/etaireia-psychikon-ereynon/medium-etaireias' 
      },
      { 
        slug: 'arthra-dialexeis', 
        title: 'Άρθρα - Διαλέξεις', 
        url: '/etaireia-psychikon-ereynon/arthra-dialexeis' 
      },
      { 
        slug: 'peiramata', 
        title: 'Πειράματα', 
        url: '/etaireia-psychikon-ereynon/peiramata' 
      }
    ]
  },
  {
    id: '3',
    title: 'Εφημερίδες',
    url: '/efimerides',
    subitems: [
      { 
        slug: 'all', 
        title: 'Όλα', 
        url: '/efimerides' 
      },
      { 
        slug: 'egklimata', 
        title: 'Εγκλήματα', 
        url: '/efimerides/egklimata' 
      },
      
              
      { 
        slug: 'mageia', 
        title: 'Μαγεία', 
        url: '/efimerides/mageia' 
      },
      { 
        slug: 'teletes', 
        title: 'Τελετές',
        url: '/efimerides/teletes' 
      },
      { 
        slug: 'satanismos', 
        title: 'Σατανισμός', 
        url: '/efimerides/satanismos' 
      },
      { 
        slug: 'fainomena', 
        title: 'Φαινόμενα',
        url: '/efimerides/fainomena',
       
      },
      
         
    ]
  },
  
  {
    id: '4',
    title: 'Χάρτες',
    url: '/map2',
    subitems: [
      
      { 
        slug: 'Χάρτης Λαογραφίας', 
        title: 'Χάρτης Λαογραφίας', 
        url: '/map2' 
      },
      { 
        slug: 'Χάρτης Εφημερίδων', 
        title: 'Χάρτης Εφημερίδων', 
        url: '/map' 
      }
      
    ]
  },
  {
    id: '5',
    title: 'Σχετικά',
    url: '/about',
    subitems: [
      { 
        slug: 'about-us', 
        title: 'Σχετικά με εμάς', 
        url: '/about-us' 
      },
      { 
        slug: 'terms-and-conditions', 
        title: 'Όροι Χρήσης & Προϋποθέσεις', 
        url: '/terms' 
      },
      { 
        slug: 'privacy-policy', 
        title: 'Πολιτική Απορρήτου', 
        url: '/privacy' 
      }
      
    ]
   
  }
  
];





