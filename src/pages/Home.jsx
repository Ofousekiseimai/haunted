import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SUBCATEGORY_MAP } from '../constants/categories';
import Hero from '../components/Hero';
import YouTubeSection from '../components/YoutubeSection';
import GreeceMap from '../components/GreeceMap';

const Home = () => {
  const [youtubeData, setYoutubeData] = useState(null);
  const [mapArticles, setMapArticles] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  
  // State for category selection
  const [selectedLaografiaSub, setSelectedLaografiaSub] = useState('vrikolakes');
  const [selectedEfimeridesSub, setSelectedEfimeridesSub] = useState('medium');
  const [laografiaArticles, setLaografiaArticles] = useState([]);
  const [efimeridesArticles, setEfimeridesArticles] = useState([]);
  const [loadingLaografia, setLoadingLaografia] = useState(true);
  const [loadingEfimerides, setLoadingEfimerides] = useState(true);
  const [errorLaografia, setErrorLaografia] = useState(null);
  const [errorEfimerides, setErrorEfimerides] = useState(null);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };


  // Get subcategories
  const laografiaSubcategories = Object.keys(SUBCATEGORY_MAP).filter(
    key => SUBCATEGORY_MAP[key].category === 'laografia'
  );
  
  const efimeridesSubcategories = Object.keys(SUBCATEGORY_MAP).filter(
    key => SUBCATEGORY_MAP[key].category === 'efimerides'
  );

  // Load data function
  const loadData = async (subcategory, category) => {
    try {
      const response = await fetch(`/data/${category}/${subcategory}.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      throw new Error(`Failed to load ${subcategory} data: ${error.message}`);
    }
  };

  // Load laografia articles
   useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingLaografia(true);
        setErrorLaografia(null);
        const data = await loadData(selectedLaografiaSub, 'laografia');
        
        // Shuffle articles before slicing
        const shuffledArticles = shuffleArray(data?.articles || []);
        const randomArticles = shuffledArticles.slice(0, 6);
        
        setLaografiaArticles(randomArticles);
      } catch (err) {
        console.error('Σφάλμα φόρτωσης:', err);
        setErrorLaografia(err.message);
      } finally {
        setLoadingLaografia(false);
      }
    };

    fetchArticles();
  }, [selectedLaografiaSub]);

  // Load efimerides articles (UPDATED)
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingEfimerides(true);
        setErrorEfimerides(null);
        const data = await loadData(selectedEfimeridesSub, 'efimerides');
        
        // Shuffle articles before slicing
        const shuffledArticles = shuffleArray(data?.articles || []);
        const randomArticles = shuffledArticles.slice(0, 6);
        
        setEfimeridesArticles(randomArticles);
      } catch (err) {
        console.error('Σφάλμα φόρτωσης:', err);
        setErrorEfimerides(err.message);
      } finally {
        setLoadingEfimerides(false);
      }
    };

    fetchArticles();
  }, [selectedEfimeridesSub]);

  // Load map articles (same as before)
  useEffect(() => {
    const loadMapArticles = async () => {
      try {
        const subcategories = [
          'aerika', 'drakontes', 'drakospita', 
          'gigantes', 'ksotika', 'lamies',
          'limnes', 'neraides','vrikolakes', 'stoixeia','telonia', 'xamodrakia',
        ];

        const fetchPromises = subcategories.map(subcat => 
          fetch(`/data/laografia/${subcat}.json`)
            .then(res => res.json())
            .catch(() => null)
        );

        const results = await Promise.all(fetchPromises);
        const validData = results.filter(Boolean);

        const fetchedArticles = validData.flatMap((data, index) => 
          data.articles.map(article => ({
            ...article,
            subcategory: subcategories[index],
            lat: parseFloat(article.lat),
            lng: parseFloat(article.lng),
            imageUrl: article.image?.src || '/default-image.webp',
            mainArea: article.mainArea?.trim() || '',
            subLocation: [
              article.subLocation?.trim(), 
              article.subLocation2?.trim()
            ].filter(Boolean),
            locationTags: [article.mainArea?.trim(), article.subLocation?.trim(), article.subLocation2?.trim()]
              .filter(Boolean)
              .map(tag => tag.trim())
          }))
        ).filter(article => 
          !isNaN(article.lat) && 
          !isNaN(article.lng) &&
          article.lat >= 34.8 &&
          article.lat <= 41.7 &&
          article.lng >= 19.4 &&
          article.lng <= 29.6
        );

        setMapArticles(fetchedArticles);
        setMapLoading(false);
      } catch (err) {
        console.error('Error loading map articles:', err);
        setMapLoading(false);
      }
    };

    loadMapArticles();
  }, []);

  // Load YouTube data
  useEffect(() => {
    fetch('/data/youtube.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setYoutubeData(data))
      .catch(error => console.error('Error loading YouTube data:', error));
  }, []);

  // Render articles function
  const renderArticles = (articles, loading, error, mainCategory, selectedSub) => {
    if (error) {
      return (
        <div className="text-red-500 text-center py-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-blue-400 hover:text-blue-300"
          >
            Δοκιμάστε ξανά
          </button>
        </div>
      );
    }
    
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
        </div>
      );
    }
    
    if (articles.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          Δεν βρέθηκαν άρθρα για αυτή την κατηγορία
        </div>
      );
    }
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              to={`/${mainCategory}/${selectedSub}/${article.slug}`}
              key={`${article.id}-${article.slug}`}
              className="group relative bg-gray-800/50 rounded-2xl p-4 overflow-hidden hover:transform hover:scale-[1.02] duration-300 border border-gray-700 shadow-lg"
            >
              {article.image?.src && (
                <img
                  src={article.image.src}
                  alt={article.image.alt || 'Article image'}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  loading="lazy"
                />
              )}
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-400 mb-4 line-clamp-3">{article.excerpt}</p>
              <div className="text-white inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                Διαβάστε περισσότερα
                <span aria-hidden="true" className="ml-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* "See All" button for current category */}
        <div className="flex justify-center mt-8">
          <Link 
            to={`/${mainCategory}/${selectedSub}`}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium py-3 px-6 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
          >
            Δες όλα τα άρθρα στην κατηγορία "{SUBCATEGORY_MAP[selectedSub]?.image?.alt || selectedSub}"
          </Link>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Haunted Greece - Αρχική Σελίδα</title>
        <meta 
          name="description" 
          content="Εξερευνήστε την ελληνική λαογραφία και ιστορικά άρθρα από εφημερίδες. Διαδραστικός χάρτης, βρυκόλακες, δαίμονες και παραδόσεις." 
        />
      </Helmet>

      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        {/* Λαογραφία Section */}
        <section className="mb-16" id="laografia">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            Άρθρα Παραδόσεις / Λαογραφία
          </h2>
          
          {/* Mobile Dropdown */}
          <div className="md:hidden mb-6">
            <label className="sr-only" htmlFor="mobile-filter-laografia">Επιλογή κατηγορίας λαογραφίας</label>
            <select
              id="mobile-filter-laografia"
              value={selectedLaografiaSub}
              onChange={(e) => setSelectedLaografiaSub(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            >
              {laografiaSubcategories.map(sub => {
                const subInfo = SUBCATEGORY_MAP[sub];
                return (
                  <option key={sub} value={sub}>
                    {subInfo?.image?.alt || sub}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex flex-wrap gap-3 mb-6 justify-center">
            {laografiaSubcategories.map(sub => {
              const subInfo = SUBCATEGORY_MAP[sub];
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedLaografiaSub(sub)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedLaografiaSub === sub 
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px]' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <span className={`block rounded-md px-3 py-1 ${
                    selectedLaografiaSub === sub ? 'bg-transparent' : 'bg-transparent'
                  }`}>
                    {subInfo?.image?.alt || sub}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Render articles */}
          {renderArticles(laografiaArticles, loadingLaografia, errorLaografia, 'laografia', selectedLaografiaSub)}
        </section>

        {/* Map Section */}
        <section className="mb-16" id="map">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Διαδραστικός Λαογραφικός Χάρτης
            </h2>
            <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
              Ανακαλύψτε παραδόσεις, ιστορικά γεγονότα και υπερφυσικά φαινόμενα σε όλη την Ελλάδα
            </p>
          </div>
          
          {mapLoading ? (
            <div className="h-96 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-400">Φόρτωση χάρτη...</p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <GreeceMap articles={mapArticles} simplified={true} />
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Link 
              to="/map2"
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium py-3 px-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] transform"
            >
              Χάρτης Λαογραφίας
            </Link>
          </div>
        </section>

        {/* Εφημερίδες Section */}
        <section className="mb-16" id="efimerides">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            Άρθρα Εφημερίδων
          </h2>
          
          {/* Mobile Dropdown */}
          <div className="md:hidden mb-6">
            <label className="sr-only" htmlFor="mobile-filter-efimerides">Επιλογή κατηγορίας εφημερίδων</label>
            <select
              id="mobile-filter-efimerides"
              value={selectedEfimeridesSub}
              onChange={(e) => setSelectedEfimeridesSub(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            >
              {efimeridesSubcategories.map(sub => {
                const subInfo = SUBCATEGORY_MAP[sub];
                return (
                  <option key={sub} value={sub}>
                    {subInfo?.image?.alt || sub}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex flex-wrap gap-3 mb-6 justify-center">
            {efimeridesSubcategories.map(sub => {
              const subInfo = SUBCATEGORY_MAP[sub];
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedEfimeridesSub(sub)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedEfimeridesSub === sub 
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px]' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <span className={`block rounded-md px-3 py-1 ${
                    selectedEfimeridesSub === sub ? 'bg-transparent' : 'bg-transparent'
                  }`}>
                    {subInfo?.image?.alt || sub}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Render articles */}
          {renderArticles(efimeridesArticles, loadingEfimerides, errorEfimerides, 'efimerides', selectedEfimeridesSub)}
        </section>
      </div>

      {youtubeData?.playlists?.length > 0 && (
        <YouTubeSection videosData={youtubeData} />
      )}
    </div>
  );
};

export default Home;