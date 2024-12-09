import React from 'react';
import { socials } from '../constants';
import Section from './Section';
import Button from "./Button";

const JoinUsSection = () => {
  return (
    <Section id="contact" className="bg-transparent text-center m-3">
      <h2 className="text-4xl font-bold mb-4">JOIN US</h2>
      <p className="text-lg mb-8">
        Follow us on our social media platforms to stay updated on the latest developments and opportunities at CNO.
      </p>

      <div className="flex justify-center gap-8">
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <img
              src={social.iconUrl}
              alt={social.title}
              className="w-8 h-8 mb-2 hover:opacity-80 transition-opacity duration-300"
            />
           
          </a>
        ))}
      </div>
      <div className="flex justify-center gap-8 mt-10">
      <Button className 
      href="https://hwc4jqn32d9.typeform.com/to/K8N5V30D"
      target="_blank">
            Become a Partner
          </Button>
          </div>
    </Section>
  );
};

export default JoinUsSection;


