import de from "../../locales/de.json";
import fa from "../../locales/fa.json";
import en from "../../locales/en.json";
import type { Locale } from "./config";

export const dictionaries = { de, fa, en } as const;

type Widen<T> = T extends string
  ? string
  : T extends Record<string, unknown>
    ? { [Key in keyof T]: Widen<T[Key]> }
    : T;

export type Dictionary = Widen<typeof de>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
