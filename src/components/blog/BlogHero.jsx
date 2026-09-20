"use client";

// Blog masthead
// File: src/components/blog/BlogHero.jsx
//
// A publication masthead rather than a hero banner: the name of the thing, a
// line about what it covers, and then straight into the articles. Magazines do
// not put a photograph of a magazine above their contents page.
//
// The oversized word sitting behind the heading is the one decorative gesture,
// and it is type rather than an image or a pattern -- which keeps it on the
// same footing as everything else on the page.

import { motion } from "framer-motion";

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-forest pb-16 pt-16 md:pt-20 text-white md:pb-20">
      {/* Oversized wordmark, clipped by the section. Decoration made of the
          same material as the content. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-6 select-none font-display text-[22vw] font-extrabold leading-none tracking-tighter text-white/[0.035] md:-top-10"
      >
        JOURNAL
      </span>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end"
        >
          <div>
            <p className="eyebrow text-moss-light">The TrainSight journal</p>
            <h1 className="mt-6 font-display text-display font-extrabold">
              Training, examined
              <span className="block text-white/45">rather than advertised.</span>
            </h1>
          </div>

          <p className="max-w-prose leading-relaxed text-white/65 lg:pb-3">
            Writing on strength, endurance, nutrition and the technology behind the
            form analysis — including where it works and where it does not.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
