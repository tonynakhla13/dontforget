import { LocaleControl, ThemeControl } from "./SiteControls";
import type { Locale, Theme } from "@/lib/site-routing";

export default function FloatingPreferenceControls({ locale, theme, labels }: { locale: Locale; theme: Theme; labels: { theme: string; language: string; current: string } }) {
  return (
    <>
      <div className={`canonical-locale preference-${theme}`}>
        <LocaleControl locale={locale} theme={theme} labels={labels} />
      </div>
      <div className={`canonical-theme preference-${theme}`}>
        <ThemeControl locale={locale} theme={theme} labels={labels} />
      </div>
    </>
  );
}
