"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/lib/themeStore";

const modes = [
  { id: "focused", label: "FOCUSED", icon: "○" },
  { id: "creative", label: "CREATIVE", icon: "✦" },
  { id: "immersive", label: "IMMERSIVE", icon: "◆" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "creative" || theme === "immersive";

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
            isDark
              ? "bg-white/10 border-white/20 hover:border-white/40"
              : "bg-black/10 border-black/20 hover:border-black/40"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={`text-lg transition-transform ${isDark ? "text-white" : "text-black"}`}>
            ◯
          </span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`absolute bottom-16 right-0 rounded-lg p-3 min-w-max shadow-2xl backdrop-blur-xl border ${
                isDark
                  ? "bg-black/80 border-white/20"
                  : "bg-white/95 border-black/10"
              }`}
            >
              <div className="flex flex-col gap-2">
                {modes.map((m) => (
                  <motion.button
                    key={m.id}
                    onClick={() => {
                      setTheme(m.id as "focused" | "creative" | "immersive");
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      theme === m.id
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
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
