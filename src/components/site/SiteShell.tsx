import Link from "next/link";
import type { ReactNode } from "react";
import { pagePath, themeHome, type Locale, type Theme } from "@/lib/site-routing";
import { LocaleControl, ThemeControl } from "./SiteControls";

type Props = {
  children: ReactNode;
  locale: Locale;
  theme: Theme;
  dictionary: Awaited<ReturnType<typeof import("@/i18n/get-dictionary").getDictionary>>;
};

export default function SiteShell({ children, locale, theme, dictionary: d }: Props) {
  const links = [
    ["home", themeHome(locale, theme)],
    ["about", pagePath(locale, theme, "about")],
    ["work", pagePath(locale, theme, "work")],
    ["services", pagePath(locale, theme, "services")],
    ["blog", pagePath(locale, theme, "blog")],
    ["contact", pagePath(locale, theme, "contact")],
  ] as const;

  return (
    <div className={`public-site theme-${theme}`}>
      <header className="site-header">
        <Link href={themeHome(locale, theme)} className="site-brand">{d.brand}</Link>
        <nav aria-label={d.controls.language}>
          {links.map(([label, href]) => <Link key={label} href={href}>{d.nav[label]}</Link>)}
        </nav>
        <LocaleControl locale={locale} theme={theme} labels={d.controls} />
      </header>
      <div className={`shell-theme preference-${theme}`}>
        <ThemeControl locale={locale} theme={theme} labels={d.controls} />
      </div>
      {children}
      <footer className="site-footer">
        <h2>{d.footer.title}</h2>
        <Link href={pagePath(locale, theme, "request")} className="site-button">{d.nav.request}</Link>
        <p>&copy; {new Date().getFullYear()} {d.brand}. {d.footer.rights}</p>
      </footer>
    </div>
  );
}
