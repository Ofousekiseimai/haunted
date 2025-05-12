import Section from "./Section";
import ButtonGradient from "../assets/svg/ButtonGradient";
import { Helmet } from "react-helmet-async";




const Hero = () => {
  return (
    <Section className="pt-[8rem] -mt-[5.25rem] relative overflow-hidden" customPaddings id="hero">
      {/* Glowing Background Elements */}
     

      <div className="container relative z-10 flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="relative  w-full">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-800">
              Haunted Greece
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Παραδόσεις, Μαρτυρίες για Παράξενα Φαινόμενα, Όντα και Εγκλήματα στην Ελλάδα.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
          
          </div>
        </div>

        {/* Image/Artwork Section */}
       
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
      <ButtonGradient className="absolute top-1/2 right-0 transform -translate-y-1/2 opacity-20" />
    </Section>
  );
};

export default Hero;