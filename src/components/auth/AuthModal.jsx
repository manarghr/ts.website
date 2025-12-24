"use client";

import { useState, useEffect, useRef } from "react"
import { X, Mail, Lock, User, Phone, Calendar, Dumbbell, Upload, Camera } from "lucide-react"

const initialFormData = {
  fullName: "",
  phone: "",
  email: "",
  password: "",
  gender: "",
  age: "",
  workoutExperience: "",
  sportsRating: "",
  selectedPlan: "",
  profilePicture: "", // Add this
  bio: "", // Add this for description
}

const initialLoginData = {
  email: "",
  password: "",
}

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("signup")
  const [formData, setFormData] = useState(initialFormData)
  const [loginData, setLoginData] = useState(initialLoginData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const prevIsOpenRef = useRef(isOpen)

  // State for image preview
  const [profilePreview, setProfilePreview] = useState("")

  // Effect 1: Manage body overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Effect 2: Reset form only when modal transitions from closed to open
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // Modal just opened (transitioned from false to true)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialFormData)
      setLoginData(initialLoginData)
      setErrors({})
      setActiveTab("signup")
      setShowSuccess(false)
      setShowForgotPassword(false)
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (activeTab === "signup") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    } else {
      setLoginData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Convert to base64 for storage (for demo - in production, upload to server)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setFormData((prev) => ({ ...prev, profilePicture: base64String }))
        setProfilePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateSignup = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (!formData.gender) newErrors.gender = "Please select your gender"
    if (!formData.age) newErrors.age = "Age is required"
    if (!formData.workoutExperience) newErrors.workoutExperience = "Please select your experience"
    if (!formData.sportsRating) newErrors.sportsRating = "Please rate your sports experience"
    if (!formData.selectedPlan) newErrors.selectedPlan = "Please select a plan"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateLogin = () => {
    const newErrors = {}

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!loginData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateSignup()) return

    setIsSubmitting(true)

    try {
      // Register user via API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ email: data.error || "An error occurred. Please try again." })
        setIsSubmitting(false)
        return
      }

      // Save user to localStorage for frontend state
      localStorage.setItem("trainsight_current_user", JSON.stringify(data.user))

      // Dispatch event to update navbar
      window.dispatchEvent(new Event("userUpdated"));

      setIsSubmitting(false)
      setShowSuccess(true)
      setSuccessMessage(
        `🎉 Welcome aboard, ${formData.fullName.split(" ")[0]}! Your fitness journey starts now. We're excited to help you achieve your goals!`,
      )

      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Error during signup:", error)
      setErrors({ email: "An error occurred. Please try again." })
      setIsSubmitting(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return

    setIsSubmitting(true)

    try {
      // Login via API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ email: data.error || "Invalid email or password" })
        setIsSubmitting(false)
        return
      }

      // Save user to localStorage for frontend state
      localStorage.setItem("trainsight_current_user", JSON.stringify(data.user))

      // Dispatch event to update navbar
      window.dispatchEvent(new Event("userUpdated"));

      setIsSubmitting(false)
      setShowSuccess(true)
      setSuccessMessage(`Welcome back, ${data.user.fullName}! Ready to crush your fitness goals today? Let's make it happen! 💪`)

      setTimeout(() => {
        onClose()
      }, 2500)
    } catch (error) {
      console.error("Error during login:", error)
      setErrors({ email: "An error occurred. Please try again." })
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    if (!resetEmail.trim()) {
      setErrors({ resetEmail: "Please enter your email" })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setSuccessMessage("Password reset link sent! Check your email to reset your password.")
      setTimeout(() => {
        setShowForgotPassword(false)
        setShowSuccess(false)
        setResetEmail("")
      }, 2500)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10 bg-white rounded-full p-1"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {!showSuccess && !showForgotPassword && (
          <>
            <div className="flex border-b bg-linear-to-r from-[#354F52] to-[#52796F] rounded-t-2xl overflow-hidden">
              {["signup", "login"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setErrors({})
                    setFormData(initialFormData)
                    setLoginData(initialLoginData)
                  }}
                  className={`flex-1 py-4 font-semibold transition-all duration-300 relative ${
                    activeTab === tab ? "text-white" : "text-white/60 hover:text-white/80"
                  }`}
                >
                  {tab === "signup" ? "Sign Up" : "Login"}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {activeTab === "signup" ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#354F52] text-center mb-6">Start Your Fitness Journey</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                            errors.fullName ? "border-red-500" : "border-slate-300"
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                            errors.phone ? "border-red-500" : "border-slate-300"
                          }`}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                            errors.email ? "border-red-500" : "border-slate-300"
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                            errors.password ? "border-red-500" : "border-slate-300"
                          }`}
                          placeholder="Minimum 6 characters"
                        />
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                          errors.gender ? "border-red-500" : "border-slate-300"
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                            errors.age ? "border-red-500" : "border-slate-300"
                          }`}
                          placeholder="Your age"
                          min="13"
                          max="120"
                        />
                      </div>
                      {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Workout Experience *</label>
                      <select
                        name="workoutExperience"
                        value={formData.workoutExperience}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                          errors.workoutExperience ? "border-red-500" : "border-slate-300"
                        }`}
                      >
                        <option value="">Select experience</option>
                        <option value="first-time">First Time - Just Getting Started</option>
                        <option value="beginner">Beginner - Less than 6 months</option>
                        <option value="intermediate">Intermediate - 6 months to 2 years</option>
                        <option value="advanced">Advanced - 2+ years</option>
                      </select>
                      {errors.workoutExperience && (
                        <p className="text-red-500 text-sm mt-1">{errors.workoutExperience}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sports Experience Rating *
                      </label>
                      <select
                        name="sportsRating"
                        value={formData.sportsRating}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                          errors.sportsRating ? "border-red-500" : "border-slate-300"
                        }`}
                      >
                        <option value="">Rate your experience</option>
                        <option value="1">1 - Complete Beginner</option>
                        <option value="2">2 - Some Experience</option>
                        <option value="3">3 - Moderate Experience</option>
                        <option value="4">4 - Good Experience</option>
                        <option value="5">5 - Expert Level</option>
                      </select>
                      {errors.sportsRating && <p className="text-red-500 text-sm mt-1">{errors.sportsRating}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-3">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {profilePreview ? (
                            <img
                              src={profilePreview}
                              alt="Profile preview"
                              className="w-20 h-20 rounded-full object-cover border-4 border-[#52796F]"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#354F52] to-[#52796F] flex items-center justify-center border-4 border-[#52796F]">
                              <User className="w-10 h-10 text-white" />
                            </div>
                          )}
                          <label
                            htmlFor="profile-picture"
                            className="absolute bottom-0 right-0 bg-[#52796F] text-white rounded-full p-2 cursor-pointer hover:bg-[#354F52] transition-colors"
                          >
                            <Camera className="w-4 h-4" />
                          </label>
                          <input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Upload a profile picture</p>
                          <p className="text-xs text-slate-500">JPG, PNG or GIF (max 5MB)</p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Bio (Optional)</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Choose Your Plan *</label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {[
                        { value: "free-trial", title: "Free Trial", subtitle: "7 days free", icon: "🎁" },
                        { value: "monthly", title: "Monthly Plan", subtitle: "$29/month", icon: "⭐" },
                        { value: "annual", title: "Annual Plan", subtitle: "$199/year", icon: "🏆" },
                      ].map((plan) => (
                        <button
                          key={plan.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, selectedPlan: plan.value }))
                            if (errors.selectedPlan) {
                              setErrors((prev) => {
                                const newErrors = { ...prev }
                                delete newErrors.selectedPlan
                                return newErrors
                              })
                            }
                          }}
                          className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                            formData.selectedPlan === plan.value
                              ? "border-[#52796F] bg-[#52796F]/5 shadow-md"
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                        >
                          <div className="text-3xl mb-2">{plan.icon}</div>
                          <div className="font-semibold text-slate-800">{plan.title}</div>
                          <div className="text-sm text-slate-600">{plan.subtitle}</div>
                        </button>
                      ))}
                    </div>
                    {errors.selectedPlan && <p className="text-red-500 text-sm mt-2">{errors.selectedPlan}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-linear-to-r from-[#354F52] to-[#52796F] text-white py-3.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Your Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Dumbbell className="w-5 h-5" />
                        Join Now!
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5 max-w-md mx-auto" autoComplete="off">
                  <h2 className="text-2xl font-bold text-[#354F52] text-center mb-6">Welcome Back!</h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email or Username *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                        autoComplete="username"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readOnly')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                          errors.email ? "border-red-500" : "border-slate-300"
                        }`}
                        placeholder="Enter your email or username"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readOnly')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                          errors.password ? "border-red-500" : "border-slate-300"
                        }`}
                        placeholder="Enter your password"
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-[#52796F] hover:text-[#354F52] font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-r from-[#354F52] to-[#52796F] text-white py-3.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              )}
            </div>
          </>
        )}

        {showForgotPassword && !showSuccess && (
          <div className="p-8">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="mb-4 text-[#52796F] hover:text-[#354F52] font-medium flex items-center gap-2 transition-colors"
            >
              ← Back to Login
            </button>
            <h2 className="text-2xl font-bold text-[#354F52] text-center mb-2">Reset Your Password</h2>
            <p className="text-slate-600 text-center mb-6">Enter your email and we will send you a reset link</p>
            <div onSubmit={handleForgotPassword} className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value)
                      setErrors({})
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none transition-all ${
                      errors.resetEmail ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.resetEmail && <p className="text-red-500 text-sm mt-1">{errors.resetEmail}</p>}
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSubmitting}
                className="w-full bg-linear-to-r from-[#354F52] to-[#52796F] text-white py-3.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-linear-to-r from-[#354F52] to-[#52796F] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#354F52] mb-3">Success!</h3>
            <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}