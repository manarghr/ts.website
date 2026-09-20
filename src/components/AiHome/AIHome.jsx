"use client";

// AI showcase
// File: src/components/AiHome/AIHome.jsx
//
// The differentiator, so it gets the most deliberate composition on the page.
//
// Previously: centred pill, centred heading, a screenshot inside a card, then
// four identical feature boxes. That is the same shape as every other section,
// which wastes the one thing here nobody else has.
//
// Now it is a dark, full-bleed split. Type on the left, the product on the
// right, deliberately overlapping its frame so it reads as a real interface
// caught mid-use rather than an image pasted into a box. Capabilities sit
// underneath as a numbered row -- no cards, no icon tiles.
//
// Copy is limited to what the product actually does. The previous version
// promised "Free for 14 Days" (the trial is 7 days, and checkout is not
// connected) and "thousands of athletes" (there are none). Both are gone.

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import picture from "../assets/picture.png";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true },
};

/** What the analyser genuinely measures. Nothing here is aspirational. */
const CAPABILITIES = [
  {
    step: "01",
    title: "Reads 33 joints",
    body: "A pose model locates your joints in each frame and measures the angles that define the lift.",
  },
  {
    step: "02",
    title: "Scores every rep",
    body: "Each repetition is graded at its turning point — how deep you actually got, not how it felt.",
  },
  {
    step: "03",
    title: "Runs on your device",
    body: "The model executes in your browser. No frame from your camera is uploaded or stored.",
  },
];

export default function AIHome() {
  return (
    <section className="relative overflow-hidden bg-forest py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <p className="eyebrow text-moss-light">Form analysis</p>

            <h2 className="mt-6 font-display text-display font-bold text-white">
              The camera you already own,
              <span className="block text-white/45">watching every rep.</span>
            </h2>

            <p className="mt-7 max-w-prose text-lg leading-relaxed text-white/70">
              Point a phone or laptop at yourself and start a set. TrainSight tracks
              your joints as you move, counts the reps, and tells you what to change —
              while you are still in the movement.
            </p>

            <Link
              href="/services/ai-sports"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-ink transition-all duration-300 ease-editorial hover:gap-4 hover:bg-moss-light hover:text-white"
            >
              Open the analyser
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* The product, given room. The frame is cropped on the right at large
              sizes so the interface runs past the column edge -- a small thing
              that stops it reading as a stock screenshot in a card. */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative lg:-mr-12 xl:-mr-24"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-forest-700 shadow-lg">
              <Image
                src={picture}
                alt="TrainSight analysing a squat, with the detected skeleton drawn over the athlete"
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 55vw"
                placeholder="blur"
                priority={false}
              />
            </div>

            {/* A single readout lifted out of the interface, overlapping the
                frame. One detail, placed deliberately, does more than a row of
                floating stat cards. */}
            <div className="absolute -bottom-5 left-5 rounded-xl border border-white/10 bg-forest/95 px-5 py-4 backdrop-blur-sm sm:left-8">
              <p className="eyebrow text-white/45">Knee angle</p>
              <p className="mt-2 font-display text-3xl font-bold text-moss-light">92°</p>
              <p className="mt-1 text-xs text-white/50">target 90–140</p>
            </div>
          </motion.div>
        </div>

        {/* Capabilities as a numbered row. Rules instead of card borders. */}
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mt-24 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3"
        >
          {CAPABILITIES.map((item) => (
            <motion.div key={item.step} variants={fadeInUp} className="bg-forest p-8 md:p-9">
              <span className="eyebrow text-moss-light">{item.step}</span>
              <h3 className="mt-5 font-display text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
