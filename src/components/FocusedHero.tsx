"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function FocusedHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        {/* Hand-drawn style background element */}
        <div className="absolute top-20 right-10 w-40 h-40 pointer-events-none">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            stroke="#14b8a6"
            fill="none"
            strokeWidth="1.5"
            opacity="0.3"
          >
            <circle cx="100" cy="100" r="90" strokeDasharray="5,5" />
            <path d="M 50 100 Q 100 50 150 100" />
            <path d="M 50 100 Q 100 150 150 100" />
          </svg>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-teal-600 font-medium text-lg mb-6 tracking-wide">
              DESIGN STUDIO
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-7xl md:text-8xl lg:text-9xl font-black text-black leading-none mb-8 tracking-tight"
          >
            Dontforget
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-700 max-w-2xl mb-8 leading-relaxed"
          >
            Digital experiences that leave a lasting impression. Bold design, minimal approach, maximum impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex gap-6 flex-wrap"
          >
            <Link
              href="#work"
              className="px-8 py-4 bg-black text-white font-semibold hover:bg-gray-900 transition-colors"
            >
              View Work
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-black flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-black rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
