// components/HomeArticles.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SUBCATEGORY_MAP } from '../constants/categories';

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
// In your ArticlePage component, after setting article and categoryData:

// Add this to your return statement right after the article content:

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

        const validArticles = data.articles
          .filter(article => 
            article?.id &&
            article?.title &&
            article?.slug &&
            article?.excerpt
          )
          .slice(0, 6);

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

  return (
    <div className="mb-12">
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
              className={`px-4 py-2 rounded-lg ${
                selectedSub === sub 
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px] text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {subInfo.image?.alt || sub}
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-gray-500 text-center">Δεν βρέθηκαν άρθρα</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <Link
              to={`/${mainCategory}/${selectedSub}/${article.slug}`}
              key={`${article.id}-${index}`}
               className="group relative bg-transparent rounded-2xl p-4 overflow-hidden hover:transform hover:scale-[1.02] duration-300 border shadow-xl border-gray-700"
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
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeArticles;