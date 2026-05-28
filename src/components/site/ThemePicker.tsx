"use client";

import { selectTheme } from "@/app/(site)/[lang]/actions";
import { themeHome, THEMES, type Locale, type Theme } from "@/lib/site-routing";
import { useThemeTransition } from "./ThemeLoadingExperience";

type Props = {
  locale: Locale;
  copy: { title: string; intro: string; note: string; themes: Record<Theme, readonly [string, string]> };
};

export default function ThemePicker({ locale, copy }: Props) {
  const { navigateWithTransition } = useThemeTransition();

  function choose(theme: Theme) {
    navigateWithTransition(themeHome(locale, theme), {
      beforeNavigate: () => selectTheme(theme, locale),
    });
  }

  return (
    <main className="theme-picker">
      <p className="picker-brand">DON&apos;T FORGET</p>
      <h1>{copy.title}</h1>
      <p>{copy.intro}</p>
      <div className="picker-grid">
        {THEMES.map((theme) => (
          <button type="button" key={theme} className={`picker-card ${theme}`} onClick={() => choose(theme)}>
            <span>{copy.themes[theme][0]}</span>
            <small>{copy.themes[theme][1]}</small>
          </button>
        ))}
      </div>
      <p className="picker-note">{copy.note}</p>
    </main>
  );
}
