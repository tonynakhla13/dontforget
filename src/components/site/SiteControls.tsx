"use client";

import { usePathname } from "next/navigation";
import { selectLocale, selectTheme } from "@/app/(site)/[lang]/actions";
import { parseCanonicalPath, replaceLocale, replaceTheme, type Locale, type Theme, THEMES } from "@/lib/site-routing";
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

export function HeaderLocaleControl({ theme, className }: { theme: Theme; className?: string }) {
  const pathname = usePathname();
  const route = parseCanonicalPath(pathname);

  if (!route) return null;

  return (
    <div className={className}>
      <LocaleControl
        locale={route.locale}
        theme={theme}
        labels={{ language: "Switch language", theme: "Switch theme", current: "Current" }}
      />
    </div>
  );
}

export function ThemeControl({ locale, theme, labels }: ThemeProps) {
  const pathname = usePathname();
  const { navigateWithTransition } = useThemeTransition();
  const others = THEMES.filter((item) => item !== theme);

  function changeTheme(next: Theme) {
    navigateWithTransition(replaceTheme(pathname, next), {
      beforeNavigate: () => selectTheme(next, locale),
    });
  }

  return (
    <div className="theme-control">
      <div className="theme-control-clip">
        <div className="theme-strip">
          <button type="button" className="theme-strip-item current" aria-label={labels.theme}>
            <span className="theme-control-dot" />
            <span className="theme-option-name">{theme}</span>
          </button>
          <div className="theme-strip-options">
            <span className="theme-strip-divider" />
            {others.map((item) => (
              <button
                key={item}
                type="button"
                className="theme-strip-item"
                onClick={() => changeTheme(item)}
              >
                <span className="theme-option-name">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
