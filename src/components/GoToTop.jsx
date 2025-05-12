import React, { useState, useEffect } from 'react';

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 transition-opacity duration-200">
      <button
        onClick={scrollToTop}
        aria-label="Go to top"
        className={`bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px] text-white rounded-lg hover:shadow-xl transition-all ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="block bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors duration-200 p-2">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 15l7-7 7 7" 
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default GoToTop;