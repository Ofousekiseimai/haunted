// components/HomeArticles.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SUBCATEGORY_MAP } from '../constants/categories';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const HomeArticles = ({ 
  mainCategory,
  subcategories,
  defaultSubcategory,
  dataImporter
}) => {
  const [selectedSub, setSelectedSub] = useState(defaultSubcategory);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    let isMounted = true;
    
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await dataImporter(selectedSub);
        
        if (!data?.articles) {
          throw new Error('Invalid data format');
        }

        // Shuffle articles before filtering and slicing
        const shuffledArticles = shuffleArray(data.articles);
        
        const validArticles = shuffledArticles
          .filter(article => 
            article?.id &&
            article?.title &&
            article?.slug &&
            article?.excerpt
          )
          .slice(0, 6); // Show first 6 random articles

        if (isMounted) {
          setArticles(validArticles);
        }
      } catch (err) {
        if (isMounted) {
          setError(`Error loading ${selectedSub}: ${err.message}`);
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      isMounted = false;
    };
  }, [selectedSub, dataImporter]);

  // Get current category name for button text
  const currentCategoryName = SUBCATEGORY_MAP[selectedSub]?.image?.alt || selectedSub;

  return (
    <div className="mb-12">
      {/* Category selector tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        {subcategories.map(sub => {
          const subInfo = SUBCATEGORY_MAP[sub];
          if (!subInfo) {
            console.warn(`Missing subcategory info for: ${sub}`);
            return null;
          }
          
          return (
            <button
              key={sub}
              onClick={() => setSelectedSub(sub)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedSub === sub 
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px]' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <span className={`block rounded-md px-3 py-1 ${
                selectedSub === sub ? 'bg-transparent' : 'bg-transparent'
              }`}>
                {subInfo.image?.alt || sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Article display */}
      {error ? (
        <div className="text-red-500 text-center py-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-blue-400 hover:text-blue-300"
          >
            Δοκιμάστε ξανά
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Δεν βρέθηκαν άρθρα για αυτή την κατηγορία
        </div>
      ) : (
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
              Δες όλα τα άρθρα στην κατηγορία "{currentCategoryName}"
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeArticles;