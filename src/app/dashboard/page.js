"use client";

import { useEffect, useState } from "react"
import {
  Users,
  UserPlus,
  Calendar,
  Mail,
  Phone,
  Activity,
  TrendingUp,
  Search,
  Filter,
  Dumbbell,
  Award,
} from "lucide-react"

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  })

  const filterUsersFunc = () => {
    let filtered = [...users]

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm),
      )
    }

    if (filterPlan !== "all") {
      filtered = filtered.filter((user) => user.selectedPlan === filterPlan)
    }

    setFilteredUsers(filtered)
  }

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("trainsight_users") || "[]");
    setUsers(storedUsers);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const todayCount = storedUsers.filter((u) => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= today;
    }).length;
    
    const weekCount = storedUsers.filter((u) => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= weekAgo;
    }).length;
    
    const monthCount = storedUsers.filter((u) => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= monthAgo;
    }).length;

    setStats({
      total: storedUsers.length,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
    });
  }, [])

  useEffect(() => {
    filterUsersFunc()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchTerm, filterPlan])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getPlanLabel = (plan) => {
    const plans = {
      "free-trial": "Free Trial",
      monthly: "Monthly",
      annual: "Annual",
    }
    return plans[plan] || plan
  }

  const getExperienceLabel = (exp) => {
    const experiences = {
      "first-time": "First Time",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    }
    return experiences[exp] || exp
  }

  const getGenderLabel = (gender) => {
    const genders = {
      male: "Male",
      female: "Female",
      other: "Other",
      "prefer-not-to-say": "Prefer not to say",
    }
    return genders[gender] || gender
  }

  const handleRefresh = () => {
    const storedUsers = JSON.parse(localStorage.getItem("trainsight_users") || "[]");
    setUsers(storedUsers);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const todayCount = storedUsers.filter((u) => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= today;
    }).length;
    
    const weekCount = storedUsers.filter((u) => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= weekAgo;
    }).length;
    
    const monthCount = storedUsers.filter((u) => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= monthAgo;
    }).length;

    setStats({
      total: storedUsers.length,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Dumbbell className="w-10 h-10 text-blue-600" />
            TrainSight Dashboard
          </h1>
          <p className="text-slate-600 text-lg ml-[52px]">Track and manage your fitness community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-linear-to-br from-blue-500 to-blue-600 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</div>
            <div className="text-slate-600 font-medium">Total Members</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-linear-to-br from-purple-500 to-purple-600 p-3 rounded-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{stats.today}</div>
            <div className="text-slate-600 font-medium">Joined Today</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-linear-to-br from-green-500 to-green-600 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{stats.thisWeek}</div>
            <div className="text-slate-600 font-medium">This Week</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-linear-to-br from-orange-500 to-orange-600 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{stats.thisMonth}</div>
            <div className="text-slate-600 font-medium">This Month</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-w-[180px] appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Plans</option>
                <option value="free-trial">Free Trial</option>
                <option value="monthly">Monthly Plan</option>
                <option value="annual">Annual Plan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="p-6 bg-linear-to-r from-blue-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6" />
              All Members ({filteredUsers.length})
            </h2>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">
                {searchTerm || filterPlan !== "all"
                  ? "No members found matching your filters"
                  : "No members registered yet"}
              </p>
              {(searchTerm || filterPlan !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterPlan("all")
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Member Info</th>
                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold">Profile</th>
                    <th className="px-6 py-4 text-left font-semibold">Experience</th>
                    <th className="px-6 py-4 text-left font-semibold">Plan</th>
                    <th className="px-6 py-4 text-left font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.fullName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{user.fullName || "N/A"}</div>
                            <div className="text-sm text-slate-500">{user.age ? `${user.age} years` : "Age N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{user.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{user.phone || "N/A"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium text-slate-700">Gender:</span>{" "}
                            <span className="text-slate-600">{getGenderLabel(user.gender)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-slate-600">Rating: {user.sportsRating || "N/A"}/5</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                          <Dumbbell className="w-4 h-4" />
                          {getExperienceLabel(user.workoutExperience)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${
                            user.selectedPlan === "free-trial"
                              ? "bg-blue-100 text-blue-700"
                              : user.selectedPlan === "monthly"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {getPlanLabel(user.selectedPlan)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
  {user.createdAt ? formatDate(user.createdAt) : "N/A"}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRefresh}
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}