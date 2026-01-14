export type Locale = "el" | "en";

export const DEFAULT_LOCALE: Locale = "el";
export const LOCALE_COOKIE_KEY = "haunted-locale";
export const SUPPORTED_LOCALES: Locale[] = ["el", "en"];

export function getNextLocale(current: Locale): Locale {
  return current === "en" ? "el" : "en";
}
