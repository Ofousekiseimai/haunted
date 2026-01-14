"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { LOCALE_COOKIE_KEY, getNextLocale, type Locale } from "@/lib/locale";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type LanguageSwitchProps = {
  initialLocale: Locale;
  variant?: "desktop" | "mobile";
};

export function LanguageSwitch({ initialLocale, variant = "desktop" }: LanguageSwitchProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  const handleToggle = () => {
    const nextLocale = getNextLocale(locale);
    document.cookie = `${LOCALE_COOKIE_KEY}=${nextLocale};path=/;max-age=${ONE_YEAR_SECONDS}`;
    setLocale(nextLocale);
    startTransition(() => {
      router.refresh();
    });
  };

  const label = locale === "en" ? "EN" : "EL";
  const targetLabel = locale === "en" ? "EL" : "EN";

  const baseClasses =
    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-color-1 disabled:opacity-60";
  const variantClasses =
    variant === "mobile"
      ? "w-full justify-center border-n-6 bg-n-7 text-n-1 hover:border-color-1 hover:text-color-1"
      : "border-n-6 text-n-1 hover:border-color-1 hover:text-color-1";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`${baseClasses} ${variantClasses}`}
      aria-label={`Switch language to ${targetLabel}`}
    >
      <span>{label}</span>
      <span className="text-n-4">/</span>
      <span className="text-n-3">{targetLabel}</span>
    </button>
  );
}
