import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom"; // Add Link for routing

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = (url) => {
    if (openNavigation) {
      enablePageScroll();
      setOpenNavigation(false);
    }
    // If the link points to an internal section, scroll to it
    if (url.startsWith("#")) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={`header-container fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
  openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
}`}>
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        {/* Left Section */}
        <div className="flex items-center w-1/2">
          <a className="block w-[12rem] xl:mr-8" href="#hero">
           <Link
    to="/"
    className="mr-4 text-sm font-semibold text-n-1 transition-colors hover:text-color-1 lg:mr-6"
  >
    Hanted.gr
  </Link>
          </a>
        </div>

        {/* Right Section */}
        <div className="flex items-center w-1/2 justify-end">
          <nav
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
          >
             <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseLeave={() => setOpenDropdown(null)}
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

                  {/* Mobile Dropdown */}
                  {openDropdown === item.id && (
                    <div className="lg:hidden pl-4">
                      {item.subitems?.map((subitem) => (
                        <Link
                          key={subitem.slug}
                          to={subitem.url}
                          className="block py-2 text-n-1 hover:text-color-1"
                          onClick={() => handleClick(subitem.url)}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

         
         

          {/* Hamburger Menu for Mobile */}
          <Button
            className="ml-auto lg:hidden"
            px="px-3"
            onClick={toggleNavigation}
          >
            <MenuSvg openNavigation={openNavigation} />
          </Button>
        </div>
      </div>

      {/* Overlay Menu with Effects */}
      {openNavigation && <HamburgerMenu />}
    </div>
  );
};

export default Header;
