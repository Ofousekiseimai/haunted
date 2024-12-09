import Section from "./Section";

import { style3 } from "../assets";

const Hero = () => {
  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" customPaddings id="hero">
      <div className="container relative flex flex-col-reverse md:flex-row">
        {/* Left Section (Text) */}
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-6 md:w-1/2 md:text-left md:mr-10">
          <h1 className="h1 mb-6">
            Unlock the Future of Enterprise with CNO
            
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-1 lg:mb-8">
            Reshaping the Financial Landscape for Small & Medium Enterprises 
          </p>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-3 lg:mb-8">
            
          </p>
        </div>

        {/* Right Section (Image) */}
        <div className="relative md:w-1/2 md:max-w-5xl xl:mb-24">
          

          {/* Background Image */}
          <div className="absolute -top-[54%] left-1/2 w-[100%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={style3}
              className="w-full darken-on-mobile"
              width={1440}
              height={1800}
              alt="hero"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
