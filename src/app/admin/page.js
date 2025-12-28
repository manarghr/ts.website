"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Dumbbell, Activity, Zap, Target, TrendingUp, Award, Heart } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    // Auto-logout when user leaves the page (closes tab, navigates away, or refreshes)
    const handleBeforeUnload = () => {
      localStorage.removeItem("admin_authenticated");
    };

    // Auto-logout when page visibility changes (user switches tabs or minimizes window)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.removeItem("admin_authenticated");
        setIsAuthenticated(false);
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple login check for demo (password: admin123, username can be anything or empty)
    if (password === "admin123") {
      localStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#52796F]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#52796F]/5 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>

        {/* Floating Gym Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dumbbell - Top Left */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[15%] left-[10%] text-[#6BB371]/20"
          >
            <Dumbbell className="w-16 h-16" />
          </motion.div>

          {/* Activity - Top Right */}
          <motion.div
            animate={{ 
              y: [0, 25, 0],
              x: [0, -15, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-[20%] right-[15%] text-[#52796F]/20"
          >
            <Activity className="w-20 h-20" />
          </motion.div>

          {/* Zap - Bottom Left */}
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, -15, 0]
            }}
            transition={{ 
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-[25%] left-[8%] text-[#6BB371]/15"
          >
            <Zap className="w-14 h-14" />
          </motion.div>

          {/* Target - Bottom Right */}
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
            className="absolute bottom-[20%] right-[12%] text-[#52796F]/25"
          >
            <Target className="w-18 h-18" />
          </motion.div>

          {/* TrendingUp - Middle Left */}
          <motion.div
            animate={{ 
              x: [0, 20, 0],
              y: [0, -15, 0]
            }}
            transition={{ 
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
            className="absolute top-[45%] left-[5%] text-[#6BB371]/20"
          >
            <TrendingUp className="w-16 h-16" />
          </motion.div>

          {/* Award - Middle Right */}
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 20, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-[50%] right-[8%] text-[#52796F]/20"
          >
            <Award className="w-18 h-18" />
          </motion.div>

          {/* Heart - Top Center */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8
            }}
            className="absolute top-[10%] left-[45%] text-[#6BB371]/15"
          >
            <Heart className="w-14 h-14" />
          </motion.div>

          {/* Dumbbell - Bottom Center */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 0],
              y: [0, 15, 0]
            }}
            transition={{ 
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            }}
            className="absolute bottom-[15%] left-[50%] text-[#52796F]/15"
          >
            <Dumbbell className="w-16 h-16" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-[#52796F]/20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#354F52] mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">TrainSight Administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#354F52] mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent outline-none transition-all"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#52796F] to-[#354F52] text-white font-semibold py-3 px-6 rounded-lg hover:shadow-xl hover:shadow-[#52796F]/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return <AdminDashboard />;
}

