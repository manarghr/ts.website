"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Award, Briefcase, FileText } from "lucide-react";

export default function CoachAuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    experience: "",
    certification: "",
    bio: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle coach login
      const coaches = JSON.parse(localStorage.getItem("coaches") || "[]");
      const coach = coaches.find(
        (c) => c.email === formData.email && c.password === formData.password
      );
      if (coach) {
        localStorage.setItem("currentCoach", JSON.stringify(coach));
        alert("Welcome back, Coach " + coach.name + "!");
        onClose();
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } else {
      // Handle coach signup
      const newCoach = {
        id: Date.now(),
        ...formData,
        joinedDate: new Date().toISOString(),
        status: "pending" // Pending approval
      };
      const coaches = JSON.parse(localStorage.getItem("coaches") || "[]");
      coaches.push(newCoach);
      localStorage.setItem("coaches", JSON.stringify(coaches));
      localStorage.setItem("currentCoach", JSON.stringify(newCoach));
      alert("Application submitted! We'll review your profile and get back to you soon.");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Left Side - Branding */}
              <div className="relative bg-gradient-to-br from-[#354F52] to-[#52796F] p-12 text-white overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6BB371]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 h-full flex flex-col justify-center">
                  <div className="mb-8">
                    <Award className="w-16 h-16 text-[#6BB371] mb-4" />
                    <h2 className="text-4xl font-bold mb-4">
                      {isLogin ? "Welcome Back!" : "Join Our Team"}
                    </h2>
                    <p className="text-white/90 text-lg leading-relaxed">
                      {isLogin
                        ? "Log in to access your coach dashboard and continue inspiring your clients."
                        : "Share your expertise and help others achieve their fitness goals with TrainSight."}
                    </p>
                  </div>

                  {!isLogin && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#6BB371]/20 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-[#6BB371]" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Professional Growth</h4>
                          <p className="text-white/80 text-sm">Expand your reach and build your coaching career</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#6BB371]/20 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5 text-[#6BB371]" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Flexible Schedule</h4>
                          <p className="text-white/80 text-sm">Work on your own terms and set your availability</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#6BB371]/20 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#6BB371]" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">AI-Powered Tools</h4>
                          <p className="text-white/80 text-sm">Leverage cutting-edge technology to enhance training</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-12">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-[#354F52] mb-2">
                    {isLogin ? "Coach Login" : "Coach Application"}
                  </h3>
                  <p className="text-gray-600">
                    {isLogin
                      ? "Enter your credentials to access your dashboard"
                      : "Fill in your details to apply as a coach"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all"
                        placeholder="coach@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialization *
                        </label>
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all"
                        >
                          <option value="">Select your specialization</option>
                          <option value="strength">Strength Training</option>
                          <option value="cardio">Cardio & Endurance</option>
                          <option value="yoga">Yoga & Flexibility</option>
                          <option value="crossfit">CrossFit</option>
                          <option value="nutrition">Nutrition Coaching</option>
                          <option value="rehabilitation">Rehabilitation</option>
                          <option value="sports">Sports Performance</option>
                          <option value="general">General Fitness</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience *
                        </label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all"
                          placeholder="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certifications
                        </label>
                        <input
                          type="text"
                          name="certification"
                          value={formData.certification}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., NASM-CPT, ACE, ISSA"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all resize-none"
                          placeholder="Tell us about yourself and your coaching philosophy..."
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white font-semibold py-3 rounded-lg hover:shadow-xl hover:shadow-[#52796F]/30 transition-all duration-300 transform hover:scale-105"
                  >
                    {isLogin ? "Login to Dashboard" : "Submit Application"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#52796F] hover:text-[#354F52] font-medium transition-colors"
                  >
                    {isLogin
                      ? "Don't have an account? Apply Now"
                      : "Already a coach? Login Here"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

