"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCog,
  Video,
  UtensilsCrossed,
  Dumbbell,
  Menu,
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X as XIcon,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [videos, setVideos] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form states
  const [showCoachForm, setShowCoachForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form data
  const [coachForm, setCoachForm] = useState({ id: "", name: "", category: "", bio: "", image_url: "" });
  const [videoForm, setVideoForm] = useState({ title: "", description: "", video_url: "", thumbnail_url: "", bio: "", price: 0, discount: false, discount_percentage: 0 });
  const [nutritionForm, setNutritionForm] = useState({ name: "", description: "", duration: "", meals: [], price: 0, discount: false, discount_percentage: 0 });
  const [programForm, setProgramForm] = useState({ name: "", description: "", duration: "", schedule: [], exercises: [], price: 0, discount: false, discount_percentage: 0 });

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSection === "users") {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) setUsers(data.users || []);
      } else if (activeSection === "coaches") {
        const res = await fetch("/api/coaches");
        const data = await res.json();
        if (data.success) setCoaches(data.coaches || []);
      } else if (activeSection === "videos") {
        const res = await fetch("/api/admin/videos");
        const data = await res.json();
        if (data.success) setVideos(data.videos || []);
      } else if (activeSection === "nutrition") {
        const res = await fetch("/api/admin/nutrition");
        const data = await res.json();
        if (data.success) setNutritionPlans(data.plans || []);
      } else if (activeSection === "programs") {
        const res = await fetch("/api/admin/programs");
        const data = await res.json();
        if (data.success) setPrograms(data.programs || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    window.location.reload();
  };

  const handleAddCoach = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/coaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coachForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowCoachForm(false);
        setCoachForm({ id: "", name: "", category: "", bio: "", image_url: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding coach:", error);
    }
  };

  const handleUpdateCoach = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/coaches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coachForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowCoachForm(false);
        setEditingItem(null);
        setCoachForm({ id: "", name: "", category: "", bio: "", image_url: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error updating coach:", error);
    }
  };

  const handleDeleteCoach = async (id) => {
    if (!confirm("Are you sure you want to delete this coach?")) return;
    try {
      const res = await fetch(`/api/coaches?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (error) {
      console.error("Error deleting coach:", error);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowVideoForm(false);
        setVideoForm({ title: "", description: "", video_url: "", thumbnail_url: "", bio: "", price: 0, discount: false, discount_percentage: 0 });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...videoForm, id: editingItem.id }),
      });
      const data = await res.json();
      if (data.success) {
        setShowVideoForm(false);
        setEditingItem(null);
        setVideoForm({ title: "", description: "", video_url: "", thumbnail_url: "", bio: "", price: 0, discount: false, discount_percentage: 0 });
        fetchData();
      }
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleAddNutrition = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nutritionForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowNutritionForm(false);
        setNutritionForm({ name: "", description: "", duration: "", meals: [], price: 0, discount: false, discount_percentage: 0 });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding nutrition plan:", error);
    }
  };

  const handleUpdateNutrition = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/nutrition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nutritionForm, id: editingItem.id }),
      });
      const data = await res.json();
      if (data.success) {
        setShowNutritionForm(false);
        setEditingItem(null);
        setNutritionForm({ name: "", description: "", duration: "", meals: [], price: 0, discount: false, discount_percentage: 0 });
        fetchData();
      }
    } catch (error) {
      console.error("Error updating nutrition plan:", error);
    }
  };

  const handleDeleteNutrition = async (id) => {
    if (!confirm("Are you sure you want to delete this nutrition plan?")) return;
    try {
      const res = await fetch(`/api/admin/nutrition?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (error) {
      console.error("Error deleting nutrition plan:", error);
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowProgramForm(false);
        setProgramForm({ name: "", description: "", duration: "", schedule: [], exercises: [], price: 0, discount: false, discount_percentage: 0 });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding program:", error);
    }
  };

  const handleUpdateProgram = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...programForm, id: editingItem.id }),
      });
      const data = await res.json();
      if (data.success) {
        setShowProgramForm(false);
        setEditingItem(null);
        setProgramForm({ name: "", description: "", duration: "", schedule: [], exercises: [], price: 0, discount: false, discount_percentage: 0 });
        fetchData();
      }
    } catch (error) {
      console.error("Error updating program:", error);
    }
  };

  const handleDeleteProgram = async (id) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await fetch(`/api/admin/programs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  const openEditCoach = (coach) => {
    setEditingItem(coach);
    setCoachForm({ id: coach.id, name: coach.name, category: coach.category, bio: coach.bio || "", image_url: coach.image_url || "" });
    setShowCoachForm(true);
  };

  const openEditVideo = (video) => {
    setEditingItem(video);
    setVideoForm({ title: video.title, description: video.description || "", video_url: video.video_url, thumbnail_url: video.thumbnail_url || "", bio: video.bio || "", price: video.price || 0, discount: video.discount || false, discount_percentage: video.discount_percentage || 0 });
    setShowVideoForm(true);
  };

  const openEditNutrition = (plan) => {
    setEditingItem(plan);
    setNutritionForm({ name: plan.name, description: plan.description, duration: plan.duration || "", meals: plan.meals || [], price: plan.price || 0, discount: plan.discount || false, discount_percentage: plan.discount_percentage || 0 });
    setShowNutritionForm(true);
  };

  const openEditProgram = (program) => {
    setEditingItem(program);
    setProgramForm({ name: program.name, description: program.description, duration: program.duration || "", schedule: program.schedule || [], exercises: program.exercises || [], price: program.price || 0, discount: program.discount || false, discount_percentage: program.discount_percentage || 0 });
    setShowProgramForm(true);
  };

  const filteredCoaches = coaches.filter((coach) =>
    coach.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuItems = [
    { id: "users", label: "Users", icon: Users },
    { id: "coaches", label: "Coaches", icon: UserCog },
    { id: "videos", label: "Videos", icon: Video },
    { id: "nutrition", label: "Nutrition", icon: UtensilsCrossed },
    { id: "programs", label: "Programs", icon: Dumbbell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400 opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <div className={`bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-blue-600" />
                Admin Panel
              </h2>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <nav className="p-4 space-y-2 pb-24">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSearchTerm("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="border-t border-gray-200 pt-4 mb-4"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 border border-red-200 hover:border-red-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden">
          {/* Header */}
          <div className="bg-white/90 backdrop-blur-sm shadow-md p-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {menuItems.find((m) => m.id === activeSection)?.label || "Dashboard"}
            </h1>
            <div className="w-6"></div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Users Section */}
                {activeSection === "users" && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">All Registered Users</h2>
                      <div className="text-sm text-gray-600">Total: {users.length}</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800 text-white">
                          <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Phone</th>
                            <th className="px-4 py-3 text-left">Age</th>
                            <th className="px-4 py-3 text-left">Gender</th>
                            <th className="px-4 py-3 text-left">Plan</th>
                            <th className="px-4 py-3 text-left">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map((user, idx) => (
                            <tr key={user.id || idx} className="hover:bg-blue-50 transition-colors">
                              <td className="px-4 py-3 font-medium">{user.fullName || "N/A"}</td>
                              <td className="px-4 py-3">{user.email || "N/A"}</td>
                              <td className="px-4 py-3">{user.phone || "N/A"}</td>
                              <td className="px-4 py-3">{user.age || "N/A"}</td>
                              <td className="px-4 py-3 capitalize">{user.gender || "N/A"}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                  {user.selectedPlan || "N/A"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {users.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No users found</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Coaches Section */}
                {activeSection === "coaches" && (
                  <div className="space-y-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Coaches Management</h2>
                        <button
                          onClick={() => {
                            setShowCoachForm(true);
                            setEditingItem(null);
                            setCoachForm({ id: "", name: "", category: "", bio: "", image_url: "" });
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          Add Coach
                        </button>
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search coaches by name or bio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCoaches.map((coach, idx) => (
                          <div key={coach.id || idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                              {coach.image_url ? (
                                <img src={coach.image_url} alt={coach.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                                  {coach.name?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg text-gray-800 mb-2">{coach.name}</h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{coach.bio || "No bio available"}</p>
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  {coach.category}
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEditCoach(coach)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCoach(coach.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {filteredCoaches.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No coaches found</div>
                      )}
                    </div>

                    {/* Coach Form Modal */}
                    {showCoachForm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">{editingItem ? "Edit Coach" : "Add New Coach"}</h3>
                            <button onClick={() => { setShowCoachForm(false); setEditingItem(null); }}>
                              <XIcon className="w-6 h-6 text-gray-600" />
                            </button>
                          </div>
                          <form onSubmit={editingItem ? handleUpdateCoach : handleAddCoach} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">ID</label>
                              <input
                                type="text"
                                value={coachForm.id}
                                onChange={(e) => setCoachForm({ ...coachForm, id: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <input
                                type="text"
                                value={coachForm.name}
                                onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Category</label>
                              <input
                                type="text"
                                value={coachForm.category}
                                onChange={(e) => setCoachForm({ ...coachForm, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Bio</label>
                              <textarea
                                value={coachForm.bio}
                                onChange={(e) => setCoachForm({ ...coachForm, bio: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="3"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Image URL</label>
                              <input
                                type="text"
                                value={coachForm.image_url}
                                onChange={(e) => setCoachForm({ ...coachForm, image_url: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"}
                              </button>
                              <button type="button" onClick={() => { setShowCoachForm(false); setEditingItem(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Videos Section */}
                {activeSection === "videos" && (
                  <div className="space-y-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Videos Management</h2>
                        <button
                          onClick={() => {
                            setShowVideoForm(true);
                            setEditingItem(null);
                            setVideoForm({ title: "", description: "", video_url: "", thumbnail_url: "", bio: "", price: 0, discount: false, discount_percentage: 0 });
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          Add Video
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video, idx) => (
                          <div key={video.id || idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                            {video.thumbnail_url && (
                              <img src={video.thumbnail_url} alt={video.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description || video.bio}</p>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-blue-600">
                                  ${video.discount ? (video.price * (1 - video.discount_percentage / 100)).toFixed(2) : video.price}
                                  {video.discount && <span className="text-xs text-gray-400 line-through ml-2">${video.price}</span>}
                                </span>
                                {video.discount && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                    {video.discount_percentage}% OFF
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => openEditVideo(video)}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(video.id)}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {videos.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No videos found</div>
                      )}
                    </div>

                    {/* Video Form Modal */}
                    {showVideoForm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">{editingItem ? "Edit Video" : "Add New Video"}</h3>
                            <button onClick={() => { setShowVideoForm(false); setEditingItem(null); }}>
                              <XIcon className="w-6 h-6 text-gray-600" />
                            </button>
                          </div>
                          <form onSubmit={editingItem ? handleUpdateVideo : handleAddVideo} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Title</label>
                              <input
                                type="text"
                                value={videoForm.title}
                                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea
                                value={videoForm.description}
                                onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="3"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Bio</label>
                              <textarea
                                value={videoForm.bio}
                                onChange={(e) => setVideoForm({ ...videoForm, bio: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="2"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Video URL</label>
                              <input
                                type="text"
                                value={videoForm.video_url}
                                onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                              <input
                                type="text"
                                value={videoForm.thumbnail_url}
                                onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={videoForm.price}
                                  onChange={(e) => setVideoForm({ ...videoForm, price: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Discount %</label>
                                <input
                                  type="number"
                                  value={videoForm.discount_percentage}
                                  onChange={(e) => setVideoForm({ ...videoForm, discount_percentage: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                  disabled={!videoForm.discount}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={videoForm.discount}
                                onChange={(e) => setVideoForm({ ...videoForm, discount: e.target.checked })}
                                className="w-4 h-4"
                              />
                              <label className="text-sm font-medium">Has Discount</label>
                            </div>
                            <div className="flex gap-3">
                              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"}
                              </button>
                              <button type="button" onClick={() => { setShowVideoForm(false); setEditingItem(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Nutrition Section */}
                {activeSection === "nutrition" && (
                  <div className="space-y-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Nutrition Plans Management</h2>
                        <button
                          onClick={() => {
                            setShowNutritionForm(true);
                            setEditingItem(null);
                            setNutritionForm({ name: "", description: "", duration: "", meals: [], price: 0, discount: false, discount_percentage: 0 });
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          Add Plan
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nutritionPlans.map((plan, idx) => (
                          <div key={plan.id || idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
                            <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{plan.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-blue-600">
                                ${plan.discount ? (plan.price * (1 - plan.discount_percentage / 100)).toFixed(2) : plan.price}
                                {plan.discount && <span className="text-xs text-gray-400 line-through ml-2">${plan.price}</span>}
                              </span>
                              {plan.discount && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                  {plan.discount_percentage}% OFF
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditNutrition(plan)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteNutrition(plan.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {nutritionPlans.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No nutrition plans found</div>
                      )}
                    </div>

                    {/* Nutrition Form Modal */}
                    {showNutritionForm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">{editingItem ? "Edit Nutrition Plan" : "Add New Nutrition Plan"}</h3>
                            <button onClick={() => { setShowNutritionForm(false); setEditingItem(null); }}>
                              <XIcon className="w-6 h-6 text-gray-600" />
                            </button>
                          </div>
                          <form onSubmit={editingItem ? handleUpdateNutrition : handleAddNutrition} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <input
                                type="text"
                                value={nutritionForm.name}
                                onChange={(e) => setNutritionForm({ ...nutritionForm, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea
                                value={nutritionForm.description}
                                onChange={(e) => setNutritionForm({ ...nutritionForm, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="4"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Duration</label>
                              <input
                                type="text"
                                value={nutritionForm.duration}
                                onChange={(e) => setNutritionForm({ ...nutritionForm, duration: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="e.g., 30 days, 3 months"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={nutritionForm.price}
                                  onChange={(e) => setNutritionForm({ ...nutritionForm, price: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Discount %</label>
                                <input
                                  type="number"
                                  value={nutritionForm.discount_percentage}
                                  onChange={(e) => setNutritionForm({ ...nutritionForm, discount_percentage: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                  disabled={!nutritionForm.discount}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={nutritionForm.discount}
                                onChange={(e) => setNutritionForm({ ...nutritionForm, discount: e.target.checked })}
                                className="w-4 h-4"
                              />
                              <label className="text-sm font-medium">Has Discount</label>
                            </div>
                            <div className="flex gap-3">
                              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"}
                              </button>
                              <button type="button" onClick={() => { setShowNutritionForm(false); setEditingItem(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Programs Section */}
                {activeSection === "programs" && (
                  <div className="space-y-6 mt-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Training Programs Management</h2>
                        <button
                          onClick={() => {
                            setShowProgramForm(true);
                            setEditingItem(null);
                            setProgramForm({ 
                              name: "", 
                              description: "", 
                              duration: "", 
                              schedule: [], 
                              exercises: [], 
                              price: 0, 
                              discount: false, 
                              discount_percentage: 0,
                              goal: "muscle_building",
                              level: "All Levels",
                              equipment: [],
                              coach_recommendation: "",
                              coach_id: "",
                              overview: ""
                            });
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          Add Program
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program, idx) => (
                          <div key={program.id || idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
                            <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{program.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-blue-600">
                                ${program.discount ? (program.price * (1 - program.discount_percentage / 100)).toFixed(2) : program.price}
                                {program.discount && <span className="text-xs text-gray-400 line-through ml-2">${program.price}</span>}
                              </span>
                              {program.discount && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                  {program.discount_percentage}% OFF
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditProgram(program)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProgram(program.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {programs.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No programs found</div>
                      )}
                    </div>

                    {/* Program Form Modal */}
                    {showProgramForm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">{editingItem ? "Edit Program" : "Add New Program"}</h3>
                            <button onClick={() => { setShowProgramForm(false); setEditingItem(null); }}>
                              <XIcon className="w-6 h-6 text-gray-600" />
                            </button>
                          </div>
                          <form onSubmit={editingItem ? handleUpdateProgram : handleAddProgram} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <input
                                type="text"
                                value={programForm.name}
                                onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Description</label>
                              <textarea
                                value={programForm.description}
                                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="4"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Duration</label>
                              <input
                                type="text"
                                value={programForm.duration}
                                onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="e.g., 4 weeks, 12 weeks"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Goal</label>
                                <select
                                  value={programForm.goal}
                                  onChange={(e) => setProgramForm({ ...programForm, goal: e.target.value })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                >
                                  <option value="weight_loss">Weight Loss</option>
                                  <option value="bulking">Bulking</option>
                                  <option value="muscle_building">Muscle Building</option>
                                  <option value="endurance">Endurance</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Level</label>
                                <select
                                  value={programForm.level}
                                  onChange={(e) => setProgramForm({ ...programForm, level: e.target.value })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="All Levels">All Levels</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Overview (Extended Description)</label>
                              <textarea
                                value={programForm.overview}
                                onChange={(e) => setProgramForm({ ...programForm, overview: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="3"
                                placeholder="Additional detailed information about the program"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Equipment (comma-separated)</label>
                              <input
                                type="text"
                                value={Array.isArray(programForm.equipment) ? programForm.equipment.join(", ") : programForm.equipment}
                                onChange={(e) => {
                                  const equipmentList = e.target.value.split(",").map(item => item.trim()).filter(item => item);
                                  setProgramForm({ ...programForm, equipment: equipmentList });
                                }}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="e.g., Dumbbells, Barbell, Bench, Resistance Bands"
                              />
                              <p className="text-xs text-gray-500 mt-1">Enter equipment separated by commas</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Coach Recommendation</label>
                              <textarea
                                value={programForm.coach_recommendation}
                                onChange={(e) => setProgramForm({ ...programForm, coach_recommendation: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="2"
                                placeholder="Recommended coach or coaching style for this program"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Coach ID (Optional)</label>
                              <input
                                type="text"
                                value={programForm.coach_id}
                                onChange={(e) => setProgramForm({ ...programForm, coach_id: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Enter coach ID if linking to specific coach"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Exercises (JSON Array or comma-separated)</label>
                              <textarea
                                value={Array.isArray(programForm.exercises) ? JSON.stringify(programForm.exercises, null, 2) : programForm.exercises}
                                onChange={(e) => {
                                  try {
                                    const parsed = JSON.parse(e.target.value);
                                    if (Array.isArray(parsed)) {
                                      setProgramForm({ ...programForm, exercises: parsed });
                                    } else {
                                      setProgramForm({ ...programForm, exercises: e.target.value.split(",").map(item => item.trim()).filter(item => item) });
                                    }
                                  } catch {
                                    // If not valid JSON, treat as comma-separated
                                    const exercises = e.target.value.split(",").map(item => item.trim()).filter(item => item);
                                    setProgramForm({ ...programForm, exercises });
                                  }
                                }}
                                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                                rows="4"
                                placeholder='["Squats", "Deadlifts", "Bench Press"] or Squats, Deadlifts, Bench Press'
                              />
                              <p className="text-xs text-gray-500 mt-1">Enter as JSON array or comma-separated list</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Schedule (JSON Array - Day-by-Day)</label>
                              <textarea
                                value={JSON.stringify(programForm.schedule, null, 2)}
                                onChange={(e) => {
                                  try {
                                    const parsed = JSON.parse(e.target.value);
                                    if (Array.isArray(parsed)) {
                                      setProgramForm({ ...programForm, schedule: parsed });
                                    }
                                  } catch {
                                    // Invalid JSON, keep as is
                                  }
                                }}
                                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                                rows="8"
                                placeholder={`[\n  {\n    "day": "Day 1",\n    "focus": "Upper Body",\n    "exercises": ["Bench Press", "Rows"],\n    "notes": "Focus on form"\n  },\n  {\n    "day": "Day 2",\n    "focus": "Lower Body",\n    "exercises": ["Squats", "Deadlifts"]\n  }\n]`}
                              />
                              <p className="text-xs text-gray-500 mt-1">Format: Array of objects with day, focus, exercises, and optional notes</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={programForm.price}
                                  onChange={(e) => setProgramForm({ ...programForm, price: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Discount %</label>
                                <input
                                  type="number"
                                  value={programForm.discount_percentage}
                                  onChange={(e) => setProgramForm({ ...programForm, discount_percentage: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border rounded-lg"
                                  disabled={!programForm.discount}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={programForm.discount}
                                onChange={(e) => setProgramForm({ ...programForm, discount: e.target.checked })}
                                className="w-4 h-4"
                              />
                              <label className="text-sm font-medium">Has Discount</label>
                            </div>
                            <div className="flex gap-3">
                              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"}
                              </button>
                              <button type="button" onClick={() => { setShowProgramForm(false); setEditingItem(null); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

