"use client";

import { usePathname } from "next/navigation";
import { selectLocale, selectTheme } from "@/app/(site)/[lang]/actions";
import { replaceLocale, replaceTheme, type Locale, type Theme, THEMES } from "@/lib/site-routing";
import { useThemeTransition } from "./ThemeLoadingExperience";

type Props = { locale: Locale; theme: Theme; labels: { theme: string; language: string; current: string } };

type LocaleProps = Pick<Props, "locale" | "labels"> & { theme: Theme };
type ThemeProps = Pick<Props, "locale" | "theme" | "labels">;

export function LocaleControl({ locale, theme, labels }: LocaleProps) {
  const pathname = usePathname();
  const { navigateWithTransition } = useThemeTransition();

  function changeLocale(next: Locale) {
    navigateWithTransition(replaceLocale(pathname, next), {
      beforeNavigate: () => selectLocale(next),
    });
  }

  return (
    <div className="locale-control" aria-label={labels.language} data-theme={theme}>
      <button type="button" aria-current={locale === "en"} onClick={() => changeLocale("en")}>EN</button>
      <span>/</span>
      <button type="button" aria-current={locale === "ar"} onClick={() => changeLocale("ar")}>AR</button>
    </div>
  );
}

export function ThemeControl({ locale, theme, labels }: ThemeProps) {
  const pathname = usePathname();
  const { navigateWithTransition } = useThemeTransition();

  function changeTheme(next: Theme) {
    navigateWithTransition(replaceTheme(pathname, next), {
      beforeNavigate: () => selectTheme(next, locale),
    });
  }

  return (
    <details className="theme-control" data-theme={theme}>
      <summary aria-label={labels.theme}>
        <span className="theme-control-dot" />
        <span>{theme}</span>
      </summary>
      <div>
        {THEMES.map((item) => (
          <button key={item} type="button" aria-current={theme === item} onClick={() => changeTheme(item)}>
            {item}{theme === item ? ` - ${labels.current}` : ""}
          </button>
        ))}
      </div>
    </details>
  );
}
