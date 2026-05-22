import { create } from "zustand";

export type HomeTheme = "focused" | "creative" | "immersive";

interface ThemeState {
  theme: HomeTheme;
  hasChosen: boolean;
  setTheme: (theme: HomeTheme) => void;
  setHasChosen: (chosen: boolean) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "immersive",
  hasChosen: false,

  setTheme: (theme: HomeTheme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dfa_home_theme", theme);
    }
    set({ theme });
  },

  setHasChosen: (chosen: boolean) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dfa_theme_chosen", chosen ? "true" : "false");
    }
    set({ hasChosen: chosen });
  },

  initializeTheme: () => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("dfa_home_theme") as HomeTheme | null;
      const savedChosen = localStorage.getItem("dfa_theme_chosen") === "true";

      set({
        theme: savedTheme || "immersive",
        hasChosen: savedChosen,
      });
    }
  },
}));
