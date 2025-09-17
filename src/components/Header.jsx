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
  className={`flex items-center font-code text-xl uppercase text-n-1 transition-colors hover:text-color-1
    ${item.onlyMobile ? "lg:hidden" : ""}
    px-3 lg:px-4 xl:px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-sm xl:text-base lg:font-semibold
    ${item.url === pathname.hash ? "z-2 lg:text-n-1" : "lg:text-n-1"}
    lg:leading-5 lg:hover:text-n-1 whitespace-nowrap flex-shrink-0`}
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
  className={`block relative font-code text-xl uppercase text-n-1 transition-colors hover:text-color-1
    ${item.onlyMobile ? "lg:hidden" : ""}
    px-4 lg:px-6 xl:px-8 py-6 md:py-8 lg:-mr-0.25 lg:text-sm xl:text-base lg:font-semibold
    ${item.url === pathname.hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50"}
    lg:leading-5 lg:hover:text-n-1 whitespace-nowrap`}
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
  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 2a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/>
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