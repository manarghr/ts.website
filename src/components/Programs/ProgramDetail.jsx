"use client";

import { useAuth } from "@/components/auth/AuthProvider"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function ProgramDetail({ programId }) {
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

  const handleEnroll = async () => {
    if (!isLoggedIn || !currentUser) {
      const proceed = confirm('You need to be logged in to enroll in this program. Would you like to login now?');
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
      alert(`You now have access to "${program.name}".`);
    } catch (err) {
      console.error('Error enrolling:', err);
      alert(err.message || 'Error enrolling in program. Please try again.');
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#354F52] to-[#52796F] py-20 md:py-28 px-8 md:px-16 text-white">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Programs</span>
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              {goalIcons[program.goal] || <FaDumbbell className="text-4xl" />}
            </div>
            <div>
              <div className="text-sm text-white/80 mb-1">
                {goalLabels[program.goal] || program.goal}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                {program.name}
              </h1>
            </div>
          </div>
          
          <p className="text-xl text-white/90 max-w-3xl mb-8">
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
    </div>
  );
}

