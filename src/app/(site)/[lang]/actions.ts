"use server";

import { cookies } from "next/headers";
import { COOKIE_MAX_AGE, LOCALE_COOKIE, THEME_COOKIE, isLocale, isTheme, type Locale, type Theme } from "@/i18n/config";

const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  maxAge: COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};

export async function selectTheme(theme: Theme, locale: Locale) {
  if (!isTheme(theme) || !isLocale(locale)) return;
  const store = await cookies();
  store.set(THEME_COOKIE, theme, cookieOptions);
  store.set(LOCALE_COOKIE, locale, cookieOptions);
}

export async function selectLocale(locale: Locale) {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, cookieOptions);
}
