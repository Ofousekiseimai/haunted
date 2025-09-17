import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { SUBCATEGORY_MAP } from '../constants/categories';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const loadData = async (subcategory) => {
  try {
    const response = await fetch(`/data/efimerides/${subcategory}.json`);
    if (!response.ok) throw new Error(`HTTP σφάλμα ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Αποτυχία φόρτωσης δεδομένων: ${error.message}`);
  }
};

const Efimerides = () => {
  const [selectedSub, setSelectedSub] = useState('fainomena');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const efimeridesSubcategories = Object.keys(SUBCATEGORY_MAP).filter(
    key => SUBCATEGORY_MAP[key].category === 'efimerides'
  );

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await loadData(selectedSub);
        const sortedArticles = (data?.articles || []).sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;          
          return new Date(b.date) - new Date(a.date);
        });
        
        setArticles(sortedArticles);
      } catch (err) {
        console.error('Σφάλμα φόρτωσης:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchArticles();
  }, [selectedSub]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Εφημερίδες - Haunted Greece</title>
        <meta
          name="description"
          content="Εξερευνήστε όλα τα άρθρα εφημερίδων που σχετίζονται με το μεταφυσικό ανά κατηγορία."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
          <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Άρθρα Εφημερίδων
          </span>
        </h1>

        {/* Mobile Dropdown */}
        <div className="md:hidden mb-6">
          <label className="sr-only" htmlFor="mobile-filter">Επιλογή κατηγορίας</label>
          <select
            id="mobile-filter"
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
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
        <div className="hidden md:flex flex-wrap gap-3 mb-8 justify-center">
          {efimeridesSubcategories.map(sub => {
            const subInfo = SUBCATEGORY_MAP[sub];
            return (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedSub === sub
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {subInfo?.image?.alt || sub}
              </button>
            );
          })}
        </div>

        {/* Article Display */}
        {error ? (
          <div className="text-red-500 text-center p-4">
            Σφάλμα φόρτωσης: {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-gray-400 text-center p-4">
            Δεν βρέθηκαν άρθρα για αυτήν την κατηγορία
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <div
                key={article.id}
                className="group relative bg-transparent rounded-2xl p-4 overflow-hidden hover:transform hover:scale-[1.02] duration-300 border shadow-xl border-gray-700"
              >
                <Link
                  to={`/efimerides/${selectedSub}/${article.slug}`}
                  className="block"
                >
                  {article.image?.src && (
                    <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                      <LazyLoadImage
                        src={article.image.src}
                        alt={article.image.alt}
                        effect="opacity"
                        placeholderSrc="/placeholder.jpg"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                        {article.date && (
                          <div className="flex items-center bg-black/60 px-3 py-1 rounded-full text-sm text-white">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-1 text-purple-400"
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                              />
                            </svg>
                            <span>{article.date}</span>
                          </div>
                        )}
                        {article.locationTags?.length > 0 && (
                          <div className="flex items-center bg-black/60 px-3 py-1 rounded-full text-sm text-white">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-1 text-purple-400"
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                            </svg>
                            <span>{article.locationTags[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-2 space-y-3">
                    {!article.image?.src && article.date && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 mr-1 text-purple-400"
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                        <span>{article.date}</span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 line-clamp-3">{article.excerpt}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Efimerides;