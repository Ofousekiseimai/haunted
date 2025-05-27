import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import GreeceMap from '../components/GreeceMap';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableLocations, setAvailableLocations] = useState(['all']);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const subcategories = [
          'satanismos', 'mageia', 'egklimata', 
          'teletes', 'lithovroxes', 'fainomena',
          'medium', 'emfaniseis-panagias'
        ];

        const fetchPromises = subcategories.map(subcat => 
          fetch(`/data/efimerides/${subcat}.json`)
            .then(res => res.json())
            .catch(() => null) // Αγνοούμε αποτυχημένα requests
        );

        const results = await Promise.all(fetchPromises);
        
        const validData = results.filter(Boolean);
        // In the loadArticles useEffect, update the article mapping:
const fetchedArticles = validData.flatMap((data, index) => 
  data.articles.map(article => ({
    ...article,
    subcategory: subcategories[index], // Add this line
    lat: parseFloat(article.lat),
    lng: parseFloat(article.lng),
    imageUrl: article.image?.src || '/default-image.webp',
    mainArea: article.mainArea?.trim() || '',
    subLocation: [
      article.subLocation?.trim(), 
      article.subLocation2?.trim()
    ].filter(Boolean)
  }))
).filter(article => 
  !isNaN(article.lat) && 
  !isNaN(article.lng) &&
  article.lat >= 34.8 &&
  article.lat <= 41.7 &&
  article.lng >= 19.4 &&
  article.lng <= 29.6
);

        const locations = ['all', ...new Set(
          fetchedArticles.flatMap(a => a.locationTags)
        )].sort((a, b) => a.localeCompare(b));

        setArticles(fetchedArticles);
        setAvailableLocations(locations);
        setLoading(false);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('Πρόβλημα φόρτωσης δεδομένων. Παρακαλώ δοκιμάστε ξανά αργότερα.');
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // ... υπόλοιπος κώδικας παραμένει ίδιος ...

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