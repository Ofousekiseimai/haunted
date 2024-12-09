import Section from "./Section";
import { titles } from "../constants";

const AnimatedTitlesSection = () => {
  

  return (
    <Section className="overflow-hidden mt-10 lg:mt-20 ">
      <div className="flex flex-col items-center space-y-3">
        {titles.map((line, index) => (
          <div key={index} className="overflow-hidden w-[1400px]">
            <div
              className={`flex gap-4 whitespace-nowrap animate-line-${
                index + 1
              }`}
              style={{ display: "flex", gap: "1rem" }}
            >
              {[...line, ...line, ...line].map((title, i) => (
                <div
                  key={i + 1}
                  className="px-6 py-2 bg-cyan-500 bg-opacity-45 text-white text-xl font-semibold rounded-xl"
                >
                  {title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default AnimatedTitlesSection;
