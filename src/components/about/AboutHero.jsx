"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Lightbulb, Users, Award, Target, Zap, Shield, TrendingUp, Clock, Heart } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

export default function AboutHero() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    <div className="w-full overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-linear-to-r from-[#354F52] via-[#52796F] to-[#354F52] bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-[#354F52]/80" />
        </div>
        <div className="relative h-full flex items-center justify-center px-8 md:px-16">
          <div className={`text-center transition-all duration-1000 ${isVisible["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-wide uppercase">
              ABOUT <span className="text-[#6BB371]">TRAINSIGHT</span>
            </h1>
            <p className="text-white text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforming fitness through AI-powered movement intelligence
            </p>
            <div className="w-24 h-1 bg-[#6BB371] mx-auto animate-pulse" />
          </div>
        </div>
        <div 
          ref={(el) => (sectionRefs.current["hero"] = el)}
          className="absolute bottom-0 w-full h-20"
        />
      </section>

      {/* Mission Statement Section */}
      <section className="bg-linear-to-b from-white to-[#C8CDC5]/20 py-20 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div 
            ref={(el) => (sectionRefs.current["mission"] = el)}
            className={`transition-all duration-1000 ${isVisible["mission"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-6">
                Our <span className="text-[#52796F]">Mission</span>
              </h2>
              <div className="w-32 h-1 bg-[#52796F] mx-auto mb-8" />
            </div>
            <div className="bg-linear-to-br from-[#354F52] to-[#52796F] rounded-2xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
              <div className="relative z-10">
                <p className="text-xl md:text-2xl leading-relaxed font-light mb-6 text-center">
                  Born from a passion for <span className="font-bold">injury-free fitness</span>, TrainSight combines 
                  advanced Computer Vision and biomechanics to help you move smarter, safer, and stronger—anytime, anywhere.
                </p>
                <p className="text-lg md:text-xl leading-relaxed text-center text-white/90">
                  We believe everyone deserves access to expert-level form coaching, regardless of where they train.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-[#C8CDC5]/30 py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={(el) => (sectionRefs.current["values"] = el)}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-6">
              Our <span className="text-[#52796F]">Core Values</span>
            </h2>
            <div className="w-32 h-1 bg-[#52796F] mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Precision", desc: "Every movement analyzed with scientific accuracy" },
              { icon: Zap, title: "Innovation", desc: "Cutting-edge AI technology that evolves daily" },
              { icon: Shield, title: "Safety", desc: "Injury prevention at the core of every feature" },
              { icon: Heart, title: "Accessibility", desc: "Expert coaching accessible to everyone" }
            ].map((value, index) => (
              <div
                key={value.title}
                ref={(el) => {
                  if (!sectionRefs.current[`value-${index}`]) {
                    sectionRefs.current[`value-${index}`] = el;
                  }
                }}
                className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible[`value-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-[#52796F]/10 rounded-full p-4">
                    <value.icon className="w-8 h-8 text-[#52796F]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#354F52] mb-3 text-center">{value.title}</h3>
                <p className="text-slate-600 text-center leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-linear-to-r from-[#354F52] to-[#52796F] py-20 px-8 md:px-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mt-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mb-48" />
        </div>
        <div 
          ref={(el) => (sectionRefs.current["stats"] = el)}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible["stats"] ? "opacity-100" : "opacity-0"}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h2>
            <p className="text-xl text-white/90">Numbers that speak for themselves</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { number: stat1, suffix: "+", label: "Active Users", icon: Users },
              { number: stat2, suffix: "+", label: "Exercises Tracked", icon: Target },
              { number: stat3, suffix: "%", label: "Form Accuracy", icon: TrendingUp }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-1000 ${isVisible["stats"] ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-[#6BB371]" />
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-xl text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-white py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={(el) => (sectionRefs.current["tech"] = el)}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className={`transition-all duration-1000 ${isVisible["tech"] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-6">
                Powered by <span className="text-[#52796F]">Advanced AI</span>
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Our intelligent computer vision system watches your movements in real-time, not to judge, but to guide. 
                It detects posture mistakes, counts reps, and gives instant feedback to help you perfect your form like a personal coach would.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time movement analysis",
                  "Biomechanics-based feedback",
                  "Personalized form corrections",
                  "Injury risk assessment"
                ].map((feature, index) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-[#52796F] shrink-0" />
                    <span className="text-slate-700 text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`relative transition-all duration-1000 ${isVisible["tech"] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              <div className="bg-linear-to-br from-[#354F52] to-[#52796F] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div 
                  className="w-full h-80 bg-slate-900/50 rounded-lg flex items-center justify-center relative"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 text-center text-white">
                    <div className="text-6xl font-bold mb-2">95/100</div>
                    <div className="text-sm uppercase tracking-wide">Form Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-[#C8CDC5]/30 py-20 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div 
            ref={(el) => (sectionRefs.current["timeline"] = el)}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-6">
              Our <span className="text-[#52796F]">Journey</span>
            </h2>
            <div className="w-32 h-1 bg-[#52796F] mx-auto" />
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-300 transform md:-translate-x-1/2" />
            
            {/* Timeline Items */}
            {[
              { year: "2022", title: "Foundation", desc: "TrainSight was born from a vision to make expert coaching accessible to everyone." },
              { year: "2023", title: "First AI Model", desc: "Launched our first computer vision model for form analysis." },
              { year: "2024", title: "Public Launch", desc: "Released to the public with 10,000+ users in the first month." },
              { year: "2025", title: "Global Expansion", desc: "Expanding worldwide with new features and exercise tracking." }
            ].map((item, index) => (
              <div
                key={item.year}
                ref={(el) => {
                  if (!sectionRefs.current[`timeline-${index}`]) {
                    sectionRefs.current[`timeline-${index}`] = el;
                  }
                }}
                className={`relative mb-12 md:mb-16 transition-all duration-1000 ${
                  isVisible[`timeline-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} mb-4 md:mb-0 px-4`}>
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <div className="text-2xl font-bold text-[#52796F] mb-2">{item.year}</div>
                      <div className="text-xl font-semibold text-[#354F52] mb-2">{item.title}</div>
                      <div className="text-slate-600">{item.desc}</div>
                    </div>
                  </div>
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2">
                    <div className={`w-4 h-4 rounded-full bg-[#52796F] border-4 border-white shadow-lg ${isVisible[`timeline-${index}`] ? "scale-100" : "scale-0"} transition-transform duration-500`} />
                  </div>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="bg-white py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={(el) => (sectionRefs.current["commitment"] = el)}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-6">
              Our <span className="text-[#52796F]">Commitment</span>
            </h2>
            <div className="w-32 h-1 bg-[#52796F] mx-auto mb-4" />
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We are committed to the future of fitness, continuously evolving to serve you better
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lightbulb, title: "Perpetual Innovation", desc: "Leading AI evolution with continuous system updates for peak performance", bg: "bg-[#354F52]", text: "text-white" },
              { icon: Users, title: "Community & Growth", desc: "Global fitness network where direct user feedback drives product development", bg: "bg-[#C8CDC5]", text: "text-[#354F52]" },
              { icon: Award, title: "Expert Validation", desc: "Certified by science - algorithms verified by Master Kinesiologists", bg: "bg-[#52796F]", text: "text-white" }
            ].map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  if (!sectionRefs.current[`commitment-${index}`]) {
                    sectionRefs.current[`commitment-${index}`] = el;
                  }
                }}
                className={`${item.bg} ${item.text} rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible[`commitment-${index}`] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-center mb-6">
                  <item.icon className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">{item.title}</h3>
                <p className="text-center leading-relaxed opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-[#354F52] via-[#52796F] to-[#354F52] py-20 px-8 md:px-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mb-32" />
        </div>
        <div 
          ref={(el) => (sectionRefs.current["cta"] = el)}
          className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ${isVisible["cta"] ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Training?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of athletes and fitness enthusiasts who are already using TrainSight to perfect their form and prevent injuries.
          </p>
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-white text-[#354F52] font-bold py-4 px-10 rounded-lg text-lg hover:bg-[#C8CDC5] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started Today
          </button>
        </div>
      </section>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}