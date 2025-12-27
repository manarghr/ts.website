"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Lightbulb, Users, Award, Target, Zap, Shield, TrendingUp, Clock, Heart, Dumbbell, Activity, Star, Play } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AboutHero() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [clickedCard, setClickedCard] = useState(null);
  const router = useRouter();

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
  }, []);

  // Counter animation hook
  const useCountUp = (end, duration = 2000, isVisible) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!isVisible) return;
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [isVisible, end, duration]);
    return count;
  };

  const stat1 = useCountUp(10000, 2000, isVisible["stats"]);
  const stat2 = useCountUp(500, 2000, isVisible["stats"]);
  const stat3 = useCountUp(95, 2000, isVisible["stats"]);

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Hero Section with Parallax Effect */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46]" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#52796F]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Background Image - Horizontal Transparent */}
        <div 
          className="absolute inset-0 z-[1] opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: 'brightness(1.1) contrast(0.85)'
          }}
        />
        
        {/* ABOUT US Text - Above the image */}
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <div className="text-[120px] md:text-[200px] lg:text-[280px] font-black text-white opacity-[0.05] select-none" style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            letterSpacing: '15px',
            animation: 'heartbeat 4s ease-in-out infinite',
          }}>
            ABOUT US
          </div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-16">
          <div className={`text-center transition-all duration-1000 ${isVisible["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-wide uppercase">
              ABOUT <span className="text-[#6F8676]">TRAINSIGHT</span>
            </h1>
            <p className="text-white text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforming fitness through AI-powered movement intelligence
            </p>
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible["hero"] ? { width: 96 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-[#6BB371] mx-auto"
            />
          </div>
        </div>
        <div 
          ref={(el) => (sectionRefs.current["hero"] = el)}
          className="absolute bottom-0 w-full h-20"
        />
      </section>

      {/* Stats Section - Modern & Bold */}
      <section className="bg-white py-20 md:py-28 px-8 md:px-16 relative overflow-hidden">
        {/* Light Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
        <div className="absolute inset-0 opacity-35" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q-1 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 -1 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '1px 1px'
        }}></div>
        <div 
          ref={(el) => (sectionRefs.current["stats"] = el)}
          className="max-w-7xl mx-auto relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible["stats"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#354F52]">Our Impact</h2>
            <p className="text-xl text-slate-600 mb-6">Numbers that speak for themselves</p>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
              TrainSight has revolutionized how athletes and fitness enthusiasts approach their training. 
              Our platform empowers users worldwide to achieve better form, prevent injuries, and reach their fitness goals with confidence.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { number: stat1, suffix: "+", label: "Active Users", icon: Users, color: "from-[#6BB371] to-[#52796F]" },
              { number: stat2, suffix: "+", label: "Exercises Tracked", icon: Target, color: "from-[#52796F] to-[#6BB371]" },
              { number: stat3, suffix: "%", label: "Form Accuracy", icon: TrendingUp, color: "from-[#6BB371] to-[#52796F]" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible["stats"] ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center bg-white rounded-2xl p-8 border-2 border-[#52796F]/10 hover:border-[#52796F]/30 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex justify-center mb-6">
                  <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className={`text-6xl md:text-7xl font-extrabold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-xl text-slate-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="bg-white py-24 md:py-32 px-8 md:px-16 relative overflow-hidden">
        {/* Light Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6BB371]/5 via-transparent to-[#52796F]/5"></div>
        <div className="absolute inset-0 opacity-35" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%236BB371;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%236BB371;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q-1 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 -1 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '1px 1px'
        }}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            ref={(el) => (sectionRefs.current["mission"] = el)}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible["mission"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-[#354F52] mb-6">
              Our <span className="text-[#52796F]">Mission</span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#52796F] to-[#6BB371] mx-auto mb-8" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible["mission"] ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-3xl p-10 md:p-16 shadow-2xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-2xl md:text-3xl leading-relaxed font-light mb-8 text-center">
                Born from a passion for <span className="font-bold text-white">injury-free fitness</span>, TrainSight combines 
                advanced Computer Vision and biomechanics to help you move smarter, safer, and stronger—anytime, anywhere.
              </p>
              <div className="w-24 h-0.5 bg-white/30 mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl leading-relaxed text-center text-white/90">
                We believe everyone deserves access to expert-level form coaching, regardless of where they train.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-white py-24 md:py-32 px-8 md:px-16 relative overflow-hidden">
        {/* Light Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#52796F]/5 via-transparent to-[#6BB371]/5"></div>
        <div className="absolute inset-0 opacity-35" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%2352796F;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q-1 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 -1 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '1px 1px'
        }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            ref={(el) => (sectionRefs.current["values"] = el)}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible["values"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-[#354F52] mb-6">
              Our <span className="text-[#52796F]">Core Values</span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#52796F] to-[#6BB371] mx-auto" />
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Precision", desc: "Every movement analyzed with scientific accuracy", color: "from-[#52796F] to-[#6BB371]" },
              { icon: Zap, title: "Innovation", desc: "Cutting-edge AI technology that evolves daily", color: "from-[#6BB371] to-[#52796F]" },
              { icon: Shield, title: "Safety", desc: "Injury prevention at the core of every feature", color: "from-[#52796F] to-[#6BB371]" },
              { icon: Heart, title: "Accessibility", desc: "Expert coaching accessible to everyone", color: "from-[#6BB371] to-[#52796F]" }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                ref={(el) => {
                  if (!sectionRefs.current[`value-${index}`]) {
                    sectionRefs.current[`value-${index}`] = el;
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible[`value-${index}`] ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => {
                  setClickedCard(index);
                  setTimeout(() => setClickedCard(null), 1000);
                }}
                className={`bg-white rounded-2xl p-8 shadow-xl transition-all duration-500 transform hover:-translate-y-3 border border-[#52796F]/10 group cursor-pointer relative overflow-hidden hover:border-[#6F8676]/40 ${
                  clickedCard === index ? 'ring-4 ring-[#6F8676]/80' : ''
                }`}
                style={{
                  boxShadow: clickedCard === index 
                    ? '0 0 50px rgba(111, 134, 118, 0.8), 0 0 100px rgba(111, 134, 118, 0.6), 0 0 150px rgba(111, 134, 118, 0.4)' 
                    : undefined,
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (clickedCard !== index) {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(111, 134, 118, 0.5), 0 0 60px rgba(111, 134, 118, 0.3), 0 0 90px rgba(111, 134, 118, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (clickedCard !== index) {
                    e.currentTarget.style.boxShadow = '';
                  }
                }}
              >
                {clickedCard === index && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-br from-[#6F8676]/40 via-[#6F8676]/20 to-[#6F8676]/40 pointer-events-none rounded-2xl"
                      style={{
                        boxShadow: 'inset 0 0 80px rgba(111, 134, 118, 0.5)'
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.8, 0] }}
                      transition={{ duration: 1, repeat: 0 }}
                      className="absolute -inset-2 bg-gradient-to-r from-[#6F8676] via-[#6F8676] to-[#6F8676] rounded-2xl pointer-events-none"
                      style={{
                        filter: 'blur(12px)',
                        opacity: 0.7
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{ duration: 1, repeat: 0, delay: 0.2 }}
                      className="absolute -inset-3 bg-[#6F8676] rounded-2xl pointer-events-none"
                      style={{
                        filter: 'blur(20px)',
                        opacity: 0.4
                      }}
                    />
                  </>
                )}
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className={`bg-gradient-to-br ${value.color} rounded-2xl p-5 group-hover:scale-110 transition-transform duration-300 ${
                      clickedCard === index ? 'scale-110 shadow-lg shadow-[#6F8676]/70' : ''
                    }`}>
                      <value.icon className={`w-10 h-10 text-white transition-all duration-300 ${
                        clickedCard === index ? 'drop-shadow-[0_0_12px_rgba(111,134,118,0.9)]' : ''
                      }`} />
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 text-center transition-colors ${
                    clickedCard === index ? 'text-[#6F8676] drop-shadow-[0_0_8px_rgba(111,134,118,0.6)]' : 'text-[#354F52] group-hover:text-[#52796F]'
                  }`}>{value.title}</h3>
                  <p className="text-slate-600 text-center leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-white py-24 md:py-32 px-8 md:px-16 relative overflow-hidden">
        {/* Light Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6BB371]/5 via-transparent to-[#52796F]/5"></div>
        <div className="absolute inset-0 opacity-35" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%236BB371;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:%236BB371;stroke-width:0.3;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q-1 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 -1 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundPosition: '1px 1px'
        }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div 
            ref={(el) => (sectionRefs.current["tech"] = el)}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible["tech"] ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-6 px-4 py-2 bg-[#52796F]/10 rounded-full text-[#52796F] text-sm font-semibold">
                Technology
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-[#354F52] mb-6">
                Powered by <span className="text-[#52796F]">Advanced AI</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#52796F] to-[#6BB371] mb-8"></div>
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                Our intelligent computer vision system watches your movements in real-time, not to judge, but to guide. 
                It detects posture mistakes, counts reps, and gives instant feedback to help you perfect your form like a personal coach would.
              </p>
              <div className="space-y-5">
                {[
                  "Real-time movement analysis",
                  "Biomechanics-based feedback",
                  "Personalized form corrections",
                  "Injury risk assessment"
                ].map((feature, index) => (
                  <motion.div 
                    key={feature} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible["tech"] ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="bg-gradient-to-br from-[#52796F] to-[#6BB371] rounded-full p-2 group-hover:scale-110 transition-transform">
                      <Check className="w-5 h-5 text-white shrink-0" />
                    </div>
                    <span className="text-lg text-slate-700 font-medium group-hover:text-[#354F52] transition-colors">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible["tech"] ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div 
                  className="w-full h-96 bg-slate-900/50 rounded-xl flex items-center justify-center relative overflow-hidden border border-white/10"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  <div className="bg-black/70 backdrop-blur-md rounded-xl p-10 text-center text-white border border-white/20 shadow-2xl">
                    <div className="text-7xl font-bold mb-3 bg-gradient-to-r from-white to-[#6BB371] bg-clip-text text-transparent">95/100</div>
                    <div className="text-sm uppercase tracking-wider font-semibold">Form Score</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gradient-to-br from-[#354F52] via-[#52796F] to-[#354F52] py-24 md:py-32 px-8 md:px-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mb-48 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            ref={(el) => (sectionRefs.current["why"] = el)}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible["why"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6">Why Choose TrainSight?</h2>
            <div className="w-32 h-1.5 bg-white/30 mx-auto"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Dumbbell, title: "Expert Guidance", desc: "AI-powered coaching that rivals personal trainers", number: "24/7" },
              { icon: Activity, title: "Real-Time Feedback", desc: "Instant corrections to perfect your form", number: "< 1s" },
              { icon: Star, title: "Proven Results", desc: "95% accuracy in form detection and analysis", number: "95%" }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                ref={(el) => {
                  if (!sectionRefs.current[`why-${index}`]) {
                    sectionRefs.current[`why-${index}`] = el;
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible[`why-${index}`] ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-white/10 rounded-2xl p-5">
                    <item.icon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-3 text-[#6BB371]">{item.number}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-white py-24 md:py-32 px-8 md:px-16 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6BB371]/4 via-transparent to-[#52796F]/4"></div>
        {/* Floating Gym Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Dumbbell className="absolute top-[20%] left-[12%] w-12 h-12 text-[#52796F]/25 animate-float" style={{ animationDelay: '0s', animationDuration: '7s' }} />
          <Activity className="absolute top-[35%] right-[15%] w-11 h-11 text-[#6BB371]/25 animate-float" style={{ animationDelay: '1s', animationDuration: '8s' }} />
          <Target className="absolute top-[55%] left-[18%] w-11 h-11 text-[#52796F]/25 animate-float" style={{ animationDelay: '2s', animationDuration: '7.5s' }} />
          <Heart className="absolute top-[25%] right-[22%] w-10 h-10 text-[#6BB371]/25 animate-float" style={{ animationDelay: '0.5s', animationDuration: '8.5s' }} />
          <Dumbbell className="absolute top-[70%] right-[18%] w-12 h-12 text-[#52796F]/25 animate-float" style={{ animationDelay: '1.5s', animationDuration: '7.8s' }} />
          <Heart className="absolute top-[60%] left-[8%] w-10 h-10 text-[#6BB371]/25 animate-float" style={{ animationDelay: '2.5s', animationDuration: '8.2s' }} />
          <Activity className="absolute top-[80%] left-[25%] w-11 h-11 text-[#52796F]/25 animate-float" style={{ animationDelay: '1.2s', animationDuration: '9s' }} />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            ref={(el) => (sectionRefs.current["timeline"] = el)}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible["timeline"] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-[#354F52] mb-6">
              Our <span className="text-[#52796F]">Journey</span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#52796F] to-[#6BB371] mx-auto mb-6" />
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From a vision to reality, TrainSight has evolved through innovation, dedication, and a commitment to transforming fitness through cutting-edge technology.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#52796F] via-[#6BB371] to-[#52796F] transform md:-translate-x-1/2" />
            
            {/* Timeline Items */}
            {[
              { year: "2022", title: "Foundation", desc: "TrainSight was born from a vision to make expert coaching accessible to everyone.", icon: Lightbulb },
              { year: "2023", title: "First AI Model", desc: "Launched our first computer vision model for form analysis.", icon: Zap },
              { year: "2024", title: "Public Launch", desc: "Released to the public with 10,000+ users in the first month.", icon: Award },
              { year: "2025", title: "Global Expansion", desc: "Expanding worldwide with new features and exercise tracking.", icon: TrendingUp }
            ].map((item, index) => (
              <motion.div
                key={item.year}
                ref={(el) => {
                  if (!sectionRefs.current[`timeline-${index}`]) {
                    sectionRefs.current[`timeline-${index}`] = el;
                  }
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible[`timeline-${index}`] ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`relative mb-16 md:mb-20`}
              >
                <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} mb-6 md:mb-0 px-4`}>
                    <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#52796F]/20 hover:border-[#52796F]/40 transition-all hover:shadow-2xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-[#52796F] to-[#6BB371] rounded-xl p-3">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-[#354F52]">{item.year}</div>
                      </div>
                      <div className="text-2xl font-semibold text-[#52796F] mb-3">{item.title}</div>
                      <div className="text-slate-600 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-[#52796F] to-[#6BB371] border-4 border-white shadow-xl ${isVisible[`timeline-${index}`] ? "scale-100" : "scale-0"} transition-transform duration-500`} />
                  </div>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#354F52] via-[#52796F] to-[#354F52] py-24 md:py-32 px-8 md:px-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mb-48 blur-3xl"></div>
        </div>
        {/* Light Grid Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:white;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <motion.div 
          ref={(el) => (sectionRefs.current["cta"] = el)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible["cta"] ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Ready to Level Up Your <span className="text-[#6BB371]">Fitness?</span>
          </h2>
          <div className="w-24 h-1.5 bg-white/30 mx-auto mb-8"></div>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of athletes and fitness enthusiasts who are already using TrainSight to perfect their form and prevent injuries.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-10 py-5 bg-white text-[#354F52] font-bold rounded-xl text-lg hover:bg-[#6BB371] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Get Started Today
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Go to Home
            </button>
          </div>
        </motion.div>
      </section>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
