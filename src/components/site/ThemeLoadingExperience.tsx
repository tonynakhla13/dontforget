"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import FocusedLoaderContent from "@/components/focused/FocusedLoaderContent";
import { usePathname, useRouter } from "next/navigation";
import { parseCanonicalPath, type Theme } from "@/lib/site-routing";

type TransitionMode = "theme" | "page";
type TransitionPhase = "idle" | "entering" | "leaving";

type TransitionState = {
  phase: TransitionPhase;
  mode: TransitionMode;
  fromTheme?: Theme;
  toTheme?: Theme;
};

type NavigateOptions = {
  beforeNavigate?: () => Promise<void> | void;
  replace?: boolean;
};

type TransitionContextValue = {
  navigateWithTransition: (href: string, options?: NavigateOptions) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

const THEME_LABELS: Record<Theme, string> = {
  focused: "Focused",
  creative: "Creative",
  immersive: "Immersive",
};

const THEME_PREVIEWS: Record<Theme, string> = {
  focused: "/theme-previews/foucsed.png",
  creative: "/theme-previews/creative.png",
  immersive: "/theme-previews/immersive.png",
};

const idleState: TransitionState = {
  phase: "idle",
  mode: "page",
};

function getRouteTheme(pathname: string) {
  return parseCanonicalPath(pathname)?.theme;
}

function getTransitionState(fromPath: string, toPath: string): TransitionState {
  const fromTheme = getRouteTheme(fromPath);
  const toTheme = getRouteTheme(toPath);
  return {
    phase: "entering",
    mode: fromTheme && toTheme && fromTheme !== toTheme ? "theme" : "page",
    fromTheme,
    toTheme: toTheme ?? fromTheme,
  };
}

function normalizeInternalHref(href: string) {
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function useThemeTransition() {
  const value = useContext(TransitionContext);
  if (!value) throw new Error("useThemeTransition must be used inside ThemeTransitionProvider");
  return value;
}

export function ThemeTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [transition, setTransition] = useState<TransitionState>(idleState);
  const pendingTarget = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
    return timer;
  }, []);

  const finishTransition = useCallback(() => {
    setTransition((current) => current.phase === "idle" ? current : { ...current, phase: "leaving" });
    schedule(() => setTransition(idleState), 460);
  }, [schedule]);

  const navigateWithTransition = useCallback((href: string, options?: NavigateOptions) => {
    const target = normalizeInternalHref(href);
    if (!target) {
      window.location.href = href;
      return;
    }

    const targetUrl = new URL(target, window.location.href);
    const current = new URL(window.location.href);
    if (targetUrl.pathname === current.pathname && targetUrl.search === current.search) {
      if (targetUrl.hash && targetUrl.hash !== current.hash) window.location.hash = targetUrl.hash;
      return;
    }

    clearTimers();
    pendingTarget.current = targetUrl.pathname;
    setTransition(getTransitionState(current.pathname, targetUrl.pathname));

    schedule(async () => {
      try {
        await options?.beforeNavigate?.();
        if (options?.replace) router.replace(target);
        else router.push(target);
      } finally {
        schedule(finishTransition, 1800);
      }
    }, 420);
  }, [clearTimers, finishTransition, router, schedule]);

  useEffect(() => {
    if (!pendingTarget.current) return;
    const arrived = pathname === pendingTarget.current;
    if (!arrived) return;
    pendingTarget.current = null;
    clearTimers();
    schedule(finishTransition, 260);
  }, [clearTimers, finishTransition, pathname, schedule]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    function onDocumentClick(event: globalThis.MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;
      const target = normalizeInternalHref(link.href);
      if (!target) return;
      const targetUrl = new URL(target, window.location.href);
      if (targetUrl.pathname.startsWith("/api")) return;
      event.preventDefault();
      navigateWithTransition(target);
    }

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [navigateWithTransition]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      <ThemeLoadingOverlay transition={transition} />
    </TransitionContext.Provider>
  );
}

export function ThemeLoadingFallback() {
  const pathname = usePathname();
  const theme = getRouteTheme(pathname) ?? "immersive";
  return <ThemeLoadingScreen mode="page" phase="entering" toTheme={theme} />;
}

function ThemeLoadingOverlay({ transition }: { transition: TransitionState }) {
  if (transition.phase === "idle") return null;
  return (
    <ThemeLoadingScreen
      phase={transition.phase}
      mode={transition.mode}
      fromTheme={transition.fromTheme}
      toTheme={transition.toTheme}
    />
  );
}

function ThemeLoadingScreen({ mode, phase, fromTheme, toTheme }: Omit<TransitionState, "phase"> & { phase: Exclude<TransitionPhase, "idle"> }) {
  const activeTheme = toTheme ?? fromTheme ?? "immersive";
  const label = mode === "theme"
    ? `${fromTheme ? THEME_LABELS[fromTheme] : "Theme"} to ${toTheme ? THEME_LABELS[toTheme] : "Theme"}`
    : `${THEME_LABELS[activeTheme]} loading`;
  const backgroundThemes = mode === "theme" && fromTheme && toTheme ? [fromTheme, toTheme] : null;

  return (
    <div
      className={`theme-loading-screen theme-loading-screen--${mode} theme-loading-screen--${phase} theme-loading-screen--${activeTheme}`}
      data-from={fromTheme}
      data-to={toTheme}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {activeTheme === "focused" && mode === "page" ? (
        <FocusedLoaderContent />
      ) : backgroundThemes ? (
        <div className="theme-loading-backgrounds" aria-hidden="true">
          {backgroundThemes.map((theme, index) => (
            <div className="theme-loading-background" key={`${index}-${theme}`}>
              <Image
                className="theme-loading-background__image"
                src={THEME_PREVIEWS[theme]}
                alt=""
                fill
                sizes="50vw"
                priority
              />
              <span className="theme-loading-background__shade" />
              <span className="theme-loading-background__label">
                {index === 0 ? "From" : "To"} <strong>{THEME_LABELS[theme]}</strong>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="theme-loading-field" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="theme-loading-copy">
            <p>{mode === "theme" ? "Changing theme" : `${THEME_LABELS[activeTheme]} mode`}</p>
            <h2>{mode === "theme" ? label : "Loading page"}</h2>
          </div>
          <div className="theme-loading-meter" aria-hidden="true">
            <span />
          </div>
        </>
      )}
    </div>
  );
}
