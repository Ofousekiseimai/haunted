import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  className?: string;
  customPaddings?: string;
  children: ReactNode;
};

export function Section({ id, className = "", customPaddings, children }: SectionProps) {
  const paddings = customPaddings ?? "py-10 lg:py-16 xl:py-15";
  return (
    <section id={id} className={`relative ${paddings} ${className}`}>
      {children}
    </section>
  );
}
