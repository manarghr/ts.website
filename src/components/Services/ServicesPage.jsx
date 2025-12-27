"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  FaUtensils, 
  FaAppleAlt, 
  FaLeaf, 
  FaBrain, 
  FaChartLine, 
  FaShieldAlt, 
  FaUserMd,
  FaDumbbell,
  FaRunning,
  FaHeartbeat,
  FaCheckCircle,
  FaVideo,
  FaTrophy,
  FaStopwatch,
  FaBolt,
  FaArrowRight
} from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import picture from "../assets/elements.png";

export default function ServicesPage() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch programs from API
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
        
        console.log('Programs API Response:', data); // Debug log
        
        if (data.success && data.programs) {
          console.log('Programs loaded:', data.programs.length); // Debug log
          setPrograms(data.programs);
        } else {
          console.warn('No programs in response:', data);
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
    // Set all programs as visible initially, then use intersection observer for animations
    if (programs.length > 0) {
      const programKeys = Object.keys(sectionRefs.current).filter(key => key.startsWith('program-'));
      const initialVisible = {};
      programKeys.forEach(key => {
        initialVisible[key] = true; // Start visible, then animate on scroll
      });
      setIsVisible(prev => ({ ...prev, ...initialVisible }));
    }

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
  }, [programs]); // Re-run when programs change

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Meal preparation cards data
  const mealCards = [
    {
      icon: <FaUtensils className="text-4xl" />,
      title: "Custom Meal Plans",
      description: "Personalized nutrition plans tailored to your fitness goals, dietary preferences, and lifestyle.",
      features: ["Macro tracking", "Shopping lists", "Recipe variations", "Dietitian approved"]
    },
    {
      icon: <FaAppleAlt className="text-4xl" />,
      title: "Meal Prep Guidance",
      description: "Step-by-step meal preparation guides to help you save time and stay consistent with your nutrition.",
      features: ["Weekly prep schedules", "Batch cooking tips", "Storage solutions", "Time-saving hacks"]
    },
    {
      icon: <FaLeaf className="text-4xl" />,
      title: "Nutrition Coaching",
      description: "Expert guidance on proper nutrition, supplements, and fueling strategies for optimal performance.",
      features: ["1-on-1 consultations", "Progress tracking", "Supplement advice", "Performance nutrition"]
    }
  ];

  // AI Sports features data
  const aiSportsFeatures = [
    {
      icon: <FaVideo className="text-4xl" />,
      title: "Real-Time Movement Analysis",
      description: "Advanced computer vision technology analyzes your exercise form in real-time, providing instant feedback on technique and posture.",
      color: "from-[#354F52] to-[#52796F]"
    },
    {
      icon: <FaTrophy className="text-4xl" />,
      title: "Performance Optimization",
      description: "AI algorithms identify your strengths and weaknesses, suggesting targeted improvements to maximize your athletic performance.",
      color: "from-[#52796F] to-[#6BB371]"
    },
    {
      icon: <FaStopwatch className="text-4xl" />,
      title: "Rep Counting & Timing",
      description: "Automatically tracks your repetitions, sets, and rest periods with precision, keeping you focused on your workout.",
      color: "from-[#6BB371] to-[#52796F]"
    },
    {
      icon: <FaBolt className="text-4xl" />,
      title: "Adaptive Training Plans",
      description: "Dynamic workout adjustments based on your progress, ensuring continuous improvement and preventing plateaus.",
      color: "from-[#354F52] to-[#6BB371]"
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Injury Risk Detection",
      description: "Proactive identification of movement patterns that could lead to injuries, helping you train safely and sustainably.",
      color: "from-[#52796F] to-[#354F52]"
    },
    {
      icon: <FaChartLine className="text-4xl" />,
      title: "Progress Analytics",
      description: "Comprehensive data visualization showing your training evolution, strength gains, and performance metrics over time.",
      color: "from-[#6BB371] to-[#354F52]"
    }
  ];

  // Group programs by goal
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
      // Normalize goal - handle different possible values
      let goal = program.goal;
      if (!goal) {
        goal = 'muscle_building'; // Default goal
      }
      // Normalize goal string (handle case variations)
      goal = goal.toLowerCase().replace(/\s+/g, '_');
      
      // Map variations to standard goals
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
        // If goal doesn't match, add to muscle_building as fallback
        grouped.muscle_building.push(program);
      }
    });

    return grouped;
  };

  const groupedPrograms = groupProgramsByGoal();

  const handleProgramClick = (programId) => {
    if (!programId) {
      console.error('Program ID is missing');
      alert('Program ID is missing. Please check the program data.');
      return;
    }
    console.log('Navigating to program:', programId); // Debug log
    router.push(`/programs/${programId}`);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-[#354F52]/80" />
        </div>
        <div className="relative h-full flex items-center justify-center px-8 md:px-16">
          <div 
            ref={(el) => (sectionRefs.current["hero"] = el)}
            className={`text-center transition-all duration-1000 ${isVisible["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-wide uppercase">
              OUR <span className="text-[#6BB371]">SERVICES</span>
            </h1>
            <p className="text-white text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive fitness solutions combining AI technology, nutrition guidance, and expert programs
            </p>
            <div className="w-24 h-1 bg-[#6BB371] mx-auto mb-8 animate-pulse" />
            
            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <button
                onClick={() => scrollToSection('programs-section')}
                className="px-6 py-3 md:px-8 md:py-4 bg-[#52796F] text-white font-semibold rounded-lg hover:bg-[#354F52] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaDumbbell className="text-lg" />
                <span>Our Programs</span>
              </button>
              <button
                onClick={() => scrollToSection('ai-section')}
                className="px-6 py-3 md:px-8 md:py-4 bg-[#6BB371] text-white font-semibold rounded-lg hover:bg-[#52796F] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaBrain className="text-lg" />
                <span>AI Sports</span>
              </button>
              <button
                onClick={() => scrollToSection('meals-section')}
                className="px-6 py-3 md:px-8 md:py-4 bg-white text-[#354F52] font-semibold rounded-lg hover:bg-[#C8CDC5] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaUtensils className="text-lg" />
                <span>Meal Preparation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs-section" className="bg-[#C8CDC5]/30 py-20 md:py-28 px-8 md:px-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#52796F]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div 
          ref={(el) => (sectionRefs.current["programs"] = el)}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible["programs"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#354F52]">Our</span>{" "}
              <span className="text-[#52796F]">Programs</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Structured training programs designed to help you achieve your fitness goals
            </p>
            <div className="w-32 h-1 bg-[#52796F] mx-auto mt-6" />
          </div>

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
            // Display programs grouped by goal
            (() => {
              const hasAnyPrograms = Object.values(groupedPrograms).some(progs => progs.length > 0);
              if (!hasAnyPrograms) {
                return (
                  <div className="text-center py-20">
                    <div className="text-gray-500 text-lg mb-4">Programs found but not properly categorized</div>
                    <div className="text-sm text-gray-400">Check console for details</div>
                  </div>
                );
              }
              
              return Object.entries(groupedPrograms).map(([goal, goalPrograms], goalIndex) => {
                if (goalPrograms.length === 0) return null;
              
              return (
                <div key={goal} className="mb-16">
                  {/* Goal Header */}
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

                  {/* Programs Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goalPrograms.map((program, index) => (
                      <div
                        key={program.id || index}
                        ref={(el) => {
                          if (!sectionRefs.current[`program-${goal}-${index}`]) {
                            sectionRefs.current[`program-${goal}-${index}`] = el;
                          }
                        }}
                        className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 cursor-pointer ${
                          isVisible[`program-${goal}-${index}`] !== false ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                        style={{ transitionDelay: `${(goalIndex * 100) + (index * 150)}ms` }}
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
                        
                        {/* Program Details */}
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

                        {/* Price */}
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

      {/* AI Sports Section */}
      <section id="ai-section" className="bg-gradient-to-b from-white via-[#C8CDC5]/20 to-white py-20 md:py-28 px-8 md:px-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#52796F]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#354F52]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6BB371]/5 rounded-full blur-2xl animate-pulse-glow"></div>
        
        <div 
          ref={(el) => (sectionRefs.current["ai"] = el)}
          className="relative z-10 max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible["ai"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="inline-block mb-4 px-4 py-2 bg-[#52796F]/10 backdrop-blur-sm border border-[#52796F]/30 rounded-full text-sm font-medium text-[#354F52]">
              Advanced Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-4">
              AI-Powered
              <span className="block text-[#52796F]">Sports Intelligence</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your training with cutting-edge AI that analyzes your movements, optimizes performance, and prevents injuries in real-time
            </p>
            <div className="w-32 h-1 bg-[#52796F] mx-auto mt-6" />
          </div>

          {/* Features Grid - Different Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {aiSportsFeatures.map((feature, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (!sectionRefs.current[`ai-feature-${index}`]) {
                    sectionRefs.current[`ai-feature-${index}`] = el;
                  }
                }}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 group ${
                  isVisible[`ai-feature-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`bg-gradient-to-br ${feature.color} rounded-xl p-4 w-16 h-16 flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#354F52] mb-3 group-hover:text-[#52796F] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className={`bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden transition-all duration-1000 ${
            isVisible["ai"] ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`} style={{ transitionDelay: '0.6s' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Experience the Future of Sports Training
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join athletes worldwide who are using AI to elevate their performance and train smarter
              </p>
              <button className="bg-white text-[#354F52] font-bold py-4 px-10 rounded-lg text-lg hover:bg-[#C8CDC5] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start AI Training Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Meal Preparation Cards Section */}
      <section id="meals-section" className="bg-white py-20 md:py-28 px-8 md:px-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-pattern-waves opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#52796F]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#354F52]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div 
          ref={(el) => (sectionRefs.current["meals"] = el)}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible["meals"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#354F52]">Meal</span>{" "}
              <span className="text-[#52796F]">Preparation</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fuel your body with expertly crafted nutrition plans and meal prep guidance
            </p>
            <div className="w-32 h-1 bg-[#52796F] mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mealCards.map((card, index) => (
              <div
                key={card.title}
                ref={(el) => {
                  if (!sectionRefs.current[`meal-${index}`]) {
                    sectionRefs.current[`meal-${index}`] = el;
                  }
                }}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#C8CDC5]/50 hover:border-[#52796F]/50 ${
                  isVisible[`meal-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-xl p-6 text-white">
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#354F52] mb-4 text-center">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">
                  {card.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {card.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <FaCheckCircle className="text-[#6BB371] flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 px-6 bg-[#354F52] text-white font-semibold rounded-lg hover:bg-[#52796F] transition-all duration-300 hover:scale-105 shadow-lg">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52] py-20 md:py-28 px-8 md:px-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mb-32"></div>
        </div>
        <div 
          ref={(el) => (sectionRefs.current["cta"] = el)}
          className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ${isVisible["cta"] ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of users who are already achieving their goals with our comprehensive services
          </p>
          <button className="bg-white text-[#354F52] font-bold py-4 px-10 rounded-lg text-lg hover:bg-[#C8CDC5] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}

