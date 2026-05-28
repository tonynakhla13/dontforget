"use client";

import { useEffect, useState } from "react";

export type ImmersiveTheme = {
  bg: string;
  bgRgb: [number, number, number];
  surface: string;
  surfaceRgb: [number, number, number];
  surface2: string;
  surface2Rgb: [number, number, number];
  fg: string;
  fgRgb: [number, number, number];
  body: string;
  bodyRgb: [number, number, number];
  accent: string;
  accentRgb: [number, number, number];
  mint: string;
  deep: string;
  warm: string;
};

const DEFAULT_THEME: ImmersiveTheme = {
  bg: "#090909",
  bgRgb: [9, 9, 9],
  surface: "#111111",
  surfaceRgb: [17, 17, 17],
  surface2: "#161616",
  surface2Rgb: [22, 22, 22],
  fg: "#F0ECE3",
  fgRgb: [240, 236, 227],
  body: "#7A7A7A",
  bodyRgb: [122, 122, 122],
  accent: "#46AE22",
  accentRgb: [70, 174, 34],
  mint: "#B8FFE0",
  deep: "#46AE22",
  warm: "#F5B85E",
};

function readVar(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback;
}

function readRgbVar(styles: CSSStyleDeclaration, name: string, fallback: [number, number, number]) {
  const raw = styles.getPropertyValue(name).trim();
  const parts = raw.split(",").map((part) => Number(part.trim()));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return fallback;
  return parts as [number, number, number];
}

function readTheme(): ImmersiveTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const styles = getComputedStyle(document.documentElement);
  return {
    bg: readVar(styles, "--immersive-bg", DEFAULT_THEME.bg),
    bgRgb: readRgbVar(styles, "--immersive-bg-rgb", DEFAULT_THEME.bgRgb),
    surface: readVar(styles, "--immersive-surface", DEFAULT_THEME.surface),
    surfaceRgb: readRgbVar(styles, "--immersive-surface-rgb", DEFAULT_THEME.surfaceRgb),
    surface2: readVar(styles, "--immersive-surface2", DEFAULT_THEME.surface2),
    surface2Rgb: readRgbVar(styles, "--immersive-surface2-rgb", DEFAULT_THEME.surface2Rgb),
    fg: readVar(styles, "--immersive-fg", DEFAULT_THEME.fg),
    fgRgb: readRgbVar(styles, "--immersive-fg-rgb", DEFAULT_THEME.fgRgb),
    body: readVar(styles, "--immersive-body", DEFAULT_THEME.body),
    bodyRgb: readRgbVar(styles, "--immersive-body-rgb", DEFAULT_THEME.bodyRgb),
    accent: readVar(styles, "--immersive-accent", DEFAULT_THEME.accent),
    accentRgb: readRgbVar(styles, "--immersive-accent-rgb", DEFAULT_THEME.accentRgb),
    mint: readVar(styles, "--immersive-mint", DEFAULT_THEME.mint),
    deep: readVar(styles, "--immersive-deep", DEFAULT_THEME.deep),
    warm: readVar(styles, "--immersive-warm", DEFAULT_THEME.warm),
  };
}

export function useImmersiveTheme() {
  const [theme, setTheme] = useState<ImmersiveTheme>(DEFAULT_THEME);

  useEffect(() => {
    const update = () => setTheme(readTheme());
    update();
    window.addEventListener("immersive-theme-change", update);
    return () => window.removeEventListener("immersive-theme-change", update);
  }, []);

  return theme;
}
