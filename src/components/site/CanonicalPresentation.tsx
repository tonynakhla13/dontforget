"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isLocale, isTheme, pagePath, postPath, projectPath, servicePath, themeHome, type CorePage, type Locale, type Theme } from "@/lib/site-routing";

function rewriteHref(href: string, locale: Locale, theme: Theme) {
  if (!href.startsWith("/") || href.startsWith("/api") || href.startsWith("/dashboard") || href.startsWith("/login") || href.startsWith("/setup")) return href;
  const url = new URL(href, "http://canonical.local");
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) segments.shift();
  if (segments[0] === "focused" || segments[0] === "creative" || segments[0] === "immersive") segments.shift();
  else if (segments[0] && isTheme(segments[0])) segments.shift();
  let next = themeHome(locale, theme);
  if (segments[0] === "about" || segments[0] === "work" || segments[0] === "services" || segments[0] === "blog" || segments[0] === "contact" || segments[0] === "request") {
    if (segments[0] === "work" && segments[1]) next = projectPath(locale, theme, segments[1]);
    else if (segments[0] === "services" && segments[1]) next = servicePath(locale, theme, segments[1]);
    else if (segments[0] === "blog" && segments[1]) next = postPath(locale, theme, segments[1]);
    else next = pagePath(locale, theme, segments[0] as CorePage);
  }
  return `${next}${url.hash}`;
}

export default function CanonicalPresentation({ locale, theme, children }: { locale: Locale; theme: Theme; children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const updateLinks = () => {
      document.querySelectorAll<HTMLAnchorElement>("a[href^='/']").forEach((link) => {
        const source = link.dataset.canonicalSource ?? link.getAttribute("href");
        if (!source) return;
        link.dataset.canonicalSource = source;
        link.href = rewriteHref(source, locale, theme);
      });
    };
    updateLinks();
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale, theme, pathname]);

  return <>{children}</>;
}
