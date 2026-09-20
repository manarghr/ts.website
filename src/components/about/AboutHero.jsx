"use client";

// About page
// File: src/components/about/AboutHero.jsx
//
// Structure: an editorial masthead, the problem, how the analysis actually
// works, an honest statement of limits, then a close. Deliberately varied --
// a split, a numbered row, a pull quote, a two-column list -- so no two
// sections repeat the same shape.
//
// The previous version opened with a 600px photographic banner and then ran an
// "Our Impact" counter animating up to 10,000 active users, alongside an
// exercises-tracked figure and a form-accuracy percentage. None of those
// numbers exist. They are replaced here with things that are true and
// checkable: what the model measures, and where it stops working.

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import picture from "../assets/picture.png";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const HOW = [
  {
    step: "01",
    title: "Find the body",
    body: "A pose model locates 33 landmarks — shoulders, elbows, hips, knees, ankles — in every frame your camera produces, each with a confidence score.",
  },
  {
    step: "02",
    title: "Measure the angle",
    body: "Three landmarks make an angle. For a squat that is hip, knee and ankle; for a push-up, shoulder, elbow and wrist. The angle is the measurement everything else rests on.",
  },
  {
    step: "03",
    title: "Judge the rep",
    body: "The angle is compared against the band that counts as good form, and each repetition is scored at its turning point — how deep you actually got.",
  },
];

const LIMITS = [
  {
    title: "It sees in two dimensions",
    body: "Rotation toward or away from the lens is invisible to it. A knee that caves inward or a spine that rounds away from the camera can pass unnoticed.",
  },
  {
    title: "It reads one side of the body",
    body: "The measurements are taken from your right side. Film yourself from the other side and it is measuring joints it cannot properly see.",
  },
  {
    title: "It does not know you",
    body: "It has no knowledge of your injuries, your proportions, or what a physiotherapist told you. It is feedback, not permission.",
  },
];

export default function AboutHero() {
  return (
    <div className="w-full bg-white">
      {/* Masthead. Oversized type with a faint wordmark behind it, rather than
          a photographic banner with centred text over a dark scrim. */}
      <section className="relative overflow-hidden bg-forest pb-20 pt-20 md:pt-24 text-white md:pb-28">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -left-6 select-none font-display text-[24vw] font-extrabold leading-none tracking-tighter text-white/[0.03]"
        >
          TRAINSIGHT
        </span>

        <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow text-moss-light">About</p>
            <h1 className="mt-6 max-w-4xl font-display text-display-lg font-extrabold">
              A mirror that
              <span className="block text-white/45">actually watches.</span>
            </h1>
            <p className="mt-8 max-w-prose text-lg leading-relaxed text-white/70">
              Most training apps record what you did. TrainSight looks at how you did
              it — measuring the angles that define a lift and telling you what to
              change while you are still in the movement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The problem. A split, weighted toward the text. */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <motion.div {...reveal} className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div>
              <p className="eyebrow text-moss">The problem</p>
              <h2 className="mt-5 font-display text-display font-bold text-forest">
                Nobody is watching your third set.
              </h2>
            </div>

            <div className="lg:pt-4">
              <p className="max-w-prose text-lg leading-relaxed text-ink-soft">
                A coach can correct the rep in front of them. They cannot be in your
                garage on a Tuesday evening, and most people training alone have no
                idea their depth drifts as they fatigue.
              </p>
              <p className="mt-5 max-w-prose leading-relaxed text-ink-soft">
                Video helps, but only after the fact, and only if you go back and watch
                it. What is missing is something that notices at the moment it matters
                and says so in time to change the next repetition.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works. Numbered, with the product beside it. */}
      <section className="bg-bone py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <motion.div {...reveal} className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow text-moss">How it works</p>
              <h2 className="mt-5 font-display text-display font-bold text-forest">
                Three landmarks, one angle, one verdict.
              </h2>

              <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
                {HOW.map((item) => (
                  <div key={item.step} className="flex gap-6 py-6">
                    <span className="eyebrow pt-1 text-ink-muted">{item.step}</span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-forest">{item.title}</h3>
                      <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-forest shadow-lg">
              <Image
                src={picture}
                alt="The analyser tracking an athlete's joints during a squat"
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pull quote. A full-width statement, no card, no icon. */}
      <section className="bg-forest py-24 text-white md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center md:px-12">
          <motion.blockquote {...reveal}>
            <p className="font-display text-display-sm font-bold leading-tight">
              &ldquo;A good score is not proof that a movement is safe for your body,
              and a bad one is not proof that something is wrong.&rdquo;
            </p>
            <footer className="eyebrow mt-8 text-white/40">
              From the TrainSight terms of service
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Limits. The section most products leave out. */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <motion.div {...reveal}>
            <p className="eyebrow text-moss">Where it stops</p>
            <h2 className="mt-5 max-w-3xl font-display text-display font-bold text-forest">
              What the camera cannot tell you.
            </h2>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">
              Knowing the limits is what makes the rest of it useful.
            </p>
          </motion.div>

          <motion.div {...reveal} className="mt-14 grid gap-x-12 gap-y-10 border-t border-ink/10 pt-12 md:grid-cols-3">
            {LIMITS.map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-lg font-bold text-forest">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Close. */}
      <section className="bg-bone py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-20">
            <h2 className="font-display text-display font-bold text-forest">
              Point your camera at
              <span className="block text-ink-muted">your next set.</span>
            </h2>

            <div className="lg:pb-2">
              <p className="max-w-prose leading-relaxed text-ink-soft">
                It runs in your browser, so nothing you film leaves your device, and
                there is nothing to install.
              </p>

              <Link
                href="/services/ai-sports"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-forest px-8 py-4 text-base font-semibold text-white transition-all duration-300 ease-editorial hover:gap-4 hover:bg-moss"
              >
                Try the form analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
