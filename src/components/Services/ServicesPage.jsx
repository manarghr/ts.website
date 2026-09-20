"use client";

// Services page
// File: src/components/Services/ServicesPage.jsx
//
// Three offerings, three full-width numbered sections, alternating sides. Not
// three cards in a row: a card implies the items are interchangeable, and these
// are different kinds of thing entirely -- a tool, a library and a reference.
//
// On imagery: the only genuine photograph of the product is the analyser
// screenshot, so that is the only one used. The other two sections are
// typographic and carry a colour block instead. Padding them out with unrelated
// gym stock would look like filler, which is exactly the impression the page is
// trying to lose.

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import picture from "../assets/picture.png";

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const SERVICES = [
  {
    number: "01",
    title: "Form analysis",
    href: "/services/ai-sports",
    cta: "Open the analyser",
    lead: "A pose model runs in your browser and watches you move.",
    body:
      "Point a camera at yourself and start a set. It locates 33 joints, measures the angles that define the lift, counts the reps and scores each one at its turning point. Nothing you film is uploaded.",
    points: ["Squat, push-up, lunge and plank", "Live angle against the target band", "Per-rep scoring, not a single average"],
    media: "screenshot",
  },
  {
    number: "02",
    title: "Training programs",
    href: "/services/programs",
    cta: "Browse programs",
    lead: "Structured plans written by the coaches on the platform.",
    body:
      "Each programme states its goal, its level, the equipment it assumes and the schedule it runs to — so you can tell before starting whether it fits the time you actually have.",
    points: ["Strength, endurance and mobility", "Week-by-week schedules", "Written by named coaches"],
    media: "photo",
    // verified by eye: barbell deadlift setup
    photo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&h=1200&fit=crop&q=85&auto=format",
  },
  {
    number: "03",
    title: "Nutrition",
    href: "/services/meals",
    cta: "See meal plans",
    lead: "Recipes with the numbers already worked out.",
    body:
      "Meals with macros, prep time, servings and method — filterable by goal and by meal type, so a plan survives contact with a weekday evening.",
    points: ["Macros per serving", "Filter by goal and meal type", "Prep time and method included"],
    media: "photo",
    // verified by eye: baked salmon on greens
    photo: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1600&h=1200&fit=crop&q=85&auto=format",
  },
];

const STEPS = [
  { step: "01", title: "Create an account", body: "Set your goal and training experience." },
  { step: "02", title: "Pick your route", body: "A programme, a coach, or straight into the analyser." },
  { step: "03", title: "Train and review", body: "Every finished session is scored and saved." },
];

export default function ServicesPage() {
  return (
    <div className="w-full bg-white">
      {/* Header. Compact, typographic, no photographic banner. */}
      <section className="bg-forest pb-16 pt-16 md:pt-20 text-white md:pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end"
          >
            <div>
              <p className="eyebrow text-moss-light">Services</p>
              <h1 className="mt-6 font-display text-display font-extrabold">
                Three ways to use
                <span className="block text-white/45">TrainSight.</span>
              </h1>
            </div>

            <p className="max-w-prose leading-relaxed text-white/65 lg:pb-3">
              A tool that watches your form, a library of programmes written by coaches,
              and the nutrition reference that sits behind both.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The three offerings. Alternating sides so the page has a rhythm rather
          than three identical blocks stacked. */}
      {SERVICES.map((service, index) => {
        const flipped = index % 2 === 1;

        return (
          <section
            key={service.number}
            className={index % 2 === 1 ? "bg-bone py-20 md:py-28" : "bg-white py-20 md:py-28"}
          >
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
              <motion.div
                {...reveal}
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
              >
                <div className={flipped ? "lg:order-2" : ""}>
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-5xl font-extrabold text-ink/10">
                      {service.number}
                    </span>
                    <h2 className="font-display text-display-sm font-extrabold text-forest">
                      {service.title}
                    </h2>
                  </div>

                  <p className="mt-7 max-w-prose text-xl leading-relaxed text-forest">
                    {service.lead}
                  </p>
                  <p className="mt-4 max-w-prose leading-relaxed text-ink-soft">{service.body}</p>

                  <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                    {service.points.map((point) => (
                      <li key={point} className="py-3 text-sm text-ink-soft">
                        {point}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.href}
                    className="group mt-9 inline-flex items-center gap-3 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-editorial hover:gap-4 hover:bg-moss"
                  >
                    {service.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className={flipped ? "lg:order-1" : ""}>
                  {service.media === "screenshot" ? (
                    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-forest shadow-lg">
                      <Image
                        src={picture}
                        alt="The analyser tracking an athlete's joints during a squat"
                        className="h-auto w-full"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        placeholder="blur"
                      />
                    </div>
                  ) : service.media === "photo" ? (
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-bone-dark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.photo}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    // Colour block fallback, for a service with no photograph.
                    <div
                      className={`flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl ${
                        flipped ? "bg-forest" : "bg-moss"
                      }`}
                    >
                      <span className="font-display text-[26vw] font-extrabold leading-none tracking-tighter text-white/10 lg:text-[12rem]">
                        {service.number}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* How it works. A numbered row, no cards. */}
      <section className="bg-forest py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <motion.div {...reveal}>
            <p className="eyebrow text-moss-light">Getting started</p>
            <h2 className="mt-5 max-w-2xl font-display text-display font-bold">
              Three steps, then you are training.
            </h2>
          </motion.div>

          <motion.div
            {...reveal}
            className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3"
          >
            {STEPS.map((item) => (
              <div key={item.step} className="bg-forest p-8 md:p-9">
                <span className="eyebrow text-moss-light">{item.step}</span>
                <h3 className="mt-5 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-white/60">{item.body}</p>
              </div>
            ))}
          </motion.div>

          <motion.div {...reveal} className="mt-14">
            <Link
              href="/coaches"
              className="group inline-flex items-center gap-2 text-base font-semibold text-white transition-all duration-300 ease-editorial hover:gap-3"
            >
              Or start by finding a coach
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
