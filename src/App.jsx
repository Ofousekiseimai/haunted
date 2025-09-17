import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ButtonGradient from './assets/svg/ButtonGradient';
import Header from './components/Header';
import Footer from './components/Footer';
import GoToTop from './components/GoToTop';
import LaografikoMap from './pages/LaografikoMap';
import Laografia from './pages/Laografia';
import ArticlePage from './components/ArticlePage';
import { HelmetProvider } from 'react-helmet-async';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './components/NotFoundPage';
import SearchResultsPage from './pages/SearchResultPage';
import Efimerides from './pages/Efimerides';
import EfimeridesMap from './pages/EfimeridesMap';
import Home from './pages/Home';
import 'leaflet/dist/leaflet.css';
import AboutPage from './pages/About';
import TermsPage from './pages/Terms';
import PrivacyPage from './pages/Privacy';
import ReactGA from 'react-ga4';
import Epse from './pages/Epse';
import ScrollToTop from './components/ScrollToTop';

// Initialize GA4
ReactGA.initialize('G-FXJ30XVLMD', {
  gaOptions: {
    debug_mode: import.meta.env.DEV 
  }
});

const App = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search
    });
  }, [location]);

 
  useEffect(() => {
  const preventDefault = (e) => e.preventDefault();

  const blockKeys = (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
    }
  };

  document.addEventListener('contextmenu', preventDefault);
  document.addEventListener('selectstart', preventDefault);
  document.addEventListener('dragstart', preventDefault);
  document.addEventListener('keydown', blockKeys);

  return () => {
    document.removeEventListener('contextmenu', preventDefault);
    document.removeEventListener('selectstart', preventDefault);
    document.removeEventListener('dragstart', preventDefault);
    document.removeEventListener('keydown', blockKeys);
  };
}, []);

  
  

  return (
    <>
      <HelmetProvider>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
          <ScrollToTop />
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Home />} />

          {/* Special Category Index Pages */}
          <Route path="/laografia" element={<Laografia />} />
          <Route path="/etaireia-psychikon-ereynon" element={<Epse/>} />
          <Route path="/efimerides" element={<Efimerides />} />
          <Route path="/map" element={<EfimeridesMap />} />
          <Route path="/map2" element={<LaografikoMap />} />
          <Route path="/about-us" element= {<AboutPage/>} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          {/* Unified Dynamic Routing */}
          <Route path="/:category">
            <Route index element={<CategoryPage />} />
            <Route path=":subcategory">
              <Route index element={<CategoryPage />} />
              <Route path=":slug" element={<ArticlePage />} />
            </Route>
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
          
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>

        <Footer />
      </div>
      
      {/* Add GoToTop component here */}
      <GoToTop />
      <ButtonGradient />
      </HelmetProvider>
    </>
  );
};

export default App;