import React from "react";
import Section from "./Section";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Section className="bg-transparent">
      <div className="container mx-auto flex flex-col items-center gap-4 p-4">

        {/* Main Page Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link 
            to="/laografia" 
            className="text-n-4 hover:text-white transition-colors"
          >
            Λαογραφία
          </Link>
          <Link 
            to="/efimerides" 
            className="text-n-4 hover:text-white transition-colors"
          >
            Εφημερίδες
          </Link>
          <Link 
            to="/about-us" 
            className="text-n-4 hover:text-white transition-colors"
          >
           Σχετικά
          </Link>
          <Link 
            to="/map" 
            className="text-n-4 hover:text-white transition-colors"
          >
            Χάρτης
          </Link>
        </div>

        {/* Contact and Legal Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <a 
            href="mailto:info@haunted.gr" 
            className="text-n-4 hover:text-white transition-colors"
          >
            info@haunted.gr
          </a>
          <Link 
            to="/terms" 
            className="text-n-4 hover:text-white transition-colors"
          >
            Όροι Χρήσης
          </Link>
          <Link 
            to="/privacy" 
            className="text-n-4 hover:text-white transition-colors"
          >
            Απόρρητο
          </Link>
        </div>

        {/* Social Icons and Copyright Row */}
        <div className="flex justify-between items-center w-full max-w-screen-lg sm:flex-row flex-col gap-4">
          <p className="caption text-n-4">
            © Haunted.gr 2025 All rights reserved.
          </p>
        </div>

        {/* Full-width Line Separator */}
        <div className="w-full h-px bg-white/50 my-4"></div>

        {/* Disclaimer Text */}
       
      </div>
    </Section>
  );
};

export default Footer;