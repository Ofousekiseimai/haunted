import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { Link } from "react-router-dom";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Custom scroll lock that only prevents body scroll
  const disableBodyScroll = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  };

  const enableBodyScroll = () => {
    document.body.style.overflow = 'unset';
    document.body.style.position = 'static';
    document.body.style.width = 'auto';
  };

  const handleDropdownToggle = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      setOpenDropdown(null);
      enableBodyScroll();
    } else {
      setOpenNavigation(true);
      disableBodyScroll();
    }
  };

  const handleSubcategoryClick = (url) => {
    setOpenNavigation(false);
    setOpenDropdown(null);
    enableBodyScroll();
    
    if (url.startsWith("#")) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleClick = (url) => {
    if (openNavigation) {
      setOpenNavigation(false);
      setOpenDropdown(null);
      enableBodyScroll();
    }
    if (url.startsWith("#")) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openNavigation && !event.target.closest('.mobile-menu-container')) {
        setOpenNavigation(false);
        setOpenDropdown(null);
        enableBodyScroll();
      }
    };

    if (openNavigation) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openNavigation]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      enableBodyScroll();
    };
  }, []);

  return (
    <div className={`header-container fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
      openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
    }`}>
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        {/* Left Section */}
        <div className="flex items-center w-1/2">
          <Link
            to="/"
            className="block w-[12rem] xl:mr-8 text-sm font-semibold text-n-1 transition-colors hover:text-color-1"
            onClick={() => {
              setOpenNavigation(false);
              setOpenDropdown(null);
              enableBodyScroll();
            }}
          >
            Haunted.gr
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center w-1/2 justify-end">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:mx-auto lg:bg-transparent">
            <div className="relative z-2 flex items-center justify-center lg:flex-row">
              {navigation.map((item) => (
                <div
                  key={item.id}
                  className="relative group"
                >
                  <div className="flex items-center">
                    {item.subitems ? (
                      <>
                        <button
                          className={`flex items-center font-code text-xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                            item.onlyMobile ? "lg:hidden" : ""
                          } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                            item.url === pathname.hash
                              ? "z-2 lg:text-n-1"
                              : "lg:text-n-1"
                          } lg:leading-5 lg:hover:text-n-1 xl:px-14`}
                          onClick={() => handleDropdownToggle(item.id)}
                          onMouseEnter={() => setOpenDropdown(item.id)}
                        >
                          {item.title}
                          <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Desktop Dropdown */}
                        <div
                          className={`hidden lg:block absolute top-full left-0 bg-n-8 min-w-[200px] rounded-lg shadow-lg ${
                            openDropdown === item.id ? "lg:block" : "lg:hidden"
                          }`}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div className="flex flex-col py-2">
                            {item.subitems.map((subitem) => (
                              <Link
                                key={subitem.slug}
                                to={subitem.url}
                                className="px-6 py-3 text-sm text-n-1 hover:bg-n-7"
                                onClick={() => handleClick(subitem.url)}
                              >
                                {subitem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        to={item.url}
                        className={`block relative font-code text-xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                          item.onlyMobile ? "lg:hidden" : ""
                        } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                          item.url === pathname.hash
                            ? "z-2 lg:text-n-1"
                            : "lg:text-n-1/50"
                        } lg:leading-5 lg:hover:text-n-1 xl:px-14`}
                        onClick={() => handleClick(item.url)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/haunted.gr/"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-4 lg:mr-6"
            
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-current text-n-1 hover:text-color-1 transition-colors"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 极狐 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 极狐 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-极狐 6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Hamburger Menu for Mobile */}
          <Button
            className="ml-auto lg:hidden mobile-menu-container"
            px="px-3"
            onClick={toggleNavigation}
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Separate from desktop */}
      {openNavigation && (
        <div className="lg:hidden mobile-menu-container">
          <div className="fixed inset-0 bg-n-8 pt-16 z-40">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-n-1 z-50"
              onClick={toggleNavigation}
              aria-label="Close menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 极狐 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Mobile Menu Content - Scrollable container */}
            <div className="h-full overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto px-4 py-6" style={{ WebkitOverflowScrolling: 'touch' }}>
                {navigation.map((item) => (
                  <div key={item.id} className="mb-4">
                    {item.subitems ? (
                      <>
                        <button
                          className="flex items-center justify-between w-full text-left text-xl uppercase text-n-1 py-4 px-4 border-b border-n-6"
                          onClick={() => handleDropdownToggle(item.id)}
                        >
                          <span>{item.title}</span>
                          <svg
                            className={`ml-2 h-5 w-5 transform transition-transform ${
                              openDropdown === item.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {openDropdown === item.id && (
                          <div className="pl-6 bg-n-7 rounded-lg mt-2">
                            {item.subitems.map((subitem) => (
                              <Link
                                key={subitem.slug}
                                to={subitem.url}
                                className="block py-3 px-4 text-lg text-n-1 border-b border-n-6 last:border-b-0 hover:bg-n-6 transition-colors"
                                onClick={() => handleSubcategoryClick(subitem.url)}
                              >
                                {subitem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.url}
                        className="block text-xl uppercase text-n-1 py-4 px-4 border-b border-n-6 hover:text-color-1 transition-colors"
                        onClick={() => handleClick(item.url)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay Menu with Effects */}
      {openNavigation && <HamburgerMenu />}
    </div>
  );
};

export default Header;