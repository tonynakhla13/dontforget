import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import { direction, isLocale } from "@/i18n/config";
import { fontVariables } from "../../fonts";
import AnimatedFavicon from "@/components/site/AnimatedFavicon";
import { ThemeTransitionProvider } from "@/components/site/ThemeLoadingExperience";
import "../../globals.css";
import "./site.css";
import "@/themes/creative/creative.css";

export const metadata: Metadata = { title: "DON'T FORGET" };

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} dir={direction(lang)} className={fontVariables}>
      <body className="antialiased" suppressHydrationWarning>
        <AnimatedFavicon />
        <Script
          id="nox-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('nox-theme');if(t==='light')document.documentElement.dataset.noxTheme='light';}catch(e){}",
          }}
        />
        <ThemeTransitionProvider>{children}</ThemeTransitionProvider>
      </body>
    </html>
  );
}
