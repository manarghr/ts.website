"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
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
  Apple,
  UtensilsCrossed,
  Activity,
  Zap,
  MessageSquare,
  Trash2,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Clock, 
  Check, 
  Plus,
  Scale,
  Ruler
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PLANS, getPlan } from "@/lib/plans"

// Animated background component
const AnimatedBackground = () => {
  const particles = Array(15).fill(0);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Lighter base background - less green */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4a6a6f] via-[#5a7a7f] to-[#6a8a8f]"></div>
      
      {/* Animated gradient blurs - using platform colors */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-[#52796F]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#354F52]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#52796F]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
      
      {/* Animated particles */}
      {particles.map((_, i) => {
        // eslint-disable-next-line react-hooks/purity
        const size = Math.random() * 6 + 3;
        // eslint-disable-next-line react-hooks/purity
        const posX = Math.random() * 100;
        // eslint-disable-next-line react-hooks/purity
        const posY = Math.random() * 100;
        // eslint-disable-next-line react-hooks/purity
        const duration = Math.random() * 15 + 8;
        // eslint-disable-next-line react-hooks/purity
        const delay = Math.random() * -15;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#52796F]/20"
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
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.3, 1],
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
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[length:60px_60px] bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
      </div>
      
      {/* Floating gym equipment and nutrition icons */}
      {[
        { icon: Dumbbell, x: 10, y: 20, size: 40, duration: 8, delay: 0 },
        { icon: Activity, x: 85, y: 15, size: 35, duration: 10, delay: 1 },
        { icon: Apple, x: 20, y: 60, size: 45, duration: 12, delay: 2 },
        { icon: UtensilsCrossed, x: 75, y: 55, size: 38, duration: 9, delay: 0.5 },
        { icon: Zap, x: 50, y: 30, size: 42, duration: 11, delay: 1.5 },
        { icon: Dumbbell, x: 15, y: 75, size: 36, duration: 13, delay: 2.5 },
        { icon: Activity, x: 90, y: 70, size: 40, duration: 10, delay: 0.8 },
        { icon: Apple, x: 5, y: 45, size: 44, duration: 14, delay: 3 },
        { icon: UtensilsCrossed, x: 95, y: 40, size: 37, duration: 9.5, delay: 1.2 },
        { icon: Zap, x: 30, y: 85, size: 39, duration: 11.5, delay: 2.2 },
        { icon: Dumbbell, x: 60, y: 10, size: 41, duration: 12.5, delay: 0.3 },
        { icon: Activity, x: 40, y: 50, size: 43, duration: 10.5, delay: 1.8 },
      ].map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className="absolute text-white/35"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(index) * 20, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.45, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <IconComponent size={item.size} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default function ProfilePage({ userId }) {
  const [showBlogSubmissionForm, setShowBlogSubmissionForm] = useState(false);
  const [blogSubmissionForm, setBlogSubmissionForm] = useState({
    title: "",
    excerpt: "",
    author: "",
    readTime: "",
    image: "",
    category: "training",
    sections: [{ title: "", content: "" }],
  });

  const addBlogSection = () => {
  setBlogSubmissionForm({
    ...blogSubmissionForm,
    sections: [...blogSubmissionForm.sections, { title: "", content: "" }]
    });
  };

  const removeBlogSection = (index) => {
    setBlogSubmissionForm({
      ...blogSubmissionForm,
      sections: blogSubmissionForm.sections.filter((_, i) => i !== index)
    });
  };

  const updateBlogSection = (index, field, value) => {
    const updatedSections = [...blogSubmissionForm.sections];
    updatedSections[index][field] = value;
    setBlogSubmissionForm({
      ...blogSubmissionForm,
      sections: updatedSections
    });
  };

  // Handle logout
  const loadMyBlogs = useCallback(async () => {
    setBlogsLoading(true)
    try {
      const res = await fetch("/api/blogs/mine", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json().catch(() => ({}))
      setMyBlogs(data?.blogs || [])
    } catch (error) {
      console.error("Could not load your blogs:", error)
    } finally {
      setBlogsLoading(false)
    }
  }, [])

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json().catch(() => ({}))
      setConversations(data?.conversations || [])
    } catch (error) {
      console.error("Could not load conversations:", error)
    }
  }, [])

  const openConversation = async (contact) => {
    setOpenThread(contact)
    setThreadLoading(true)
    try {
      const res = await fetch(`/api/messages?coachId=${contact.id}`, { cache: "no-store" })
      const data = await res.json().catch(() => ({}))
      setThreadMessages(data?.messages || [])
      // The GET marked it read server-side; mirror that in the list.
      loadConversations()
    } catch (error) {
      console.error("Could not load the conversation:", error)
    } finally {
      setThreadLoading(false)
    }
  }

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    // Clear the local copy and repaint the navbar first, so the click feels
    // instant. The request below is what actually ends the session -- clearing
    // localStorage alone left the cookie valid for its full 30 days, and on a
    // shared computer the next person opening /profile was still signed in as you.
    localStorage.removeItem("trainsight_current_user");
    window.dispatchEvent(new Event("userLoggedOut"));

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    // A client-side navigation. The old window.location.href re-downloaded the
    // whole home page -- video, images and all -- which is what made this slow.
    router.replace("/");
    router.refresh();
  };


  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("Please log in to submit a blog");
      return;
    }

    try {
      const response = await fetch('/api/admin/blogs/pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...blogSubmissionForm,
          author: blogSubmissionForm.author || currentUser.fullName,
          submittedBy: currentUser.id,
        }),
      });

      const data = await response.json();

      if (!data.success) throw new Error(data.error || 'Failed to submit blog');

      alert("Blog submitted successfully! It will be reviewed by an admin.");

      // Land them on My Blogs so the new post is visible with its pending status,
      // rather than leaving them wondering where it went.
      loadMyBlogs();
      setActiveTab("blogs");

      // Reset form
      setBlogSubmissionForm({
        title: "",
        excerpt: "",
        author: "",
        readTime: "",
        image: "",
        category: "training",
        sections: [{ title: "", content: "" }],
      });
      setShowBlogSubmissionForm(false);
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert('Failed to submit blog. Please try again.');
    }
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  // Without this, the first render has profileUser === null and falls through to the
  // "User not found" screen while the profile is still being fetched.
  const [loading, setLoading] = useState(true);
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
    weight: "",
    height: "",
  })
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // conversations with coaches
  const [myBlogs, setMyBlogs] = useState([])
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [conversations, setConversations] = useState([])
  const [openThread, setOpenThread] = useState(null)
  const [threadMessages, setThreadMessages] = useState([])
  const [threadLoading, setThreadLoading] = useState(false)
  const router = useRouter()
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [savingPlan, setSavingPlan] = useState(false)
  const [showFollowModal, setShowFollowModal] = useState(null)
  const [privacySettings, setPrivacySettings] = useState({
    coaches: "public",
    videos: "public",
    workouts: "public",
    meals: "public",
  })
  const [editingComment, setEditingComment] = useState(null)
  const [commentText, setCommentText] = useState("")

  // Pull the signed-in user from the server (the session cookie decides who that is)
  // and the saved coaches/videos/meals from /api/favorites, which returns the real
  // items looked up fresh rather than stale copies stored on the user document.
  const loadProfile = useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me", { cache: "no-store" })
      const me = await meRes.json().catch(() => ({}))

      if (!me?.authenticated || !me.user) {
        setCurrentUser(null)
        setProfileUser(null)
        return
      }

      const userData = me.user
      setCurrentUser(userData)

      // Viewing someone else's profile is not supported without a public profile
      // endpoint; fall back to your own rather than reading other users locally.
      const own = !userId || userId === userData.id
      setIsOwnProfile(own)

      const [coaches, videos, meals] = await Promise.all(
        ["coach", "video", "meal"].map(async (type) => {
          const res = await fetch(`/api/favorites?type=${type}`, { cache: "no-store" })
          if (!res.ok) return []
          const data = await res.json().catch(() => ({}))
          return data?.items || []
        })
      )

      // What you bought is what you are enrolled in. This tab used to read
      // userData.enrolledWorkouts, which nothing ever wrote -- so a program you
      // paid for showed up nowhere.
      let enrolledWorkouts = []
      try {
        const res = await fetch("/api/purchases", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          enrolledWorkouts = (data?.purchases || [])
            .filter((purchase) => purchase.item_type === "program")
            .map((purchase) => ({
              id: purchase.item_id,
              name: purchase.item?.name || purchase.item_title,
              description: purchase.item?.description,
              duration: purchase.item?.duration,
              difficulty: purchase.item?.level,
              purchasedAt: purchase.created_at,
              amountPaid: purchase.amount_paid,
            }))
        }
      } catch (error) {
        console.error("Could not load purchases:", error)
      }

      // Who you follow. The Following card read userData.followings, which nothing
      // ever wrote, so it always said 0 no matter how many coaches you followed.
      let followings = []
      try {
        const res = await fetch("/api/follows", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          // The follow modal renders fullName/profilePicture; coaches use name/image_url.
          followings = (data?.coaches || []).map((coach) => ({
            id: coach.id,
            fullName: coach.name,
            profilePicture: coach.image_url,
            subtitle: coach.category,
          }))
        }
      } catch (error) {
        console.error("Could not load followed coaches:", error)
      }

      const hydrated = {
        ...userData,
        favoriteCoaches: coaches,
        likedVideos: videos,
        favoriteMeals: meals,
        enrolledWorkouts,
        followings,
      }

      setProfileUser(hydrated)
      setEditBio(userData.bio || "")
      setEditForm({
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        email: userData.email || "",
        age: userData.age ?? "",
        gender: userData.gender || "",
        workoutExperience: userData.workoutExperience || "",
        sportsRating: userData.sportsRating ?? "",
        weight: userData.weight ?? "",
        height: userData.height ?? "",
      })
      setPrivacySettings(
        userData.privacySettings || {
          coaches: "public",
          videos: "public",
          workouts: "public",
          meals: "public",
        },
      )
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      // Only ever flips to false. Later refreshes (the "userUpdated" event) must not
      // blank out a profile that is already on screen.
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadProfile()
    window.addEventListener("userUpdated", loadProfile)
    return () => window.removeEventListener("userUpdated", loadProfile)
  }, [loadProfile])

  useEffect(() => {
    loadConversations()
    loadMyBlogs()
  }, [loadConversations, loadMyBlogs])

  /**
   * Single path for every profile write: send the changed fields to the server,
   * then apply what the server returns. The server is the source of truth, so a
   * rejected or sanitised value shows up immediately instead of the UI displaying
   * something the database never accepted.
   *
   * The localStorage copy is kept only so the navbar can paint instantly on the
   * next page load -- nothing reads it for permissions.
   */
  const saveProfile = async (fields) => {
    if (!isOwnProfile || !currentUser) return false

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data?.user) {
        alert(data?.error || "Could not save your changes. Please try again.")
        return false
      }

      setCurrentUser(data.user)
      setProfileUser((prev) => ({ ...prev, ...data.user }))
      localStorage.setItem("trainsight_current_user", JSON.stringify(data.user))
      window.dispatchEvent(new Event("userUpdated"))
      return true
    } catch (error) {
      console.error("Failed to save profile:", error)
      alert("Could not reach the server. Please try again.")
      return false
    }
  }

  // No payment step yet, so switching is just a flag change. When checkout exists,
  // the paid plans route through it first and only set this on success.
  const handleChangePlan = async (value) => {
    if (value === profileUser?.selectedPlan) {
      setShowPlanModal(false)
      return
    }
    setSavingPlan(true)
    const saved = await saveProfile({ selectedPlan: value })
    setSavingPlan(false)
    if (saved) setShowPlanModal(false)
  }

  const handleSaveBio = async () => {
    if (await saveProfile({ bio: editBio })) {
      setIsEditingBio(false)
    }
  }

  const handleSaveInfo = async () => {
    // email is displayed in the form but is not editable server-side
    const { email, ...editable } = editForm
    if (await saveProfile(editable)) {
      setIsEditingInfo(false)
    }
  }

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  // Upload the file and store the returned URL -- never the base64 string itself.
  // (Storing base64 here would put a multi-megabyte blob on the user document.)
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !isOwnProfile) return

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file")
      return
    }

    // Must match the 5MB limit enforced in /api/upload/image
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB")
      return
    }

    setIsUploadingPicture(true)
    try {
      const body = new FormData()
      body.append("file", file)

      const res = await fetch("/api/upload/image", { method: "POST", body })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Upload failed")
      }

      await saveProfile({ profilePicture: data.imageUrl })
    } catch (error) {
      console.error("Profile picture upload failed:", error)
      alert(error.message || "Could not upload image. Please try again.")
    } finally {
      setIsUploadingPicture(false)
      // Let the same file be picked again after a failure.
      e.target.value = ""
    }
  }

  const handlePrivacyToggle = async (section) => {
    const previous = privacySettings
    const newSettings = {
      ...privacySettings,
      [section]: privacySettings[section] === "public" ? "private" : "public",
    }

    // Flip the switch immediately, then roll back if the server refuses --
    // a privacy control that lags behind the click feels broken.
    setPrivacySettings(newSettings)

    if (!(await saveProfile({ privacySettings: newSettings }))) {
      setPrivacySettings(previous)
    }
  }

  const handleUnfavoriteCoach = async (coach) => {
    if (!isOwnProfile || !currentUser) return
    if (!window.confirm(`Unfollow ${coach.name}?`)) return

    const previous = profileUser?.favoriteCoaches || []
    setProfileUser((prev) => ({
      ...prev,
      favoriteCoaches: previous.filter((c) => c.id !== coach.id),
    }))

    try {
      const res = await fetch(`/api/favorites?type=coach&itemId=${encodeURIComponent(coach.id)}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Request failed")
      window.dispatchEvent(new Event("userUpdated"))
    } catch (error) {
      console.error("Failed to unfollow coach:", error)
      setProfileUser((prev) => ({ ...prev, favoriteCoaches: previous }))
      alert("Could not unfollow. Please try again.")
    }
  }

  const handleUnlikeMeal = async (mealId) => {
    if (!isOwnProfile || !currentUser) return

    // Drop it from the list right away, restore it if the request fails.
    const previous = profileUser?.favoriteMeals || []
    setProfileUser((prev) => ({
      ...prev,
      favoriteMeals: previous.filter((m) => m.id !== mealId),
    }))

    try {
      const res = await fetch(`/api/favorites?type=meal&itemId=${encodeURIComponent(mealId)}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Request failed")
    } catch (error) {
      console.error("Failed to remove saved meal:", error)
      setProfileUser((prev) => ({ ...prev, favoriteMeals: previous }))
      alert("Could not remove this meal. Please try again.")
    }
  }

  const handleSaveComment = async (mealId) => {
    if (!isOwnProfile || !currentUser) return

    // The note lives on the favorite row, not on the meal -- it is the user's own
    // text about a meal that everyone else also sees unchanged.
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "meal", itemId: mealId, comment: commentText }),
      })
      if (!res.ok) throw new Error("Request failed")

      setProfileUser((prev) => ({
        ...prev,
        favoriteMeals: (prev?.favoriteMeals || []).map((m) =>
          m.id === mealId ? { ...m, comment: commentText } : m
        ),
      }))

      setEditingComment(null)
      setCommentText("")
    } catch (error) {
      console.error("Failed to save note:", error)
      alert("Could not save your note. Please try again.")
    }
  }

  const isContentVisible = (section) => {
    if (isOwnProfile) return true
    const settings = profileUser?.privacySettings || {}
    return settings[section] !== "private"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#52796F]/20 border-t-[#52796F] animate-spin" />
          <p className="text-slate-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* White Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-white"></div>
        
        {/* Animated gradient blurs - green */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-[#52796F]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#354F52]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Floating gym equipment icons - green */}
        {[
          { icon: Dumbbell, x: 10, y: 20, size: 50, duration: 8, delay: 0 },
          { icon: Activity, x: 85, y: 15, size: 45, duration: 10, delay: 1 },
          { icon: Apple, x: 20, y: 60, size: 55, duration: 12, delay: 2 },
          { icon: UtensilsCrossed, x: 75, y: 55, size: 48, duration: 9, delay: 0.5 },
          { icon: Zap, x: 50, y: 30, size: 52, duration: 11, delay: 1.5 },
        ].map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              className="absolute text-[#52796F]"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(index) * 20, 0],
                rotate: [0, 360],
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <IconComponent size={item.size} />
            </motion.div>
          );
        })}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-32 h-32 bg-[#52796F]/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-[#52796F]/30 shadow-2xl">
              <Lock className="w-16 h-16 text-[#354F52]" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-extrabold text-[#354F52] mb-4 drop-shadow-lg"
          >
            Welcome to TrainSight
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-slate-600 mb-8 font-semibold"
          >
            Please sign up or login to see your profile
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center items-center"
          >
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
            >
              <User className="w-5 h-5" />
            Go to Home
            </motion.a>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex justify-center gap-8"
          >
            {[Dumbbell, Activity, Star].map((Icon, index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className="w-12 h-12 bg-[#52796F]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#52796F]/20"
              >
                <Icon className="w-6 h-6 text-[#52796F]" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
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
      <div className="min-h-screen pt-8 pb-16 px-4 md:px-8 relative z-10">
        <div className="max-w-[1500px] mx-auto">
          <div className="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-8 items-start">

            {/* Sidebar: who you are, then where you can go. */}
            {/* Not sticky. Sticky pinned it below the viewport top while the panel
                kept scrolling, so the two never looked level. In normal flow they
                start on the same line and stay that way. */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col items-center text-center pb-5 mb-5 border-b border-slate-200">
                <div className="relative mb-3">
                  {profileUser?.profilePicture ? (
                    <Image
                      src={profileUser.profilePicture}
                      alt={profileUser.fullName || "Profile"}
                      width={88}
                      height={88}
                      className="w-22 h-22 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-[#52796F]/25"
                      style={{ width: 88, height: 88 }}
                      unoptimized
                    />
                  ) : (
                    <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#354F52] to-[#52796F] flex items-center justify-center border-4 border-white shadow-lg">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  {isOwnProfile && (
                    <label
                      title="Change profile picture"
                      className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#52796F] hover:bg-[#354F52] text-white flex items-center justify-center cursor-pointer shadow-lg ring-4 ring-white transition-colors"
                    >
                      {isUploadingPicture ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        disabled={isUploadingPicture}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="font-bold text-lg text-slate-900 leading-tight">
                  {profileUser?.fullName}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {[
                    profileUser?.age ? `${profileUser.age}` : null,
                    profileUser?.workoutExperience === "first-time"
                      ? "Just starting"
                      : profileUser?.workoutExperience === "regular"
                        ? "Trains regularly"
                        : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Member"}
                </div>
              </div>

              {/* The one number worth surfacing before the nav, the way a wallet
                  balance sits at the top of a dashboard. */}
              {isOwnProfile && (
                <button
                  onClick={() => setShowPlanModal(true)}
                  className="w-full text-left rounded-lg bg-slate-900 text-white px-4 py-3.5 mb-5 hover:bg-slate-800 transition-colors group"
                >
                  <div className="text-xs uppercase tracking-wider text-white/55 font-semibold mb-1.5">
                    Current plan
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl font-bold leading-tight">
                      {getPlan(profileUser?.selectedPlan)?.title || "No plan"}
                    </span>
                    <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">
                      Change
                    </span>
                  </div>
                </button>
              )}

              <nav className="space-y-1.5">
                {[
                  { id: "overview", label: "Overview", icon: User, count: null },
                  { id: "coaches", label: "Saved Coaches", icon: Dumbbell, count: profileUser?.favoriteCoaches?.length || 0 },
                  { id: "videos", label: "Liked Videos", icon: Video, count: profileUser?.likedVideos?.length || 0 },
                  { id: "workouts", label: "My Programs", icon: Calendar, count: profileUser?.enrolledWorkouts?.length || 0 },
                  { id: "meals", label: "Favorite Meals", icon: UtensilsCrossed, count: profileUser?.favoriteMeals?.length || 0 },
                  { id: "blogs", label: "My Blogs", icon: Edit2, count: myBlogs.length },
                  {
                    id: "messages",
                    label: "Messages",
                    icon: MessageSquare,
                    count: conversations.reduce((total, c) => total + (c.unread || 0), 0),
                  },
                ].map((item) => {
                  const ItemIcon = item.icon
                  const active = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-base transition-colors ${
                        active
                          ? "bg-[#354F52] text-white font-semibold"
                          : "text-slate-600 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      <ItemIcon className={`w-5 h-5 shrink-0 ${active ? "" : "text-slate-400"}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.count > 0 && (
                        <span
                          className={`text-sm font-semibold tabular-nums ${active ? "text-white/75" : "text-slate-400"}`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>

              {isOwnProfile && (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full mt-4 pt-4 border-t border-slate-200 flex items-center gap-3.5 px-3.5 py-3 text-base font-medium text-slate-500 hover:text-red-600 transition-colors disabled:opacity-60 disabled:cursor-wait"
                >
                  {loggingOut ? (
                    <span className="w-[18px] h-[18px] rounded-full border-2 border-red-300 border-t-red-500 animate-spin" />
                  ) : (
                    <LogOut size={18} className="text-slate-400" />
                  )}
                  {loggingOut ? "Signing out..." : "Log out"}
                </button>
              )}
            </div>

            {/* One section at a time. */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-[30px] font-bold text-slate-900 tracking-tight">
                      Welcome back, {(profileUser?.fullName || "").split(" ")[0]}
                    </h2>
                    <p className="text-slate-500 mt-1.5 text-base">
                      Here&apos;s what&apos;s happening with your training.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: "workouts", label: "My programs", value: profileUser?.enrolledWorkouts?.length || 0, icon: Calendar, tone: "text-[#52796F] bg-[#52796F]/10" },
                      { id: "coaches", label: "Coaches followed", value: profileUser?.followings?.length || 0, icon: Users, tone: "text-emerald-600 bg-emerald-500/10" },
                      { id: "videos", label: "Liked videos", value: profileUser?.likedVideos?.length || 0, icon: Video, tone: "text-pink-600 bg-pink-500/10" },
                      { id: "messages", label: "Unread messages", value: conversations.reduce((t, c) => t + (c.unread || 0), 0), icon: MessageSquare, tone: "text-amber-600 bg-amber-500/10" },
                    ].map((stat, index) => {
                      const StatIcon = stat.icon
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveTab(stat.id)}
                          className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3.5">
                            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                            <StatIcon className="w-[18px] h-[18px] text-slate-300 shrink-0" />
                          </div>
                          <div className="text-[34px] font-bold text-slate-900 leading-none tabular-nums">
                            {stat.value}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* The one thing to do next. A program you already own beats any
                      generic prompt, so that wins when there is one. */}
                  {profileUser?.enrolledWorkouts?.length > 0 ? (
                    <div className="rounded-lg bg-[#354F52] text-white p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-white/60 text-[13px] mb-2">
                            <Dumbbell className="w-4 h-4" />
                            Continue training
                          </div>
                          <h3 className="text-2xl font-bold truncate">
                            {profileUser.enrolledWorkouts[0].name}
                          </h3>
                          <p className="text-white/70 text-sm mt-1">
                            {profileUser.enrolledWorkouts[0].duration || "Your program"}
                            {profileUser.enrolledWorkouts[0].difficulty
                              ? ` · ${profileUser.enrolledWorkouts[0].difficulty}`
                              : ""}
                          </p>
                        </div>
                        <Link
                          href={`/programs/${profileUser.enrolledWorkouts[0].id}`}
                          className="px-6 py-3 rounded-lg bg-white text-[#354F52] font-bold text-base hover:bg-slate-100 transition-colors shrink-0 text-center"
                        >
                          Open program
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-[#354F52] text-white p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div>
                          <h3 className="text-2xl font-bold mb-1.5">Start your first program</h3>
                          <p className="text-white/70 text-sm">
                            Browse programs built by TrainSight coaches and pick one that fits your goals.
                          </p>
                        </div>
                        <Link
                          href="/services/programs"
                          className="px-6 py-3 rounded-lg bg-white text-[#354F52] font-bold text-base hover:bg-slate-100 transition-colors shrink-0 text-center"
                        >
                          Browse programs
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Coaches you follow, as cards -- the "Recommended for you" row. */}
                  {profileUser?.followings?.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900">Your coaches</h3>
                        <Link href="/coaches" className="text-sm text-[#52796F] hover:text-[#354F52] font-medium">
                          Find more
                        </Link>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {profileUser.followings.slice(0, 4).map((coach) => (
                          <Link
                            key={coach.id}
                            href={`/coaches/${coach.id}`}
                            className="group bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                          >
                            <div className="relative h-32 bg-gradient-to-br from-[#354F52]/10 to-[#52796F]/10">
                              {coach.profilePicture ? (
                                <Image
                                  src={coach.profilePicture}
                                  alt={coach.fullName || "Coach"}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#354F52] font-black text-3xl">
                                  {(coach.fullName || "?").charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <div className="font-semibold text-slate-900 truncate">{coach.fullName}</div>
                              <div className="text-sm text-slate-500 truncate">
                                {coach.subtitle || "Coach"}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {isOwnProfile && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg border border-slate-200 bg-slate-50">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Share your story</h3>
                        <p className="text-slate-500 text-sm">Write a blog post about your fitness journey</p>
                      </div>
                      <button
                        onClick={() => setShowBlogSubmissionForm(true)}
                        className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors shrink-0"
                      >
                        Write a post
                      </button>
                    </div>
                  )}

                  <motion.div 
                    className="flex items-center justify-between mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-3xl font-extrabold bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52] bg-clip-text text-transparent flex items-center gap-3">
                      <User className="w-8 h-8 text-[#52796F]" />
                      Profile Information
                    </h3>
                    {isOwnProfile && !isEditingInfo && (
                      <motion.button
                        onClick={() => setIsEditingInfo(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-xl hover:shadow-xl transition-all flex items-center gap-2 font-bold shadow-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                        Edit Info
                      </motion.button>
                    )}
                    {isEditingInfo && (
                      <div className="flex gap-3">
                        <motion.button
                          onClick={handleSaveInfo}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-xl hover:shadow-xl transition-all flex items-center gap-2 font-bold shadow-lg"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setEditForm({
                              fullName: profileUser?.fullName || "",
                              phone: profileUser?.phone || "",
                              email: profileUser?.email || "",
                              age: profileUser?.age || "",
                              gender: profileUser?.gender || "",
                              workoutExperience: profileUser?.workoutExperience || "",
                              sportsRating: profileUser?.sportsRating || "",
                              weight: profileUser?.weight || "",
                              height: profileUser?.height || "",
                              muscleWeight: profileUser?.muscleWeight || "",
                            })
                            setIsEditingInfo(false)
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all flex items-center gap-2 font-semibold shadow-sm"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </motion.button>
                      </div>
                    )}
                  </motion.div>

                  {isEditingInfo ? (
                    <motion.div 
                      className="grid md:grid-cols-2 gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {[
                        { key: "fullName", label: "Full Name", type: "text", icon: User },
                        { key: "email", label: "Email", type: "email", icon: Mail },
                        { key: "phone", label: "Phone", type: "tel", icon: Phone },
                        { key: "age", label: "Age", type: "number", icon: Calendar },
                        { key: "weight", label: "Weight (kg)", type: "number", icon: Scale },
                        { key: "height", label: "Height (cm)", type: "number", icon: Ruler },
                      ].map((field, index) => {
                        const IconComponent = field.icon;
                        return (
                          <motion.div 
                            key={field.key}
                            className="space-y-2 animate-fadeInUp"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <IconComponent className="w-4 h-4 text-[#52796F]" />
                              {field.label}
                            </label>
                            <div className="relative group">
                        <input
                                type={field.type}
                                value={editForm[field.key]}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md group-focus-within:border-[#52796F]/50"
                              />
                              <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#52796F] transition-colors duration-300" />
                      </div>
                          </motion.div>
                        );
                      })}
                      <motion.div 
                        className="space-y-2 animate-fadeInUp"
                        style={{ animationDelay: '200ms' }}
                      >
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#52796F]" />
                          Gender
                        </label>
                        <div className="relative group">
                        <select
                          value={editForm.gender}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none cursor-pointer"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                      </div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="space-y-2 animate-fadeInUp"
                        style={{ animationDelay: '250ms' }}
                      >
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Dumbbell className="w-4 h-4 text-[#52796F]" />
                          Workout Experience
                        </label>
                        <div className="relative group">
                        <select
                          value={editForm.workoutExperience}
                          onChange={(e) => handleInputChange("workoutExperience", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none cursor-pointer"
                        >
                          <option value="">Select Experience</option>
                          <option value="first-time">First Time</option>
                          <option value="regular">Regular Workout</option>
                        </select>
                          <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                      </div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="space-y-2 animate-fadeInUp"
                        style={{ animationDelay: '300ms' }}
                      >
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Star className="w-4 h-4 text-[#52796F]" />
                          Sports Rating
                        </label>
                        <div className="relative group">
                        <select
                          value={editForm.sportsRating}
                          onChange={(e) => handleInputChange("sportsRating", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none cursor-pointer"
                        >
                          <option value="">Select Rating</option>
                          <option value="1">1 - Beginner</option>
                          <option value="2">2 - Novice</option>
                          <option value="3">3 - Intermediate</option>
                          <option value="4">4 - Advanced</option>
                          <option value="5">5 - Expert</option>
                        </select>
                          <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                      </div>
                    </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { 
                          key: "gender", 
                          label: "Gender", 
                          value: profileUser?.gender ? profileUser.gender.charAt(0).toUpperCase() + profileUser.gender.slice(1) : "Not specified",
                          icon: Users,
                        },
                        { 
                          key: "age", 
                          label: "Age", 
                          value: profileUser?.age ? `${profileUser.age} years` : "Not specified",
                          icon: Calendar,
                        },
                        {
                          key: "weight",
                          label: "Weight",
                          value: profileUser?.weight ? `${profileUser.weight} kg` : "Not specified",
                          icon: Scale,
                        },
                        {
                          key: "height",
                          label: "Height",
                          value: profileUser?.height ? `${profileUser.height} cm` : "Not specified",
                          icon: Ruler,
                        },
                        { 
                          key: "workoutExperience", 
                          label: "Workout Experience", 
                          value: profileUser?.workoutExperience === "first-time"
                            ? "First Time"
                            : profileUser?.workoutExperience === "regular"
                              ? "Regular Workout"
                              : "Not specified",
                          icon: Dumbbell,
                        },
                        { 
                          key: "sportsRating", 
                          label: "Sports Rating", 
                          value: profileUser?.sportsRating,
                          icon: Star,
                          isRating: true
                        },
                      ].map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <motion.div
                            key={item.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#52796F]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative z-10">
                              <div className="text-sm text-slate-600 mb-2 font-bold flex items-center gap-2">
                                <IconComponent className="w-4 h-4 text-[#52796F]" />
                                {item.label}
                        </div>
                              <div className="font-extrabold text-slate-800 text-xl flex items-center gap-2">
                                {item.isRating && item.value ? (
                                  <>
                                    <Star className="w-6 h-6 text-[#52796F] fill-[#52796F]" />
                                    {item.value}/5
                            </>
                          ) : (
                                  item.value
                          )}
                        </div>
                      </div>
                          </motion.div>
                        );
                      })}
                      {isOwnProfile && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#52796F]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="relative z-10">
                              <div className="text-sm text-slate-600 mb-2 font-bold flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#52796F]" />
                              Email (Private)
                            </div>
                              <div className="font-extrabold text-slate-800 text-lg break-all">{profileUser?.email}</div>
                          </div>
                          </motion.div>
                          {profileUser?.phone && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#52796F]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              <div className="relative z-10">
                                <div className="text-sm text-slate-600 mb-2 font-bold flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-[#52796F]" />
                                Phone (Private)
                              </div>
                                <div className="font-extrabold text-slate-800 text-lg">{profileUser.phone}</div>
                            </div>
                            </motion.div>
                          )}
                        </>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="p-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#52796F]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-sm text-slate-600 mb-2 font-bold">Plan</div>
                              <div className="font-extrabold text-slate-800 text-lg">
                                {getPlan(profileUser?.selectedPlan)?.title || "Not selected"}
                              </div>
                            </div>
                            {isOwnProfile && (
                              <motion.button
                                onClick={() => setShowPlanModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-[#52796F] text-white rounded-xl hover:bg-[#354F52] transition-colors text-sm font-bold whitespace-nowrap"
                              >
                                Change Plan
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "coaches" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Followed Coaches</h3>
                    {isOwnProfile && (
                      <motion.button
                        onClick={() => handlePrivacyToggle("coaches")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                          privacySettings.coaches === "public"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl"
                            : "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:shadow-xl"
                        }`}
                      >
                        {privacySettings.coaches === "public" ? (
                          <>
                            <Unlock className="w-5 h-5" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            Private
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                  {isContentVisible("coaches") ? (
                    profileUser?.favoriteCoaches && profileUser.favoriteCoaches.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profileUser.favoriteCoaches.map((coach, index) => (
                          <motion.div
                            key={coach.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            
                            {/* Coach Image/Avatar */}
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                              {coach.image ? (
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#52796F]/30 shadow-lg group-hover:scale-110 transition-transform">
                                  <img 
                                    src={coach.image} 
                                    alt={coach.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = `
                                        <div class="w-16 h-16 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-full flex items-center justify-center shadow-lg">
                                          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                          </svg>
                                        </div>
                                      `;
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <Dumbbell className="w-8 h-8 text-white" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-bold text-slate-800 text-xl mb-1">{coach.name || "Coach"}</div>
                                <div className="text-sm text-slate-600 font-semibold">{coach.category || "General"}</div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 relative z-10">
                              <Link
                                href={`/coaches/${coach.id}`}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold text-center"
                              >
                                View Profile
                              </Link>
                              {isOwnProfile && (
                                <motion.button
                                  onClick={() => handleUnfavoriteCoach(coach)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all text-sm font-bold"
                                >
                                  Unfollow
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Dumbbell className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-slate-600 text-xl font-semibold mb-2">No Followed Coaches yet</p>
                        {isOwnProfile && (
                          <p className="text-slate-400 text-sm">Start following coaches to see them here!</p>
                        )}
                      </motion.div>
                    )
                  ) : (
                    <motion.div 
                      className="text-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-slate-600 text-xl font-semibold mb-2">This section is private</p>
                      <p className="text-slate-400 text-sm">The user has chosen to keep this information private</p>
                    </motion.div>
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
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="flex items-center gap-3 mb-2 relative z-10">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-white fill-white" />
                              </div>
                              <div className="font-bold text-slate-800 text-lg">{video.title || "Video"}</div>
                            </div>
                            <div className="text-sm text-slate-600 font-semibold relative z-10">{video.coach || "Unknown"}</div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart className="w-20 h-20 text-slate-300 mx-auto mb-4 fill-slate-300" />
                        </motion.div>
                        <p className="text-slate-600 text-xl font-semibold mb-2">No liked videos yet</p>
                        {isOwnProfile && <p className="text-slate-400 text-sm">Like videos to see them here!</p>}
                      </motion.div>
                    )
                  ) : (
                    <motion.div 
                      className="text-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-slate-600 text-xl font-semibold mb-2">This section is private</p>
                      <p className="text-slate-400 text-sm">The user has chosen to keep this information private</p>
                    </motion.div>
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
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <div className="flex items-start gap-4 relative z-10">
                              <motion.div 
                                className="w-16 h-16 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Calendar className="w-8 h-8 text-white" />
                              </motion.div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="font-extrabold text-slate-800 text-xl">
                                    {workout.name || "Workout Program"}
                                  </div>
                                  {workout.id && (
                                    <Link
                                      href={`/programs/${workout.id}`}
                                      className="shrink-0 px-3 py-1.5 rounded-lg bg-[#52796F] text-white text-xs font-bold hover:bg-[#354F52] transition-colors"
                                    >
                                      Open
                                    </Link>
                                  )}
                                </div>
                                {workout.purchasedAt && (
                                  <div className="text-xs text-slate-400 mb-2">
                                    Bought {new Date(workout.purchasedAt).toLocaleDateString()}
                                  </div>
                                )}
                                <div className="text-sm text-slate-600 mb-4 font-medium">
                                  {workout.description || "Build strength and endurance"}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                  <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-semibold">{workout.duration || "8 weeks"}</span>
                                  </div>
                                  <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-lg">
                                    <Dumbbell className="w-3 h-3" />
                                    <span className="font-semibold">{workout.difficulty || "Intermediate"}</span>
                                  </div>
                                </div>
                                {workout.progress && (
                                  <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2 font-semibold">
                                      <span>Progress</span>
                                      <span className="font-bold">{workout.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                                      <motion.div
                                        className="bg-gradient-to-r from-[#52796F] to-[#354F52] h-3 rounded-full shadow-lg"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${workout.progress}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                      ></motion.div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-slate-600 text-xl font-semibold mb-2">No enrolled workouts yet</p>
                        {isOwnProfile && (
                          <Link
                            href="/services/programs"
                            className="inline-flex mt-4 px-5 py-2.5 rounded-xl bg-[#52796F] text-white font-semibold hover:bg-[#354F52] transition-colors"
                          >
                            Browse programs
                          </Link>
                        )}
                        {isOwnProfile && (
                          <p className="text-slate-400 text-sm">Start a workout program to see it here!</p>
                        )}
                      </motion.div>
                    )
                  ) : (
                    <motion.div 
                      className="text-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-slate-600 text-xl font-semibold mb-2">This section is private</p>
                      <p className="text-slate-400 text-sm">The user has chosen to keep this information private</p>
                    </motion.div>
                  )}
                    </div>
              )}

              {activeTab === "blogs" && (
                <div>
                  <div className="flex items-center justify-between mb-6 gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">My Blogs</h3>
                      <p className="text-slate-500 mt-1">
                        Posts you submitted, and where each one stands.
                      </p>
                    </div>
                    {isOwnProfile && (
                      <button
                        onClick={() => setShowBlogSubmissionForm(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#354F52] text-white font-bold hover:bg-[#52796F] transition-colors shrink-0"
                      >
                        Write one
                      </button>
                    )}
                  </div>

                  {blogsLoading && myBlogs.length === 0 ? (
                    <p className="text-slate-500">Loading…</p>
                  ) : myBlogs.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <Edit2 className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 text-xl font-semibold mb-2">No blogs yet</p>
                      <p className="text-slate-400">
                        Share what has worked for you. An admin reviews each post before it goes live.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myBlogs.map((blog, index) => (
                        <div
                          key={blog.id || index}
                          className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-shadow"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-bold text-slate-800">{blog.title || "Untitled"}</span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  blog.status === "published"
                                    ? "bg-[#6BB371] text-white"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {blog.status === "published" ? "Published" : "Awaiting review"}
                              </span>
                            </div>
                            {blog.excerpt && (
                              <p className="text-sm text-slate-500 line-clamp-2">{blog.excerpt}</p>
                            )}
                            <div className="text-xs text-slate-400 mt-2">
                              {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ""}
                              {blog.category ? ` · ${blog.category}` : ""}
                            </div>
                          </div>
                          {blog.status === "published" && blog.id && (
                            <Link
                              href={`/blog/${blog.id}`}
                              className="shrink-0 px-4 py-2 rounded-lg bg-[#52796F] text-white text-sm font-bold hover:bg-[#354F52] transition-colors"
                            >
                              Read
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "messages" && (
                <div>
                  <div className="flex items-center justify-between mb-6 gap-4">
                    <h3 className="text-2xl font-bold text-slate-800">
                      {openThread ? openThread.name : "Messages"}
                    </h3>
                    {openThread ? (
                      <button
                        onClick={() => {
                          setOpenThread(null)
                          setThreadMessages([])
                        }}
                        className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors shrink-0"
                      >
                        All conversations
                      </button>
                    ) : (
                      <button
                        onClick={loadConversations}
                        className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors shrink-0"
                      >
                        Refresh
                      </button>
                    )}
                  </div>

                  {openThread ? (
                    threadLoading ? (
                      <p className="text-slate-500">Loading…</p>
                    ) : (
                      <>
                        <div className="space-y-3 mb-6">
                          {threadMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`max-w-[85%] p-4 rounded-2xl ${
                                message.fromMe
                                  ? "ml-auto bg-[#52796F] text-white rounded-br-md"
                                  : "bg-slate-100 text-slate-800 rounded-bl-md"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                              <div
                                className={`text-[11px] mt-1 ${
                                  message.fromMe ? "text-white/70" : "text-slate-400"
                                }`}
                              >
                                {message.createdAt
                                  ? new Date(message.createdAt).toLocaleString()
                                  : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link
                          href={`/coaches/${openThread.id}`}
                          className="inline-flex px-5 py-2.5 rounded-xl bg-[#52796F] text-white font-semibold hover:bg-[#354F52] transition-colors"
                        >
                          Send another message
                        </Link>
                      </>
                    )
                  ) : conversations.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <MessageSquare className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600 text-xl font-semibold mb-2">No messages yet</p>
                      <p className="text-slate-400 mb-4">
                        Open a coach&apos;s profile and use the Message button to start a conversation.
                      </p>
                      <Link
                        href="/coaches"
                        className="inline-flex px-5 py-2.5 rounded-xl bg-[#52796F] text-white font-semibold hover:bg-[#354F52] transition-colors"
                      >
                        Find a coach
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conversations.map((conversation) => (
                        <button
                          key={conversation.otherId}
                          onClick={() => openConversation(conversation.contact)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-[#52796F]/40 hover:shadow-md transition-all text-left"
                        >
                          <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-[#52796F]/10">
                            {conversation.contact?.picture ? (
                              <Image
                                src={conversation.contact.picture}
                                alt={conversation.contact.name || "Coach"}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#354F52] font-bold">
                                {(conversation.contact?.name || "?").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 truncate">
                                {conversation.contact?.name || "Coach"}
                              </span>
                              {conversation.unread > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-[#6BB371] text-white text-[11px] font-bold shrink-0">
                                  {conversation.unread} new
                                </span>
                              )}
                              <span className="text-xs text-slate-400 ml-auto shrink-0">
                                {conversation.lastAt
                                  ? new Date(conversation.lastAt).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 truncate">{conversation.lastMessage}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "meals" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Favorite Meals</h3>
                    {isOwnProfile && (
                      <motion.button
                        onClick={() => handlePrivacyToggle("meals")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                          privacySettings.meals === "public"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl"
                            : "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:shadow-xl"
                        }`}
                      >
                        {privacySettings.meals === "public" ? (
                          <>
                            <Unlock className="w-5 h-5" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            Private
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                  {isContentVisible("meals") ? (
                    profileUser?.favoriteMeals && profileUser.favoriteMeals.length > 0 ? (
                      <div className="space-y-8">
                        {(() => {
                          // Group meals by category
                          const mealsByCategory = {
                            breakfast: profileUser.favoriteMeals.filter(m => m.mealType === "breakfast"),
                            lunch: profileUser.favoriteMeals.filter(m => m.mealType === "lunch"),
                            dinner: profileUser.favoriteMeals.filter(m => m.mealType === "dinner"),
                            snacks: profileUser.favoriteMeals.filter(m => m.mealType === "snacks"),
                          };

                          const categoryConfig = [
                            { id: "breakfast", label: "Breakfast", icon: Coffee, color: "from-orange-500 to-amber-600" },
                            { id: "lunch", label: "Lunch", icon: Sun, color: "from-yellow-500 to-orange-500" },
                            { id: "dinner", label: "Dinner", icon: Moon, color: "from-purple-500 to-indigo-600" },
                            { id: "snacks", label: "Snacks", icon: Cookie, color: "from-pink-500 to-rose-600" },
                          ];

                          return categoryConfig.map((category) => {
                            const categoryMeals = mealsByCategory[category.id];
                            if (!categoryMeals || categoryMeals.length === 0) return null;

                            const Icon = category.icon;
                            return (
                              <div key={category.id} className="space-y-4">
                                {/* Category Header */}
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-3 pb-2 border-b-2 border-slate-200"
                                >
                                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                  </div>
                                  <h4 className="text-2xl font-bold text-slate-800">
                                    {category.label}
                                  </h4>
                                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                    {categoryMeals.length} {categoryMeals.length === 1 ? 'meal' : 'meals'}
                                  </span>
                                </motion.div>

                                {/* Meals Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {categoryMeals.map((meal, index) => (
                                    <motion.div
                                      key={meal.id || index}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      whileHover={{ scale: 1.02, y: -5 }}
                                      className="bg-white rounded-2xl border-2 border-slate-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                                    >
                            {/* Meal Image */}
                            {meal.image && (
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={meal.image}
                                  alt={meal.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Meal+Image'; }}
                                />
                                {isOwnProfile && (
                                  <button
                                    onClick={() => handleUnlikeMeal(meal.id)}
                                    className="absolute top-3 right-3 p-2 bg-red-500/90 text-white rounded-full backdrop-blur-sm hover:bg-red-600 transition-all shadow-lg"
                                  >
                                    <Heart className="w-4 h-4 fill-current" />
                                  </button>
                                )}
                              </div>
                            )}
                            
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-extrabold text-slate-800 text-xl mb-1">
                                    {meal.name || "Meal"}
                                  </h4>
                                  <p className="text-sm text-slate-600 mb-3">
                                    {meal.description || "Delicious and nutritious meal"}
                                  </p>
                                </div>
                                {!meal.image && isOwnProfile && (
                                  <button
                                    onClick={() => handleUnlikeMeal(meal.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"
                                  >
                                    <Heart className="w-5 h-5 fill-current" />
                                  </button>
                                )}
                              </div>

                              {/* Nutritional Info */}
                              {meal.calories && (
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                  <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                    <Zap className="w-3 h-3 text-emerald-600" />
                                    <span className="font-semibold text-emerald-700 text-xs">{meal.calories} cal</span>
                                  </div>
                                  {meal.protein && (
                                    <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                                      <span className="font-semibold text-blue-700 text-xs">{meal.protein}g protein</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Comment Section */}
                              {isOwnProfile && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                  {editingComment === meal.id ? (
                                    <div className="space-y-2">
                                      <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment about this recipe..."
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                        rows="3"
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleSaveComment(meal.id)}
                                          className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all text-sm"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingComment(null);
                                            setCommentText("");
                                          }}
                                          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all text-sm"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      {meal.comment ? (
                                        <div className="mb-2">
                                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg mb-2">
                                            {meal.comment}
                                          </p>
                                          <button
                                            onClick={() => {
                                              setEditingComment(meal.id);
                                              setCommentText(meal.comment || "");
                                            }}
                                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                            Edit comment
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setEditingComment(meal.id);
                                            setCommentText("");
                                          }}
                                          className="w-full text-sm text-slate-600 hover:text-emerald-600 font-medium flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-lg hover:border-emerald-300 transition-all"
                                        >
                                          <MessageSquare className="w-4 h-4" />
                                          Add a comment
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                                    </div>
                                  </motion.div>
                                  ))}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    ) : (
                      <motion.div 
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <UtensilsCrossed className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-slate-600 text-xl font-semibold mb-2">No favorite meals yet</p>
                        {isOwnProfile && (
                          <p className="text-slate-400 text-sm">Like meals to see them here!</p>
                        )}
                      </motion.div>
                    )
                  ) : (
                    <motion.div 
                      className="text-center py-16"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-slate-600 text-xl font-semibold mb-2">This section is private</p>
                      <p className="text-slate-400 text-sm">The user has chosen to keep this information private</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
            </div>
          </div>

          {showPlanModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => !savingPlan && setShowPlanModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-white/20"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-2 bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52]"></div>
                <div className="bg-gradient-to-r from-[#354F52] to-[#52796F] p-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Choose Your Plan</h3>
                  <button
                    onClick={() => setShowPlanModal(false)}
                    disabled={savingPlan}
                    className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 space-y-3">
                  {PLANS.map((plan) => {
                    const current = profileUser?.selectedPlan === plan.value
                    return (
                      <button
                        key={plan.value}
                        onClick={() => handleChangePlan(plan.value)}
                        disabled={savingPlan || current}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                          current
                            ? "border-[#52796F] bg-[#52796F]/10 cursor-default"
                            : "border-slate-200 hover:border-[#52796F] hover:bg-slate-50 disabled:opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{plan.title}</span>
                          <span className="text-sm font-bold text-[#52796F]">{plan.subtitle}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{plan.description}</p>
                        {current && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#52796F]">
                            <Check className="w-3 h-3" /> Current plan
                          </span>
                        )}
                      </button>
                    )
                  })}
                  <p className="text-xs text-slate-400 text-center pt-2">
                    Payment is not set up yet, so switching applies immediately.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showFollowModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setShowFollowModal(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden border-2 border-white/20"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-2 bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#354F52]"></div>
                <div className="bg-gradient-to-r from-[#354F52] to-[#52796F] p-6 flex items-center justify-between relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2 relative z-10">
                    <Users className="w-6 h-6" />
                    {showFollowModal === "followers" ? "Followers" : "Following"}
                  </h3>
                  <motion.button
                    onClick={() => setShowFollowModal(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all relative z-10"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                  {((showFollowModal === "followers" ? profileUser?.followers : profileUser?.followings) || []).length >
                  0 ? (
                    <div className="space-y-3">
                      {(showFollowModal === "followers" ? profileUser?.followers : profileUser?.followings).map(
                        (user, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl hover:shadow-xl transition-all duration-300 border-2 border-slate-200/50 group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            {user.profilePicture ? (
                              <Image
                                src={user.profilePicture || "/placeholder.svg"}
                                alt={user.fullName || "User"}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#52796F]/30 shadow-md group-hover:scale-110 transition-transform relative z-10"
                                unoptimized
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#354F52] to-[#52796F] flex items-center justify-center ring-2 ring-[#52796F]/30 shadow-md group-hover:scale-110 transition-transform relative z-10">
                                <User className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div className="flex-1 relative z-10">
                              <div className="font-bold text-slate-800 text-lg">{user.fullName || "User"}</div>
                              {user.bio && <div className="text-sm text-slate-600 line-clamp-1">{user.bio}</div>}
                            </div>
                            <Link
                              href={`/profile/${user.id}`}
                              className="px-4 py-2 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold relative z-10"
                            >
                              View
                            </Link>
                          </motion.div>
                        ),
                      )}
                    </div>
                  ) : (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Users className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-slate-600 text-xl font-semibold mb-2">
                        No {showFollowModal === "followers" ? "followers" : "following"} yet
                      </p>
                      {isOwnProfile && (
                        <p className="text-slate-400 text-sm">Connect with other members to grow your network!</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      {/* Blog Submission Form Modal */}
      {showBlogSubmissionForm && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowBlogSubmissionForm(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#354F52] to-[#52796F] p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Edit2 className="w-7 h-7" />
                  Submit Your Blog Post
                </h3>
                <motion.button
                  onClick={() => setShowBlogSubmissionForm(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              <p className="text-white/80 text-sm mt-2">Your blog will be reviewed by our team before publishing</p>
            </div>

            <form onSubmit={handleSubmitBlog} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-[#354F52]">Title *</label>
                <input
                  type="text"
                  value={blogSubmissionForm.title}
                  onChange={(e) => setBlogSubmissionForm({ ...blogSubmissionForm, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                  placeholder="Enter your blog title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-[#354F52]">Excerpt *</label>
                <textarea
                  value={blogSubmissionForm.excerpt}
                  onChange={(e) => setBlogSubmissionForm({ ...blogSubmissionForm, excerpt: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none resize-none transition-all"
                  rows="3"
                  placeholder="Brief description of your blog post..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-[#354F52]">Author Name</label>
                  <input
                    type="text"
                    value={blogSubmissionForm.author}
                    onChange={(e) => setBlogSubmissionForm({ ...blogSubmissionForm, author: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                    placeholder={currentUser?.fullName || "Your name"}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to use your profile name</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-[#354F52]">Read Time</label>
                  <input
                    type="text"
                    value={blogSubmissionForm.readTime}
                    onChange={(e) => setBlogSubmissionForm({ ...blogSubmissionForm, readTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-[#354F52]">Category *</label>
                <select
                  value={blogSubmissionForm.category}
                  onChange={(e) => setBlogSubmissionForm({ ...blogSubmissionForm, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                  required
                >
                  <option value="training">Training</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="technology">Technology</option>
                  <option value="wellness">Wellness</option>
                  <option value="mindset">Mindset</option>
                  <option value="progress">Progress</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-[#354F52]">Image URL</label>
                <input
                  type="text"
                  value={blogSubmissionForm.image}
                  onChange={(e) => setBlogSubmissionForm({ ...blogSubmissionForm, image: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52796F] focus:border-[#52796F] outline-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-[#354F52]">Content Sections *</label>
                  <motion.button
                    type="button"
                    onClick={addBlogSection}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#52796F] hover:text-[#354F52] font-bold text-sm flex items-center gap-1 bg-[#52796F]/10 px-3 py-1.5 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  {blogSubmissionForm.sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-white"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-[#354F52]">Section {index + 1}</span>
                        {blogSubmissionForm.sections.length > 1 && (
                          <motion.button
                            type="button"
                            onClick={() => removeBlogSection(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </motion.button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-600">Section Title</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateBlogSection(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none"
                            placeholder="e.g., Introduction, Key Benefits..."
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-600">Section Content</label>
                          <textarea
                            value={section.content}
                            onChange={(e) => updateBlogSection(index, 'content', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#52796F] focus:border-transparent outline-none resize-none"
                            rows="6"
                            placeholder="Write the content for this section..."
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-[#52796F] to-[#354F52] text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Submit for Review
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setShowBlogSubmissionForm(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
 