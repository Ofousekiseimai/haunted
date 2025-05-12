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
            onSearch(); // This will trigger the parent's close
            onClose(); // Close the popup immediately
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

  const toggleNavigation = () => {
    setOpenNavigation(!openNavigation);
    if (!openNavigation) disablePageScroll();
    else enablePageScroll();
  };

  const handleMobileSearch = (query) => {
    setShowMobileSearch(false);
    enablePageScroll();
  };

  const handleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleSubItemClick = (url) => {
    setOpenNavigation(false);
    enablePageScroll();
    if (url.startsWith("#")) {
      const element = document.querySelector(url);
      element?.scrollIntoView({ behavior: "smooth" });
    }
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
          <nav className={`${
  openNavigation ? "flex" : "hidden"
} fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}>
  {/* Mobile menu background image ▼ */}
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
                      <div className={`${
                        openDropdown === item.id ? 'block' : 'hidden'
                      } lg:absolute lg:top-full lg:left-0 lg:w-48 lg:bg-n-8 lg:rounded-lg lg:shadow-xl ${
                        openNavigation ? 'static w-full bg-transparent shadow-none' : ''
                      } transition-all duration-300 origin-top`}>
                        <div className="lg:py-2">
                          {item.subitems.map((subitem) => (
                            <Link
                              key={subitem.slug}
                              to={subitem.url}
                              className="block px-6 py-3 text-sm text-white hover:bg-purple-500 transition-colors lg:text-xs lg:px-4 lg:py-2"
                              onClick={() => {
                                handleSubItemClick(subitem.url);
                                setOpenDropdown(null);
                              }}
                            >
                              {subitem.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block w-1/3 mx-4">
              <SearchBar />
            </div>

            {/* Mobile Search Button */}
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