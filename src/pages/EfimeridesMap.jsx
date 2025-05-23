import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import GreeceMap from '../components/GreeceMap';
import satanismosData from '../data/efimerides/satanismos.json';
import mageiaData from '../data/efimerides/mageia.json';
import egklimataData from '../data/efimerides/egklimata.json';
import teletesData from '../data/efimerides/teletes.json';
import lithovroxesData from '../data/efimerides/lithovroxes.json';
import fainomenaData from '../data/efimerides/fainomena.json';
import mediumData from '../data/efimerides/medium.json';
import panagiaData from '../data/efimerides/emfaniseis-panagias.json';

const filterOptions = {
  all: 'Όλες οι Κατηγορίες',
  satanismos: 'Σατανισμός',
  
  egklimata: 'Εγκλήματα',
  panagia: "Εμφανίσεις Παναγίας - Οράματα",
  medium: 'Εταιρία Ψυχικών Ερευνών - Μέντιουμ',
  lithovroxes: 'Λιθοβροχές',
  mageia: 'Μαγεία',
  teletes: 'Τελετές',
  fainomena: 'Φαινόμενα'
 
};



const EfimeridesMap = () => {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [uniqueLocations, setUniqueLocations] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableLocations, setAvailableLocations] = useState(['all']);
  useEffect(() => {
    const loadArticles = () => {
      try {
        const allData = {
          satanismos: satanismosData,
          mageia: mageiaData,
          egklimata: egklimataData,
          teletes: teletesData,
          lithovroxes: lithovroxesData,
          fainomena: fainomenaData,
          medum: mediumData,
          panagia: panagiaData,
        };

        const fetchedArticles = Object.entries(allData).flatMap(([subcat, data]) =>
          data.articles.map(article => {
            // Validate coordinates
            const lat = parseFloat(article.lat);
            const lng = parseFloat(article.lng);
            
            return {
              ...article,
              subcategory: subcat,
              lat: lat,
              lng: lng,
               imageUrl: article.image?.src || '/default-image.webp', // Add this line
              locationTags: Array.isArray(article.locationTags) 
                ? article.locationTags.map(tag => String(tag).trim()) 
                : [String(article.locationTags).trim()]
            };
          })
        ).filter(article => 
          !isNaN(article.lat) && 
          !isNaN(article.lng) &&
          article.lat >= 34.8 &&  // Southern Greece
          article.lat <= 41.7 &&  // Northern Greece
          article.lng >= 19.4 &&  // Western Greece
          article.lng <= 29.6     // Eastern Greece
        );

        // Get unique locations
        const locations = ['all', ...new Set(
          fetchedArticles.flatMap(a => a.locationTags)
        )].sort((a, b) => a.localeCompare(b));

        
        setArticles(fetchedArticles);
        setLoading(false);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('Πρόβλημα φόρτωσης δεδομένων. Παρακαλώ δοκιμάστε ξανά αργότερα.');
        setLoading(false);
      }
    };

    loadArticles();
  }, []);
  useEffect(() => {
    // Update available locations based on selected category
    const filteredByCategory = articles.filter(article => 
      selectedCategory === 'all' || article.subcategory === selectedCategory
    );
    
    const locations = ['all', ...new Set(
      filteredByCategory.flatMap(a => a.locationTags)
    )].sort((a, b) => a.localeCompare(b));
  
    setAvailableLocations(locations);
    
    // Reset location filter if current selection isn't available
    if (!locations.includes(selectedLocation)) {
      setSelectedLocation('all');
    }
  }, [selectedCategory, articles, selectedLocation]);


  const filteredArticles = articles.filter(article => {
    const categoryMatch = selectedCategory === 'all' || article.subcategory === selectedCategory;
    const locationMatch = selectedLocation === 'all' || article.locationTags.includes(selectedLocation);
    return categoryMatch && locationMatch;
  });

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Σφάλμα</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-4">Φόρτωση χάρτη...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Διαδραστικός Χάρτης </title>
        <meta
          name="description"
          content="Διαδραστικός χάρτης με λαογραφικές αφηγήσεις και ιστορικά άρθρα από όλη την Ελλάδα"
        />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mt-4">Διαδραστικός Χάρτης Συμβάντων</h1>
        <p className="mt-2 text-gray-300">Περιήγηση στα άρθρα ανά γεωγραφική θέση</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Κατηγορία
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-"
            >
              {Object.entries(filterOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Περιοχή
            </label>
            <select
  value={selectedLocation}
  onChange={(e) => setSelectedLocation(e.target.value)}
  className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500"
>
  {availableLocations.map(loc => (
    <option key={loc} value={loc}>
      {loc === 'all' ? 'Όλες οι Περιοχές' : loc}
    </option>
  ))}
</select>
          </div>
        </div>

        <div className="mt-4 text-gray-400 text-sm">
          Εμφανίζονται {filteredArticles.length} από {articles.length} συνολικά άρθρα
        </div>
      </header>

      <GreeceMap articles={filteredArticles} />
    </div>
  );
};

export default EfimeridesMap;