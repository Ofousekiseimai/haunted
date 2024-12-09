import React from "react";
import { articles } from "../constants";
import ButtonGradient from "../assets/svg/ButtonGradient";
import Button from "./Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import Section from "./Section";

const Media = () => {
  return (
    <Section id="media" className="overflow-hidden mt-10 lg:mt-10 ">
      <ButtonGradient />

      <div className="container relative z-2">
        <div className="text-center mb-2">
          <h2 className="h1 mb-6 ">MEDIA</h2>
        </div>

        {/* Swiper Slider with Pagination and Responsive Preview */}
        <Swiper
          spaceBetween={20}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="w-full swiper-container"
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {articles.map((article) => (
            <SwiperSlide
              key={article.id}
              className="flex justify-center mx-auto p-8"
            >
              <div className="relative p-0.5 w-[500px] h-[450px] bg-no-repeat bg-[length:100%_100%] rounded-lg mx-auto ">
                <div className="relative p-1 rounded-lg ">
                  <div className="relative inset-0 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-[2px] h-full">
                    <div className="relative  p-[2.4rem] bg-n-8 rounded-md h-full flex flex-col justify-between">
                      <div className="text-center">
                        <h5 className="text-xl font-bold mb-4 p-4">
                          {article.title}
                        </h5>
                        {/* Render the icon below the title */}
                        <img
                          src={article.iconUrl}
                          alt={`${article.title} icon`}
                          className="mx-auto mb-4 "
                          style={{ width: "50px", height: "50px" }} // Adjust width and height as needed
                        />
                        <p className="text-neutral-100">{article.text}</p>
                      </div>
                      {/* Pass the article URL to the Button component */}
                      <Button href={article.url} className="mt-4" white>
                        Read more
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Section>
  );
};

export default Media;
