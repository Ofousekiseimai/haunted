// pages/Home.jsx
import { Helmet } from 'react-helmet-async';
import HomeArticles from '../components/HomeArticles';
import { SUBCATEGORY_MAP } from '../constants/categories';
import Hero from '../components/Hero';
import YouTubeSection from '../components/YoutubeSection';
import youtubeData from '../data/youtube.json';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const loadData = async (subcategory, category) => {
  try {
    const module = await import(`../data/${category}/${subcategory}.json`);
    return module.default;
  } catch (error) {
    throw new Error(`Failed to load ${subcategory} data: ${error.message}`);
  }
};

const Home = () => {
 
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
    Αρθρα Παραδόσεις / Λαογραφία
  </h2>
  <HomeArticles
    mainCategory="laografia"
    subcategories={Object.keys(SUBCATEGORY_MAP).filter(
      key => SUBCATEGORY_MAP[key].category === 'laografia'
    )}
    defaultSubcategory="kalikatzaroi"
    dataImporter={(sub) => loadData(sub, 'laografia')}
  />
  
  {/* Add this button container */}
  <div className="flex justify-center mt-8">
  
  <Link 
      to="/map2"
      className="bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px] text-white rounded-lg hover:shadow-xl transition-all duration-300"
    >
      <span className="block bg-gray-900 hover:bg-gray-800 px-6 py-2 rounded-md transition-colors duration-200 font-medium">
        Aνακάλυψε όλα τα άρθρα στο Χάρτη
      </span>
    </Link>
  </div>
</section>

        {/* Εφημερίδες Section */}
        <section className="mb-16" id="efimerides">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">
            Αρθρα Εφημερίδων
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
        Aνακάλυψε όλα τα άρθρα στο Χάρτη
      </span>
    </Link>
  </div>
        </section>
      </div>

      <div className='min-h-sceen bg-gray-900'></div>
      <YouTubeSection videosData={youtubeData} />
      <div/>
    </div>
  );
};

export default Home;