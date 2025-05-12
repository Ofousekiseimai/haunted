import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAllArticles } from '../utils/search';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const searchResults = await searchAllArticles(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Αποτελέσματα για "{query}"</h1>
      
      {results.length === 0 ? (
        <p className="text-gray-500">Δεν βρέθηκαν αποτελέσματα</p>
      ) : (
        <div className="grid gap-6">
          {results.map((article) => (
            <Link
              key={article.id}
              to={`/${article.category}/${article.subcategory}/${article.slug}`}
              className="block border rounded-lg hover:shadow-lg transition-shadow overflow-hidden bg-white dark:bg-gray-800"
            >
              <div className="relative aspect-video">
                <LazyLoadImage
                  src={article.image.src}
                  alt={article.image.alt}
                  effect="opacity"
                  className="w-full h-full object-cover"
                  placeholderSrc="/placeholder.jpg"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-3 dark:text-white">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="mr-4">{article.subcategory}</span>
                  <span>{article.locationTags?.join(', ')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;