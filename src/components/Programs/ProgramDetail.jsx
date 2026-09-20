"use client";

import { useAuth } from "@/components/auth/AuthProvider"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  FaDumbbell, 
  FaRunning, 
  FaHeartbeat, 
  FaCheckCircle,
  FaArrowLeft,
  FaCalendar,
  FaTools,
  FaUser,
  FaDollarSign,
  FaClock,
  FaLock
} from "react-icons/fa";
import { useToast } from "@/components/ui/ToastProvider";
import { useConfirm } from "@/components/ui/ConfirmProvider";

export default function ProgramDetail({ programId }) {
  const toast = useToast();
  const confirm = useConfirm();
  const { user: authUser } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [owned, setOwned] = useState(false);
  // The server strips the schedule for programs you have not bought, and says so.
  const [locked, setLocked] = useState(false);
  // Bumped after a purchase so the program is fetched again, unlocked this time.
  const [refreshKey, setRefreshKey] = useState(0);
  // The server quotes the price, including the subscriber discount. Working it out
  // here as well would eventually disagree with what actually gets charged.
  const [quote, setQuote] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [coach, setCoach] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Who is signed in comes from the auth provider, which asks the server.
  useEffect(() => {
    setCurrentUser(authUser);
    setIsLoggedIn(Boolean(authUser));
  }, [authUser]);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching program with ID:', programId); // Debug log
        
        if (!programId) {
          setError('Program ID is missing');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/programs/${programId}`);
        console.log('API Response status:', response.status); // Debug log
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch program: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Program data received:', data); // Debug log
        
        if (data.success && data.program) {
          setProgram(data.program);
          setLocked(Boolean(data.locked));
        } else {
          setError(data.error || 'Program not found');
        }
      } catch (err) {
        console.error('Error fetching program:', err);
        setError(err.message || 'Failed to load program');
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgram();
    } else {
      setError('Program ID is required');
      setLoading(false);
    }
  }, [programId, refreshKey]);

  // Ask the server whether this is already owned and what it would cost. Only the
  // server knows the buyer's plan, so only the server can quote the real price.
  useEffect(() => {
    if (!programId || !isLoggedIn) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/purchases?itemType=program&itemId=${programId}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setOwned(Boolean(data.owned));
        setQuote(data.quote || null);
      } catch (err) {
        console.error("Could not check purchase status:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [programId, isLoggedIn]);

  // The programme endpoint returns coach_id but not the coach, so fetch it.
  // A failure here costs the byline, not the page.
  useEffect(() => {
    if (!program?.coach_id) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/coaches/${program.coach_id}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCoach(data.coach || data);
      } catch {
        // byline stays hidden
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [program?.coach_id]);

  const handleEnroll = async () => {
    if (!isLoggedIn || !currentUser) {
      const proceed = await confirm({
        title: 'Log in to enroll',
        message: `You need an account to enroll in "${program?.name ?? 'this program'}". Would you like to log in now?`,
        confirmText: 'Log in',
        cancelText: 'Not now',
        danger: false,
      });
      if (proceed) router.push('/?auth=login');
      return;
    }

    if (owned) {
      router.push('/profile');
      return;
    }

    setEnrolling(true);
    try {
      // No payment provider yet: this records the sale and grants access. When one
      // is added it goes in front of this call and nothing downstream changes.
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType: 'program', itemId: program.id }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        setOwned(true);
        setRefreshKey((key) => key + 1);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Could not complete enrollment');

      setOwned(true);
      setRefreshKey((key) => key + 1);
      toast.success(`You now have access to "${program.name}".`, { title: "You're enrolled" });
    } catch (err) {
      console.error('Error enrolling:', err);
      toast.error(err.message || 'Could not complete enrollment. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#354F52] text-xl">Loading program...</div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Program not found'}</div>
          <button
            onClick={() => router.push('/services')}
            className="px-6 py-3 bg-[#354F52] text-white rounded-lg hover:bg-[#52796F] transition-all"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = program.discount && program.discount_percentage
    ? program.price * (1 - program.discount_percentage / 100)
    : program.price;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#C8CDC5]/20">
      {/* Programme header
          ------------------------------------------------------------------
          Cover photograph, the coach's byline, and how many people are on the
          programme -- the three things someone weighs before starting one.
          The icon tile that used to sit here repeated the goal label beside
          it, so it is gone. */}
      <section className="bg-forest pb-14 pt-10 text-white md:pb-16">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 hover:text-white"
          >
            <FaArrowLeft className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to programs
          </button>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div className="flex flex-col justify-center">
              <p className="eyebrow text-moss-light">
                {goalLabels[program.goal] || program.goal}
              </p>

              <h1 className="mt-5 font-display text-display-sm font-extrabold">
                {program.name}
              </h1>

              {/* Byline. Only rendered once the coach actually resolves. */}
              {coach && (
                <Link
                  href={`/coaches/${coach.id}`}
                  className="group mt-7 inline-flex items-center gap-3.5"
                >
                  <span className="relative h-11 w-11 overflow-hidden rounded-full bg-forest-700">
                    <Image
                      src={coach.image_url || "/coach-avatar.svg"}
                      alt={coach.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold transition-colors duration-300 group-hover:text-moss-light">
                      {coach.name}
                    </span>
                    <span className="block text-xs text-white/50">{coach.category} coach</span>
                  </span>
                </Link>
              )}

              <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-y border-white/10 py-5">
                {[
                  ["Level", program.level || "All levels"],
                  ["Duration", program.duration || "—"],
                  [
                    "Enrolled",
                    program.enrolled ? program.enrolled.toLocaleString() : "—",
                  ],
                  ["Lessons", program.lessons?.length || "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dd className="font-display text-2xl font-bold">{value}</dd>
                    <dt className="eyebrow mt-1 text-white/40">{label}</dt>
                  </div>
                ))}
              </dl>
            </div>

            {program.image && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={program.image}
                  alt={program.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <p className="mt-10 max-w-prose leading-relaxed text-white/70">

            {program.description}
          </p>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-4">
            {program.duration && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <FaClock className="text-[#6BB371]" />
                <span>{program.duration}</span>
              </div>
            )}
            {program.level && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <FaUser className="text-[#6BB371]" />
                <span>{program.level}</span>
              </div>
            )}
            {program.price > 0 && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <FaDollarSign className="text-[#6BB371]" />
                <span>
                  ${finalPrice.toFixed(2)}
                  {program.discount && program.discount_percentage && (
                    <span className="text-sm line-through opacity-70 ml-2">
                      ${program.price.toFixed(2)}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-[#354F52] mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#52796F] to-[#6BB371] rounded"></div>
                  Overview
                </h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <p className="text-lg font-medium mb-4 text-[#354F52]">{program.description}</p>
                  {program.overview ? (
                    <div className="mt-6 p-6 bg-[#C8CDC5]/10 rounded-lg border-l-4 border-[#52796F]">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{program.overview}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic mt-4">Additional program details will be available after enrollment.</p>
                  )}
                </div>
              </div>

              {/* Day-by-Day Schedule */}
              {program.schedule && program.schedule.length > 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <FaCalendar className="text-[#52796F] text-2xl" />
                    <h2 className="text-3xl font-bold text-[#354F52]">Day-by-Day Schedule</h2>
                  </div>
                  <div className="space-y-6">
                    {program.schedule.map((day, index) => (
                      <div key={index} className="border-l-4 border-[#52796F] pl-6 py-4 bg-[#C8CDC5]/5 rounded-r-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-[#354F52]">
                            {day.day || `Day ${index + 1}`}
                          </h3>
                          {day.focus && (
                            <span className="px-3 py-1 bg-[#52796F]/10 text-[#52796F] rounded-full text-sm font-semibold">
                              {day.focus}
                            </span>
                          )}
                        </div>
                        {day.exercises && day.exercises.length > 0 && (
                          <ul className="space-y-3 mt-4">
                            {day.exercises.map((exercise, exIndex) => (
                              <li key={exIndex} className="flex items-start gap-3 text-gray-700 bg-white p-3 rounded-lg border border-[#C8CDC5]/30">
                                <FaCheckCircle className="text-[#6BB371] flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                  <span className="font-medium">
                                    {typeof exercise === 'string' ? exercise : exercise.name}
                                  </span>
                                  {exercise.sets && exercise.reps && (
                                    <span className="text-gray-500 ml-2 text-sm">
                                      ({exercise.sets} sets × {exercise.reps} reps)
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                        {day.notes && (
                          <div className="mt-3 p-3 bg-[#52796F]/5 rounded-lg border-l-2 border-[#52796F]">
                            <p className="text-gray-700 text-sm italic">{day.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FaCalendar className="text-[#52796F] text-2xl" />
                    <h2 className="text-3xl font-bold text-[#354F52]">Day-by-Day Schedule</h2>
                  </div>
                  {locked ? (
                    <div className="p-6 bg-[#C8CDC5]/15 rounded-lg border border-[#C8CDC5] text-center">
                      <FaLock className="text-[#52796F] text-2xl mx-auto mb-3" />
                      <p className="text-[#354F52] font-semibold mb-1">
                        {program.lockedDays > 0
                          ? `${program.lockedDays} days of training, unlocked when you buy this program.`
                          : "The full schedule is unlocked when you buy this program."}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Every session, exercise and coach note is included.
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Schedule details will be available after enrollment.</p>
                  )}
                </div>
              )}

              {/* Exercises List */}
              {program.exercises && program.exercises.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-[#354F52] mb-6">Exercises Included</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {program.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-[#C8CDC5]/20 rounded-lg">
                        <FaCheckCircle className="text-[#6BB371] flex-shrink-0" />
                        <span className="text-gray-700">
                          {typeof exercise === 'string' ? exercise : exercise.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Required Equipment */}
              {program.equipment && program.equipment.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FaTools className="text-[#52796F] text-xl" />
                    <h3 className="text-xl font-bold text-[#354F52]">Required Equipment</h3>
                  </div>
                  <ul className="space-y-2">
                    {program.equipment.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <FaCheckCircle className="text-[#6BB371] text-sm flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Coach Recommendation */}
              {program.coach_recommendation && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FaUser className="text-[#52796F] text-xl" />
                    <h3 className="text-xl font-bold text-[#354F52]">Recommended Coach</h3>
                  </div>
                  <p className="text-gray-700">{program.coach_recommendation}</p>
                  {program.coach_id && (
                    <button
                      onClick={() => router.push(`/coaches/${program.coach_id}`)}
                      className="mt-4 w-full py-2 px-4 bg-[#354F52] text-white rounded-lg hover:bg-[#52796F] transition-all text-sm"
                    >
                      View Coach Profile
                    </button>
                  )}
                </div>
              )}

              {/* Pricing & Enroll */}
              <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-2xl p-6 shadow-lg text-white sticky top-6">
                <h3 className="text-2xl font-bold mb-4">Get Started</h3>
                
                {/* Price Display */}
                {program.price > 0 ? (
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <div className="text-4xl font-bold">
                        ${(quote ? quote.amountPaid : finalPrice).toFixed(2)}
                      </div>
                      {program.discount && program.discount_percentage && (
                        <div className="text-lg text-white/70 line-through">
                          ${program.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {program.discount && program.discount_percentage ? (
                        <span className="inline-block px-3 py-1 bg-[#6BB371] rounded-full text-sm font-semibold">
                          {program.discount_percentage}% OFF
                        </span>
                      ) : null}
                      {quote?.subscriberDiscount > 0 && (
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                          Member price
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-white/80 mt-2">One-time payment</div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2">Free</div>
                    <div className="text-sm text-white/80">No payment required</div>
                    <div className="text-xs text-white/70 mt-2 italic">
                      Available with subscription
                    </div>
                  </div>
                )}

                {/* Access Info */}
                <div className="mb-6 p-3 bg-white/10 rounded-lg">
                  <div className="text-sm font-semibold mb-2">What you&apos;ll get:</div>
                  <ul className="text-xs space-y-1 text-white/90">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#6BB371] text-xs" />
                      <span>Full program access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#6BB371] text-xs" />
                      <span>Day-by-day schedule</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="text-[#6BB371] text-xs" />
                      <span>Exercise instructions</span>
                    </li>
                    {program.coach_recommendation && (
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-[#6BB371] text-xs" />
                        <span>Coach recommendations</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-4 px-6 bg-white text-[#354F52] font-bold rounded-lg hover:bg-[#C8CDC5] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-3"
                >
                  {enrolling
                    ? 'Processing...'
                    : !isLoggedIn
                      ? 'Login to Enroll'
                      : owned
                        ? 'You own this - go to my profile'
                        : program.price > 0
                          ? `Buy for ${(quote ? quote.amountPaid : finalPrice).toFixed(2)}`
                          : 'Enroll for free'}
                </button>

                {owned && (
                  <p className="text-xs text-white/90 text-center mb-2 flex items-center justify-center gap-1">
                    <FaCheckCircle className="text-[#6BB371]" /> Purchased
                  </p>
                )}

                {!owned && quote?.subscriberDiscount > 0 && (
                  <p className="text-xs text-white/80 text-center mb-2">
                    Includes your member discount of ${quote.subscriberDiscount.toFixed(2)}
                  </p>
                )}
                
                {!isLoggedIn && (
                  <p className="text-xs text-white/80 text-center mb-2">
                    Login required to enroll
                  </p>
                )}
                
                {program.price === 0 && isLoggedIn && !owned && (
                  <p className="text-xs text-white/80 text-center">
                    Free with your account
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* What is in the programme
            ----------------------------------------------------------------
            A lesson list, not a video grid: people scan a curriculum to judge
            whether it covers what they need, and a row of thumbnails makes
            that harder rather than easier.

            Videos open on YouTube in a new tab. The site's CSP has no
            frame-src, so an embedded iframe would be silently blocked --
            allowing one would mean widening the policy for a demo playlist. */}
        {program.lessons?.length > 0 && (
          <section className="border-t border-ink/10 bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow text-moss">The lessons</p>
                  <h2 className="mt-4 font-display text-display-sm font-bold text-forest">
                    What the programme covers
                  </h2>
                </div>
                <p className="text-sm text-ink-muted">
                  {program.lessons.length} lessons
                </p>
              </div>

              <ul className="mt-12 border-t border-ink/10">
                {program.lessons.map((lesson, index) => (
                  <li key={lesson.title} className="border-b border-ink/10">
                    <a
                      href={
                        lesson.youtubeId
                          ? `https://www.youtube.com/watch?v=${lesson.youtubeId}`
                          : "#"
                      }
                      target={lesson.youtubeId ? "_blank" : undefined}
                      rel={lesson.youtubeId ? "noopener noreferrer" : undefined}
                      className="group grid items-center gap-5 py-5 md:grid-cols-[auto_minmax(0,140px)_minmax(0,1fr)_auto] md:gap-8"
                    >
                      <span className="eyebrow text-ink-muted transition-colors duration-300 group-hover:text-moss-light">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="relative hidden aspect-video w-[140px] overflow-hidden rounded-lg bg-bone-dark md:block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            lesson.youtubeId
                              ? `https://img.youtube.com/vi/${lesson.youtubeId}/mqdefault.jpg`
                              : "/video-placeholder.svg"
                          }
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
                        />
                      </span>

                      <span className="font-display text-lg font-bold text-forest transition-transform duration-300 ease-editorial md:group-hover:translate-x-1">
                        {lesson.title}
                      </span>

                      <span className="text-sm tabular-nums text-ink-muted">
                        {lesson.duration}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* What people said. Pull quotes rather than avatar cards. */}
        {program.testimonials?.length > 0 && (
          <section className="bg-bone py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
              <p className="eyebrow text-moss">From people on the programme</p>

              <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
                {program.testimonials.map((item) => (
                  <blockquote key={item.name}>
                    <p className="font-display text-xl font-bold leading-snug text-forest md:text-2xl">
                      &ldquo;{item.text}&rdquo;
                    </p>
                    <footer className="mt-5 flex items-center gap-3 text-sm text-ink-muted">
                      <span className="font-semibold text-ink-soft">{item.name}</span>
                      <span className="h-px w-6 bg-ink/20" />
                      <span>finished in {item.weeks} weeks</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        )}
    </div>
  );
}

