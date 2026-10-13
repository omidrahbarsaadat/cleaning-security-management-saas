export const locales = ["de", "fa", "en"] as const;

export type Locale = (typeof locales)[number];
export type TextDirection = "ltr" | "rtl";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getDirection(locale: Locale): TextDirection {
  return locale === "fa" ? "rtl" : "ltr";
}
