import { getLanguageTag, type Locale } from "./config";

export function formatDate(
  value: Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  return new Intl.DateTimeFormat(getLanguageTag(locale), options).format(value);
}

export function formatTime(
  value: Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { timeStyle: "short" },
): string {
  return new Intl.DateTimeFormat(getLanguageTag(locale), options).format(value);
}

export function formatNumber(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(getLanguageTag(locale), options).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "EUR"): string {
  return new Intl.NumberFormat(getLanguageTag(locale), {
    style: "currency",
    currency,
  }).format(value);
}
