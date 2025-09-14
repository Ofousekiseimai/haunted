import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";

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
      setOpenDropdown(null);
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
      setOpenDropdown(null);
    }
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
          <Link
            to="/"
            className="block w-[12rem] xl:mr-8 text-sm font-semibold text-n-1 transition-colors hover:text-color-1"
          >
            Haunted.gr
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center w-1/2 justify-end">
          <nav
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[5rem] left-0 right-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center w-full lg:flex-row">
              {navigation.map((item) => (
                <div
                  key={item.id}
                  className="relative group w-full lg:w-auto"
                >
                  <div className="flex flex-col items-center lg:flex-row">
                    {item.subitems ? (
                      <>
                        <button
                          className={`flex items-center justify-between w-full lg:w-auto font-code text-xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                            item.onlyMobile ? "lg:hidden" : ""
                          } px-6 py-4 md:py-6 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                            item.url === pathname.hash
                              ? "z-2 lg:text-n-1"
                              : "lg:text-n-1"
                          } lg:leading-5 lg:hover:text-n-1 xl:px-14`}
                          onClick={() => handleDropdownToggle(item.id)}
                        >
                          <span>{item.title}</span>
                          <svg
                            className={`ml-2 h-4 w-4 transform transition-transform ${
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

                        {/* Mobile Dropdown - Full expansion */}
                        <div
                          className={`w-full lg:hidden ${
                            openDropdown === item.id ? "block" : "hidden"
                          }`}
                        >
                          <div className="flex flex-col pl-10 bg-n-7">
                            {item.subitems.map((subitem) => (
                              <Link
                                key={subitem.slug}
                                to={subitem.url}
                                className="px-6 py-3 text-lg text-n-1 hover:bg-n-6 border-b border-n-6 last:border-b-0"
                                onClick={() => {
                                  handleClick(subitem.url);
                                  setOpenDropdown(null);
                                }}
                              >
                                {subitem.title}
                              </Link>
                            ))}
                          </div>
                        </div>

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
                        className={`block relative w-full lg:w-auto text-center font-code text-xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                          item.onlyMobile ? "lg:hidden" : ""
                        } px-6 py-4 md:py-6 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
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
          <a
            href="https://www.instagram.com/haunted.gr/"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-4 lg:mr-6"
            aria-label="Visit our Instagram"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-current text-n-1 hover:text-color-1 transition-colors"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

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