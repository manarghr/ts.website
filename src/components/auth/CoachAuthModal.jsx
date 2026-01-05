"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Award, Briefcase, FileText, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoachAuthModal({ isOpen, onClose }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    experience: "",
    certification: "",
    bio: "",
    certificateFile: null
  });
  const [certificatePreview, setCertificatePreview] = useState(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, certificateFile: file });
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificatePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        if (isLogin) {
          const res = await fetch("/api/coach/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || "Login failed");
          // Ensure exclusivity: clear any user session
          localStorage.removeItem("trainsight_current_user");
          // Fetch coach details so navbar can show image/name immediately
          try {
            const me = await fetch("/api/coach/me", { cache: "no-store" });
            const meData = await me.json().catch(() => ({}));
            if (me.ok && meData?.coachId) {
              localStorage.setItem(
                "trainsight_current_coach",
                JSON.stringify({
                  coachId: meData.coachId,
                  name: meData.coach?.name || "",
                  image_url: meData.coach?.image_url || "",
                })
              );
            } else {
              localStorage.setItem("trainsight_current_coach", JSON.stringify({ coachId: data.coachId }));
            }
          } catch {
            localStorage.setItem("trainsight_current_coach", JSON.stringify({ coachId: data.coachId }));
          }
          alert("Welcome back, Coach!");
        } else {
          // Optional: upload certificate image (if provided and is an image)
          let certificateUrl = null;
          if (formData.certificateFile && String(formData.certificateFile.type || "").startsWith("image/")) {
            const fd = new FormData();
            fd.append("file", formData.certificateFile);
            const up = await fetch("/api/upload/image", { method: "POST", body: fd });
            const upData = await up.json().catch(() => ({}));
            if (up.ok && upData.imageUrl) certificateUrl = upData.imageUrl;
          }

          const res = await fetch("/api/coach/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              specialization: formData.specialization,
              experience: formData.experience,
              certification: formData.certification,
              bio: formData.bio,
              // store certificate as profile image if nothing else (simple MVP)
              image_url: certificateUrl || "",
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || "Registration failed");
          // Ensure exclusivity: clear any user session
          localStorage.removeItem("trainsight_current_user");
          // Fetch coach details so navbar can show image/name immediately
          try {
            const me = await fetch("/api/coach/me", { cache: "no-store" });
            const meData = await me.json().catch(() => ({}));
            if (me.ok && meData?.coachId) {
              localStorage.setItem(
                "trainsight_current_coach",
                JSON.stringify({
                  coachId: meData.coachId,
                  name: meData.coach?.name || "",
                  image_url: meData.coach?.image_url || "",
                })
              );
            } else {
              localStorage.setItem("trainsight_current_coach", JSON.stringify({ coachId: data.coachId }));
            }
          } catch {
            localStorage.setItem("trainsight_current_coach", JSON.stringify({ coachId: data.coachId }));
          }
          alert("Coach profile created!");
        }

        onClose();
        router.push("/coach/dashboard");
        router.refresh();
      } catch (err) {
        console.error(err);
        alert(err.message || "Something went wrong");
      }
    })();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md animate-in fade-in duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6BB371]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#52796F]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#354F52]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative bg-gradient-to-br from-white via-white to-slate-50/50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 scrollbar-hide border border-white/20 backdrop-blur-xl">
        {/* Sporty decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#6BB371]"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6BB371]/5 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#52796F]/5 to-transparent rounded-tr-full"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all duration-300 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 hover:rotate-90"
          aria-label="Close modal"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

            <div className="grid md:grid-cols-2">
              {/* Left Side - Branding */}
              <div className="relative bg-gradient-to-br from-[#354F52] to-[#52796F] p-12 text-white overflow-hidden hidden md:flex md:flex-col md:justify-center">
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
                          Upload Certificate *
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            id="certificate-upload"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="certificate-upload"
                            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#6BB371] transition-all cursor-pointer group"
                          >
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#6BB371] mx-auto mb-2 transition-colors" />
                              <p className="text-sm text-gray-600 group-hover:text-[#52796F] transition-colors">
                                {formData.certificateFile ? formData.certificateFile.name : "Click to upload certificate (PDF or Image)"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                            </div>
                          </label>
                        </div>
                        {certificatePreview && (
                          <div className="mt-3 relative">
                            <img
                              src={certificatePreview}
                              alt="Certificate preview"
                              className="w-full h-40 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, certificateFile: null });
                                setCertificatePreview(null);
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
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
      </div>
    </div>
  );
}

