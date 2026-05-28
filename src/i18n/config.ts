export const LOCALES = ["en", "ar"] as const;
export const THEMES = ["focused", "creative", "immersive"] as const;

export type Locale = (typeof LOCALES)[number];
export type Theme = (typeof THEMES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "df_locale";
export const THEME_COOKIE = "df_theme";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function isTheme(value: string): value is Theme {
  return THEMES.includes(value as Theme);
}

export function direction(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}
