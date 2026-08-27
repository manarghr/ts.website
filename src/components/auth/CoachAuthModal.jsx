"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Mail, Lock, User, Phone, Award, Briefcase, FileText, Upload, Camera } from "lucide-react";
import Image from "next/image";

export default function CoachAuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    experience: "",
    certification: "",
    bio: "",
    certificateFile: null,
    profilePicture: null
  });
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const isProfilePictureLoading = !isLogin && formData.profilePicture && !profilePicturePreview;

  const toCategory = (specialization) => {
    const v = String(specialization || "").toLowerCase();
    if (v === "yoga") return "Yoga";
    if (v === "cardio") return "Cardio";
    if (v === "nutrition") return "Nutrition";
    if (v === "crossfit") return "CrossFit";
    if (v === "rehabilitation") return "Rehabilitation";
    if (v === "sports") return "Sports Performance";
    return "Strength";
  };

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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setFormData({ ...formData, profilePicture: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePicture = async () => {
    if (!formData.profilePicture) return "";
    const fd = new FormData();
    fd.append("file", formData.profilePicture);
    const res = await fetch("/api/upload/image", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) throw new Error(data.error || "Failed to upload profile picture");
    return data.imageUrl || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isProfilePictureLoading) return;
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const res = await fetch("/api/coach/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Login failed");
      } else {
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
            category: toCategory(formData.specialization),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Signup failed");

        // /api/upload/image needs a session, which only exists once register
        // succeeds. A failure here leaves the account intact, just without a picture.
        if (formData.profilePicture) {
          try {
            const imageUrl = await uploadProfilePicture();
            await fetch("/api/coach/profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ image_url: imageUrl }),
            });
          } catch (uploadError) {
            console.error("Profile picture upload failed:", uploadError);
          }
        }
      }
      alert(isLogin ? "Welcome back, Coach!" : "Coach account created!");

      // Coaches and users cannot be logged in at the same time
      try {
        localStorage.removeItem("trainsight_current_user");
        window.dispatchEvent(new Event("userLoggedOut"));
      } catch {
        // ignore
      }
      window.dispatchEvent(new Event("coachSessionUpdated"));

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        experience: "",
        certification: "",
        bio: "",
        certificateFile: null,
        profilePicture: null,
      });
      setCertificatePreview(null);
      setProfilePicturePreview(null);
      onClose();
    } catch (err) {
      alert(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendered into <body> via a portal at the bottom of this file.
  // Inside the page tree it sat within `<div className="relative z-10">` in page.js,
  // which creates a stacking context -- so z-50 only competed with its siblings and
  // the sections further down the page painted straight over the modal.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isOpen || !isMounted) return null;

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-4 py-6 sm:py-8 bg-black/80 animate-in fade-in duration-300 overflow-y-auto">
      {/* Decorative blurred blobs removed: they were animate-pulse + blur-3xl,
          repainting a large blur every frame behind an opaque overlay. */}
      
      <div className="relative my-auto bg-gradient-to-br from-white via-white to-slate-50/50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 flex-shrink-0">
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

            <div className="grid md:grid-cols-2 flex-1 min-h-0">
              {/* Left Side - Branding */}
              <div className="relative bg-gradient-to-br from-[#354F52] to-[#52796F] p-10 text-white overflow-hidden hidden md:flex md:flex-col md:justify-center rounded-l-3xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64" style={{ background: "radial-gradient(circle, rgba(107,179,113,0.2) 0%, transparent 70%)" }}></div>
                <div className="absolute bottom-0 left-0 w-48 h-48" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }}></div>

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
              <div className="flex flex-col min-h-0">
                {/* Same tab switcher as the user modal, so both flows behave alike.
                    Replaces the small "Already a coach? Login Here" link that used to
                    sit at the very bottom of a long form. */}
                <div className="flex shrink-0 border-b bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52] rounded-t-3xl md:rounded-tl-none overflow-hidden relative">
                  {[
                    { key: "apply", label: "Apply", Icon: Award },
                    { key: "login", label: "Login", Icon: Lock },
                  ].map(({ key, label, Icon }) => {
                    const active = (key === "login") === isLogin;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setIsLogin(key === "login")}
                        className={`flex-1 py-4 font-bold text-lg transition-all duration-300 relative ${
                          active ? "text-white" : "text-white/60 hover:text-white/90"
                        }`}
                      >
                        <Icon className="w-4 h-4 inline mr-2" />
                        {label}
                        {active && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-10 overflow-y-auto min-h-0 flex-1">
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Profile Picture
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-50 flex items-center justify-center flex-shrink-0">
                            {profilePicturePreview ? (
                              <Image
                                src={profilePicturePreview}
                                alt="Profile preview"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Camera className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 w-full">
                            <input
                              type="file"
                              id="profile-picture-upload"
                              accept="image/*"
                              onChange={handleProfilePictureChange}
                              className="hidden"
                            />
                            <div className="flex flex-col gap-2">
                              <label
                                htmlFor="profile-picture-upload"
                                className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white rounded-lg hover:shadow-lg transition-all cursor-pointer text-sm font-medium"
                              >
                                {profilePicturePreview ? "Change Picture" : "Upload Picture"}
                              </label>
                              {profilePicturePreview && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, profilePicture: null });
                                    setProfilePicturePreview(null);
                                  }}
                                  className="inline-flex items-center justify-center px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                >
                                  Remove Picture
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              This picture will appear in your profile and navbar. Max size: 5MB
                            </p>
                          </div>
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
                            required
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
                          <div className="mt-3 relative h-40">
                            <Image
                              src={certificatePreview}
                              alt="Certificate preview"
                              fill
                              className="object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, certificateFile: null });
                                setCertificatePreview(null);
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
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
                    disabled={isProfilePictureLoading}
                    className={`w-full bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white font-semibold py-3 rounded-lg hover:shadow-xl hover:shadow-[#52796F]/30 transition-all duration-300 transform hover:scale-105 ${
                      isProfilePictureLoading ? "opacity-60 cursor-not-allowed hover:scale-100" : ""
                    }`}
                  >
                    {isProfilePictureLoading ? "Processing Picture..." : (isLogin ? "Login to Dashboard" : "Submit Application")}
                  </button>
                </form>

                </div>
              </div>
            </div>
      </div>
    </div>
  );

  // Mount on <body> so no ancestor stacking context or overflow can hide it.
  return createPortal(modal, document.body);
}
