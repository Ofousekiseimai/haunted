import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SUBCATEGORY_MAP, CATEGORY_CONFIG } from '../constants/categories';
import { LazyLoadImage } from 'react-lazy-load-image-component';

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

        // Get all subcategories with their category info
        const subcategories = Object.values(SUBCATEGORY_MAP);

        // Fetch all articles from all categories
        const fetchPromises = subcategories.map(async (sub) => {
          try {
            const categoryConfig = CATEGORY_CONFIG[sub.category];
            if (!categoryConfig) return null;
            
            const jsonUrl = `${categoryConfig.dataPath}${sub.slug}.json`;
            const response = await fetch(jsonUrl);
            if (!response.ok) return null;
            
            const data = await response.json();
            return (data.articles || []).map(article => ({
              ...article,
              mainCategory: sub.category,
              subcategory: sub.slug
            }));
          } catch (error) {
            console.error(`Error loading ${sub.slug}:`, error);
            return null;
          }
        });

        const allArticlesResults = await Promise.all(fetchPromises);
        const allArticles = allArticlesResults
          .filter(Boolean)
          .flat();

        const filteredArticles = allArticles
          .filter(article => 
            article?.mainArea &&
            article.mainArea.toLowerCase() === currentMainArea.toLowerCase() &&
            article.id !== currentArticleId &&
            article?.title &&
            article?.slug &&
            article?.excerpt
          )
          .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
          .slice(0, 6);

        setArticles(filteredArticles);
      } catch (err) {
        console.error('Σφάλμα φόρτωσης:', err);
        setError(`Πρόβλημα φόρτωσης άρθρων περιοχής: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentMainArea, currentArticleId]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
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
            <Link
              to={`/${article.mainCategory}/${article.subcategory}/${article.slug}`}
              key={article.id}
              className="block group bg-transparent rounded-lg p-4 transition-colors overflow-hidden hover:transform hover:scale-[1.02] duration-300 border shadow-xl border-gray-700"
            >
              {article.image?.src && (
                <LazyLoadImage
                  src={article.image.src}
                  alt={article.image.alt || article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  placeholderSrc="/placeholder.jpg"
                  effect="opacity"
                />
              )}
              <div className="mb-2 text-sm text-purple-400 mt-2">
                {subcategoryInfo?.displayName || article.subcategory}
              </div>
              <h3 className="text-xl font-bold mb-2 mt-2 text-white group-hover:text-purple-400 transition-colors">
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