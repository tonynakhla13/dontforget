"use client";

import { usePathname, useRouter } from "next/navigation";
import { selectLocale, selectTheme } from "@/app/(site)/[lang]/actions";
import { replaceLocale, replaceTheme, type Locale, type Theme, THEMES } from "@/lib/site-routing";

type Props = { locale: Locale; theme: Theme; labels: { theme: string; language: string; current: string } };

type LocaleProps = Pick<Props, "locale" | "labels"> & { theme: Theme };
type ThemeProps = Pick<Props, "locale" | "theme" | "labels">;

export function LocaleControl({ locale, theme, labels }: LocaleProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function changeLocale(next: Locale) {
    await selectLocale(next);
    router.push(replaceLocale(pathname, next));
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
  const router = useRouter();

  async function changeTheme(next: Theme) {
    await selectTheme(next, locale);
    router.push(replaceTheme(pathname, next));
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
