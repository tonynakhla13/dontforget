import {
  DEFAULT_LOCALE,
  LOCALES,
  THEMES,
  isLocale,
  isTheme,
  type Locale,
  type Theme,
} from "@/i18n/config";

export { DEFAULT_LOCALE, LOCALES, THEMES, isLocale, isTheme };
export type { Locale, Theme };

export const CORE_PAGES = ["about", "work", "services", "blog", "contact", "request"] as const;
export type CorePage = (typeof CORE_PAGES)[number];

export type CanonicalRoute = {
  locale: Locale;
  theme: Theme;
  tail: string[];
};

export function localeLanding(locale: Locale) {
  return `/${locale}`;
}

export function themeHome(locale: Locale, theme: Theme) {
  return `/${locale}/${theme}`;
}

export function pagePath(locale: Locale, theme: Theme, page: CorePage) {
  return `${themeHome(locale, theme)}/${page}`;
}

export function projectPath(locale: Locale, theme: Theme, slug: string) {
  return `${pagePath(locale, theme, "work")}/${encodeURIComponent(slug)}`;
}

export function servicePath(locale: Locale, theme: Theme, id: string) {
  return `${pagePath(locale, theme, "services")}/${encodeURIComponent(id)}`;
}

export function postPath(locale: Locale, theme: Theme, slug: string) {
  return `${pagePath(locale, theme, "blog")}/${encodeURIComponent(slug)}`;
}

export function parseCanonicalPath(pathname: string): CanonicalRoute | null {
  const segments = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  const locale = segments[0] ?? "";
  const theme = segments[1] ?? "";
  if (!isLocale(locale) || !isTheme(theme)) return null;
  return { locale, theme, tail: segments.slice(2) };
}

export function replaceTheme(pathname: string, theme: Theme) {
  const route = parseCanonicalPath(pathname);
  return route ? `/${route.locale}/${theme}${route.tail.length ? `/${route.tail.map(encodeURIComponent).join("/")}` : ""}` : pathname;
}

export function replaceLocale(pathname: string, locale: Locale) {
  const route = parseCanonicalPath(pathname);
  return route ? `/${locale}/${route.theme}${route.tail.length ? `/${route.tail.map(encodeURIComponent).join("/")}` : ""}` : localeLanding(locale);
}

export function validTail(tail: string[]) {
  if (tail.length === 0) return true;
  if (!CORE_PAGES.includes(tail[0] as CorePage)) return false;
  return tail.length === 1 || (tail.length === 2 && ["work", "services", "blog"].includes(tail[0]));
}
