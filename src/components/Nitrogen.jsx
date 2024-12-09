import React, { useState } from "react";
import Section from "./Section";
import { NitrogenItems } from "../constants"; // Update the import to include NitrogenItems
import { style2 } from "../assets";

const NitrogenSection = () => {
  const [activeTab, setActiveTab] = useState("SME Features");

  // Filter items based on active tab
  const filteredItems = NitrogenItems.filter((item) => item.type === activeTab);

  return (
    <Section id="Nitrogen" className="w-full max-w-screen-xl mx-auto p-3">
      <div className="container relative flex flex-col-reverse md:flex-row mt-16">
        {/* Left Section (Text) */}
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-6 md:w-1/2 md:text-left md:mr-10">
          <h2 className="h1 mb-6">NITROGEN</h2>
          <p className="body-3 text-n-3 mb-4">
            Simplifies online advertising funding by establishing a dynamic ecosystem, connecting businesses and investors on a decentralized platform.
          </p>
          <p className="body-3 text-n-3 mb-4">
            Empowers businesses with affordable advertising solutions. Investors receive a share of profits from sales, fostering a supportive community. Drives growth for retail shops and businesses. Connects retailers with investors for marketing campaign funding. Stimulates economic growth within local economies.
          </p>
        </div>

        {/* Right Section (Image) */}
        <div className="relative md:w-1/2 md:max-w-5xl xl:mb-24">
          {/* Background Image */}
          <div className="absolute  left-1/2 w-[100%] -translate-x-1/2 md:-top-[46%] md:w-[90%] lg:-top-[20%]">
            <img
              src={style2}
              className="w-full darken-on-mobile hidden md:block"
              width={500}
              height={400}
              alt="Nitrogen Ecosystem"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 mb-2 p-8">
        {["SME Features", "Investor Features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative p-1 rounded-lg text-lg font-semibold ${
              activeTab === tab
                ? "bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px]"
                : "bg-transparent"
            }`}
          >
            <div
              className={`${
                activeTab === tab
                  ? "p-4 bg-n-8 rounded-md text-white"
                  : "p-4 text-white"
              }`}
            >
              {tab}
            </div>
          </button>
        ))}
      </div>

      {/* Display items for the active tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {filteredItems.map((item, index) => (
          <div key={index} className="relative p-4 rounded-lg">
            <div className="relative inset-0 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px]">
              {/* Inner content with gradient border */}
              <div className="relative p-8 bg-n-8 rounded-md">
                <h5 className="font-bold mb-2 text-white">{item.text}</h5>
                <p className="text-sm text-gray-300">{item.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default NitrogenSection;
