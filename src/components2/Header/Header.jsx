import Image from "next/image";
import { Check, Lightbulb, Users, Award } from "lucide-react";

export default function AboutTrainSight() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-600">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        </div>
        <div className="relative h-full flex items-center px-8 md:px-16">
          <div className="max-w-xl">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
              ABOUT TRAINSIGHT
            </h1>
            <p className="text-white text-xl md:text-2xl mb-8">
              not just a gym, a Movement<br />Intelligence Platform,
            </p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded transition">
              See Our Journey
            </button>
          </div>
        </div>
      </section>

      {/* Core Mission & Founding Principles */}
      <section className="bg-slate-100 py-16 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Core Mission */}
          <div className="border-l-4 border-teal-600 pl-6">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">
              Our <span className="text-teal-600">Core Mission</span>
            </h2>
            <p className="text-slate-800 font-semibold mb-4">
              Born from a passion for injury-free fitness
            </p>
            <p className="text-slate-700 leading-relaxed">
              We combine advanced Computer Vision and biomechanics to help you move smarter, safer, and stronger, anytime, anywhere
            </p>
          </div>

          {/* Founding Principles */}
          <div>
            <h2 className="text-2xl font-bold text-slate-700 mb-6">
              Our <span className="text-[#52796F]">Founding Principles</span>
            </h2>
            <div className="bg-[#52796f62] rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-700" />
                <span className="text-slate-800 font-medium">Precision</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-700" />
                <span className="text-slate-800 font-medium">Accessibility</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-700" />
                <span className="text-slate-800 font-medium">Safety</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-700" />
                <span className="text-slate-800 font-medium">Data-Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Vision */}
      <section className="bg-gradient-to-r from-slate-700 to-teal-700 py-16 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image/Mockup */}
          <div className="relative">
            <div className="bg-slate-800/50 rounded-lg p-8 backdrop-blur">
              <div 
                className="w-full h-80 bg-slate-900/50 rounded-lg flex items-center justify-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="text-center text-white">
                  <div className="text-6xl font-bold mb-2">85/100</div>
                  <div className="text-sm">FORM SCORE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              AI-Powered Vision
            </h2>
            <p className="text-lg leading-relaxed">
              Our intelligent computer vision system watches your movements in real time, not to judge, but to guide. It detects posture mistakes, counts reps, and gives instant feedback to help you perfect your form like a personal coach would
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-100 py-12">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-300 -translate-y-1/2 -z-10" />
            
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow" />
              <span className="mt-2 text-slate-600 font-semibold">2022</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-teal-500 border-4 border-white shadow flex items-center justify-center" />
              <span className="mt-2 text-teal-700 font-bold">2024</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-teal-500 border-4 border-white shadow flex items-center justify-center" />
              <span className="mt-2 text-teal-700 font-bold">2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="bg-white py-16 px-8 md:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
          Our Commitment <span className="text-teal-600">to the Future of Fitness</span>
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Perpetual Innovation */}
          <div className="bg-slate-700 text-white rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Lightbulb className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-bold mb-4">Perpetual Innovation</h3>
            <p className="text-slate-300">
              Leading AI Evolution<br />
              Continuous system updates<br />
              for peak performance
            </p>
          </div>

          {/* Community & Growth */}
          <div className="bg-slate-300 text-slate-800 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Users className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-bold mb-4">Community & Growth</h3>
            <p className="text-slate-700">
              Global Fitness Network<br />
              Direct user feedback<br />
              drives product<br />
              development.
            </p>
          </div>

          {/* Expert Validation */}
          <div className="bg-slate-300 text-slate-800 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Award className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-bold mb-4">Expert Validation</h3>
            <p className="text-slate-700">
              Certified by Science<br />
              Algorithms verified by<br />
              Master Kinesiologists.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}