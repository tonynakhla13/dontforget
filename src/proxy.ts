import { NextRequest, NextResponse } from "next/server";
import { COOKIE_MAX_AGE, DEFAULT_LOCALE, LOCALE_COOKIE, THEME_COOKIE, isLocale, isTheme } from "@/i18n/config";

const COOKIE_NAME = "df_session";
const preferenceOptions = {
  path: "/",
  sameSite: "lax" as const,
  maxAge: COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const savedTheme = request.cookies.get(THEME_COOKIE)?.value;

  if (pathname === "/") {
    const locale = savedLocale && isLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;
    const destination = savedTheme && isTheme(savedTheme) ? `/${locale}/${savedTheme}` : `/${locale}`;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0] ?? "") && isTheme(segments[1] ?? "")) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, segments[0], preferenceOptions);
    response.cookies.set(THEME_COOKIE, segments[1], preferenceOptions);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/en/:path*", "/ar/:path*"],
};
