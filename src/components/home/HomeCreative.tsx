"use client";

import { motion } from "framer-motion";
import { homeContent } from "@/lib/homeContent";
import Link from "next/link";

export default function HomeCreative() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white min-h-screen">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 2 }}
          className="absolute bottom-40 left-1/3 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section - Dark and Bold */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-12 gap-12 items-center">
            {/* Left text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-12 md:col-span-5"
            >
              <p className="text-teal-400 text-sm font-bold tracking-widest mb-6 uppercase">
                {homeContent.hero.eyebrow}
              </p>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none bg-gradient-to-r from-teal-400 to-pink-400 bg-clip-text text-transparent">
                {homeContent.hero.headline}
              </h1>
            </motion.div>

            {/* Right - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-12 md:col-span-7 relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-teal-500/20 to-pink-500/20 border border-teal-500/30 backdrop-blur-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 300 300"
                  className="w-4/5 h-4/5"
                  stroke="url(#grad1)"
                  fill="none"
                  strokeWidth="2"
                >
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <circle cx="150" cy="150" r="100" opacity="0.6" />
                  <circle cx="150" cy="150" r="60" opacity="0.8" />
                  <path d="M 50 150 Q 150 80 250 150 Q 150 220 50 150" opacity="0.5" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* CTA Below */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex gap-6"
          >
            <Link
              href="#work"
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-black font-bold hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300"
            >
              {homeContent.hero.cta.primary}
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 border-2 border-teal-500 text-teal-400 font-bold hover:bg-teal-500/10 transition-all duration-300"
            >
              {homeContent.hero.cta.secondary}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Marquee Strip */}
      <section className="relative py-16 border-t border-b border-teal-500/20">
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap"
          >
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                {homeContent.services.items.map((service) => (
                  <span key={service.number} className="text-2xl font-bold text-teal-400 inline-block mx-6">
                    {service.title} •
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section - Split Layout */}
      <section className="relative py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16">{homeContent.about.headline}</h2>

          <div className="grid grid-cols-12 gap-12">
            {/* Text and stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="col-span-12 md:col-span-6"
            >
              <p className="text-lg text-gray-400 mb-12 leading-relaxed">
                {homeContent.about.copy}
              </p>

              <div className="grid grid-cols-3 gap-6">
                {homeContent.about.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-gradient-to-br from-teal-500/10 to-pink-500/10 border border-teal-500/20 hover:border-teal-500/60 transition-colors"
                  >
                    <p className="text-3xl font-black bg-gradient-to-r from-teal-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Visual card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="col-span-12 md:col-span-6"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-teal-500/10 to-pink-500/10 border border-teal-500/30 backdrop-blur-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Detailed Cards */}
      <section className="relative py-24 px-6 md:px-12 bg-black/40 backdrop-blur-lg border-t border-teal-500/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16">{homeContent.services.headline}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeContent.services.items.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-gradient-to-br from-teal-500/5 to-pink-500/5 border border-teal-500/20 hover:border-teal-500/60 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300"
              >
                <p className="text-5xl font-black text-teal-500/60 group-hover:text-teal-400 mb-4 transition-colors">
                  {service.number}
                </p>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Premium CTA */}
      <section className="relative py-24 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-teal-500/10 to-pink-500/10 border border-teal-500/30 text-center"
        >
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-teal-400 to-pink-400 bg-clip-text text-transparent">
            {homeContent.contact.headline}
          </h2>
          <p className="text-xl text-gray-400 mb-12">{homeContent.contact.subheadline}</p>

          <form className="space-y-6">
            <input
              type="text"
              placeholder={homeContent.contact.placeholders.name}
              className="w-full px-6 py-4 bg-white/5 border border-teal-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors backdrop-blur-lg"
            />
            <input
              type="email"
              placeholder={homeContent.contact.placeholders.email}
              className="w-full px-6 py-4 bg-white/5 border border-teal-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors backdrop-blur-lg"
            />
            <button className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-pink-500 text-black font-bold rounded-lg hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300">
              {homeContent.contact.cta}
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
