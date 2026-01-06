import { Section } from "@/components/section";
import { ButtonGradient } from "@/components/svg/button-gradient";
import type { Locale } from "@/lib/locale";
import { getHomeCopy } from "@/lib/i18n/ui";

type HomeHeroProps = {
  locale: Locale;
};

export function HomeHero({ locale }: HomeHeroProps) {
  const copy = getHomeCopy(locale);

  return (
    <Section
      id="hero"
      className="relative overflow-hidden"
      customPaddings="pt-[8rem] pb-0 -mt-[5.25rem]"
    >
      <div className="container relative z-10 flex flex-col-reverse items-center gap-12 md:flex-row">
        <div className="relative w-full">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-color-5 via-color-1 to-color-6 bg-clip-text text-transparent">
              Haunted Greece
            </span>
          </h1>
          <p className="mt-6 text-xl text-n-2 md:text-2xl">
            {copy.heroTagline}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-n-8/80 to-transparent" />
      <ButtonGradient />
    </Section>
  );
}
