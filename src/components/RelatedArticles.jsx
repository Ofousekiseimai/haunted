import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SUBCATEGORY_MAP, CATEGORY_CONFIG } from '../constants/categories';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const RelatedArticles = ({ currentSubcategory, currentArticleId }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subcategoryInfo = SUBCATEGORY_MAP[currentSubcategory];
  const mainCategory = subcategoryInfo?.category;

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!mainCategory || !currentSubcategory) {
          throw new Error('Λείπουν πληροφορίες κατηγορίας');
        }

        const categoryConfig = CATEGORY_CONFIG[mainCategory];
        if (!categoryConfig) throw new Error('Ακαθόριστη κατηγορία');
        
        const jsonUrl = `${categoryConfig.dataPath}${currentSubcategory}.json`;
        const response = await fetch(jsonUrl);
        
        if (!response.ok) throw new Error(`HTTP σφάλμα ${response.status}`);
        const data = await response.json();

        const validArticles = (data?.articles || [])
          .filter(article => 
            article?.id &&
            article?.title &&
            article?.slug &&
            article?.excerpt &&
            article.id !== currentArticleId
          )
          .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
          .slice(0, 6);

        setArticles(validArticles);
      } catch (err) {
        console.error('Σφάλμα φόρτωσης:', err);
        setError(`Πρόβλημα φόρτωσης συναφών άρθρων: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (currentSubcategory && mainCategory) {
      loadArticles();
    }
  }, [currentSubcategory, currentArticleId, mainCategory]);

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
        Περισσότερα Άρθρα Κατηγορίας: "{subcategoryInfo?.displayName || currentSubcategory}"
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            to={`/${mainCategory}/${currentSubcategory}/${article.slug}`}
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
            <h3 className="text-xl font-bold mb-2 mt-2 text-white group-hover:text-purple-400 transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-400 line-clamp-3">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;