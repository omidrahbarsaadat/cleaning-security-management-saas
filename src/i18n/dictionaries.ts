import de from "@/locales/de.json";
import fa from "@/locales/fa.json";
import en from "@/locales/en.json";
import type { Locale } from "./config";

export const dictionaries = { de, fa, en } as const;
export type Dictionary = (typeof dictionaries)["de"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
