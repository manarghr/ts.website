"use client";

import { useState, useEffect, useRef } from "react"
import { X, Mail, Lock, User, Phone, Calendar, Dumbbell, Upload, Camera, AlertCircle, Users, Star, Gift, Trophy, Zap, Edit, CreditCard, Globe, Hash, CheckCircle2 } from "lucide-react"

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
  paymentMethod: "", // Baridimod or Visa
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCVV: "",
  baridimodNumber: "",
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

    // Payment validation for paid plans
    if (formData.selectedPlan === "monthly" || formData.selectedPlan === "annual") {
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = "Please select a payment method"
      } else {
        if (formData.paymentMethod === "baridimod") {
          if (!formData.baridimodNumber.trim()) {
            newErrors.baridimodNumber = "Baridimod number is required"
          }
        } else if (formData.paymentMethod === "visa") {
          if (!formData.cardName.trim()) newErrors.cardName = "Cardholder name is required"
          if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = "Card number is required"
          } else if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
            newErrors.cardNumber = "Card number must be 13-19 digits"
          }
          if (!formData.cardExpiry.trim()) {
            newErrors.cardExpiry = "Expiry date is required"
          } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
            newErrors.cardExpiry = "Format: MM/YY"
          }
          if (!formData.cardCVV.trim()) {
            newErrors.cardCVV = "CVV is required"
          } else if (!/^\d{3,4}$/.test(formData.cardCVV)) {
            newErrors.cardCVV = "CVV must be 3-4 digits"
          }
        }
      }
    }

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
    setErrors({}) // Clear previous errors

    try {
      // Register user via API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("Failed to parse response:", parseError)
        setErrors({ email: "Server error. Please try again later." })
        setIsSubmitting(false)
        return
      }

      if (!response.ok) {
        const errorMsg = data?.error || data?.details || "An error occurred. Please try again."
        
        // If database error, try localStorage fallback
        if (errorMsg.includes('Database') || data?.useLocalStorage) {
          return handleSignupLocalStorage()
        }
        
        setErrors({ email: errorMsg })
        setIsSubmitting(false)
        return
      }

      // Clear any errors on success
      setErrors({})

      // Save user to localStorage for frontend state
      // If logging in/signing up as a user, clear any coach session so the navbar switches correctly
      localStorage.removeItem("currentCoach")
      window.dispatchEvent(new Event("coachLoggedOut"))

      localStorage.setItem("trainsight_current_user", JSON.stringify(data.user))

      // Dispatch event to update navbar
      window.dispatchEvent(new Event("userUpdated"));

      setIsSubmitting(false)
      setShowSuccess(true)
      setSuccessMessage(
        `Welcome aboard, ${formData.fullName.split(" ")[0]}! Your fitness journey starts now. We're excited to help you achieve your goals!`,
      )

      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Error during signup:", error)
      // Try localStorage fallback on network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        return handleSignupLocalStorage()
      }
      setErrors({ email: error.message || "Network error. Please check your connection and try again." })
      setIsSubmitting(false)
    }
  }

  // LocalStorage fallback for registration
  const handleSignupLocalStorage = () => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem("trainsight_users") || "[]")
      
      // Check if user already exists
      const existingUser = existingUsers.find(
        (u) => u.email === formData.email || u.phone === formData.phone
      )
      
      if (existingUser) {
        setErrors({ email: "User with this email or phone already exists" })
        setIsSubmitting(false)
        return
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // Store plain password for demo (not secure!)
        gender: formData.gender || '',
        age: formData.age || null,
        workoutExperience: formData.workoutExperience || '',
        sportsRating: formData.sportsRating || '',
        selectedPlan: formData.selectedPlan || '',
        profilePicture: formData.profilePicture || '',
        bio: formData.bio || '',
        followers: [],
        followings: [],
        favoriteCoaches: [],
        likedVideos: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Save to localStorage
      const updatedUsers = [...existingUsers, newUser]
      localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers))
      // If logging in/signing up as a user, clear any coach session so the navbar switches correctly
      localStorage.removeItem("currentCoach")
      window.dispatchEvent(new Event("coachLoggedOut"))

      localStorage.setItem("trainsight_current_user", JSON.stringify(newUser))

      // Dispatch event to update navbar
      window.dispatchEvent(new Event("userUpdated"))

      setIsSubmitting(false)
      setShowSuccess(true)
      setSuccessMessage(
        `Welcome aboard, ${formData.fullName.split(" ")[0]}! Your fitness journey starts now. We're excited to help you achieve your goals!`,
      )

      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Error during localStorage signup:", error)
      setErrors({ email: "An error occurred. Please try again." })
      setIsSubmitting(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return

    setIsSubmitting(true)
    setErrors({}) // Clear previous errors

    try {
      // Login via API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("Failed to parse response:", parseError)
        setErrors({ email: "Server error. Please try again later." })
        setIsSubmitting(false)
        return
      }

      if (!response.ok) {
        const errorMsg = data?.error || data?.details || "Invalid email or password"
        
        // If database error, try localStorage fallback
        if (data?.error?.includes('Database') || data?.useLocalStorage) {
          // Use localStorage for login
          return handleLoginLocalStorage()
        }
        
        setErrors({ email: errorMsg })
        setIsSubmitting(false)
        return
      }

      // Clear any errors on success
      setErrors({})

      // Save user to localStorage for frontend state
      // If logging in/signing up as a user, clear any coach session so the navbar switches correctly
      localStorage.removeItem("currentCoach")
      window.dispatchEvent(new Event("coachLoggedOut"))

      localStorage.setItem("trainsight_current_user", JSON.stringify(data.user))

      // Dispatch event to update navbar
      window.dispatchEvent(new Event("userUpdated"));

      setIsSubmitting(false)
      setShowSuccess(true)
      setSuccessMessage(`Welcome back, ${data.user.fullName}! Ready to crush your fitness goals today? Let's make it happen!`)

      setTimeout(() => {
        onClose()
      }, 2500)
    } catch (error) {
      console.error("Error during login:", error)
      // Try localStorage fallback on network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        return handleLoginLocalStorage()
      }
      setErrors({ email: error.message || "Network error. Please check your connection and try again." })
      setIsSubmitting(false)
    }
  }

  // LocalStorage fallback for login
  const handleLoginLocalStorage = () => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]")
      
      // Find user by email
      const user = users.find((u) => u.email === loginData.email)
      
      if (!user) {
        setErrors({ email: "Invalid email or password" })
        setIsSubmitting(false)
        return
      }

      // Check password (plain text comparison for demo - not secure!)
      if (user.password !== loginData.password) {
        setErrors({ email: "Invalid email or password" })
        setIsSubmitting(false)
        return
      }

      // Update last login
      user.lastLogin = new Date().toISOString()
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
      localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers))

      // Save current user (without password)
      const { password, ...userWithoutPassword } = user
      // If logging in/signing up as a user, clear any coach session so the navbar switches correctly
      localStorage.removeItem("currentCoach")
      window.dispatchEvent(new Event("coachLoggedOut"))

      localStorage.setItem("trainsight_current_user", JSON.stringify(userWithoutPassword))

      // Dispatch event to update navbar
      window.dispatchEvent(new Event("userUpdated"))

      setIsSubmitting(false)
      setShowSuccess(true)
      setSuccessMessage(`Welcome back, ${user.fullName}! Ready to crush your fitness goals today? Let's make it happen!`)

      setTimeout(() => {
        onClose()
      }, 2500)
    } catch (error) {
      console.error("Error during localStorage login:", error)
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 py-6 sm:py-8 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative my-auto bg-gradient-to-br from-white via-white to-slate-50/50 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300 border border-white/20 backdrop-blur-xl flex-shrink-0">
        {/* Sporty decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-tr-full"></div>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all duration-300 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110 hover:rotate-90"
          aria-label="Close modal"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {!showSuccess && !showForgotPassword && (
          <>
            <div className="flex shrink-0 border-b bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52] rounded-t-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gradient"></div>
              {["signup", "login"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setErrors({})
                    setFormData(initialFormData)
                    setLoginData(initialLoginData)
                  }}
                  className={`flex-1 py-4 font-bold text-lg transition-all duration-300 relative z-10 ${
                    activeTab === tab 
                      ? "text-white transform scale-105" 
                      : "text-white/60 hover:text-white/90 hover:scale-102"
                  }`}
                >
                  {tab === "signup" ? (
                    <>
                      <Dumbbell className="w-4 h-4 inline mr-2" />
                      Sign Up
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 inline mr-2" />
                      Login
                    </>
                  )}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full animate-fadeInUp shadow-lg shadow-white/50"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8 relative overflow-y-auto min-h-0 flex-1" style={{ maxHeight: 'calc(85vh - 56px)' }}>
              {activeTab === "signup" ? (
                <form onSubmit={handleSignup} className="space-y-5" autoComplete="off">
                  <div className="text-center mb-8 animate-fadeInUp">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52] bg-clip-text text-transparent mb-2">
                      Start Your Fitness Journey
                    </h2>
                    <p className="text-slate-600 text-sm flex items-center justify-center gap-2">
                      <Dumbbell className="w-4 h-4 text-[#52796F]" />
                      Transform your body, transform your life
                    </p>
                    <div className="flex justify-center gap-2 mt-3">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                      <div className="w-8 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                      <div className="w-4 h-1 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full"></div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 animate-fadeInUp">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-[#52796F]" />
                        Full Name *
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#52796F] transition-colors duration-300" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md ${
                            errors.fullName 
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-sm mt-1 animate-fadeInUp flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </p>}
                    </div>

                    <div className="animate-fadeInUp" style={{ animationDelay: '50ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#52796F]" />
                        Phone Number *
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#52796F] transition-colors duration-300" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md ${
                            errors.phone 
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1 animate-fadeInUp flex items-center gap-1">
                        <span>⚠️</span> {errors.phone}
                      </p>}
                    </div>

                    <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#52796F]" />
                        Email *
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#52796F] transition-colors duration-300" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          autoComplete="off"
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md ${
                            errors.email 
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 animate-fadeInUp flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#52796F]" />
                        Password *
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#52796F] transition-colors duration-300" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          autoComplete="new-password"
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md ${
                            errors.password 
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                          placeholder="Enter your password"
                        />
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1 animate-fadeInUp flex items-center gap-1">
                        <span>⚠️</span> {errors.password}
                      </p>}
                    </div>

                    <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#52796F]" />
                        Gender *
                      </label>
                      <div className="relative group">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none cursor-pointer ${
                            errors.gender 
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1 animate-fadeInUp flex items-center gap-1">
                          <span>⚠️</span> {errors.gender}
                        </p>
                      )}
                    </div>

                    <div className="animate-fadeInUp" style={{ animationDelay: '250ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#52796F]" />
                        Age *
                      </label>
                      <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#52796F] transition-colors duration-300" />
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md ${
                            errors.age 
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                          placeholder="Your age"
                          min="13"
                          max="120"
                        />
                      </div>
                      {errors.age && (
                        <p className="text-red-500 text-sm mt-1 animate-fadeInUp flex items-center gap-1">
                          <span>⚠️</span> {errors.age}
                        </p>
                      )}
                    </div>

                    <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-[#52796F]" />
                        Workout Experience *
                      </label>
                      <div className="relative group">
                        <select
                          name="workoutExperience"
                          value={formData.workoutExperience}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none cursor-pointer ${
                            errors.workoutExperience 
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                        >
                          <option value="">Select experience</option>
                          <option value="first-time">First Time - Just Getting Started</option>
                          <option value="beginner">Beginner - Less than 6 months</option>
                          <option value="intermediate">Intermediate - 6 months to 2 years</option>
                          <option value="advanced">Advanced - 2+ years</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.workoutExperience && (
                        <p className="text-red-500 text-sm mt-1 animate-fadeInUp flex items-center gap-1">
                          <span>⚠️</span> {errors.workoutExperience}
                        </p>
                      )}
                    </div>

                    <div className="animate-fadeInUp" style={{ animationDelay: '350ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#52796F]" />
                        Sports Experience Rating *
                      </label>
                      <div className="relative group">
                        <select
                          name="sportsRating"
                          value={formData.sportsRating}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none cursor-pointer ${
                            errors.sportsRating 
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                              : "border-slate-200 hover:border-[#52796F]/50"
                          }`}
                        >
                          <option value="">Rate your experience</option>
                          <option value="1">1 - Complete Beginner</option>
                          <option value="2">2 - Some Experience</option>
                          <option value="3">3 - Moderate Experience</option>
                          <option value="4">4 - Good Experience</option>
                          <option value="5">5 - Expert Level</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {errors.sportsRating && (
                        <p className="text-red-500 text-sm mt-1 animate-fadeInUp flex items-center gap-1">
                          <span>⚠️</span> {errors.sportsRating}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#52796F]" />
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          {profilePreview ? (
                            <div className="relative">
                              <img
                                src={profilePreview}
                                alt="Profile preview"
                                className="w-24 h-24 rounded-full object-cover border-4 border-[#52796F] shadow-lg transform transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#354F52] via-[#52796F] to-[#354F52] flex items-center justify-center border-4 border-[#52796F] shadow-lg transform transition-transform duration-300 group-hover:scale-110 animate-pulse-glow">
                              <User className="w-12 h-12 text-white" />
                            </div>
                          )}
                          <label
                            htmlFor="profile-picture"
                            className="absolute bottom-0 right-0 bg-gradient-to-br from-[#52796F] to-[#354F52] text-white rounded-full p-2.5 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
                          >
                            <Camera className="w-5 h-5" />
                          </label>
                          <input
                            id="profile-picture"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700 mb-1">Upload a profile picture</p>
                          <p className="text-xs text-slate-500">JPG, PNG or GIF (max 5MB)</p>
                          <div className="mt-2 flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 animate-fadeInUp" style={{ animationDelay: '450ms' }}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Edit className="w-4 h-4 text-[#52796F]" />
                        Bio (Optional)
                      </label>
                      <div className="relative group">
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md border-slate-200 hover:border-[#52796F]/50"
                          placeholder="Tell us about yourself..."
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                          {formData.bio.length}/500
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                    <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-[#52796F] animate-pulse" />
                      Choose Your Plan *
                    </label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { 
                          value: "free-trial", 
                          title: "Free Trial", 
                          subtitle: "7 days free", 
                          icon: Gift,
                          gradient: "from-green-400 to-emerald-500",
                          description: "Perfect for beginners! Get 7 days of full access to explore our platform, workout plans, and community features."
                        },
                        { 
                          value: "monthly", 
                          title: "Monthly Plan", 
                          subtitle: "$29/month", 
                          icon: Star,
                          gradient: "from-blue-400 to-purple-500",
                          description: "Unlimited access to all workout programs, nutrition plans, coach consultations, and premium features. Cancel anytime."
                        },
                        { 
                          value: "annual", 
                          title: "Annual Plan", 
                          subtitle: "$199/year", 
                          icon: Trophy,
                          gradient: "from-purple-400 to-pink-500",
                          description: "Best value! Save 43% with annual membership. Includes everything in monthly plan plus priority support and exclusive content."
                        },
                      ].map((plan, index) => (
                        <button
                          key={plan.value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ 
                              ...prev, 
                              selectedPlan: plan.value,
                              // Reset payment fields when changing plan
                              paymentMethod: "",
                              cardName: "",
                              cardNumber: "",
                              cardExpiry: "",
                              cardCVV: "",
                              baridimodNumber: ""
                            }))
                            if (errors.selectedPlan) {
                              setErrors((prev) => {
                                const newErrors = { ...prev }
                                delete newErrors.selectedPlan
                                return newErrors
                              })
                            }
                          }}
                          className={`relative p-6 rounded-2xl border-2 transition-all duration-500 hover:shadow-2xl overflow-hidden group ${
                            formData.selectedPlan === plan.value
                              ? `border-[#52796F] bg-gradient-to-br ${plan.gradient} text-white shadow-2xl scale-110 transform z-10`
                              : "border-slate-200 hover:border-[#52796F]/50 hover:scale-105 bg-white/80 backdrop-blur-sm"
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {/* Animated background gradient for selected */}
                          {formData.selectedPlan === plan.value && (
                            <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-90 animate-pulse-glow`}></div>
                          )}
                          
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          
                          <div className="relative z-10">
                            <div className={`mb-4 transform transition-transform duration-300 ${formData.selectedPlan === plan.value ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
                              {(() => {
                                const IconComponent = plan.icon;
                                return <IconComponent className={`w-12 h-12 ${formData.selectedPlan === plan.value ? 'text-white' : 'text-[#52796F]'}`} />;
                              })()}
                            </div>
                            <div className={`font-extrabold text-xl mb-2 ${formData.selectedPlan === plan.value ? 'text-white' : 'text-slate-800'}`}>
                              {plan.title}
                            </div>
                            <div className={`text-sm font-bold mb-3 ${formData.selectedPlan === plan.value ? 'text-white/90' : 'text-[#52796F]'}`}>
                              {plan.subtitle}
                            </div>
                            <div className={`text-xs leading-relaxed ${formData.selectedPlan === plan.value ? 'text-white/90' : 'text-slate-600'}`}>
                              {plan.description}
                            </div>
                            
                            {/* Checkmark for selected */}
                            {formData.selectedPlan === plan.value && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center animate-fadeInUp">
                                <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.selectedPlan && (
                      <p className="text-red-500 text-sm mt-3 animate-fadeInUp flex items-center gap-2 justify-center">
                        <span>⚠️</span> {errors.selectedPlan}
                      </p>
                    )}
                  </div>

                  {/* Payment Section for Paid Plans */}
                  {(formData.selectedPlan === "monthly" || formData.selectedPlan === "annual") && (
                    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-[#52796F]/30 shadow-xl animate-fadeInUp backdrop-blur-sm relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-tr-full"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-xl font-extrabold bg-gradient-to-r from-[#354F52] to-[#52796F] bg-clip-text text-transparent mb-2 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[#52796F]" />
                          Payment Information
                        </h3>
                        <p className="text-sm text-slate-600 mb-6">Secure payment processing</p>
                      
                      {/* Payment Method Selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-4">Payment Method *</label>
                        <div className="grid md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ 
                                ...prev, 
                                paymentMethod: "baridimod",
                                cardName: "",
                                cardNumber: "",
                                cardExpiry: "",
                                cardCVV: ""
                              }))
                              if (errors.paymentMethod) {
                                setErrors((prev) => {
                                  const newErrors = { ...prev }
                                  delete newErrors.paymentMethod
                                  return newErrors
                                })
                              }
                            }}
                            className={`p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group ${
                              formData.paymentMethod === "baridimod"
                                ? "border-[#52796F] bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105 transform"
                                : "border-slate-200 hover:border-[#52796F]/50 hover:shadow-md hover:scale-102 bg-white/80"
                            }`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative z-10">
                              <div className="mb-2">
                                <Globe className="w-8 h-8 text-[#52796F]" />
                              </div>
                              <div className="font-bold text-slate-800 mb-1">Baridimod</div>
                              <div className="text-xs text-slate-600">For Algeria</div>
                            </div>
                            {formData.paymentMethod === "baridimod" && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-[#52796F] rounded-full flex items-center justify-center animate-fadeInUp">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ 
                                ...prev, 
                                paymentMethod: "visa",
                                baridimodNumber: ""
                              }))
                              if (errors.paymentMethod) {
                                setErrors((prev) => {
                                  const newErrors = { ...prev }
                                  delete newErrors.paymentMethod
                                  return newErrors
                                })
                              }
                            }}
                            className={`p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group ${
                              formData.paymentMethod === "visa"
                                ? "border-[#52796F] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105 transform"
                                : "border-slate-200 hover:border-[#52796F]/50 hover:shadow-md hover:scale-102 bg-white/80"
                            }`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative z-10">
                              <div className="mb-2">
                                <CreditCard className="w-8 h-8 text-[#52796F]" />
                              </div>
                              <div className="font-bold text-slate-800 mb-1">Visa Card</div>
                              <div className="text-xs text-slate-600">International</div>
                            </div>
                            {formData.paymentMethod === "visa" && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-[#52796F] rounded-full flex items-center justify-center animate-fadeInUp">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        </div>
                        {errors.paymentMethod && (
                          <p className="text-red-500 text-sm mt-3 animate-fadeInUp flex items-center gap-1">
                            <span>⚠️</span> {errors.paymentMethod}
                          </p>
                        )}
                      </div>

                      {/* Baridimod Form */}
                      {formData.paymentMethod === "baridimod" && (
                        <div className="space-y-5 animate-fadeInUp">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                              <Hash className="w-4 h-4 text-[#52796F]" />
                              Baridimod Number *
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="baridimodNumber"
                                value={formData.baridimodNumber}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                                  errors.baridimodNumber 
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                                    : "border-slate-200 hover:border-[#52796F]/50"
                                }`}
                                placeholder="Enter your Baridimod number"
                              />
                            </div>
                            {errors.baridimodNumber && (
                              <p className="text-red-500 text-sm mt-2 animate-fadeInUp flex items-center gap-1">
                                <span>⚠️</span> {errors.baridimodNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Visa Card Form */}
                      {formData.paymentMethod === "visa" && (
                        <div className="space-y-5 animate-fadeInUp">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                              <User className="w-4 h-4 text-[#52796F]" />
                              Cardholder Name *
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                                  errors.cardName 
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                                    : "border-slate-200 hover:border-[#52796F]/50"
                                }`}
                                placeholder="Name as it appears on card"
                              />
                            </div>
                            {errors.cardName && (
                              <p className="text-red-500 text-sm mt-2 animate-fadeInUp flex items-center gap-1">
                                <span>⚠️</span> {errors.cardName}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-[#52796F]" />
                              Card Number *
                            </label>
                            <div className="relative group">
                              <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\s/g, "").replace(/\D/g, "")
                                  const formatted = value.match(/.{1,4}/g)?.join(" ") || value
                                  setFormData((prev) => ({ ...prev, cardNumber: formatted }))
                                  if (errors.cardNumber) {
                                    setErrors((prev) => {
                                      const newErrors = { ...prev }
                                      delete newErrors.cardNumber
                                      return newErrors
                                    })
                                  }
                                }}
                                maxLength={19}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md font-mono ${
                                  errors.cardNumber 
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                                    : "border-slate-200 hover:border-[#52796F]/50"
                                }`}
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            {errors.cardNumber && (
                              <p className="text-red-500 text-sm mt-2 animate-fadeInUp flex items-center gap-1">
                                <span>⚠️</span> {errors.cardNumber}
                              </p>
                            )}
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#52796F]" />
                                Expiry Date *
                              </label>
                              <div className="relative group">
                                <input
                                  type="text"
                                  name="cardExpiry"
                                  value={formData.cardExpiry}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, "")
                                    if (value.length >= 2) {
                                      value = value.slice(0, 2) + "/" + value.slice(2, 4)
                                    }
                                    setFormData((prev) => ({ ...prev, cardExpiry: value }))
                                    if (errors.cardExpiry) {
                                      setErrors((prev) => {
                                        const newErrors = { ...prev }
                                        delete newErrors.cardExpiry
                                        return newErrors
                                      })
                                    }
                                  }}
                                  maxLength={5}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md font-mono ${
                                    errors.cardExpiry 
                                      ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                                      : "border-slate-200 hover:border-[#52796F]/50"
                                  }`}
                                  placeholder="MM/YY"
                                />
                              </div>
                              {errors.cardExpiry && (
                                <p className="text-red-500 text-sm mt-2 animate-fadeInUp flex items-center gap-1">
                                  <span>⚠️</span> {errors.cardExpiry}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-[#52796F]" />
                                CVV *
                              </label>
                              <div className="relative group">
                                <input
                                  type="text"
                                  name="cardCVV"
                                  value={formData.cardCVV}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                                    setFormData((prev) => ({ ...prev, cardCVV: value }))
                                    if (errors.cardCVV) {
                                      setErrors((prev) => {
                                        const newErrors = { ...prev }
                                        delete newErrors.cardCVV
                                        return newErrors
                                      })
                                    }
                                  }}
                                  maxLength={4}
                                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md font-mono ${
                                    errors.cardCVV 
                                      ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                                      : "border-slate-200 hover:border-[#52796F]/50"
                                  }`}
                                  placeholder="123"
                                />
                              </div>
                              {errors.cardCVV && (
                                <p className="text-red-500 text-sm mt-2 animate-fadeInUp flex items-center gap-1">
                                  <span>⚠️</span> {errors.cardCVV}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-8 bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#52796F] via-[#354F52] to-[#52796F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3 relative z-10">
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Your Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3 relative z-10">
                        <Dumbbell className="w-6 h-6 animate-pulse" />
                        Join Now!
                        <Zap className="w-5 h-5 ml-2" />
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto" autoComplete="off">
                  <div className="text-center mb-8 animate-fadeInUp">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52] bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
                      Welcome Back!
                      <Star className="w-6 h-6 text-[#52796F]" />
                    </h2>
                    <p className="text-slate-600 text-sm">Ready to crush your fitness goals?</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                      <div className="w-8 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                      <div className="w-4 h-1 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full"></div>
                    </div>
                  </div>

                  <div className="animate-fadeInUp">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#52796F]" />
                      Email *
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#52796F] transition-colors duration-300" />
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md ${
                          errors.email 
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                            : "border-slate-200 hover:border-[#52796F]/50"
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 animate-fadeInUp flex items-center gap-1">
                        <span>⚠️</span> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#52796F]" />
                      Password *
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#52796F] transition-colors duration-300" />
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md ${
                          errors.password 
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500 animate-pulse" 
                            : "border-slate-200 hover:border-[#52796F]/50"
                        }`}
                        placeholder="Enter your password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2 animate-fadeInUp flex items-center gap-1">
                        <span>⚠️</span> {errors.password}
                      </p>
                    )}
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
                    className="w-full mt-6 bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#52796F] via-[#354F52] to-[#52796F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3 relative z-10">
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Logging in...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Login
                        <Dumbbell className="w-5 h-5" />
                      </span>
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