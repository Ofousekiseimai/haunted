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
      label: translateCategoryLabel("etaireia-psychikon-ereynon", "Εταιρεία Ψυχικών Ερευνών", locale),
    },
    { href: "/vivlia", label: translateCategoryLabel("vivlia", "Βιβλία", locale) },
    { href: "/search", label: copy.search },
  ];

  const resources = [
    { href: "/map2", label: copy.folkloreMap },
    { href: "/map", label: copy.articlesMap },
    { href: "/terms", label: copy.terms },
    { href: "/privacy", label: copy.privacy },
    { href: "/about-us", label: copy.about },
  ];

  return (
    <footer className="border-t border-n-6 bg-n-8/80 backdrop-blur-sm">
      <div className="container flex flex-col gap-10 py-12">
        <div className="grid gap-10 text-sm text-n-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-n-5">{copy.categoriesLabel}</p>
            <ul className="space-y-2 text-n-3">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-n-1">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-n-5">{copy.resourcesLabel}</p>
            <ul className="space-y-2 text-n-3">
              {resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-n-1">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-n-3">
            <p className="text-xs uppercase tracking-[0.28em] text-n-5">{copy.brandLabel}</p>
            <p className="leading-6 text-n-4">{copy.brandDescription}</p>
            <MailchimpSignup />
          </div>
        </div>

        <div className="h-px w-full bg-n-7/60" />

        <p className="caption text-center text-n-4">
          © {year} Haunted.gr {copy.allRights}
        </p>
      </div>
    </footer>
  );
}
