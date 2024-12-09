import React from "react";
import { teamMembers } from "../constants"; // Import team members from constants
import Section from "./Section";

const TeamSection = () => {
  return (
    <Section id="about" className= " flex justify-center items-center mx-auto p-20 ">
            
      <div className="text-center mb-20">
        <h2 className="h1 mb-6 ">TEAM</h2>
      
        {/* Team members grid */}
        <div className="flex flex-wrap gap-10 mb-0">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative p-0.5 md:max-w-[20rem]"
                         >
              {/* Gradient Border Container */}
              <div className="relative p-1 rounded-lg">
                <div className="relative inset-0 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-pink-400 p-[2px]">
                  {/* Inner transparent content with gradient border */}
                  <div className="relative p-6 bg-n-8 rounded-md flex flex-col items-center">
                   
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-72 h-72 object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    <p className="text-lg text-purple-500 mb-4">{member.title}</p>

                    {/* Social icons container */}
                    <div className="flex space-x-4">
                      {member.socials.map((social, index) => (
                        <a key={index} href={social.url}>
                          <img
                            src={social.iconUrl}
                            alt={social.title}
                            className="w-6 h-6"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default TeamSection;
