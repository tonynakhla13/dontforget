"use client";

import { useState, useRef, useEffect } from "react";
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
  const pathname   = usePathname();
  const { navigateWithTransition } = useThemeTransition();
  const [open, setOpen] = useState(false);
  const stripRef   = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState(0);

  // measure how much to shift so only current is visible
  useEffect(() => {
    function measure() {
      if (!stripRef.current || !currentRef.current) return;
      const total   = stripRef.current.scrollWidth;
      const current = currentRef.current.offsetWidth;
      setOffset(total - current);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [theme]);

  function changeTheme(next: Theme) {
    setOpen(false);
    navigateWithTransition(replaceTheme(pathname, next), {
      beforeNavigate: () => selectTheme(next, locale),
    });
  }

  // order: others first (left), current last (right, always visible)
  const others = THEMES.filter((t) => t !== theme);

  return (
    <div
      className="theme-control"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* overflow wrapper clips the strip */}
      <div className="theme-control-clip">
        <div
          ref={stripRef}
          className="theme-strip"
          style={{ transform: open ? "translateX(0)" : `translateX(${offset}px)` }}
        >
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

          {/* divider */}
          <span className="theme-strip-divider" />

          {/* current — always visible */}
          <button
            ref={currentRef}
            type="button"
            className="theme-strip-item current"
            aria-label={labels.theme}
          >
            <span className="theme-control-dot" />
            <span className="theme-option-name">{theme}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
