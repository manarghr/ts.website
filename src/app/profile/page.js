"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  User,
  Edit2,
  Users,
  Heart,
  Video,
  Dumbbell,
  Calendar,
  Mail,
  Phone,
  Save,
  X,
  Star,
  Camera,
  Lock,
  Unlock,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Animated background component
const AnimatedBackground = () => {
  const particles = Array(15).fill(0);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#354F52] via-[#2F3E46] to-[#1B2D2F] opacity-90"></div>
      
      {/* Animated particles */}
      {particles.map((_, i) => {
        // eslint-disable-next-line react-hooks/purity
        const size = Math.random() * 6 + 4;
        // eslint-disable-next-line react-hooks/purity
        const posX = Math.random() * 100;
        // eslint-disable-next-line react-hooks/purity
        const posY = Math.random() * 100;
        // eslint-disable-next-line react-hooks/purity
        const duration = Math.random() * 20 + 10;
        // eslint-disable-next-line react-hooks/purity
        const delay = Math.random() * -20;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${posX}%`,
              top: `${posY}%`,
            }}
            animate={{
              y: [0, 100, 0],
              // eslint-disable-next-line react-hooks/purity
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[length:40px_40px] bg-grid-white/[0.1]" />
      </div>
    </div>
  );
};

export default function ProfilePage({ userId }) {
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("trainsight_current_user");
    window.dispatchEvent(new Event("userLoggedOut"));
    window.location.href = "/";
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    workoutExperience: "",
    sportsRating: "",
  })
  const [showFollowModal, setShowFollowModal] = useState(null)
  const [privacySettings, setPrivacySettings] = useState({
    coaches: "public",
    videos: "public",
    workouts: "public",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const current = localStorage.getItem("trainsight_current_user")
      if (current) {
        const userData = JSON.parse(current)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(userData)

        if (userId && userId !== userData.id) {
          // Viewing another user's profile
          const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]")
          const targetUser = users.find((u) => u.id === userId)
          setProfileUser(targetUser || null)
          setIsOwnProfile(false)
        } else {
          // Viewing own profile
          setProfileUser(userData)
          setIsOwnProfile(true)
          setEditBio(userData.bio || "")
          setEditForm({
            fullName: userData.fullName || "",
            phone: userData.phone || "",
            email: userData.email || "",
            age: userData.age || "",
            gender: userData.gender || "",
            workoutExperience: userData.workoutExperience || "",
            sportsRating: userData.sportsRating || "",
          })
          setPrivacySettings(
            userData.privacySettings || {
              coaches: "public",
              videos: "public",
              workouts: "public",
            },
          )
        }
      }
    }
  }, [userId])

  const handleSaveBio = () => {
    if (!isOwnProfile || !currentUser) return

    const updatedUser = { ...currentUser, bio: editBio }
    setCurrentUser(updatedUser)
    setProfileUser(updatedUser)

    localStorage.setItem("trainsight_current_user", JSON.stringify(updatedUser))

    const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]")
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u))
    localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers))

    window.dispatchEvent(new Event("userUpdated"))

    setIsEditingBio(false)
  }

  const handleSaveInfo = () => {
    if (!isOwnProfile || !currentUser) return

    const updatedUser = { ...currentUser, ...editForm }
    setCurrentUser(updatedUser)
    setProfileUser(updatedUser)

    localStorage.setItem("trainsight_current_user", JSON.stringify(updatedUser))

    const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]")
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u))
    localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers))

    window.dispatchEvent(new Event("userUpdated"))

    setIsEditingInfo(false)
  }

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file && isOwnProfile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const updatedUser = { ...currentUser, profilePicture: reader.result }
        setCurrentUser(updatedUser)
        setProfileUser(updatedUser)

        localStorage.setItem("trainsight_current_user", JSON.stringify(updatedUser))

        const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]")
        const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u))
        localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers))

        window.dispatchEvent(new Event("userUpdated"))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePrivacyToggle = (section) => {
    const newSettings = {
      ...privacySettings,
      [section]: privacySettings[section] === "public" ? "private" : "public",
    }
    setPrivacySettings(newSettings)

    const updatedUser = { ...currentUser, privacySettings: newSettings }
    setCurrentUser(updatedUser)
    setProfileUser(updatedUser)

    localStorage.setItem("trainsight_current_user", JSON.stringify(updatedUser))

    const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]")
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u))
    localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers))

    window.dispatchEvent(new Event("userUpdated"))
  }

  const isContentVisible = (section) => {
    if (isOwnProfile) return true
    const settings = profileUser?.privacySettings || {}
    return settings[section] !== "private"
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">Please log in to view profiles</p>
          <Link href="/" className="text-[#52796F] hover:underline font-semibold">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">User not found</p>
          <Link href="/" className="text-[#52796F] hover:underline font-semibold">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white/80 to-slate-100/80 backdrop-blur-sm py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
         
          {/* Profile Header */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm shadow-lg relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-32 bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52]"></div>
            <div className="px-8 pb-8 -mt-16">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <div className="relative group">
                  {profileUser?.profilePicture ? (
                    <Image
                      src={profileUser.profilePicture || "/placeholder.svg"}
                      alt={profileUser.fullName || "Profile"}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-[#52796F]/20"
                      unoptimized
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#354F52] to-[#52796F] flex items-center justify-center border-4 border-white shadow-xl ring-2 ring-[#52796F]/20">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                  {isOwnProfile && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-[#52796F] to-[#354F52] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all group-hover:scale-110 border-2 border-white">
                      <Camera className="w-5 h-5 text-white" />
                      <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                    </label>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-800 mb-2">{profileUser?.fullName}</h1>
                      {profileUser?.selectedPlan && (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                            profileUser.selectedPlan === "annual"
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                              : profileUser.selectedPlan === "monthly"
                                ? "bg-gradient-to-r from-[#52796F] to-[#354F52] text-white"
                                : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {profileUser.selectedPlan === "annual"
                            ? "⭐ Annual Member"
                            : profileUser.selectedPlan === "monthly"
                              ? "💎 Monthly Member"
                              : "🎁 Free Trial"}
                        </span>
                      )}
                    </div>
                  </div>

                  {profileUser?.bio ? (
                    <div className="mb-4">
                      {isEditingBio && isOwnProfile ? (
                        <div>
                          <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none resize-none transition-all"
                            placeholder="Tell us about yourself..."
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleSaveBio}
                              className="px-4 py-2 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditBio(profileUser.bio || "")
                                setIsEditingBio(false)
                              }}
                              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all flex items-center gap-2 font-semibold"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <p className="text-slate-600 flex-1 leading-relaxed">{profileUser.bio}</p>
                          {isOwnProfile && (
                            <button
                              onClick={() => setIsEditingBio(true)}
                              className="text-[#52796F] hover:text-[#354F52] transition-colors p-2 hover:bg-slate-100 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4">
                      {isEditingBio && isOwnProfile ? (
                        <div>
                          <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none resize-none transition-all"
                            placeholder="Tell us about yourself..."
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleSaveBio}
                              className="px-4 py-2 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditBio("")
                                setIsEditingBio(false)
                              }}
                              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all flex items-center gap-2 font-semibold"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : isOwnProfile ? (
                        <button
                          onClick={() => setIsEditingBio(true)}
                          className="text-[#52796F] hover:text-[#354F52] transition-colors text-sm flex items-center gap-2 font-semibold hover:bg-slate-100 px-3 py-2 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                          Add a bio
                        </button>
                      ) : null}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    {isOwnProfile ? (
                      <>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                          <Mail className="w-4 h-4 text-[#52796F]" />
                          {profileUser?.email}
                        </div>
                        {profileUser?.phone && (
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                            <Phone className="w-4 h-4 text-[#52796F]" />
                            {profileUser.phone}
                          </div>
                        )}
                      </>
                    ) : null}
                    {profileUser?.age && (
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-[#52796F]" />
                        {profileUser.age} years old
                      </div>
                    )}
                    {profileUser?.gender && (
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                        <User className="w-4 h-4 text-[#52796F]" />
                        <span className="capitalize">{profileUser.gender}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Logout Button */}
                {isOwnProfile && (
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors absolute right-6 bottom-6"
                  >
                    <LogOut size={16} />
                    Logout
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setShowFollowModal("followers")}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 group cursor-pointer w-full"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{profileUser?.followers?.length || 0}</div>
                <div className="text-sm text-slate-600 font-medium">Followers</div>
              </div>
            </button>
            <button
              onClick={() => setShowFollowModal("following")}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 group cursor-pointer w-full"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{profileUser?.followings?.length || 0}</div>
                <div className="text-sm text-slate-600 font-medium">Following</div>
              </div>
            </button>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {isContentVisible("coaches") ? profileUser?.favoriteCoaches?.length || 0 : "🔒"}
                </div>
                <div className="text-sm text-slate-600 font-medium">Coaches</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-red-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {isContentVisible("videos") ? profileUser?.likedVideos?.length || 0 : "🔒"}
                </div>
                <div className="text-sm text-slate-600 font-medium">Videos</div>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100">
            <div className="border-b border-slate-200">
              <div className="flex gap-1 px-4 overflow-x-auto">
                {[
                  { id: "overview", label: "Overview", icon: User },
                  { id: "coaches", label: "Favorite Coaches", icon: Dumbbell },
                  { id: "videos", label: "Liked Videos", icon: Video },
                  { id: "workouts", label: "Enrolled Workouts", icon: Calendar },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-semibold transition-all rounded-t-lg whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#52796F] to-[#354F52] text-white shadow-lg"
                        : "text-slate-600 hover:text-[#52796F] hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="w-5 h-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-800">Profile Information</h3>
                    {isOwnProfile && !isEditingInfo && (
                      <button
                        onClick={() => setIsEditingInfo(true)}
                        className="px-4 py-2 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Info
                      </button>
                    )}
                    {isEditingInfo && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveInfo}
                          className="px-4 py-2 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditForm({
                              fullName: profileUser?.fullName || "",
                              phone: profileUser?.phone || "",
                              email: profileUser?.email || "",
                              age: profileUser?.age || "",
                              gender: profileUser?.gender || "",
                              workoutExperience: profileUser?.workoutExperience || "",
                              sportsRating: profileUser?.sportsRating || "",
                            })
                            setIsEditingInfo(false)
                          }}
                          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all flex items-center gap-2 font-semibold"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditingInfo ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Phone</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Age</label>
                        <input
                          type="number"
                          value={editForm.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Gender</label>
                        <select
                          value={editForm.gender}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Workout Experience</label>
                        <select
                          value={editForm.workoutExperience}
                          onChange={(e) => handleInputChange("workoutExperience", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                        >
                          <option value="">Select Experience</option>
                          <option value="first-time">First Time</option>
                          <option value="regular">Regular Workout</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Sports Rating</label>
                        <select
                          value={editForm.sportsRating}
                          onChange={(e) => handleInputChange("sportsRating", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                        >
                          <option value="">Select Rating</option>
                          <option value="1">1 - Beginner</option>
                          <option value="2">2 - Novice</option>
                          <option value="3">3 - Intermediate</option>
                          <option value="4">4 - Advanced</option>
                          <option value="5">5 - Expert</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
                        <div className="text-sm text-slate-600 mb-2 font-semibold">Gender</div>
                        <div className="font-bold text-slate-800 capitalize text-lg">
                          {profileUser?.gender || "Not specified"}
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
                        <div className="text-sm text-slate-600 mb-2 font-semibold">Age</div>
                        <div className="font-bold text-slate-800 text-lg">
                          {profileUser?.age ? `${profileUser.age} years` : "Not specified"}
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
                        <div className="text-sm text-slate-600 mb-2 font-semibold">Workout Experience</div>
                        <div className="font-bold text-slate-800 capitalize text-lg">
                          {profileUser?.workoutExperience === "first-time"
                            ? "First Time"
                            : profileUser?.workoutExperience === "regular"
                              ? "Regular Workout"
                              : "Not specified"}
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-all">
                        <div className="text-sm text-slate-600 mb-2 font-semibold">Sports Rating</div>
                        <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                          {profileUser?.sportsRating ? (
                            <>
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                              {profileUser.sportsRating}/5
                            </>
                          ) : (
                            "Not rated"
                          )}
                        </div>
                      </div>
                      {isOwnProfile && (
                        <>
                          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="text-sm text-blue-600 mb-2 font-semibold flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email (Private)
                            </div>
                            <div className="font-bold text-blue-800 text-lg break-all">{profileUser?.email}</div>
                          </div>
                          {profileUser?.phone && (
                            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                              <div className="text-sm text-green-600 mb-2 font-semibold flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone (Private)
                              </div>
                              <div className="font-bold text-green-800 text-lg">{profileUser.phone}</div>
                            </div>
                          )}
                        </>
                      )}
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                        <div className="text-sm text-purple-600 mb-2 font-semibold">Plan</div>
                        <div className="font-bold text-purple-800 capitalize text-lg">
                          {profileUser?.selectedPlan || "Not selected"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "coaches" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Favorite Coaches</h3>
                    {isOwnProfile && (
                      <button
                        onClick={() => handlePrivacyToggle("coaches")}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                          privacySettings.coaches === "public"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                            : "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:shadow-lg"
                        }`}
                      >
                        {privacySettings.coaches === "public" ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Private
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {isContentVisible("coaches") ? (
                    profileUser?.favoriteCoaches && profileUser.favoriteCoaches.length > 0 ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        {profileUser.favoriteCoaches.map((coach, index) => (
                          <div
                            key={index}
                            className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-full flex items-center justify-center">
                                <Dumbbell className="w-5 h-5 text-white" />
                              </div>
                              <div className="font-bold text-slate-800">{coach.name || "Coach"}</div>
                            </div>
                            <div className="text-sm text-slate-600 font-medium">{coach.category || "General"}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Dumbbell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No favorite coaches yet</p>
                        {isOwnProfile && (
                          <p className="text-slate-400 text-sm mt-2">Start following coaches to see them here!</p>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="text-center py-16">
                      <Lock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">This section is private</p>
                      <p className="text-slate-400 text-sm mt-2">The user has chosen to keep this information private</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "videos" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Liked Videos</h3>
                    {isOwnProfile && (
                      <button
                        onClick={() => handlePrivacyToggle("videos")}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                          privacySettings.videos === "public"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                            : "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:shadow-lg"
                        }`}
                      >
                        {privacySettings.videos === "public" ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Private
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {isContentVisible("videos") ? (
                    profileUser?.likedVideos && profileUser.likedVideos.length > 0 ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        {profileUser.likedVideos.map((video, index) => (
                          <div
                            key={index}
                            className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-red-500 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                              </div>
                              <div className="font-bold text-slate-800">{video.title || "Video"}</div>
                            </div>
                            <div className="text-sm text-slate-600 font-medium">{video.coach || "Unknown"}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No liked videos yet</p>
                        {isOwnProfile && <p className="text-slate-400 text-sm mt-2">Like videos to see them here!</p>}
                      </div>
                    )
                  ) : (
                    <div className="text-center py-16">
                      <Lock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">This section is private</p>
                      <p className="text-slate-400 text-sm mt-2">The user has chosen to keep this information private</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "workouts" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Enrolled Workouts</h3>
                    {isOwnProfile && (
                      <button
                        onClick={() => handlePrivacyToggle("workouts")}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                          privacySettings.workouts === "public"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                            : "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:shadow-lg"
                        }`}
                      >
                        {privacySettings.workouts === "public" ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Private
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {isContentVisible("workouts") ? (
                    profileUser?.enrolledWorkouts && profileUser.enrolledWorkouts.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {profileUser.enrolledWorkouts.map((workout, index) => (
                          <div
                            key={index}
                            className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-lg transition-all"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-800 text-lg mb-1">
                                  {workout.name || "Workout Program"}
                                </div>
                                <div className="text-sm text-slate-600 mb-3">
                                  {workout.description || "Build strength and endurance"}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{workout.duration || "8 weeks"}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Dumbbell className="w-3 h-3" />
                                    <span>{workout.difficulty || "Intermediate"}</span>
                                  </div>
                                </div>
                                {workout.progress && (
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                                      <span>Progress</span>
                                      <span className="font-semibold">{workout.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                      <div
                                        className="bg-gradient-to-r from-[#52796F] to-[#354F52] h-2 rounded-full transition-all"
                                        style={{ width: `${workout.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No enrolled workouts yet</p>
                        {isOwnProfile && (
                          <p className="text-slate-400 text-sm mt-2">Start a workout program to see it here!</p>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="text-center py-16">
                      <Lock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">This section is private</p>
                      <p className="text-slate-400 text-sm mt-2">The user has chosen to keep this information private</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {showFollowModal && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowFollowModal(null)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-[#354F52] to-[#52796F] p-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    {showFollowModal === "followers" ? "Followers" : "Following"}
                  </h3>
                  <button
                    onClick={() => setShowFollowModal(null)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                  {((showFollowModal === "followers" ? profileUser?.followers : profileUser?.followings) || []).length >
                  0 ? (
                    <div className="space-y-3">
                      {(showFollowModal === "followers" ? profileUser?.followers : profileUser?.followings).map(
                        (user, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-md transition-all border border-slate-200"
                          >
                            {user.profilePicture ? (
                              <Image
                                src={user.profilePicture || "/placeholder.svg"}
                                alt={user.fullName || "User"}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#52796F]/20"
                                unoptimized
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#354F52] to-[#52796F] flex items-center justify-center ring-2 ring-[#52796F]/20">
                                <User className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-bold text-slate-800">{user.fullName || "User"}</div>
                              {user.bio && <div className="text-sm text-slate-600 line-clamp-1">{user.bio}</div>}
                            </div>
                            <Link
                              href={`/profile/${user.id}`}
                              className="px-4 py-2 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                            >
                              View
                            </Link>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">
                        No {showFollowModal === "followers" ? "followers" : "following"} yet
                      </p>
                      {isOwnProfile && (
                        <p className="text-slate-400 text-sm mt-2">Connect with other members to grow your network!</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
 