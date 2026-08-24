"use client";

import { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/auth/AuthModal";
import CoachAuthModal from "@/components/auth/CoachAuthModal";
import { FaPlay, FaArrowRight, FaUserTie } from "react-icons/fa";

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
  // The modal backdrop uses backdrop-blur, which re-blurs whatever is behind it on
  // every painted frame. With the video playing that is 30-60 fresh frames a second
  // being blurred for no benefit -- the video is completely hidden behind the modal
  // anyway. Pausing it makes opening and closing the modal noticeably snappier.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isAnyModalOpen) {
      video.pause();
    } else {
      // play() rejects if the browser blocks autoplay; nothing to do about it here.
      video.play().catch(() => {});
    }
  }, [isAnyModalOpen]);

  return (
    <>
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Video with Overlay */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/videos.mp4" type="video/mp4" />
          </video>
          {/* Enhanced gradient overlay with animated pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#354F52]/90 via-[#354F52]/75 to-transparent"></div>
          <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
          {/* Animated floating elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-[#6BB371]/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#52796F]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#354F52]/20 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className={`max-w-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className={`mb-6 inline-flex items-center gap-2 px-4 py-2 bg-[#52796F]/30 backdrop-blur-sm border border-[#52796F]/50 rounded-full text-white text-sm font-medium animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>
                <FaPlay className="text-[#6BB371] animate-pulse-glow" size={12} />
                <span>AI-Powered Training Platform</span>
              </div>

              {/* Main Heading */}
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-fadeInUp`} style={{ animationDelay: '0.4s' }}>
                Transform Your
                <span className="block text-[#6BB371] animate-gradient bg-gradient-to-r from-[#6BB371] via-[#52796F] to-[#6BB371] bg-clip-text text-transparent">
                  Training Experience
                </span>
              </h1>

              {/* Subheading */}
              <p className={`text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-xl animate-fadeInUp`} style={{ animationDelay: '0.6s' }}>
                Real-time AI coaching that perfects your form, prevents injuries, and maximizes your performance.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 mb-12 animate-fadeInUp`} style={{ animationDelay: '0.8s' }}>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="group px-8 py-4 text-lg font-semibold text-white bg-[#354F52] rounded-lg shadow-xl transition-all duration-300 hover:bg-[#52796F] hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#52796F] to-[#6BB371] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={() => setIsCoachAuthModalOpen(true)}
                  className="group px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FaUserTie className="group-hover:scale-110 transition-transform" />
                  Join Us as Coach
                </button>
              </div>

              {/* Stats */}
             
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CoachAuthModal isOpen={isCoachAuthModalOpen} onClose={() => setIsCoachAuthModalOpen(false)} />
    </>
  );
}
