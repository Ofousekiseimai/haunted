import { type Locale } from "./content";

export const LOCALE_COOKIE_KEY = "haunted-locale";
export const SUPPORTED_LOCALES: Locale[] = ["el", "en"];

export function getNextLocale(current: Locale): Locale {
  return current === "en" ? "el" : "en";
}
