import Link from "next/link";

import { translateCategoryLabel } from "@/lib/translations";
import type { Locale } from "@/lib/locale";
import { getFooterCopy } from "@/lib/i18n/ui";
import { MailchimpSignup } from "../marketing/mailchimp-signup";

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear();
  const copy = getFooterCopy(locale);

  const categories = [
    { href: "/laografia", label: translateCategoryLabel("laografia", "Λαογραφία", locale) },
    { href: "/efimerides", label: translateCategoryLabel("efimerides", "Εφημερίδες", locale) },
    {
      href: "/etaireia-psychikon-ereynon",
      label: translateCategoryLabel(
        "etaireia-psychikon-ereynon",
        "Εταιρεία Ψυχικών Ερευνών",
        locale,
      ),
    },
    { href: "/vivlia", label: translateCategoryLabel("vivlia", "Βιβλία", locale) },
    { href: "/search", label: copy.search },
  ];

  const resources = [
    { href: "/chartis-laografia", label: copy.folkloreMap },
    { href: "/chartis-efimerides", label: copy.articlesMap },
    { href: "/terms", label: copy.terms },
    { href: "/privacy", label: copy.privacy },
    { href: "/about-us", label: copy.about },
  ];

  return (
    <footer className="foot">
      <div className="frame">
        <div className="foot__cols">
          <div>
            <p className="mono foot__head">{copy.categoriesLabel}</p>
            {categories.map((item) => (
              <Link key={item.href} href={item.href} className="foot__link">
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <p className="mono foot__head">{copy.resourcesLabel}</p>
            {resources.map((item) => (
              <Link key={item.href} href={item.href} className="foot__link">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <p className="mono foot__head">{copy.brandLabel}</p>
            <p className="text-[var(--t-small)] leading-6 text-[var(--ink-2)]">
              {copy.brandDescription}
            </p>
            <div className="mt-5">
              <MailchimpSignup />
            </div>
          </div>
        </div>

        {/* The copyright used to be centred while every other thing in the
            footer was flush left. Now the base row is one aligned band. */}
        <div className="foot__base">
          <span className="mono mono--micro">
            &copy; {year} haunted.gr {copy.allRights}
          </span>
          <span className="mono mono--micro foot__credit">designed by Trithemius 2026</span>
        </div>
      </div>
    </footer>
  );
}
