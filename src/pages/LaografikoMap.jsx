import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import GreeceMap from '../components/GreeceMap';
import { useLocation } from 'react-router-dom';
import aerikaData from '../data/laografia/aerika.json';
import daimonesData from '../data/laografia/daimones.json';
import drakospitaData from '../data/laografia/drakospita.json';
import fylaktaData from '../data/laografia/fylakta.json';
import kalikatzaroiData from '../data/laografia/kalikatzaroi.json';
import giteiesData from '../data/laografia/giteies.json';
import ksotikaData from '../data/laografia/ksotika.json';
import lamiesData from '../data/laografia/lamies.json';
import moiresData from '../data/laografia/moires.json';
import neraidesData from '../data/laografia/neraides.json';
import vrikolakesData from '../data/laografia/vrikolakes.json';
import gigantesData from '../data/laografia/gigantes.json'; 
import limnesData from '../data/laografia/limnes.json';
import drakontesData from '../data/laografia/drakontes.json';
import stoixeiaData from '../data/laografia/stoixeia.json';
import xamodrakiaData from '../data/laografia/xamodrakia.json';
import teloniaData from '../data/laografia/telonia.json';
import zoudiaredesData from '../data/laografia/zoudiaredes.json'


const filterOptions = {
  all: 'Όλες οι Κατηγορίες',
  
  aerika: 'Αερικά',
  vrikolakes: 'Βρυκόλακες',
  gigantes: 'Γίγαντες',
  giteies: 'Γητείες - Ξόρκια',
  zoudiaredes: " Γητευτές - Ζουδιάρηδες",
   daimones: 'Δαίμονες',
  drakospita: 'Δρακόσπιτα',
  drakontes: 'Δράκοντες',
   kalikatzaroi: 'Καλικάντζαροι',
  lamies: 'Λάμιες - Στρίγκλες',
  limnes: 'Λίμνες- Ποταμοί',
  moires: 'Μοίρες',
  neraides: 'Νεράιδες',
  ksotika: 'Ξωτικά',
  stoixeia: 'Στοιχεία',
  telonia: 'Τελώνια',
   fylakta: 'Φυλακτά',
    xamodrakia: 'Χαμοδράκια-Σμερδάκια',
    
};




const MapPage = () => {
  // State variables
  const [articles, setArticles] = useState([]);
    const [selectedMainArea, setSelectedMainArea] = useState('all');
  const [selectedSubLocation, setSelectedSubLocation] = useState('all');
  const [availableMainAreas, setAvailableMainAreas] = useState(['all']);
  const [availableSubLocations, setAvailableSubLocations] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(
    location.state?.subcategory || 'all'
  );


  useEffect(() => {
    const loadArticles = () => {
      try {
        const allData = {
          
          aerika: aerikaData,
          daimones: daimonesData,
          drakospita: drakospitaData,
            fylakta: fylaktaData,
          kalikatzaroi: kalikatzaroiData,
          giteies: giteiesData,
          ksotika: ksotikaData,
          lamies: lamiesData,
          moires: moiresData,
          neraides: neraidesData,
          vrikolakes: vrikolakesData,
          gigantes: gigantesData,
          limnes: limnesData,
          drakontes: drakontesData,
          stoixeia: stoixeiaData,
          xamodrakia: xamodrakiaData,
          telonia: teloniaData,
          zoudiaredes: zoudiaredesData,
          
        };

       
        const fetchedArticles = Object.entries(allData).flatMap(([subcat, data]) =>
          data.articles.map(article => {
            const lat = parseFloat(article.lat);
            const lng = parseFloat(article.lng);
            
            return {
              ...article,
              subcategory: subcat,
              lat: lat,
              lng: lng,
              imageUrl: article.image?.src || '/default-image.webp', // Access nested image object
              mainArea: article.mainArea?.trim() || '',
              subLocation: [
                article.subLocation?.trim(), 
                article.subLocation2?.trim()
              ].filter(Boolean)
            };
          })
        ).filter(article => 
      !isNaN(article.lat) && 
      !isNaN(article.lng) &&
      article.lat >= 34.8 &&
      article.lat <= 41.7 &&
      article.lng >= 19.4 &&
      article.lng <= 29.6
    );

    setArticles(fetchedArticles);
    setLoading(false);
  } catch (err) {
    console.error('Error loading articles:', err);
    setError('Πρόβλημα φόρτωσης δεδομένων. Παρακαλώ δοκιμάστε ξανά αργότερα.');
    setLoading(false);
  }
};
if (location.state?.subcategory){
  setSelectedCategory(location.state.subcategory);
}
    loadArticles();
  
  }, [location.state]);

  
 // Update available main areas when category changes
useEffect(() => {
  const filteredByCategory = articles.filter(article => 
    selectedCategory === 'all' || article.subcategory === selectedCategory
  );
  
  const mainAreas = ['all', ...new Set(
    filteredByCategory.map(a => a.mainArea).filter(a => a)
  )].sort((a, b) => a.localeCompare(b));

  setAvailableMainAreas(mainAreas);
  setSelectedMainArea('all'); // Reset main area when category changes
}, [selectedCategory, articles]);

// Update available sublocations when main area changes
useEffect(() => {
  const filtered = articles.filter(article => 
    (selectedCategory === 'all' || article.subcategory === selectedCategory) &&
    (selectedMainArea === 'all' || article.mainArea === selectedMainArea)
  );

  const subLocations = ['all', ...new Set(
    filtered.flatMap(a => a.subLocation).filter(a => a)
  )].sort((a, b) => a.localeCompare(b));

  setAvailableSubLocations(subLocations);
  setSelectedSubLocation('all'); // Reset sublocation when main area changes
}, [selectedMainArea, selectedCategory, articles]);


const filteredArticles = articles.filter(article => {
  const categoryMatch = selectedCategory === 'all' || article.subcategory === selectedCategory;
  const mainAreaMatch = selectedMainArea === 'all' || article.mainArea === selectedMainArea;
  const subLocationMatch = selectedSubLocation === 'all' || 
                         article.subLocation.includes(selectedSubLocation);
  
  return categoryMatch && mainAreaMatch && subLocationMatch;
});



  const targetBounds = useMemo(() => {
    if (filteredArticles.length > 0) {
      const latitudes = filteredArticles.map(article => article.lat);
      const longitudes = filteredArticles.map(article => article.lng);
      
      return [
        [Math.min(...latitudes), Math.min(...longitudes)],  // SW corner
        [Math.max(...latitudes), Math.max(...longitudes)]   // NE corner
      ];
    }
    return null;
  }, [filteredArticles]);

  

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500 ">
        <h2 className="text-2xl font-bold mb-4">Σφάλμα</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64 ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        <span className="ml-4">Φόρτωση χάρτη...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4  ">
      <Helmet>
        <title>Διαδραστικός Λαογραφικός Χάρτης </title>
        <meta
          name="description"
          content="Διαδραστικός χάρτης με λαογραφικές αφηγήσεις και ιστορικά άρθρα από όλη την Ελλάδα"
        />
      </Helmet>

      <header className="mb-8 ">
        <h1 className="text-3xl font-bold text-gray-100 mt-4 ">Διαδραστικός Λαογραφικός Χάρτης</h1>
        <p className="mt-2 text-gray-300">Περιήγηση στα άρθρα ανά γεωγραφική θέση και θεματολογία</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 dropdowns-container ">
  {/* Existing category select */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
     (1) Κατηγορία
    </label>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500"
    >
      {Object.entries(filterOptions).map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  </div>

  {/* Main Area select */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
     (2) Ευρύτερη περιοχή
    </label>
    <select
      value={selectedMainArea}
      onChange={(e) => setSelectedMainArea(e.target.value)}
      className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500"
    >
      {availableMainAreas.map(area => (
        <option key={area} value={area}>
          {area === 'all' ? 'Όλες οι ευρείς περιοχές' : area}
        </option>
      ))}
    </select>
  </div>

  {/* Sub Location select */}
  
</div>

        <div className="mt-4 text-gray-400 text-sm">
          Εμφανίζονται {filteredArticles.length} από {articles.length} συνολικά άρθρα
        </div>
      </header>

     
       
      <GreeceMap 
        articles={filteredArticles} 
        targetBounds={targetBounds}
      />
    </div>
  
  );
};

export default MapPage;