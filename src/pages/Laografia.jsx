import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { SUBCATEGORY_MAP } from '../constants/categories';
import { Link } from 'react-router-dom';
import  {LazyLoadImage} from 'react-lazy-load-image-component';

const loadData = async (subcategory) => {
  try {
    const response = await fetch(`/data/laografia/${subcategory}.json`);
    if (!response.ok) throw new Error(`HTTP σφάλμα ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Αποτυχία φόρτωσης δεδομένων: ${error.message}`);
  }
};

const Laografia = () => {
  const [selectedSub, setSelectedSub] = useState('stoixeia');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const laografiaSubcategories = Object.keys(SUBCATEGORY_MAP).filter(
    key => SUBCATEGORY_MAP[key].category === 'laografia'
  );

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await loadData(selectedSub);
        setArticles(data?.articles || []);
      } catch (err) {
        console.error('Σφάλμα φόρτωσης:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedSub]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Λαογραφία - Haunted Greece</title>
        <meta
          name="description"
          content="Εξερευνήστε όλες τις λαογραφικές αφηγήσεις ανά κατηγορία. Βρυκόλακες, νεράιδες, δρακόσπιτα και άλλες ελληνικές παραδόσεις."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
          <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Λαογραφική Συλλογή
          </span>
        </h1>

        {/* Mobile Dropdown */}
        <div className="md:hidden mb-6">
          <label className="sr-only" htmlFor="mobile-filter">Επιλογή κατηγορίας</label>
          <select
            id="mobile-filter"
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          >
            {laografiaSubcategories.map(sub => {
              const subInfo = SUBCATEGORY_MAP[sub];
              return (
                <option key={sub} value={sub}>
                  {subInfo?.image?.alt || sub}
                </option>
              );
            })}
          </select>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex flex-wrap gap-3 mb-8 justify-center">
          {laografiaSubcategories.map(sub => {
            const subInfo = SUBCATEGORY_MAP[sub];
            return (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedSub === sub
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {subInfo?.image?.alt || sub}
              </button>
            );
          })}
        </div>

        {/* Article Display */}
        {error ? (
          <div className="text-red-500 text-center p-4">
            Σφάλμα φόρτωσης: {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-gray-400 text-center p-4">
            Δεν βρέθηκαν άρθρα για αυτήν την κατηγορία
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <div
                key={article.id}
                className="group relative bg-transparent rounded-2xl p-4 overflow-hidden hover:transform hover:scale-[1.02] duration-300 border shadow-xl border-gray-700"
              >
                <Link
                  to={`/laografia/${selectedSub}/${article.slug}`}
                  className="block"
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
                  <p className="text-gray-400 line-clamp-3">{article.excerpt}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Laografia;