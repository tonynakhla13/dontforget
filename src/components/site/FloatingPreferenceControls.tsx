import { LocaleControl, ThemeControl } from "./SiteControls";
import type { Locale, Theme } from "@/lib/site-routing";

export default function FloatingPreferenceControls({ locale, theme, labels }: { locale: Locale; theme: Theme; labels: { theme: string; language: string; current: string } }) {
  return (
    <>
      {theme !== "immersive" ? (
        <div className={`canonical-locale preference-${theme}`}>
          <LocaleControl locale={locale} theme={theme} labels={labels} />
        </div>
      ) : null}
      <div className={`canonical-theme preference-${theme}`}>
        <ThemeControl locale={locale} theme={theme} labels={labels} />
      </div>
    </>
  );
}
