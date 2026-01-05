"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaStar,
  FaDumbbell,
  FaRunning,
  FaLeaf,
  FaCertificate,
  FaVideo,
  FaBell,
  FaUserPlus,
  FaEnvelope,
  FaFlag,
  FaChevronLeft,
  FaPlay,
} from "react-icons/fa";

import picture1 from "../assets/picture1.png";
import picture2 from "../assets/picture2.png";
import picture3 from "../assets/picture3.png";

// --- Modal components ---
function MessageModalContent({ onSend, onClose }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return alert("Please enter a message");
    setSubmitting(true);
    try {
      await onSend(message);
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#354F52] mb-4"
        placeholder="Type your message..."
      />
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={submitting}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || !message.trim()}
          className="flex-1 px-4 py-2 bg-[#354F52] text-white rounded-lg hover:bg-[#52796F] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending..." : "Send"}
        </button>
      </div>
    </>
  );
}

function ReportModalContent({ onSubmit, onClose }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) return alert("Please select a reason");
    setSubmitting(true);
    try {
      await onSubmit(reason, description);
      setReason("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <p className="text-gray-600 mb-4">Please select a reason for reporting:</p>
      <div className="space-y-2 mb-4">
        {["Inappropriate content", "Spam", "Harassment", "Other"].map((r) => (
          <label
            key={r}
            className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name="report"
              value={r}
              checked={reason === r}
              onChange={(e) => setReason(e.target.value)}
            />
            <span>{r}</span>
          </label>
        ))}
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#354F52] mb-4"
        placeholder="Additional details (optional)..."
      />
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={submitting}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || !reason}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </>
  );
}

// Mock fallback data (used if API fails)
const mockCoaches = {
  sami: {
    id: "sami",
    name: "Sami",
    category: "Strength",
    image: picture1,
    bio: "Expert in strength and conditioning with over 10 years of experience.",
    rating: 4.8,
    totalRatings: 127,
    followers: 1250,
    following: 340,
    certifications: [
      { name: "NASM Certified Personal Trainer", year: "2015" },
      { name: "NSCA Strength and Conditioning Specialist", year: "2017" },
    ],
    videos: [
      { id: 1, title: "Deadlift Form Tutorial", thumbnail: picture1, views: 12500, likes: 890, duration: "8:30" },
    ],
    announcements: [{ id: 1, title: "New Strength Program", date: "2024-01-15", content: "Join my 12-week program." }],
    comments: [{ id: 1, user: "John Doe", rating: 5, text: "Great coach!", date: "2024-01-10" }],
  },
};

export default function CoachProfile({ coachId }) {
  const router = useRouter();
  const [coach, setCoach] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryIcons = {
    Strength: <FaDumbbell />,
    Cardio: <FaRunning />,
    Yoga: <FaLeaf />,
  };

  useEffect(() => {
  fetchCoachData();
  checkFollowStatus();
  
  // Listen for storage changes and user updates
  const handleStorageChange = () => {
    checkFollowStatus();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userUpdated", handleStorageChange);
    };
  }, [coachId]);


  const fetchCoachData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/coaches/${coachId}`);
      if (!res.ok) throw new Error("Failed to fetch coach data");
      const data = await res.json();
      setCoach({
        ...data,
        videos: data.videos || [],
        certifications: data.certifications || [],
        announcements: data.announcements || [],
        comments: data.comments || [],
        followers_count: data.followers_count ?? 0,
        following_count: data.following_count ?? 0,
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
      const fallback = mockCoaches[coachId] || mockCoaches["sami"];
      if (fallback) setCoach(fallback);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      if (typeof window !== "undefined") {
        const currentUser = localStorage.getItem("trainsight_current_user");
        if (currentUser) {
          const user = JSON.parse(currentUser);
          
          // Check localStorage directly for favoriteCoaches
          const favoriteCoaches = user.favoriteCoaches || [];
          const isFollowingLocally = favoriteCoaches.some(
            c => c.id === coachId || c.id === coach?.id
          );
          setIsFollowing(isFollowingLocally);
        } else {
          setIsFollowing(false);
        }
      }
    } catch (err) {
      console.error("Follow status error", err);
      setIsFollowing(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (typeof window !== "undefined") {
        const currentUser = localStorage.getItem("trainsight_current_user");
        if (!currentUser) return alert("Please log in to follow coaches");
        const user = JSON.parse(currentUser);
        const action = isFollowing ? "unfollow" : "follow";
        
        const res = await fetch(`/api/coaches/${coachId}/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, action }),
        });
        
        if (!res.ok) throw new Error("Failed to update follow status");
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        
        if (coach) {
          setCoach({
            ...coach,
            followers_count: data.isFollowing
              ? (coach.followers_count || 0) + 1
              : Math.max(0, (coach.followers_count || 0) - 1),
          });
        }

        if (data.isFollowing) {
          // Add coach to favoriteCoaches
          const updatedUser = {
            ...user,
            favoriteCoaches: [
              ...(user.favoriteCoaches || []),
              {
                id: coach.id,
                name: coach.name,
                category: coach.category,
                image: coach.image_url || coach.image
              }
            ]
          };
          localStorage.setItem("trainsight_current_user", JSON.stringify(updatedUser));
          
          // Update in users array
          const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]");
          const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
          localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers));
          
          window.dispatchEvent(new Event("userUpdated"));
        } else {
          // Remove coach from favoriteCoaches
          const updatedUser = {
            ...user,
            favoriteCoaches: (user.favoriteCoaches || []).filter(c => c.id !== coach.id)
          };
          localStorage.setItem("trainsight_current_user", JSON.stringify(updatedUser));
          
          // Update in users array
          const users = JSON.parse(localStorage.getItem("trainsight_users") || "[]");
          const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
          localStorage.setItem("trainsight_users", JSON.stringify(updatedUsers));
          
          window.dispatchEvent(new Event("userUpdated"));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update follow status");
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;
    if (typeof window !== "undefined") {
      const currentUser = localStorage.getItem("trainsight_current_user");
      if (!currentUser) return alert("Please log in to send messages");
      const user = JSON.parse(currentUser);
      const res = await fetch(`/api/coaches/${coachId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, content }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      alert("Message sent!");
      setShowMessageModal(false);
    }
  };

  const handleSubmitReport = async (reason, description) => {
    if (!reason) return;
    if (typeof window !== "undefined") {
      const currentUser = localStorage.getItem("trainsight_current_user");
      if (!currentUser) return alert("Please log in to report");
      const user = JSON.parse(currentUser);
      const res = await fetch(`/api/coaches/${coachId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, reason, description }),
      });
      if (!res.ok) throw new Error("Failed to submit report");
      alert("Report submitted. Thank you.");
      setShowReportModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#C8CDC5]/10 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#354F52] mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-[#354F52]">Loading coach profile...</div>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#C8CDC5]/10 to-white">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#354F52] mb-4">Coach not found</div>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#354F52] text-white rounded-lg hover:bg-[#52796F] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#C8CDC5]/10 to-white">
      {/* Header with Back Button */}
      <div className="bg-[#354F52] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:text-[#6BB371] transition-colors"
          >
            <FaChevronLeft />
            <span>Back to Coaches</span>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <section className="bg-gradient-to-br from-[#354F52] to-[#52796F] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src={coach.image_url || coach.image || "/placeholder.svg"}
                  alt={coach.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#6BB371] rounded-full flex items-center justify-center text-white text-xl border-4 border-[#354F52]">
                {categoryIcons[coach.category] || <FaDumbbell />}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{coach.name}</h1>
              <p className="text-xl text-white/90 mb-4">{coach.category} Coach</p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(coach.rating || 0) ? "text-yellow-400" : "text-white/30"}
                      size={20}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{coach.rating || 0}</span>
                <span className="text-white/70">({coach.total_ratings || coach.totalRatings || 0} reviews)</span>
              </div>

              <div className="flex gap-6 mb-6">
                <div>
                  <div className="text-2xl font-bold">{(coach.followers_count || coach.followers || 0).toLocaleString()}</div>
                  <div className="text-sm text-white/80">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{coach.following_count || coach.following || 0}</div>
                  <div className="text-sm text-white/80">Following</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{coach.videos?.length || 0}</div>
                  <div className="text-sm text-white/80">Videos</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    isFollowing ? "bg-white text-[#354F52] hover:bg-white/90" : "bg-[#6BB371] text-white hover:bg-[#52796F]"
                  }`}
                >
                  <FaUserPlus />
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/30"
                >
                  <FaEnvelope />
                  Message
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/30"
                >
                  <FaFlag />
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[60px] z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex gap-8 overflow-x-auto">
            {["overview", "videos", "announcements", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold capitalize border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab ? "border-[#354F52] text-[#354F52]" : "border-transparent text-gray-600 hover:text-[#354F52]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-[#C8CDC5]/50 mb-6">
                <h2 className="text-2xl font-bold text-[#354F52] mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-[#C8CDC5]/50">
                <h2 className="text-2xl font-bold text-[#354F52] mb-4 flex items-center gap-2">
                  <FaCertificate className="text-[#52796F]" />
                  Certifications
                </h2>
                <div className="space-y-4">
                  {(coach.certifications || []).map((cert, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-[#C8CDC5]/20 rounded-lg">
                      <div className="w-10 h-10 bg-[#354F52] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        <FaCertificate />
                      </div>
                      <div>
                        <div className="font-semibold text-[#354F52]">{cert.name}</div>
                        <div className="text-sm text-gray-600">Certified in {cert.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-[#C8CDC5]/50">
                <h3 className="text-xl font-bold text-[#354F52] mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Videos</span>
                    <span className="font-bold text-[#354F52]">{coach.videos?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-bold text-[#354F52]">
                      {(coach.videos || []).reduce((sum, v) => sum + (v.views || 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-bold text-[#354F52]">{coach.rating || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "videos" && (
          <div>
            <h2 className="text-3xl font-bold text-[#354F52] mb-6">Uploaded Videos</h2>
            {coach.videos?.length ? (
              <div className="grid md:grid-cols-3 gap-6">
                {coach.videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#C8CDC5]/50 hover:shadow-xl transition-all group cursor-pointer"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-[#354F52] to-[#52796F]">
                      <Image
                        src={video.thumbnail || picture1}
                        alt={video.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FaPlay className="text-[#354F52] ml-1" size={24} />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration || "0:00"}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#354F52] mb-2">{video.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{(video.views || 0).toLocaleString()} views</span>
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" size={12} />
                          {video.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-[#C8CDC5]/50">
                <FaVideo className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600">No videos uploaded yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "announcements" && (
          <div>
            <h2 className="text-3xl font-bold text-[#354F52] mb-6 flex items-center gap-2">
              <FaBell className="text-[#52796F]" />
              Upcoming Announcements
            </h2>
            {coach.announcements?.length ? (
              <div className="space-y-4">
                {coach.announcements.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white rounded-xl p-6 shadow-lg border border-[#C8CDC5]/50 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#354F52]">{a.title}</h3>
                      <span className="text-sm text-gray-500">{a.date}</span>
                    </div>
                    <p className="text-gray-700">{a.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-[#C8CDC5]/50">
                <FaBell className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-600">No announcements at the moment</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2 className="text-3xl font-bold text-[#354F52] mb-6">Comments & Ratings</h2>
            {coach.comments?.length ? (
              <div className="space-y-4">
                {coach.comments.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl p-6 shadow-lg border border-[#C8CDC5]/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-full flex items-center justify-center text-white font-bold">
                          {(c.user || "A")[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-[#354F52]">{c.user || "Anonymous"}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < (c.rating || 0) ? "text-yellow-400" : "text-gray-300"} size={14} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{c.date}</span>
                    </div>
                    <p className="text-gray-700">{c.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-[#C8CDC5]/50">
                <p className="text-gray-600">No reviews yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-[#354F52] mb-4">Send Message</h3>
            <MessageModalContent onSend={handleSendMessage} onClose={() => setShowMessageModal(false)} />
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-[#354F52] mb-4">Report Coach</h3>
            <ReportModalContent onSubmit={handleSubmitReport} onClose={() => setShowReportModal(false)} />
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="bg-black rounded-xl overflow-hidden max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-[#354F52] text-white">
              <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-white hover:text-gray-300 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                src={selectedVideo.video_url || selectedVideo.videoUrl}
                controls
                autoPlay
                className="absolute inset-0 w-full h-full"
                onError={(e) => {
                  console.error("Video playback error:", e);
                  alert("Failed to load video. Please check the video URL.");
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{(selectedVideo.views || 0).toLocaleString()} views</span>
                <span className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" size={12} />
                  {selectedVideo.likes || 0} likes
                </span>
                <span>{selectedVideo.duration || "0:00"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

