// components/RandomArticles.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { SUBCATEGORY_MAP, CATEGORY_CONFIG } from '../constants/categories';

// Preload JSON files using Vite's glob import
const jsonModules = import.meta.glob('../data/**/*.json', {
  eager: true,
  import: 'default'
});

const RandomArticles = ({ currentArticleId }) => {
  const [randomArticles, setRandomArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = () => {
      try {
        const allEntries = Object.values(SUBCATEGORY_MAP);
        
        const allArticles = allEntries.flatMap(entry => {
          const categoryConfig = CATEGORY_CONFIG[entry.category];
          const jsonPath = `../data/${entry.category}/${entry.slug}.json`;
          const data = jsonModules[jsonPath];
          
          return data?.articles?.map(article => ({
            ...article,
            category: entry.category,
            subcategorySlug: entry.slug
          })) || [];
        });

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
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [currentArticleId]);

  if (loading) {
    return (
      <div className="mt-12 text-center">
        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 text-red-600 text-center">
        Error loading random articles: {error}
      </div>
    );
  }

  if (randomArticles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-serif font-bold mb-6 border-b-2 border-gray-300 pb-2">
        Περισσότερα Άρθρα
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {randomArticles.map((article) => (
          <article 
            key={`${article.category}-${article.id}`}
            className="bg-transparent rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Link 
              to={`/laografia/${article.subcategorySlug}/${article.slug || article.id}`}
              className="block group bg-transparent rounded-lg p-4 transition-colors  overflow-hidden hover:transform hover:scale-[1.02] duration-300 border shadow-xl border-gray-700"
            >
              {article.image?.src && (
                <LazyLoadImage
                  src={article.image.src}
                  alt={article.image.alt || article.title}
                  className="w-full h-48 object-fill rounded-t-lg"
                  placeholderSrc="/placeholder.jpg"
                />
              )}
              <div className="p-4">
              <h3 className="text-xl font-bold mb-2 mt-2 text-white group-hover:text-purple-500 transition-colors">
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