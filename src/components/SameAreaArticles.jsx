// components/SameAreaArticles.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SUBCATEGORY_MAP } from '../constants/categories';

const jsonModules = import.meta.glob('../data/**/*.json', {
  eager: true,
  import: 'default'
});

const SameAreaArticles = ({ currentMainArea, currentArticleId }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentMainArea) {
          setArticles([]);
          return;
        }

        // Process all articles with their category paths
        const allArticles = Object.entries(jsonModules).flatMap(([path, data]) => {
          // Extract mainCategory and subcategory from file path
          const match = path.match(/\.\.\/data\/([^/]+)\/([^/]+)\.json$/);
          if (!match) return [];
          
          const [, mainCategory, subcategory] = match;
          return (data.articles || []).map(article => ({
            ...article,
            mainCategory,
            subcategory
          }));
        });

        const filteredArticles = allArticles
          .filter(article => 
            article?.mainArea &&
            article.mainArea.toLowerCase() === currentMainArea.toLowerCase() &&
            article.id !== currentArticleId &&
            article?.title &&
            article?.slug &&
            article?.excerpt
          )
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

        setArticles(filteredArticles);
      } catch (err) {
        setError(`Error loading area articles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentMainArea, currentArticleId]);

  // Rest of the component remains the same...



  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 text-white">
        Άρθρα στην περιοχή "{currentMainArea}"
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const subcategoryInfo = SUBCATEGORY_MAP[article.subcategory];
          
          return (
            // In the return statement, change the Link's to prop:
<Link
  to={`/${article.mainCategory}/${article.subcategory}/${article.slug}`}
  key={article.id}
  className="block group bg-transparent rounded-lg p-4 transition-colors  overflow-hidden hover:transform hover:scale-[1.02] duration-300 border shadow-xl border-gray-700"
>
              {article.image?.src && (
                <img
                  src={article.image.src}
                  alt={article.image.alt || 'Article image'}
                     className="w-full h-48 object-fill rounded-t-lg"
                  loading="lazy"
                />
              )}
              <div className="mb-2  text-m text-white mt-2">
                {subcategoryInfo?.displayName || article.subcategory}
              </div>
              <h3 className="text-xl font-bold mb-2 mt-2 text-white group-hover:text-purple-500  transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-400 line-clamp-3">{article.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SameAreaArticles;