"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "focused" | "creative" | "immersive";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  hasChosen: boolean;
}

const defaultValue: ThemeContextType = {
  mode: "immersive",
  setMode: () => {},
  hasChosen: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("immersive");
  const [hasChosen, setHasChosenState] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dfa_theme");
    const chosen = localStorage.getItem("dfa_theme_chosen");

    if (stored === "focused" || stored === "creative" || stored === "immersive") {
      setModeState(stored);
    }
    setHasChosenState(!!chosen);
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("dfa_theme", newMode);
    localStorage.setItem("dfa_theme_chosen", "true");
    setHasChosenState(true);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, hasChosen }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
