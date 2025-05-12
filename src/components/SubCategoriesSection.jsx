// components/SubcategoriesSection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { SUBCATEGORY_MAP } from '../constants/categories';

const SubcategoriesSection = ({ articles = [] }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState('aerika');
  
  // Get laografia subcategories
  const laografiaSubcategories = Object.values(SUBCATEGORY_MAP)
    .filter(({ category, slug }) => category === 'laografia' && slug !== 'laografia')
    .slice(0, 4); // Only show first 4

  // Filter articles for selected subcategory
  const filteredArticles = articles
    .filter(article => 
      article.subcategorySlug === selectedSubcategory ||
      article.categorySlug === selectedSubcategory
    )
    .slice(0, 3);

  return (
    <section className="mt-12 px-4 lg:px-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-2 border-gray-300 pb-2">
          <h2 className="text-2xl font-serif font-bold mb-4 md:mb-0">
            Άρθρα Λαογραφίας ανά κατηγορία
          </h2>
          <Link 
            to="/laografia/categories"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            Όλες οι Κατηγορίες
          </Link>
        </div>

        {/* Subcategory Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {laografiaSubcategories.map((sub) => (
            <button
              key={sub.slug}
              onClick={() => setSelectedSubcategory(sub.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedSubcategory === sub.slug 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {sub.image.alt}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const articleSlug = article.slug || String(article.id);
            const subcategorySlug = article.subcategorySlug || selectedSubcategory;

            return (
              <article 
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link 
                  to={`/laografia/${subcategorySlug}/${articleSlug}`}
                  className="block h-full text-gray-800 hover:text-blue-600"
                >
                  {article.image?.src && (
                    <LazyLoadImage
                      src={article.image.src}
                      alt={article.image.alt || article.title}
                      className="w-full h-48 object-cover"
                      placeholderSrc="/placeholder.jpg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-serif font-semibold mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Δεν βρέθηκαν άρθρα για αυτήν την κατηγορία
          </div>
        )}
      </div>
    </section>
  );
};

export default SubcategoriesSection;