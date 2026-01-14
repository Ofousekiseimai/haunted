import { cookies, headers } from "next/headers";

import { DEFAULT_LOCALE, type Locale } from "./content";
import { LOCALE_COOKIE_KEY, SUPPORTED_LOCALES } from "./locale";

function normalizeLocale(value?: string | null): Locale | null {
  if (!value) {
    return null;
  }

  const lowered = value.toLowerCase();

  if (SUPPORTED_LOCALES.includes(lowered as Locale)) {
    return lowered as Locale;
  }

  if (lowered.startsWith("en")) {
    return "en";
  }

  if (lowered.startsWith("el") || lowered.startsWith("gr")) {
    return "el";
  }

  return null;
}

async function getLocaleFromAcceptLanguage() {
  const hdrs = await headers();
  const acceptLanguage = hdrs.get("accept-language");
  if (!acceptLanguage) {
    return null;
  }

  const candidates = acceptLanguage.split(",").map((entry) => entry.trim().split(";")[0]);
  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
  if (cookieLocale) {
    return cookieLocale;
  }

  const acceptLanguageLocale = await getLocaleFromAcceptLanguage();
  if (acceptLanguageLocale === "el") {
    return "el";
  }

  return DEFAULT_LOCALE;
}
