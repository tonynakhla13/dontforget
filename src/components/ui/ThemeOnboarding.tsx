"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/lib/themeStore";

const modes = [
  {
    id: "focused",
    name: "FOCUSED",
    description: "Minimal, clean, and distraction-free.",
    preview: "bg-white text-black",
    accent: "bg-teal-600",
  },
  {
    id: "creative",
    name: "CREATIVE",
    description: "Bold, dark, and modern.",
    preview: "bg-gradient-to-br from-slate-900 to-black text-white",
    accent: "bg-teal-500",
  },
  {
    id: "immersive",
    name: "IMMERSIVE",
    description: "Full sensory experience.",
    preview: "bg-gradient-to-br from-purple-900 to-black text-white",
    accent: "bg-gradient-to-r from-cyan-500 to-blue-600",
  },
];

export default function ThemeOnboarding() {
  const { hasChosen, setTheme, setHasChosen } = useThemeStore();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasChosen) {
      setIsVisible(true);
    }
  }, [hasChosen]);

  if (!mounted) return null;

  const handleSelect = (modeId: string) => {
    setTheme(modeId as "focused" | "creative" | "immersive");
    setHasChosen(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-6xl px-6 py-12 mx-4"
          >
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-white mb-4"
              >
                Choose Your Experience
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-300"
              >
                Select how you'd like to explore Dontforget
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modes.map((mode, idx) => (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  onClick={() => handleSelect(mode.id)}
                  className="group relative overflow-hidden rounded-2xl border border-gray-700 transition-all hover:border-gray-500 hover:shadow-2xl"
                >
                  {/* Preview background */}
                  <div className={`${mode.preview} h-48 flex items-center justify-center relative`}>
                    <div
                      className={`${mode.accent} absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />
                  </div>

                  {/* Content */}
                  <div className="bg-black/70 backdrop-blur-sm px-6 py-6">
                    <h3 className="text-xl font-black text-white mb-2">{mode.name}</h3>
                    <p className="text-sm text-gray-400">{mode.description}</p>
                  </div>

                  {/* Hover underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-gray-500 text-sm mt-12"
            >
              You can change this anytime using the theme switcher in the corner
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
