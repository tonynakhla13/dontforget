"use client";

import { motion } from "framer-motion";
import { homeContent } from "@/lib/homeContent";
import Link from "next/link";

export default function HomeFocused() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section - Asymmetric Editorial Grid */}
      <section className="min-h-screen flex items-center px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left column - Text */}
            <div className="col-span-12 md:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-teal-600 text-sm font-semibold tracking-widest mb-6">
                  {homeContent.hero.eyebrow}
                </p>
                <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
                  {homeContent.hero.headline}
                </h1>
                <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
                  {homeContent.hero.subheadline}
                </p>
                <div className="flex gap-6">
                  <Link
                    href="#work"
                    className="px-6 py-3 bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
                  >
                    {homeContent.hero.cta.primary}
                  </Link>
                  <Link
                    href="#contact"
                    className="px-6 py-3 border-2 border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors"
                  >
                    {homeContent.hero.cta.secondary}
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right column - Minimal visual element */}
            <div className="col-span-12 md:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 200 200"
                  className="w-3/4 h-3/4"
                  stroke="#14b8a6"
                  fill="none"
                  strokeWidth="1"
                >
                  <circle cx="100" cy="100" r="80" opacity="0.3" />
                  <circle cx="100" cy="100" r="50" opacity="0.5" />
                  <path d="M 50 100 Q 100 60 150 100" opacity="0.4" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Stats and Cards */}
      <section className="py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16">{homeContent.about.headline}</h2>

          <div className="grid grid-cols-12 gap-8">
            {/* Text + Stats */}
            <div className="col-span-12 md:col-span-6">
              <p className="text-lg text-gray-700 mb-12 leading-relaxed">
                {homeContent.about.copy}
              </p>

              <div className="space-y-6">
                {homeContent.about.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-baseline gap-6"
                  >
                    <div className="text-4xl font-black text-teal-600 min-w-fit">
                      {stat.value}
                    </div>
                    <p className="text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image cards - Bento style */}
            <div className="col-span-12 md:col-span-6">
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="aspect-square rounded-xl bg-gray-200"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="aspect-square rounded-xl bg-gray-200"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="col-span-2 aspect-video rounded-xl bg-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Clean Table/List */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-16">{homeContent.services.headline}</h2>

          <div className="space-y-8">
            {homeContent.services.items.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-12 gap-8 pb-8 border-b border-gray-200 group hover:border-teal-600 transition-colors"
              >
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-bold text-gray-400 group-hover:text-teal-600 transition-colors">
                    {service.number}
                  </p>
                </div>
                <div className="col-span-10 md:col-span-3">
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Soft and Simple */}
      <section className="py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-5xl font-black mb-4">{homeContent.contact.headline}</h2>
            <p className="text-lg text-gray-600 mb-12">{homeContent.contact.subheadline}</p>

            <form className="space-y-6">
              <input
                type="text"
                placeholder={homeContent.contact.placeholders.name}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 transition-colors"
              />
              <input
                type="email"
                placeholder={homeContent.contact.placeholders.email}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 transition-colors"
              />
              <button className="w-full px-6 py-4 bg-black text-white font-semibold hover:bg-gray-900 transition-colors">
                {homeContent.contact.cta}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
