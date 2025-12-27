"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-[#354F52]/80" />
        </div>
        <div className="relative h-full flex items-center justify-center px-8 md:px-16">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
              Our <span className="text-[#6BB371]">Programs</span>
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
              Structured training programs designed to help you achieve your fitness goals
            </p>
            <div className="w-24 h-1 bg-[#6BB371] mx-auto mt-6" />
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-[#C8CDC5]/30 py-20 md:py-28 px-8 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#52796F]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-[#354F52] text-lg">Loading programs...</div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-600 text-lg">Error loading programs: {error}</div>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-500 text-lg mb-4">No programs available at the moment</div>
              <div className="text-sm text-gray-400">Create programs in the Admin Dashboard to see them here</div>
            </div>
          ) : (
            (() => {
              const hasAnyPrograms = Object.values(groupedPrograms).some(progs => progs.length > 0);
              if (!hasAnyPrograms) {
                return (
                  <div className="text-center py-20">
                    <div className="text-gray-500 text-lg mb-4">Programs found but not properly categorized</div>
                  </div>
                );
              }
              
              return Object.entries(groupedPrograms).map(([goal, goalPrograms], goalIndex) => {
                if (goalPrograms.length === 0) return null;
              
              return (
                <div key={goal} className="mb-16">
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-lg p-3 text-white">
                        {goalIcons[goal] || <FaDumbbell className="text-4xl" />}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#354F52]">
                        {goalLabels[goal] || goal}
                      </h3>
                    </div>
                    <div className="w-24 h-1 bg-[#52796F]" />
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goalPrograms.map((program, index) => (
                      <div
                        key={program.id || index}
                        ref={(el) => {
                          if (!sectionRefs.current[`program-${goal}-${index}`]) {
                            sectionRefs.current[`program-${goal}-${index}`] = el;
                          }
                        }}
                        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 cursor-pointer"
                        onClick={() => handleProgramClick(program.id)}
                      >
                        <div className="flex justify-center mb-6">
                          <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-xl p-6 text-white">
                            {goalIcons[goal] || <FaDumbbell className="text-4xl" />}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-[#354F52] mb-3 text-center">
                          {program.name || program.title}
                        </h3>
                        <p className="text-gray-600 mb-6 text-center leading-relaxed">
                          {program.description}
                        </p>
                        
                        <div className="flex justify-center gap-4 mb-6 flex-wrap">
                          {program.duration && (
                            <span className="px-3 py-1 bg-[#52796F]/10 text-[#52796F] rounded-full text-sm font-semibold">
                              {program.duration}
                            </span>
                          )}
                          {program.level && (
                            <span className="px-3 py-1 bg-[#354F52]/10 text-[#354F52] rounded-full text-sm font-semibold">
                              {program.level}
                            </span>
                          )}
                        </div>

                        {program.price > 0 && (
                          <div className="text-center mb-4">
                            <span className="text-2xl font-bold text-[#354F52]">
                              ${program.discount && program.discount_percentage ? 
                                (program.price * (1 - program.discount_percentage / 100)).toFixed(2) : 
                                program.price.toFixed(2)}
                            </span>
                            {program.discount && program.discount_percentage && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${program.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProgramClick(program.id);
                          }}
                          className="w-full py-3 px-6 bg-[#354F52] text-white font-semibold rounded-lg hover:bg-[#52796F] transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                          View Details
                          <FaArrowRight />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
              });
            })()
          )}
        </div>
      </section>
    </div>
  );
}

