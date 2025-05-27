import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { SUBCATEGORY_MAP, CATEGORY_CONFIG } from '../constants/categories';

const RandomArticles = ({ currentArticleId }) => {
  const [randomArticles, setRandomArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all articles from all categories
        const subcategories = Object.values(SUBCATEGORY_MAP);
        
        const fetchPromises = subcategories.map(async (entry) => {
          try {
            const categoryConfig = CATEGORY_CONFIG[entry.category];
            const jsonUrl = `${categoryConfig.dataPath}${entry.slug}.json`;
            const response = await fetch(jsonUrl);
            if (!response.ok) return null;
            const data = await response.json();
            
            return data?.articles?.map(article => ({
              ...article,
              category: entry.category,
              subcategorySlug: entry.slug
            })) || [];
          } catch (error) {
            console.error(`Error loading ${entry.slug}:`, error);
            return null;
          }
        });

        const allArticlesResults = await Promise.all(fetchPromises);
        const allArticles = allArticlesResults
          .filter(Boolean)
          .flat();

        // Filter out current article
        const filtered = allArticles.filter(article => 
          article.id !== currentArticleId
        );

        // Fisher-Yates shuffle
        const shuffled = [...filtered];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        setRandomArticles(shuffled.slice(0, 5));
      } catch (err) {
        console.error('Σφάλμα φόρτωσης:', err);
        setError('Πρόβλημα φόρτωσης συναφών άρθρων');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentArticleId]);

  if (loading) {
    return (
      <div className="mt-12 text-center">
        <svg className="animate-spin h-8 w-8 text-purple-500 mx-auto" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 text-red-500 text-center">
        Σφάλμα: {error}
      </div>
    );
  }

  if (randomArticles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-serif font-bold mb-6 border-b-2 border-gray-300 pb-2 text-white">
        Περισσότερα Άρθρα
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {randomArticles.map((article) => (
          <article 
            key={`${article.category}-${article.id}`}
            className="bg-transparent rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Link 
              to={`/${article.category}/${article.subcategorySlug}/${article.slug || article.id}`}
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
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 mt-2 text-white group-hover:text-purple-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-400 line-clamp-3">{article.excerpt}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RandomArticles;