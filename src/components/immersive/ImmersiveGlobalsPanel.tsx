"use client";

import { useEffect, useMemo, useState } from "react";

type Token = {
  label: string;
  cssVar: string;
  rgbVar?: string;
  aliases?: string[];
  rgbAliases?: string[];
  fallback: string;
};

const TOKENS: Token[] = [
  { label: "Background", cssVar: "--immersive-bg", rgbVar: "--immersive-bg-rgb", aliases: ["--bg", "--site-bg"], rgbAliases: ["--bg-rgb"], fallback: "#090909" },
  { label: "Surface", cssVar: "--immersive-surface", rgbVar: "--immersive-surface-rgb", aliases: ["--surface", "--site-panel"], rgbAliases: ["--surface-rgb"], fallback: "#111111" },
  { label: "Surface 2", cssVar: "--immersive-surface2", rgbVar: "--immersive-surface2-rgb", aliases: ["--surface2"], rgbAliases: ["--surface2-rgb"], fallback: "#161616" },
  { label: "Foreground", cssVar: "--immersive-fg", rgbVar: "--immersive-fg-rgb", aliases: ["--fg", "--site-fg"], rgbAliases: ["--fg-rgb"], fallback: "#F0ECE3" },
  { label: "Body Text", cssVar: "--immersive-body", rgbVar: "--immersive-body-rgb", aliases: ["--body", "--site-muted"], rgbAliases: ["--body-rgb"], fallback: "#7A7A7A" },
  { label: "Accent", cssVar: "--immersive-accent", rgbVar: "--immersive-accent-rgb", aliases: ["--teal", "--site-accent"], rgbAliases: ["--teal-rgb"], fallback: "#46AE22" },
  { label: "Particles", cssVar: "--immersive-particles", rgbVar: "--immersive-particles-rgb", fallback: "#46D12A" },
  { label: "Mint Light", cssVar: "--immersive-mint", fallback: "#B8FFE0" },
  { label: "Deep Accent", cssVar: "--immersive-deep", fallback: "#46AE22" },
  { label: "Warm Accent", cssVar: "--immersive-warm", fallback: "#F5B85E" },
];

function hexToRgbChannel(hex: string) {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  const value = Number.parseInt(normalized, 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function readCssVar(cssVar: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || fallback;
}

function applyToken(root: HTMLElement, token: Token, value: string) {
  root.style.setProperty(token.cssVar, value);
  token.aliases?.forEach((alias) => root.style.setProperty(alias, value));

  if (!token.rgbVar) return;
  const rgb = hexToRgbChannel(value);
  if (!rgb) return;
  root.style.setProperty(token.rgbVar, rgb);
  token.rgbAliases?.forEach((alias) => root.style.setProperty(alias, rgb));
}

export default function ImmersiveGlobalsPanel() {
  const initialValues = useMemo(
    () => Object.fromEntries(TOKENS.map((token) => [token.cssVar, token.fallback])),
    []
  );
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  useEffect(() => {
    const root = document.documentElement;
    const nextValues = Object.fromEntries(
      TOKENS.map((token) => [token.cssVar, readCssVar(token.cssVar, token.fallback)])
    );
    setValues(nextValues);

    TOKENS.forEach((token) => {
      applyToken(root, token, nextValues[token.cssVar]);
    });
    window.dispatchEvent(new CustomEvent("immersive-theme-change"));
  }, []);

  const updateToken = (token: Token, value: string) => {
    const root = document.documentElement;
    setValues((current) => ({ ...current, [token.cssVar]: value }));
    applyToken(root, token, value);

    window.dispatchEvent(new CustomEvent("immersive-theme-change"));
  };

  const reset = () => {
    const root = document.documentElement;
    const nextValues = Object.fromEntries(TOKENS.map((token) => [token.cssVar, token.fallback]));
    setValues(nextValues);

    TOKENS.forEach((token) => {
      applyToken(root, token, token.fallback);
    });
    window.dispatchEvent(new CustomEvent("immersive-theme-change"));
  };

  return (
    <aside className="immersive-globals-panel" aria-label="Immersive global color controls">
      <details>
        <summary>
          <span>Globals</span>
          <span className="immersive-globals-panel__chip" />
        </summary>
        <div className="immersive-globals-panel__body">
          {TOKENS.map((token) => (
            <label key={token.cssVar} className="immersive-globals-panel__row">
              <span>
                <span>{token.label}</span>
                <code>{token.cssVar}</code>
              </span>
              <input
                type="color"
                value={values[token.cssVar] ?? token.fallback}
                onChange={(event) => updateToken(token, event.target.value)}
                aria-label={token.label}
              />
            </label>
          ))}
          <button type="button" onClick={reset}>Reset defaults</button>
        </div>
      </details>
    </aside>
  );
}
