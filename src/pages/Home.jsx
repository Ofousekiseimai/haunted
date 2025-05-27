import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeArticles from '../components/HomeArticles';
import { SUBCATEGORY_MAP } from '../constants/categories';
import Hero from '../components/Hero';
import YouTubeSection from '../components/YoutubeSection';

const Home = () => {
  const [youtubeData, setYoutubeData] = useState(null); // Changed to null initial state

  // Φόρτωση YouTube δεδομένων
  useEffect(() => {
    fetch('/data/youtube.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setYoutubeData(data))
      .catch(error => console.error('Error loading YouTube data:', error));
  }, []);

  const loadData = async (subcategory, category) => {
    try {
      const response = await fetch(`/data/${category}/${subcategory}.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      throw new Error(`Failed to load ${subcategory} data: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Haunted Greece - Αρχική Σελίδα</title>
        <meta 
          name="description" 
          content="Εξερευνήστε την ελληνική λαογραφία και ιστορικά άρθρα από εφημερίδες. Διαδραστικός χάρτης, βρυκόλακες, δαίμονες και παραδόσεις." 
        />
      </Helmet>

      <Hero />
      
      <div className="container mx-auto px-4 py-16">
        {/* Λαογραφία Section */}
        <section className="mb-16" id="laografia">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">
            Άρθρα Παραδόσεις / Λαογραφία
          </h2>
          <HomeArticles
            mainCategory="laografia"
            subcategories={Object.keys(SUBCATEGORY_MAP).filter(
              key => SUBCATEGORY_MAP[key].category === 'laografia'
            )}
            defaultSubcategory="vrikolakes"
            dataImporter={(sub) => loadData(sub, 'laografia')}
          />
          
          <div className="flex justify-center mt-8">
            <Link 
              to="/map2"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px] text-white rounded-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="block bg-gray-900 hover:bg-gray-800 px-6 py-2 rounded-md transition-colors duration-200 font-medium">
                Ανακάλυψε όλα τα άρθρα στο Χάρτη
              </span>
            </Link>
          </div>
        </section>

        {/* Εφημερίδες Section */}
        <section className="mb-16" id="efimerides">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">
            Άρθρα Εφημερίδων
          </h2>
          <HomeArticles
            mainCategory="efimerides"
            subcategories={Object.keys(SUBCATEGORY_MAP).filter(
              key => SUBCATEGORY_MAP[key].category === 'efimerides'
            )}
            defaultSubcategory="egklimata"
            dataImporter={(sub) => loadData(sub, 'efimerides')}
          />

          <div className="flex justify-center mt-8">
            <Link 
              to="/map"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px] text-white rounded-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="block bg-gray-900 hover:bg-gray-800 px-6 py-2 rounded-md transition-colors duration-200 font-medium">
                Ανακάλυψε όλα τα άρθρα στο Χάρτη
              </span>
            </Link>
          </div>
        </section>
      </div>

      {/* Fixed YouTube section rendering */}
      {youtubeData?.playlists?.length > 0 && (
        <YouTubeSection videosData={youtubeData} />
      )}
    </div>
  );
};

export default Home;