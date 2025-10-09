import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { CATEGORY_CONFIG, SUBCATEGORY_MAP } from '../constants/categories';

export default function CategoryPage() {
  const { category, subcategory } = useParams();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [selectedMainArea, setSelectedMainArea] = useState('all');
  const [selectedSubLocation, setSelectedSubLocation] = useState('all');
  const [availableMainAreas, setAvailableMainAreas] = useState(['all']);
  const [availableSubLocations, setAvailableSubLocations] = useState(['all']);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const config = SUBCATEGORY_MAP[subcategory || category];
        if (!config) throw new Error('Δεν βρέθηκε η κατηγορία');
        setCurrentConfig(config);

        const categoryConfig = CATEGORY_CONFIG[config.category];
        if (!categoryConfig) throw new Error('Δεν βρέθηκε η διαμόρφωση κατηγορίας');

        // Build correct data path
        const jsonUrl = `${categoryConfig.dataPath}${config.slug}.json`;
        
        // Fetch from public directory
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error(`HTTP σφάλμα ${response.status}`);
        
        const data = await response.json();

        const processedArticles = data.articles
          .map(article => ({
            ...article,
            subcategory: article.subcategory || config.slug,
            mainArea: article.mainArea?.trim() || '',
            subLocation: [
              article.subLocation?.trim(), 
              article.subLocation2?.trim()
            ].filter(Boolean)
          }))
          .sort((a, b) => Number(b.id) - Number(a.id)); // Descending ID sort

        setArticles(processedArticles);
        setSelectedMainArea('all');
        setSelectedSubLocation('all');
      } catch (err) {
        console.error('Σφάλμα φόρτωσης:', err);
        setError(`Πρόβλημα φόρτωσης: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category, subcategory]);

  // Update available main areas when articles change
  useEffect(() => {
    const mainAreas = ['all', ...new Set(
      articles.map(a => a.mainArea).filter(a => a)
    )].sort((a, b) => a.localeCompare(b));
    
    setAvailableMainAreas(mainAreas);
  }, [articles]);

  // Update available sublocations when main area changes
  useEffect(() => {
    const filtered = articles.filter(article => 
      selectedMainArea === 'all' || article.mainArea === selectedMainArea
    );

    const subLocations = ['all', ...new Set(
      filtered.flatMap(a => a.subLocation).filter(a => a)
    )].sort((a, b) => a.localeCompare(b));

    setAvailableSubLocations(subLocations);
    setSelectedSubLocation('all');
  }, [selectedMainArea, articles]);

  const filteredArticles = articles.filter(article => {
    const mainAreaMatch = selectedMainArea === 'all' || article.mainArea === selectedMainArea;
    const subLocationMatch = selectedSubLocation === 'all' || 
                           article.subLocation.includes(selectedSubLocation);
    
    return mainAreaMatch && subLocationMatch;
  });

  const canonicalSegments = [category];
  if (subcategory) {
    canonicalSegments.push(subcategory);
  }
  const canonicalUrl = `https://haunted.gr/${canonicalSegments.filter(Boolean).join('/')}`;
  const pageTitle = `${currentConfig?.displayName || category} - Haunted.gr`;
  const pageDescription = currentConfig?.description || 'Εξερευνήστε τη συλλογή μας με ιστορίες και άρθρα.';
  const ogImage = currentConfig?.image?.src
    ? `https://haunted.gr${currentConfig.image.src}`
    : 'https://haunted.gr/og-default-image.jpg';

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
        <span className="ml-2">Φόρτωση άρθρων...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600">Σφάλμα</h2>
        <p>{error}</p>
        <Link to="/" className="text-blue-600 underline">Επιστροφή στην αρχική</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="haunted.gr" />
        <meta property="og:locale" content="el_GR" />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <span className="bg-white bg-clip-text text-transparent">
              {currentConfig?.displayName || category}
            </span>
          </h1>
          
          {currentConfig?.description && (
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {currentConfig.description}
            </p>
          )}

          {/* Filter Controls */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ευρύτερη περιοχή
              </label>
              <select
                value={selectedMainArea}
                onChange={(e) => setSelectedMainArea(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500"
              >
                {availableMainAreas.map(area => (
                  <option key={area} value={area}>
                    {area === 'all' ? 'Όλες οι περιοχές' : area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Τοποθεσία
              </label>
              <select
                value={selectedSubLocation}
                onChange={(e) => setSelectedSubLocation(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500"
              >
                {availableSubLocations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'Όλες οι τοποθεσίες' : loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-gray-400 text-sm">
            Εμφανίζονται {filteredArticles.length} από {articles.length} συνολικά άρθρα
          </div>
        </header>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Δεν βρέθηκαν άρθρα για αυτήν την κατηγορία</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => {
              const config = SUBCATEGORY_MAP[article.subcategory || category];
              const categoryConfig = CATEGORY_CONFIG[config?.category || category];

              const mainCategory = categoryConfig?.category || config?.category || category;
              const pathSegments = [mainCategory];

              if (article.subcategory && article.subcategory !== 'all') {
                pathSegments.push(article.subcategory);
              }

              pathSegments.push(article.slug);

              const articlePath = `/${pathSegments.filter(Boolean).join('/')}`;

              return (
                <article 
                  key={article.id}
                  className="group relative bg-transparent rounded-2xl p-4 overflow-hidden hover:transform hover:scale-[1.02] duration-300 border shadow-xl border-gray-700"
                >
                  <Link to={articlePath} className="block">
                    {article.image?.src && (
                      <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10" />
                        <LazyLoadImage
                          src={article.image.src}
                          alt={article.image.alt}
                          effect="opacity"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          placeholderSrc="/placeholder.jpg"
                        />
                        {article.locationTags?.length > 0 && (
                          <div className="absolute bottom-2 left-2 z-20 flex items-center bg-black/60 px-3 py-1 rounded-full text-sm text-white">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4 mr-1 text-purple-400"
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                            </svg>
                            <span>{article.locationTags[0]}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-2 space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-white  text-sm font-medium mt-3">
                        <span>Διαβάστε περισσότερα</span>
                        <svg 
                          className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M14 5l7 7m0 0l-7 7m7-7H3" 
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
