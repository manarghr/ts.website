"use client";

// Homepage hero
// File: src/components/head/Head.jsx
//
// Composition notes, since this is the page's most important surface:
//
// The video is the asset, so the overlay has to make type legible without
// washing the footage out. A flat dark panel behind the text would do that and
// kill the video at the same time. Instead there are two gradients: a strong
// one rising from the bottom-left where the type sits, and a light top scrim so
// the transparent navbar has something to sit against. The right two-thirds of
// the frame stay largely uncovered, which is where the video subject lives.
//
// The headline is the dominant element on the entire site by design -- it
// clamps up to 6.75rem. Everything else in the hero is deliberately quiet so
// that it reads as one statement rather than a stack of competing blocks.

import { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/auth/AuthModal";
import CoachAuthModal from "@/components/auth/CoachAuthModal";
import { ArrowRight } from "lucide-react";

/** Capabilities the product genuinely has. No invented claims. */
const CAPABILITIES = ["AI form analysis", "Real-time feedback", "Coach-built programs"];

export default function Head() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCoachAuthModalOpen, setIsCoachAuthModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);
  const isAnyModalOpen = isAuthModalOpen || isCoachAuthModalOpen;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Pause the hero video while a modal is open.
  //
  // The modal backdrop uses backdrop-blur, which re-blurs whatever is behind it
  // on every painted frame. With the video playing that is 30-60 fresh frames a
  // second being blurred for no benefit -- the video is hidden behind the modal
  // anyway. Pausing makes opening and closing the modal noticeably snappier.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isAnyModalOpen) {
      video.pause();
    } else {
      // play() rejects if the browser blocks autoplay; nothing to do about it.
      video.play().catch(() => {});
    }
  }, [isAnyModalOpen]);

  const reveal = (delay) =>
    `transition-all duration-[900ms] ease-editorial ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  return (
    <>
      <section className="relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-forest">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/videos.mp4" type="video/mp4" />
          </video>

          {/* Readability without erasing the footage: weight concentrated at the
              bottom-left behind the type, thinning out across the frame. */}
          <div className="absolute inset-0 bg-gradient-to-tr from-forest via-forest/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-transparent to-forest/35" />
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-1 items-end pb-16 sm:items-center sm:pb-0">
            <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16">
              <div className="max-w-4xl">
                <p
                  className={`eyebrow text-moss-light ${reveal(0)}`}
                  style={{ transitionDelay: "120ms" }}
                >
                  TrainSight
                </p>

                <h1
                  className={`mt-5 font-display text-display-lg font-extrabold text-white ${reveal(1)}`}
                  style={{ transitionDelay: "220ms" }}
                >
                  Train smarter.
                  <span className="block text-white/55">Move better.</span>
                </h1>

                <p
                  className={`mt-7 max-w-prose text-lg leading-relaxed text-white/75 sm:text-xl ${reveal(2)}`}
                  style={{ transitionDelay: "340ms" }}
                >
                  A pose model runs in your browser and checks your form as you move —
                  counting reps, scoring depth, and telling you what to fix.
                </p>

                <div
                  className={`mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center ${reveal(3)}`}
                  style={{ transitionDelay: "460ms" }}
                >
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-ink transition-all duration-300 ease-editorial hover:gap-4 hover:bg-moss-light hover:text-white"
                  >
                    Start training
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>

                  {/* Understated on purpose -- a second filled button would make
                      the two compete and neither would read as the primary. */}
                  <button
                    onClick={() => setIsCoachAuthModalOpen(true)}
                    className="group relative text-base font-medium text-white/80 transition-colors duration-300 hover:text-white"
                  >
                    Join as a coach
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-editorial group-hover:scale-x-100" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* A quiet capability strip along the base, anchoring the composition
              and giving the eye somewhere to land before the fold. */}
          <div
            className={`border-t border-white/10 ${reveal(4)}`}
            style={{ transitionDelay: "620ms" }}
          >
            <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16">
              <ul className="flex flex-wrap items-center gap-x-10 gap-y-3 py-5 text-white/55">
                {CAPABILITIES.map((item) => (
                  <li key={item} className="eyebrow">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CoachAuthModal
        isOpen={isCoachAuthModalOpen}
        onClose={() => setIsCoachAuthModalOpen(false)}
      />
    </>
  );
}
