import { locales, type Locale } from "@/i18n/config";

// Path segments may not be "." or "..".
const localizedPath = new RegExp(
  `^/(${locales.join("|")})(/(?!\\.{1,2}(?:/|$))[A-Za-z0-9._~-]+)*/?$`,
);

// Only same-origin, localized application paths are accepted as post-login
// targets, preventing open redirects through the `next` parameter.
export function safeNextPath(next: string | null | undefined, locale: Locale): string {
  if (next && localizedPath.test(next)) return next;
  return `/${locale}`;
}
