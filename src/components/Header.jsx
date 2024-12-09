import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { CNO } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom"; // Add Link for routing

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

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
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        {/* Left Section */}
        <div className="flex items-center w-1/2">
          <a className="block w-[12rem] xl:mr-8" href="#hero">
            <img src={CNO} width={100} height={60} alt="cnologo" />
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
                <Link
                  key={item.id}
                  to={item.url}
                  className={`block relative font-code text-xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-n-1"
                      : "lg:text-n-1/50"
                  } lg:leading-5 lg:hover:text-n-1 xl:px-14`}
                  onClick={() => handleClick(item.url)} // Call handleClick when clicked
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>

          {/* Buttons */}
          <Button className="hidden lg:flex" href="#whitepaper">
            Pitch Deck
          </Button>

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
