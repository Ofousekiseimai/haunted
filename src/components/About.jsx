import { about } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import ClipPath from "../assets/svg/ClipPath";
import ButtonGradient from "../assets/svg/ButtonGradient"; // Import the gradient SVG

const Benefits = () => {
  return (
    <Section id="about" className="overflow-hidden mt-10 lg:mt-20">
      {/* Render the gradient definitions */}
      <ButtonGradient />

      <div className="container relative z-2">
        <Heading className="md:max-w-md lg:max-w-2xl" />

        <div className="flex flex-wrap gap-10 mb-0">
          {about?.map((item) => (
            <div
              className="relative p-0.5 bg-no-repeat bg-[length:50%_100%] md:max-w-[24rem]"
              key={item.id}
                      >
              {/* Gradient Border Container */}
              <div className="relative p-1 rounded-lg">
                <div className="relative inset-0 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px]">
                  {/* Inner content with gradient border */}
                  <div className="relative p-[2.4rem] bg-n-8 rounded-md">
                    <h5 className="h5 mb-5 font-bold">{item.title}</h5>
                    <p className="body-2 mb-6 text-neutral-100">{item.text}</p>
                    <div className="flex items-center mt-auto">
                      {/* Additional content here */}
                    </div>
                  </div>
                </div>
              </div>
              <ClipPath />
              
            </div>
          ))}
        </div>

        {/* Company Logo Section */}
       
      </div>
    </Section>
  );
};

export default Benefits;
