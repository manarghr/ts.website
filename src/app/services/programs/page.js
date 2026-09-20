"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { 
  FaDumbbell,
  FaRunning,
  FaHeartbeat,
  FaArrowRight
} from "react-icons/fa";

export default function ProgramsPage() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/programs');
        if (!response.ok) {
          throw new Error('Failed to fetch programs');
        }
        const data = await response.json();
        
        if (data.success && data.programs) {
          setPrograms(data.programs);
        } else {
          setPrograms([]);
        }
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError(err.message);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const observers = Object.keys(sectionRefs.current).map((key) => {
      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [key]: true }));
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
      );
    });

    Object.keys(sectionRefs.current).forEach((key, index) => {
      if (sectionRefs.current[key]) {
        observers[index].observe(sectionRefs.current[key]);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [programs]);

  const goalIcons = {
    weight_loss: <FaHeartbeat className="text-4xl" />,
    bulking: <FaDumbbell className="text-4xl" />,
    muscle_building: <FaDumbbell className="text-4xl" />,
    endurance: <FaRunning className="text-4xl" />
  };

  const goalLabels = {
    weight_loss: "Weight Loss",
    bulking: "Bulking",
    muscle_building: "Muscle Building",
    endurance: "Endurance"
  };

  const groupProgramsByGoal = () => {
    const grouped = {
      weight_loss: [],
      bulking: [],
      muscle_building: [],
      endurance: []
    };

    programs.forEach(program => {
      let goal = program.goal;
      if (!goal) {
        goal = 'muscle_building';
      }
      goal = goal.toLowerCase().replace(/\s+/g, '_');
      
      if (goal.includes('weight') || goal.includes('loss') || goal.includes('fat')) {
        goal = 'weight_loss';
      } else if (goal.includes('bulk') || goal.includes('mass')) {
        goal = 'bulking';
      } else if (goal.includes('endurance') || goal.includes('cardio')) {
        goal = 'endurance';
      } else if (goal.includes('muscle') || goal.includes('strength') || goal.includes('build')) {
        goal = 'muscle_building';
      }
      
      if (grouped[goal]) {
        grouped[goal].push(program);
      } else {
        grouped.muscle_building.push(program);
      }
    });

    return grouped;
  };

  const groupedPrograms = groupProgramsByGoal();

  const handleProgramClick = (programId) => {
    if (!programId) {
      console.error('Program ID is missing');
      return;
    }
    router.push(`/programs/${programId}`);
  };

  // Flattened view for the filtered list. The grouping above stays as it is --
  // it is what powers the goal filter and the counts.
  const visiblePrograms =
    selectedGoal === "all"
      ? Object.values(groupedPrograms).flat()
      : groupedPrograms[selectedGoal] || [];

  const [featured, ...others] = visiblePrograms;

  return (
    <MainLayout>
      <div className="w-full bg-white">
        {/* Masthead
            ----------------------------------------------------------------
            Editorial rather than a 500px photographic banner: the eyebrow,
            the headline and the count of what is actually available. A
            discovery page should get you to the list quickly. */}
        <section className="relative overflow-hidden bg-forest pb-16 pt-16 text-white md:pb-20 md:pt-20">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[20vw] font-extrabold leading-none tracking-tighter text-white/[0.03]"
          >
            PROGRAMS
          </span>

          <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end"
            >
              <div>
                <p className="eyebrow text-moss-light">Train with purpose</p>
                <h1 className="mt-6 font-display text-display font-extrabold">
                  Programs built around
                  <span className="block text-white/45">how you move.</span>
                </h1>
              </div>

              <p className="max-w-prose leading-relaxed text-white/65 lg:pb-3">
                Each programme states its goal, its level, the equipment it assumes and
                the schedule it runs to — so you can tell before you start whether it
                fits the time you actually have.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Goal filter. Quiet text tabs, sticky under the navbar. */}
        <section className="sticky top-[var(--nav-h)] z-30 border-b border-ink/10 bg-white/90 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 py-5">
              <button
                onClick={() => setSelectedGoal("all")}
                className={`relative pb-1 text-sm font-semibold transition-colors duration-300 ${
                  selectedGoal === "all" ? "text-forest" : "text-ink-muted hover:text-forest"
                }`}
              >
                All programs
                <span
                  className={`absolute -bottom-[9px] left-0 h-px w-full bg-forest transition-transform duration-300 ease-editorial ${
                    selectedGoal === "all" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>

              {Object.entries(goalLabels).map(([goal, label]) => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`relative pb-1 text-sm font-semibold transition-colors duration-300 ${
                    selectedGoal === goal ? "text-forest" : "text-ink-muted hover:text-forest"
                  }`}
                >
                  {label}
                  <span className="ml-1.5 text-xs font-normal opacity-50">
                    {(groupedPrograms[goal] || []).length}
                  </span>
                  <span
                    className={`absolute -bottom-[9px] left-0 h-px w-full bg-forest transition-transform duration-300 ease-editorial ${
                      selectedGoal === goal ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20 lg:px-16">
          {loading ? (
            <p className="py-24 text-center text-ink-muted">Loading programs…</p>
          ) : error ? (
            <p className="py-24 text-center text-ink-soft">{error}</p>
          ) : visiblePrograms.length === 0 ? (
            <div className="py-24 text-center">
              <h2 className="font-display text-2xl font-bold text-forest">
                No programs in this goal yet
              </h2>
              <button
                onClick={() => setSelectedGoal("all")}
                className="mt-7 rounded-full bg-forest px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-moss"
              >
                See all programs
              </button>
            </div>
          ) : (
            <>
              {/* The lead programme, given a full split. */}
              {featured && (
                <motion.article
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="group cursor-pointer"
                  onClick={() => handleProgramClick(featured.id)}
                >
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
                    <div className="flex aspect-[4/3] items-end overflow-hidden rounded-2xl bg-forest p-8 lg:aspect-auto lg:min-h-[340px]">
                      <span className="font-display text-[22vw] font-extrabold leading-none tracking-tighter text-white/10 lg:text-[9rem]">
                        01
                      </span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="eyebrow text-moss">{featured.level || "All levels"}</span>
                        <span className="h-px w-8 bg-ink/15" />
                        <span className="text-xs text-ink-muted">{featured.duration}</span>
                      </div>

                      <h2 className="mt-5 font-display text-display-sm font-extrabold text-forest transition-colors duration-300 group-hover:text-moss">
                        {featured.name || featured.title}
                      </h2>

                      <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
                        {featured.description}
                      </p>

                      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/10 pt-6">
                        {featured.goal && (
                          <span className="text-sm text-ink-soft">{featured.goal}</span>
                        )}
                        {featured.equipment && (
                          <span className="text-sm text-ink-muted">{featured.equipment}</span>
                        )}
                        <span className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-forest transition-all duration-300 ease-editorial group-hover:gap-3">
                          Explore program
                          <FaArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* The rest, numbered. Rules rather than card borders. */}
              {others.length > 0 && (
                <ul className="mt-20 border-t border-ink/10">
                  {others.map((program, index) => (
                    <motion.li
                      key={program.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="border-b border-ink/10"
                    >
                      <button
                        onClick={() => handleProgramClick(program.id)}
                        className="group grid w-full gap-3 py-8 text-left md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)_auto] md:items-baseline md:gap-10"
                      >
                        <span className="eyebrow text-ink-muted transition-colors duration-300 group-hover:text-moss-light">
                          {String(index + 2).padStart(2, "0")}
                        </span>

                        <div>
                          <h3 className="font-display text-2xl font-bold text-forest transition-transform duration-300 ease-editorial md:group-hover:translate-x-1">
                            {program.name || program.title}
                          </h3>
                          <p className="mt-1.5 text-sm text-ink-muted">
                            {program.level}
                            {program.level && program.duration ? " · " : ""}
                            {program.duration}
                          </p>
                        </div>

                        <p className="max-w-prose leading-relaxed text-ink-soft line-clamp-2">
                          {program.description}
                        </p>

                        <FaArrowRight className="hidden h-4 w-4 shrink-0 text-ink-muted transition-all duration-300 ease-editorial group-hover:text-moss-light md:block md:group-hover:translate-x-1" />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
