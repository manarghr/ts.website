"use client";

import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import Head from "@/components/head/Head";
import AIHome from "@/components/AiHome/AIHome";
import Services from "@/components/Services/Services";
import CoachesHome from "@/components/coaches/CoachesHome";
import BlogHome from "@/components/blog/BlogHome";
import Link from "next/link";
import { FaArrowRight, FaDumbbell, FaChartLine, FaUsers, FaHeartbeat } from "react-icons/fa";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { 
    transition: { staggerChildren: 0.1 } 
  },
  viewport: { once: true }
};

export default function Home() {
  return (
    <MainLayout>
      <div className="bg-white overflow-x-hidden relative min-h-screen">

        {/* Hero Section */}
        <div className="relative z-10">
          <Head />
        </div>

        {/* Capabilities
            ------------------------------------------------------------------
            Was four identical icon-cards in a row. A row of equal cards tells
            the reader everything here matters the same amount, which is never
            true -- the form analysis is the reason this product exists and the
            rest support it. So it is a two-column split: the argument on the
            left, the features on the right, with the first one given weight
            and the other three reduced to a list. */}
        <section className="relative bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
              <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
                <p className="eyebrow text-moss">What it does</p>
                <h2 className="mt-5 font-display text-display font-bold text-forest">
                  Everything you need to train with intention.
                </h2>
                <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">
                  Most training apps count what you did. TrainSight looks at how you
                  did it — then gives you something specific to change on the next rep.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="flex flex-col"
              >
                {/* The one feature that earns a panel of its own. */}
                <motion.article
                  variants={fadeInUp}
                  className="group relative overflow-hidden rounded-2xl bg-forest p-8 text-white md:p-10"
                >
                  <FaDumbbell className="h-6 w-6 text-moss-light" />
                  <h3 className="mt-6 font-display text-2xl font-bold md:text-3xl">
                    AI form analysis
                  </h3>
                  <p className="mt-3 max-w-prose leading-relaxed text-white/65">
                    A pose model reads 33 joints from your camera and measures the
                    angles that matter for the lift. It runs entirely in your browser,
                    so nothing you film is ever uploaded.
                  </p>
                  <Link
                    href="/services/ai-sports"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-moss-light transition-all duration-300 ease-editorial hover:gap-3"
                  >
                    Try it now
                    <FaArrowRight className="h-3 w-3" />
                  </Link>
                </motion.article>

                {/* The supporting three: a list, not cards. Separated by rules
                    rather than boxes, which is quieter and reads faster. */}
                <div className="mt-10 divide-y divide-bone-dark border-t border-bone-dark">
                  {[
                    {
                      icon: FaChartLine,
                      title: "Progress tracking",
                      desc: "Every finished session is scored and saved — reps, form, duration.",
                    },
                    {
                      icon: FaUsers,
                      title: "Coach-built programs",
                      desc: "Structured plans written by the coaches on the platform.",
                    },
                    {
                      icon: FaHeartbeat,
                      title: "Nutrition plans",
                      desc: "Recipes and meal plans with the numbers worked out for you.",
                    },
                  ].map((feature) => (
                    <motion.div
                      key={feature.title}
                      variants={fadeInUp}
                      className="group flex gap-5 py-6"
                    >
                      <feature.icon className="mt-1 h-5 w-5 shrink-0 text-moss transition-colors duration-300 group-hover:text-moss-light" />
                      <div>
                        <h3 className="font-display text-lg font-bold text-forest">
                          {feature.title}
                        </h3>
                        <p className="mt-1 leading-relaxed text-ink-soft">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* AI Technology Section */}
        <section className="relative z-10">
          <div className="relative z-10">
            <AIHome />
          </div>
        </section>

        {/* Services Section */}
        <section className="relative z-10">
          <div className="relative z-10">
            <Services />
          </div>
        </section>

        {/* Coaches Section */}
        <section className="relative z-10">
          <div className="relative z-10">
            <CoachesHome />
          </div>
        </section>

        {/* Blog Section */}
        <section className="relative z-10">
          <div className="relative z-10">
            <BlogHome />
          </div>
        </section>

        {/* Closing statement
            ------------------------------------------------------------------
            Was a centred pill, a centred headline, a centred paragraph and two
            centred buttons on a patterned gradient -- the exact shape of every
            SaaS footer CTA. Now the type is left-aligned and oversized, the
            pattern is gone, and the claim "join thousands of athletes" is gone
            with it: there are no thousands of athletes, and inventing them is
            the fastest way to lose a reader who checks. */}
        <section className="relative overflow-hidden bg-forest py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-20"
            >
              <div>
                <p className="eyebrow text-moss-light">Get started</p>
                <h2 className="mt-6 font-display text-display-lg font-extrabold leading-[0.95] text-white">
                  Your training.
                  <span className="block text-white/45">Rethought.</span>
                </h2>
              </div>

              <div className="lg:pb-3">
                <p className="max-w-prose text-lg leading-relaxed text-white/70">
                  Turn on your camera and get feedback on the next rep. No equipment
                  beyond what you already train with, and nothing you film leaves
                  your device.
                </p>

                <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  <Link
                    href="/services/ai-sports"
                    className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-ink transition-all duration-300 ease-editorial hover:gap-4 hover:bg-moss-light hover:text-white"
                  >
                    Try the form analysis
                    <FaArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/coaches"
                    className="group relative text-base font-medium text-white/75 transition-colors duration-300 hover:text-white"
                  >
                    Browse coaches
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-editorial group-hover:scale-x-100" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
