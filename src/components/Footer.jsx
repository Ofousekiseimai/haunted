import React from "react";
import Section from "./Section";
import { socials } from "../constants";

const Footer = () => {
  return (
    <Section className="bg-transparent">
      <div className="container mx-auto flex flex-col items-center gap-4 p-4">

        {/* Social Icons and Copyright Row */}
        <div className="flex justify-between items-center w-full max-w-screen-lg sm:flex-row flex-col gap-4">
          <p className="caption text-n-4">
            © CNO 2024. All rights reserved.
          </p>

          <ul className="flex gap-5">
            {socials.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-transparent rounded-full transition-colors hover:bg-n-6"
              >
                <img src={item.iconUrl} width={18} height={18} alt={item.title} />
              </a>
            ))}
          </ul>
        </div>

        {/* Full-width Line Separator */}
        <div className="w-full h-px bg-white/50 my-4"></div>

        {/* Disclaimer Text */}
        <p className="text-xs text-center text-neutral-500 max-w-screen-md mx-auto">
          The information provided on this website is for general informational purposes only. It does not constitute, and should not be considered, a formal offer to sell or a solicitation of an offer to buy any security in any jurisdiction, legal advice, investment advice, or tax advice. If you need legal, investment, or tax advice, please consult with a professional adviser. The Nolus protocol is under development and is subject to change. As such, the protocol documentation and contents of this website may not reflect the current state of the protocol at any given time. The protocol documentation and website content are not final and are subject to change.
        </p>
      </div>
    </Section>
  );
};

export default Footer;
