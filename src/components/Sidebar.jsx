import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SUBCATEGORY_MAP, CATEGORY_CONFIG } from '../constants/categories';
// Add this import at the top with other imports
import { LazyLoadImage } from 'react-lazy-load-image-component';


const Sidebar = () => {
  const [randomArticles, setRandomArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const allEntries = Object.values(SUBCATEGORY_MAP);
        
        const articlesPromises = allEntries.map(async (entry) => {
          const categoryConfig = CATEGORY_CONFIG[entry.category];
          try {
            const data = await import(
              /*vite-ignore*/
              `${categoryConfig.dataPath}${entry.slug}.json`
            );
            return data.default.articles.map(article => ({
              ...article,
              subcategory: article.subcategory || entry.slug,
              category: entry.category,
              slug: article.slug,
            }));
          } catch (err) {
            console.error(`Error loading ${entry.slug}:`, err);
            return [];
          }
        });

        const articlesArrays = await Promise.all(articlesPromises);
        const allArticles = articlesArrays.flat();

        const shuffled = [...allArticles]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
          
        setRandomArticles(shuffled);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="w-64 fixed left-0 top-20 h-full bg-n-8 overflow-y-auto p-4 shadow-lg">
        <h3 className="text-lg font-bold text-n-1 mb-4">Random Articles</h3>
        <div className="text-n-3">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 fixed left-0 top-20 h-full bg-n-8 overflow-y-auto p-4 shadow-lg">
        <h3 className="text-lg font-bold text-n-1 mb-4">Random Articles</h3>
        <div className="text-red-500">Error loading articles: {error}</div>
      </div>
    );
  }


  return (
    
    <div className="hidden md:block w-full md:w-64 fixed right-0 top-20 h-full bg-n-8 overflow-y-auto p-4 shadow-lg custom-scrollbar">
      <h3 className="text-lg font-bold text-n-1 mb-4">Τυχαία Άρθρα</h3>
      <ul className="space-y-4">
        {randomArticles.map((article) => (
          <li key={article.id} className="group">
            <Link 
              to={`/${article.category}${
                article.subcategory !== article.category ? `/${article.subcategory}` : ''
              }/${article.slug}`}
              className="flex flex-col gap-2 hover:bg-n-7 transition-colors rounded-lg p-2"
            >
              <div className="w-full aspect-square rounded-md overflow-hidden">
                <LazyLoadImage
                  src={article.image.src}
                  alt={article.image.alt}
                  effect="opacity"
                  className="w-full h-full object-cover"
                  placeholderSrc="/placeholder.jpg"
                />
              </div>

              <div className="w-full">
                <h4 className="text-sm md:text-xs font-semibold text-n-1 line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <p className="text-xs md:text-[0.7rem] text-n-3 line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
  
  export default Sidebar;