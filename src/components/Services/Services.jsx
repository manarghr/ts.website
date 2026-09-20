"use client";

// Training categories
// File: src/components/Services/Services.jsx
//
// Was a horizontal carousel of six identical cards, each showing the same
// photograph. Repeating one image six times makes the page look like it ran
// out of content, so this is typography-led instead: numbered rows separated
// by rules, no cards, no icon tiles.
//
// The numbering does the work a card border used to do -- it groups and orders
// the list without drawing six boxes. Hovering lifts the row's rule and slides
// the title, which is enough feedback without animation for its own sake.

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
};

const SERVICES = [
  {
    title: "Strength training",
    para: "Build muscle and power with programmes structured around progressive overload.",
    href: "/services/programs",
  },
  {
    title: "Cardio workouts",
    para: "Endurance work that respects the difference between an easy day and a hard one.",
    href: "/services/programs",
  },
  {
    title: "Flexibility & mobility",
    para: "Targeted range-of-motion work for the joints that limit your lifts.",
    href: "/services/programs",
  },
  {
    title: "Sports-specific training",
    para: "Programmes built around the demands of your sport and its season.",
    href: "/services/programs",
  },
  {
    title: "Recovery & rehabilitation",
    para: "Structured returns from injury, planned in weeks rather than sessions.",
    href: "/services/programs",
  },
  {
    title: "Nutrition guidance",
    para: "Meal plans and recipes with the numbers already worked out.",
    href: "/services/meals",
  },
];

export default function Services() {
  return (
    <section className="relative bg-bone py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow text-moss">What you can train</p>
            <h2 className="mt-5 max-w-2xl font-display text-display font-bold text-forest">
              Six ways in, one way of working.
            </h2>
          </div>

          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 text-base font-semibold text-forest transition-all duration-300 ease-editorial hover:gap-3"
          >
            All services
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mt-16 border-t border-ink/10"
        >
          {SERVICES.map((service, index) => (
            <motion.li key={service.title} variants={fadeInUp} className="border-b border-ink/10">
              <Link
                href={service.href}
                className="group grid gap-3 py-8 transition-colors duration-300 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)_auto] md:items-baseline md:gap-10"
              >
                <span className="eyebrow text-ink-muted transition-colors duration-300 group-hover:text-moss-light">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display text-2xl font-bold text-forest transition-transform duration-300 ease-editorial md:text-3xl md:group-hover:translate-x-1">
                  {service.title}
                </h3>

                <p className="max-w-prose leading-relaxed text-ink-soft">{service.para}</p>

                <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-ink-muted transition-all duration-300 ease-editorial group-hover:text-moss-light md:block md:group-hover:-translate-y-0.5 md:group-hover:translate-x-0.5" />
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
