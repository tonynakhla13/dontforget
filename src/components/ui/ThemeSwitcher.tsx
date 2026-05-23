"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useThemeStore, type HomeTheme } from "@/lib/themeStore";
import { triggerPageTransition } from "@/components/ui/PageTransitionOverlay";

const modes = [
  { id: "focused",   label: "FOCUSED",   icon: "○" },
  { id: "creative",  label: "CREATIVE",  icon: "✦" },
  { id: "immersive", label: "IMMERSIVE", icon: "◆" },
];

const INNER_PAGES = ["about", "work", "services", "blog", "contact"];
const MODE_PREFIXES = ["focused", "creative", "immersive"];

/** Derive which mode + inner page we're on from the pathname */
function parseRoute(pathname: string): { mode: string | null; page: string | null } {
  const segments = pathname.split("/").filter(Boolean);
  const mode = MODE_PREFIXES.includes(segments[0]) ? segments[0] : null;
  const page = mode && INNER_PAGES.includes(segments[1]) ? segments[1] : null;
  return { mode, page };
}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const { mode: currentMode, page: currentPage } = parseRoute(pathname);

  /* Derive display mode from URL (more accurate than store when on inner pages) */
  const displayMode: HomeTheme = (currentMode as HomeTheme) ?? theme;
  const isDark = displayMode === "creative" || displayMode === "immersive";

  function switchMode(newMode: string) {
    setTheme(newMode as HomeTheme);
    setIsOpen(false);

    let targetRoute: string;

    if (currentPage) {
      /* Inner page: /focused/about → /immersive/about */
      targetRoute = `/${newMode}/${currentPage}`;
    } else if (currentMode) {
      /* Mode homepage: /focused → /immersive */
      targetRoute = `/${newMode}`;
    } else {
      /* Root / — just update store, no navigation needed */
      return;
    }

    triggerPageTransition(() => router.push(targetRoute));
  }

  return (
    <div className="fixed bottom-8 right-8 z-[9000]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Trigger button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
            isDark
              ? "bg-white/10 border-white/20 hover:border-white/40"
              : "bg-black/10 border-black/20 hover:border-black/40"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Switch display mode"
        >
          <span className={`text-lg ${isDark ? "text-white" : "text-black"}`}>◯</span>
        </motion.button>

        {/* Mode picker */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.18 }}
              className={`absolute bottom-16 right-0 rounded-xl p-3 min-w-max shadow-2xl backdrop-blur-xl border ${
                isDark
                  ? "bg-black/80 border-white/20"
                  : "bg-white/95 border-black/10"
              }`}
            >
              {/* Current page indicator */}
              {currentPage && (
                <p className={`px-4 pb-2 text-[0.55rem] uppercase tracking-widest font-mono ${
                  isDark ? "text-white/30" : "text-black/30"
                }`}>
                  /{currentPage}
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                {modes.map((m) => {
                  const isActive = m.id === displayMode;
                  return (
                    <motion.button
                      key={m.id}
                      onClick={() => switchMode(m.id)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                        isActive
                          ? isDark
                            ? "bg-teal-500/30 text-teal-300 border border-teal-500/50"
                            : "bg-teal-100 text-teal-700 border border-teal-300"
                          : isDark
                            ? "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                            : "text-gray-600 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-2">{m.icon}</span>
                      {m.label}
                      {isActive && (
                        <span className={`ml-2 text-[0.65rem] opacity-60`}>current</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
