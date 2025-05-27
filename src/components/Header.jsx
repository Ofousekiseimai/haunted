import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import SearchIcon from "../assets/svg/SearchSvg";
import CloseIcon from "../assets/svg/CloseSvg";
import { HamburgerMenu } from "./design/Header";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import SearchBar from "./SearchBar";

const MobileSearchPopup = ({ show, onClose, onSearch }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [show, onClose]);

  return (
    <div className={`fixed inset-0 z-[60] bg-n-8/95 backdrop-blur-sm transition-opacity ${
      show ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="absolute top-0 left-0 right-0 p-4 bg-n-8 border-b border-purple-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-bold">Αναζήτηση</h2>
          <button onClick={onClose} className="text-purple-300 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <SearchBar onSearch={() => {
          onSearch();
          onClose();
        }} />
      </div>
    </div>
  );
};

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

useEffect(() => {
    if (openNavigation) {
      const scrollToElement = document.querySelector('[data-active="true"]');
      if (scrollToElement) {
        scrollToElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, [openDropdown, openNavigation]);

  const toggleNavigation = () => {
    setOpenNavigation(prev => !prev);
    setOpenDropdown(null);
    if (!openNavigation) disablePageScroll();
    else enablePageScroll();
  };

  const handleMobileSearch = () => {
    setShowMobileSearch(false);
    enablePageScroll();
  };

  const handleDropdown = (id) => {
    setOpenDropdown(prev => prev === id ? null : id);
  };

 const handleSubItemClick = (url, hasSubitems) => {
    if (!hasSubitems) {
      setOpenNavigation(false);
      enablePageScroll();
    }
    if (url.startsWith("#")) {
      const element = document.querySelector(url);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

   const renderSubitems = (items, level = 0) => {
  return items.map((subitem) => (
    <div 
      key={subitem.slug}
      className={`relative group ${level > 0 ? 'pl-4' : ''}`}
      data-active={openDropdown === subitem.slug ? "true" : "false"}
    
        onMouseEnter={() => !openNavigation && subitem.subitems && setOpenDropdown(subitem.slug)}
        onMouseLeave={() => !openNavigation && subitem.subitems && setTimeout(() => setOpenDropdown(null), 300)}
      >
        <Link
          to={subitem.url}
          className={`block px-6 py-3 text-sm text-white hover:bg-purple-500 transition-colors lg:text-xs lg:px-4 lg:py-2 ${
            level > 0 ? 'lg:pl-6' : ''
          }`}
          onClick={(e) => {
            if (subitem.subitems) {
              e.preventDefault();
              handleDropdown(subitem.slug);
            }
            handleSubItemClick(subitem.url, !!subitem.subitems);
          }}
        >
          <div className="flex items-center justify-between">
            {subitem.title}
            {subitem.subitems && (
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </Link>

       {subitem.subitems && (
  <div 
    className={`${
      openDropdown === subitem.slug ? 'opacity-100 visible' : 'opacity-0 invisible'
    } lg:absolute ${level > 0 ? 'lg:left-full lg:top-0' : 'lg:top-full lg:left-0'} lg:w-48 lg:bg-n-8 lg:rounded-lg lg:shadow-xl ${
      openNavigation ? 'static w-full bg-transparent shadow-none' : ''
    } transition-all duration-300 origin-top`}
    style={{ 
      marginLeft: level > 0 ? '0.75rem' : 0,
      zIndex: 10000 + level,
      maxHeight: openNavigation && window.innerWidth < 1024 ? '70vh' : 'none',
      overflowY: openNavigation && window.innerWidth < 1024 ? 'auto' : 'hidden'
    }}
  >
    {renderSubitems(subitem.subitems, level + 1)}
  </div>
)}
    </div>
  ));
};

  return (
    <>
      <MobileSearchPopup 
        show={showMobileSearch} 
        onClose={() => {
          setShowMobileSearch(false);
          enablePageScroll();
        }}
        onSearch={handleMobileSearch}
      />

      <div className={`fixed top-0 left-0 w-full z-50 border-b border-purple-600 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}>
        <div className="flex items-center justify-between px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
          <div className="w-1/4 lg:w-1/3 flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Haunted Greece
            </Link>
          </div>

          <div className="flex items-center w-3/4 lg:w-2/3 justify-end gap-2">
           <nav 
  className={`${
    openNavigation ? "flex" : "hidden"
  } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
  style={{
    overflowY: openNavigation ? 'auto' : 'hidden',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none' // Add this
  }}
>
              <div className="lg:hidden absolute inset-0 bg-[url('/images/laografia/to-apogeio-tou-katevatou-arachova.webp')] bg-cover bg-center opacity-20 z-0" />
              
              <div className="relative z-10 flex flex-col items-center justify-center m-auto lg:flex-row">
                {navigation.map((item) => (
                  <div 
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => !openNavigation && item.subitems && setOpenDropdown(item.id)}
                    onMouseLeave={() => !openNavigation && setOpenDropdown(null)}
                  >
                    <div className={`flex items-center font-code text-xl uppercase text-white transition-colors ${
                      item.onlyMobile ? "lg:hidden" : ""
                    } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:leading-5 xl:px-14`}>
                      <Link 
                        to={item.url} 
                        onClick={(e) => {
                          if (item.subitems) {
                            e.preventDefault();
                            handleDropdown(item.id);
                          } else {
                            handleSubItemClick(item.url);
                          }
                        }}
                        className="hover:text-color-1 cursor-pointer"
                      >
                        {item.title}
                      </Link>
                      {item.subitems && (
                        <svg 
                          className="ml-2 w-4 h-4 cursor-pointer" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          onClick={() => handleDropdown(item.id)}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>

                    {item.subitems && (
  <div 
    className={`${
      openDropdown === item.id ? 'opacity-100 visible' : 'opacity-0 invisible'
    } lg:absolute lg:top-full lg:left-0 lg:w-48 lg:bg-n-8 lg:rounded-lg lg:shadow-xl ${
      openNavigation ? 'static w-full bg-transparent shadow-none' : ''
    } transition-all duration-300 origin-top`}
    onMouseEnter={() => !openNavigation && setOpenDropdown(item.id)}
    // Add mouse leave handler
    onMouseLeave={() => !openNavigation && setTimeout(() => setOpenDropdown(null), 300)}
  >
    <div className="lg:py-2">
      {renderSubitems(item.subitems)}
    </div>
  </div>
)}
                  </div>
                ))}
              </div>
            </nav>

            <div className="hidden lg:block w-1/3 mx-4">
              <SearchBar />
            </div>

            <Button 
              className="lg:hidden" 
              px="px-3" 
              onClick={() => {
                setShowMobileSearch(true);
                disablePageScroll();
              }}
            >
              <SearchIcon className="w-6 h-6 text-white" />
            </Button>

            <Button className="lg:hidden" px="px-3" onClick={toggleNavigation}>
              <MenuSvg openNavigation={openNavigation} />
            </Button>
          </div>
        </div>

        {openNavigation && <HamburgerMenu />}
      </div>
    </>
  );
};

export default Header;