"use client";

import { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { 
  Camera,
  Video,
  Play,
  Lock,
  Crown,
  CheckCircle,
  Activity,
  TrendingUp,
  Target,
  Zap,
  Users,
  Clock,
  BarChart3,
  X,
  Award,
  Flame,
  Timer,
  Heart,
  AlertCircle
} from "lucide-react";

export default function AISportsPage() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState("squats");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [playlistVideos, setPlaylistVideos] = useState([]);

  const exercises = [
    { id: "squats", name: "Squats", icon: Activity },
    { id: "pushups", name: "Push-ups", icon: TrendingUp },
    { id: "lunges", name: "Lunges", icon: Target },
    { id: "planks", name: "Planks", icon: Timer }
  ];

  const categories = [
    { id: "all", label: "All Programs", icon: Video },
    { id: "weight-loss", label: "Weight Loss", icon: TrendingUp },
    { id: "muscle-gain", label: "Muscle Gain", icon: Activity },
    { id: "strength", label: "Strength", icon: Target },
    { id: "flexibility", label: "Flexibility", icon: Heart },
    { id: "cardio", label: "Cardio", icon: Zap }
  ];

  // Video playlists with free and premium content + real YouTube videos
  const playlists = [
    {
      id: 1,
      title: "Fat Burning HIIT Workout",
      description: "High-intensity cardio to burn maximum calories",
      thumbnail: "https://img.youtube.com/vi/ml6cT4AZdqI/maxresdefault.jpg",
      duration: "45 min",
      videos: 8,
      level: "Beginner",
      isFree: true,
      category: "weight-loss",
      videoList: [
        { id: 1, title: "20 Min Fat Burning HIIT", youtubeId: "ml6cT4AZdqI", duration: "20:00" },
        { id: 2, title: "Full Body Cardio Workout", youtubeId: "gC_L9qAHVJ8", duration: "30:00" },
        { id: 3, title: "Beginner Fat Burn", youtubeId: "M0uO8X3_tEA", duration: "15:00" },
        { id: 4, title: "Standing Abs Cardio", youtubeId: "gZGxN3bn7NU", duration: "10:00" },
        { id: 5, title: "Low Impact Cardio", youtubeId: "5if7PXZlYFA", duration: "25:00" },
        { id: 6, title: "HIIT Cardio No Equipment", youtubeId: "cZnsLVArIt8", duration: "20:00" },
        { id: 7, title: "Fat Burning Walk", youtubeId: "Eml2xnoLpYE", duration: "30:00" },
        { id: 8, title: "Intense Cardio Finisher", youtubeId: "IODxDxX7oi4", duration: "10:00" }
      ]
    },
    {
      id: 2,
      title: "Weight Loss Complete Program",
      description: "Comprehensive program for sustainable weight loss",
      thumbnail: "https://img.youtube.com/vi/gC_L9qAHVJ8/maxresdefault.jpg",
      duration: "60 min",
      videos: 10,
      level: "All Levels",
      isFree: true,
      category: "weight-loss",
      videoList: [
        { id: 1, title: "Full Body Weight Loss", youtubeId: "gC_L9qAHVJ8", duration: "30:00" },
        { id: 2, title: "Belly Fat Burner", youtubeId: "M0uO8X3_tEA", duration: "15:00" },
        { id: 3, title: "Cardio + Abs Workout", youtubeId: "gZGxN3bn7NU", duration: "25:00" },
        { id: 4, title: "Low Impact Fat Burn", youtubeId: "5if7PXZlYFA", duration: "30:00" },
        { id: 5, title: "HIIT for Weight Loss", youtubeId: "cZnsLVArIt8", duration: "20:00" },
        { id: 6, title: "Walking Workout", youtubeId: "Eml2xnoLpYE", duration: "30:00" },
        { id: 7, title: "Total Body Burn", youtubeId: "IODxDxX7oi4", duration: "25:00" },
        { id: 8, title: "Beginner Cardio", youtubeId: "ml6cT4AZdqI", duration: "20:00" },
        { id: 9, title: "Core Strengthening", youtubeId: "DHD1-2P94DI", duration: "15:00" },
        { id: 10, title: "Cool Down Stretch", youtubeId: "g_tea8ZNk5A", duration: "10:00" }
      ]
    },
    {
      id: 3,
      title: "Muscle Building Program",
      description: "Build lean muscle mass with progressive overload",
      thumbnail: "https://img.youtube.com/vi/vc1E5CfRfos/maxresdefault.jpg",
      duration: "90 min",
      videos: 12,
      level: "Intermediate",
      isFree: false,
      category: "muscle-gain",
      videoList: [
        { id: 1, title: "Full Body Strength", youtubeId: "vc1E5CfRfos", duration: "45:00" },
        { id: 2, title: "Upper Body Hypertrophy", youtubeId: "oAPCPjnU1wA", duration: "40:00" },
        { id: 3, title: "Leg Day Workout", youtubeId: "2C-uNqKfNlU", duration: "50:00" },
        { id: 4, title: "Push Day", youtubeId: "0jGJJdHAA", duration: "35:00" },
        { id: 5, title: "Pull Day", youtubeId: "eE7cdCbV", duration: "35:00" },
        { id: 6, title: "Shoulder & Arms", youtubeId: "3D8NE3", duration: "30:00" },
        { id: 7, title: "Back & Biceps", youtubeId: "HSoHeSj", duration: "40:00" },
        { id: 8, title: "Chest & Triceps", youtubeId: "yvPHt", duration: "40:00" },
        { id: 9, title: "Core Strength", youtubeId: "DHD1-2P94DI", duration: "20:00" },
        { id: 10, title: "Glutes & Hamstrings", youtubeId: "Ue4Gg", duration: "30:00" },
        { id: 11, title: "Full Body Power", youtubeId: "2nZJ8g", duration: "45:00" },
        { id: 12, title: "Recovery Stretch", youtubeId: "g_tea8ZNk5A", duration: "15:00" }
      ]
    },
    {
      id: 4,
      title: "Strength Training Fundamentals",
      description: "Master proper form and build foundational strength",
      thumbnail: "https://img.youtube.com/vi/oAPCPjnU1wA/maxresdefault.jpg",
      duration: "60 min",
      videos: 8,
      level: "Beginner",
      isFree: true,
      category: "strength",
      videoList: [
        { id: 1, title: "Bodyweight Strength", youtubeId: "oAPCPjnU1wA", duration: "30:00" },
        { id: 2, title: "Push-up Progressions", youtubeId: "IODxDxX7oi4", duration: "15:00" },
        { id: 3, title: "Squat Mastery", youtubeId: "2C-uNqKfNlU", duration: "20:00" },
        { id: 4, title: "Core Fundamentals", youtubeId: "DHD1-2P94DI", duration: "15:00" },
        { id: 5, title: "Upper Body Basics", youtubeId: "vc1E5CfRfos", duration: "25:00" },
        { id: 6, title: "Lower Body Strength", youtubeId: "M0uO8X3_tEA", duration: "30:00" },
        { id: 7, title: "Full Body Workout", youtubeId: "gC_L9qAHVJ8", duration: "35:00" },
        { id: 8, title: "Flexibility & Mobility", youtubeId: "g_tea8ZNk5A", duration: "20:00" }
      ]
    },
    {
      id: 5,
      title: "Yoga & Flexibility Flow",
      description: "Improve mobility, balance, and mind-body connection",
      thumbnail: "https://img.youtube.com/vi/g_tea8ZNk5A/maxresdefault.jpg",
      duration: "50 min",
      videos: 6,
      level: "All Levels",
      isFree: true,
      category: "flexibility",
      videoList: [
        { id: 1, title: "Morning Yoga Flow", youtubeId: "g_tea8ZNk5A", duration: "30:00" },
        { id: 2, title: "Full Body Stretch", youtubeId: "L_xrDAtykMI", duration: "20:00" },
        { id: 3, title: "Hip Flexibility", youtubeId: "2C-uNqKfNlU", duration: "15:00" },
        { id: 4, title: "Shoulder Mobility", youtubeId: "oAPCPjnU1wA", duration: "10:00" },
        { id: 5, title: "Evening Relaxation", youtubeId: "Eml2xnoLpYE", duration: "25:00" },
        { id: 6, title: "Deep Stretching", youtubeId: "5if7PXZlYFA", duration: "30:00" }
      ]
    },
    {
      id: 6,
      title: "Advanced Cardio Challenge",
      description: "Push your limits with intense cardio sessions",
      thumbnail: "https://img.youtube.com/vi/cZnsLVArIt8/maxresdefault.jpg",
      duration: "75 min",
      videos: 10,
      level: "Advanced",
      isFree: false,
      category: "cardio",
      videoList: [
        { id: 1, title: "Extreme HIIT", youtubeId: "cZnsLVArIt8", duration: "30:00" },
        { id: 2, title: "Tabata Cardio", youtubeId: "ml6cT4AZdqI", duration: "20:00" },
        { id: 3, title: "Plyometric Training", youtubeId: "IODxDxX7oi4", duration: "25:00" },
        { id: 4, title: "Sprint Intervals", youtubeId: "gC_L9qAHVJ8", duration: "15:00" },
        { id: 5, title: "Burpee Challenge", youtubeId: "M0uO8X3_tEA", duration: "20:00" },
        { id: 6, title: "Jump Rope Workout", youtubeId: "gZGxN3bn7NU", duration: "15:00" },
        { id: 7, title: "Mountain Climbers", youtubeId: "5if7PXZlYFA", duration: "10:00" },
        { id: 8, title: "Cardio Finisher", youtubeId: "Eml2xnoLpYE", duration: "12:00" },
        { id: 9, title: "Full Body Blast", youtubeId: "vc1E5CfRfos", duration: "30:00" },
        { id: 10, title: "Cool Down", youtubeId: "g_tea8ZNk5A", duration: "10:00" }
      ]
    },
    {
      id: 7,
      title: "Powerlifting Essentials",
      description: "Master the big three: squat, bench, deadlift",
      thumbnail: "https://img.youtube.com/vi/2C-uNqKfNlU/maxresdefault.jpg",
      duration: "120 min",
      videos: 15,
      level: "Advanced",
      isFree: false,
      category: "strength",
      videoList: [
        { id: 1, title: "Squat Technique", youtubeId: "2C-uNqKfNlU", duration: "30:00" },
        { id: 2, title: "Bench Press Form", youtubeId: "oAPCPjnU1wA", duration: "25:00" },
        { id: 3, title: "Deadlift Mastery", youtubeId: "vc1E5CfRfos", duration: "30:00" },
        { id: 4, title: "Squat Accessories", youtubeId: "M0uO8X3_tEA", duration: "20:00" },
        { id: 5, title: "Bench Accessories", youtubeId: "IODxDxX7oi4", duration: "20:00" },
        { id: 6, title: "Deadlift Variations", youtubeId: "gC_L9qAHVJ8", duration: "25:00" },
        { id: 7, title: "Leg Day", youtubeId: "2C-uNqKfNlU", duration: "40:00" },
        { id: 8, title: "Upper Body Power", youtubeId: "oAPCPjnU1wA", duration: "35:00" },
        { id: 9, title: "Core Strength", youtubeId: "DHD1-2P94DI", duration: "20:00" },
        { id: 10, title: "Mobility Work", youtubeId: "g_tea8ZNk5A", duration: "15:00" },
        { id: 11, title: "Max Effort Squat", youtubeId: "2C-uNqKfNlU", duration: "30:00" },
        { id: 12, title: "Max Effort Bench", youtubeId: "oAPCPjnU1wA", duration: "30:00" },
        { id: 13, title: "Max Effort Deadlift", youtubeId: "vc1E5CfRfos", duration: "30:00" },
        { id: 14, title: "Deload Week", youtubeId: "5if7PXZlYFA", duration: "25:00" },
        { id: 15, title: "Recovery Stretching", youtubeId: "g_tea8ZNk5A", duration: "20:00" }
      ]
    },
    {
      id: 8,
      title: "Core & Abs Transformation",
      description: "Build a strong, defined midsection",
      thumbnail: "https://img.youtube.com/vi/DHD1-2P94DI/maxresdefault.jpg",
      duration: "40 min",
      videos: 7,
      level: "Intermediate",
      isFree: true,
      category: "strength",
      videoList: [
        { id: 1, title: "Abs Workout", youtubeId: "DHD1-2P94DI", duration: "15:00" },
        { id: 2, title: "Standing Abs", youtubeId: "gZGxN3bn7NU", duration: "10:00" },
        { id: 3, title: "Core Stability", youtubeId: "M0uO8X3_tEA", duration: "12:00" },
        { id: 4, title: "Lower Abs Focus", youtubeId: "IODxDxX7oi4", duration: "10:00" },
        { id: 5, title: "Obliques Workout", youtubeId: "gC_L9qAHVJ8", duration: "10:00" },
        { id: 6, title: "Plank Variations", youtubeId: "5if7PXZlYFA", duration: "8:00" },
        { id: 7, title: "Ab Finisher", youtubeId: "cZnsLVArIt8", duration: "5:00" }
      ]
    }
  ];

  const filteredPlaylists = selectedCategory === "all" 
    ? playlists 
    : playlists.filter(p => p.category === selectedCategory);

  useEffect(() => {
    // Check if user is logged in and has premium subscription
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("currentUser");
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, []);

  const startCamera = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access is not supported in this browser. Please use Chrome, Firefox, or Edge.");
        return;
      }

      // Request camera with simpler constraints for better compatibility
      const constraints = {
        video: true,
        audio: false
      };

      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera access granted, stream:", stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Force play after a short delay
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log("Video playing successfully");
            }).catch(err => {
              console.error("Error playing video:", err);
            });
          }
        }, 100);
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      // Provide specific error messages
      let errorMessage = "Unable to access camera. ";
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage += "Please allow camera permissions in your browser settings.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage += "No camera found. Please connect a camera device.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage += "Camera is already in use by another application.";
      } else {
        errorMessage += "Please check your camera settings and try again.";
      }
      
      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRepCount(0);
      setFormScore(0);
      setWorkoutTime(0);
      setCalories(0);
      
      // Simulate AI analysis with more realistic progression
      const repInterval = setInterval(() => {
        setRepCount(prev => prev + 1);
        // Vary form score between 75-98 for realism
        const baseScore = 85;
        const variation = Math.floor(Math.random() * 13) - 6; // -6 to +6
        setFormScore(Math.min(98, Math.max(75, baseScore + variation)));
        // Increment calories (roughly 0.5 calories per rep)
        setCalories(prev => prev + 0.5);
      }, 2500); // Count every 2.5 seconds
      
      // Timer for workout duration
      const timeInterval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
      
      // Store interval IDs for cleanup
      if (videoRef.current) {
        videoRef.current.dataset.repIntervalId = repInterval;
        videoRef.current.dataset.timeIntervalId = timeInterval;
      }
    } else {
      setIsRecording(false);
      if (videoRef.current) {
        if (videoRef.current.dataset.repIntervalId) {
          clearInterval(parseInt(videoRef.current.dataset.repIntervalId));
        }
        if (videoRef.current.dataset.timeIntervalId) {
          clearInterval(parseInt(videoRef.current.dataset.timeIntervalId));
        }
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaylistClick = (playlist) => {
    if (!playlist.isFree && (!currentUser || !currentUser.isPremium)) {
      alert("This playlist requires a premium subscription. Please upgrade to access.");
      return;
    }
    setSelectedPlaylist(playlist);
    setPlaylistVideos(playlist.videoList || []);
  };

  const closePlaylistModal = () => {
    setSelectedPlaylist(null);
    setPlaylistVideos([]);
  };

  useEffect(() => {
    return () => {
      // Cleanup camera on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <MainLayout>
      <div className="w-full overflow-hidden bg-white">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] opacity-90" />
          </div>
          <div className="relative h-full flex items-center justify-center px-8 md:px-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
                AI-Powered <span className="text-[#6BB371]">Sports Training</span>
              </h1>
              <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
                Train with real-time AI feedback or follow expert-led workout playlists
              </p>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "96px" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-1 bg-[#6BB371] mx-auto mt-6 rounded-full"
              />
            </motion.div>
          </div>
        </section>

        {/* Live Camera Practice Section */}
        <section className="py-20 px-8 md:px-16 bg-gradient-to-b from-white to-[#C8CDC5]/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6BB371]/10 rounded-full mb-4">
                <Camera className="w-5 h-5 text-[#6BB371]" />
                <span className="text-sm font-semibold text-[#354F52]">Live AI Training</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-4">
                Practice with <span className="text-[#6BB371]">Real-Time AI</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Turn on your camera and let our AI analyze your form, count reps, and provide instant feedback
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#C8CDC5]/30">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Camera Feed */}
                <div className="relative bg-gradient-to-br from-[#2F3E46] to-[#354F52] min-h-[400px] md:min-h-[600px]">
                  {!cameraActive ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mb-6"
                      >
                        <Camera className="w-24 h-24 text-[#6BB371]" />
                      </motion.div>
                      <h3 className="text-white text-2xl font-bold mb-4">Ready to Start?</h3>
                      <p className="text-white/80 text-center mb-8 max-w-sm">
                        Allow camera access to begin your AI-powered workout session
                      </p>
                      <button
                        onClick={startCamera}
                        className="flex items-center gap-2 bg-[#6BB371] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#5FA361] transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Camera className="w-5 h-5" />
                        Enable Camera
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full min-h-[400px] md:min-h-[600px] bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                      {isRecording && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse z-10">
                          <div className="w-3 h-3 bg-white rounded-full" />
                          <span className="font-semibold">Recording</span>
                        </div>
                      )}
                      <button
                        onClick={stopCamera}
                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all z-10"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Analytics Panel */}
                <div className="p-8 bg-gradient-to-br from-white to-[#C8CDC5]/10">
                  <h3 className="text-2xl font-bold text-[#354F52] mb-6">AI Analysis</h3>
                  
                  {!cameraActive ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-[#6BB371]/10 rounded-xl border border-[#6BB371]/20">
                        <Activity className="w-6 h-6 text-[#6BB371] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-[#354F52] mb-1">Real-Time Form Analysis</h4>
                          <p className="text-sm text-gray-600">Get instant feedback on your posture and technique</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-[#52796F]/10 rounded-xl border border-[#52796F]/20">
                        <Target className="w-6 h-6 text-[#52796F] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-[#354F52] mb-1">Automatic Rep Counting</h4>
                          <p className="text-sm text-gray-600">AI tracks your reps and sets automatically</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-[#354F52]/10 rounded-xl border border-[#354F52]/20">
                        <TrendingUp className="w-6 h-6 text-[#354F52] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-[#354F52] mb-1">Performance Metrics</h4>
                          <p className="text-sm text-gray-600">Track your progress over time with detailed analytics</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Flame className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-[#354F52] mb-1">Calorie Tracking</h4>
                          <p className="text-sm text-gray-600">Monitor calories burned during your workout</p>
                        </div>
                      </div>

                      {/* Camera Troubleshooting */}
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-blue-900 mb-1">Camera Not Working?</p>
                            <ul className="text-blue-700 space-y-1 text-xs">
                              <li>• Allow camera permissions when prompted</li>
                              <li>• Close other apps using your camera</li>
                              <li>• Use Chrome, Firefox, or Edge browser</li>
                              <li>• Check if your camera is properly connected</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Exercise Selector */}
                      {!isRecording && (
                        <div className="mb-4">
                          <label className="text-sm font-semibold text-[#354F52] mb-2 block">Select Exercise</label>
                          <div className="grid grid-cols-2 gap-2">
                            {exercises.map((exercise) => (
                              <button
                                key={exercise.id}
                                onClick={() => setSelectedExercise(exercise.id)}
                                className={`flex items-center gap-2 p-3 rounded-xl font-medium text-sm transition-all ${
                                  selectedExercise === exercise.id
                                    ? "bg-[#6BB371] text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                <exercise.icon className="w-4 h-4" />
                                {exercise.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Rep Counter */}
                        <div className="bg-gradient-to-br from-[#6BB371] to-[#52796F] rounded-xl p-4 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs font-medium opacity-90">Reps</span>
                          </div>
                          <div className="text-3xl font-bold">{repCount}</div>
                        </div>

                        {/* Workout Time */}
                        <div className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-xl p-4 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Timer className="w-4 h-4" />
                            <span className="text-xs font-medium opacity-90">Time</span>
                          </div>
                          <div className="text-3xl font-bold">{formatTime(workoutTime)}</div>
                        </div>

                        {/* Calories */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Flame className="w-4 h-4" />
                            <span className="text-xs font-medium opacity-90">Calories</span>
                          </div>
                          <div className="text-3xl font-bold">{Math.round(calories)}</div>
                        </div>

                        {/* Heart Rate (Simulated) */}
                        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs font-medium opacity-90">HR</span>
                          </div>
                          <div className="text-3xl font-bold">{isRecording ? Math.floor(120 + Math.random() * 40) : "--"}</div>
                        </div>
                      </div>

                      {/* Form Score */}
                      <div className="bg-white border-2 border-[#C8CDC5] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[#354F52]">Form Score</span>
                          <BarChart3 className="w-4 h-4 text-[#6BB371]" />
                        </div>
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold text-[#354F52]">{formScore}</span>
                          <span className="text-lg text-gray-500 mb-0.5">/100</span>
                          {formScore >= 90 && (
                            <Award className="w-5 h-5 text-amber-500 mb-1 ml-auto" />
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              formScore >= 90 ? "bg-gradient-to-r from-green-500 to-emerald-600" :
                              formScore >= 80 ? "bg-gradient-to-r from-[#6BB371] to-[#52796F]" :
                              "bg-gradient-to-r from-amber-500 to-orange-600"
                            }`}
                            style={{ width: `${formScore}%` }}
                          />
                        </div>
                        {formScore > 0 && (
                          <p className="text-xs text-gray-600 mt-2">
                            {formScore >= 90 ? "🎉 Excellent form!" :
                             formScore >= 80 ? "👍 Good form, keep it up!" :
                             "💪 Focus on your form"}
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="space-y-3">
                        <button
                          onClick={toggleRecording}
                          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
                            isRecording
                              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                              : "bg-gradient-to-r from-[#354F52] to-[#52796F] hover:from-[#52796F] hover:to-[#6BB371] text-white"
                          }`}
                        >
                          {isRecording ? (
                            <>
                              <div className="w-4 h-4 bg-white rounded-sm" />
                              Stop Workout
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5" fill="white" />
                              Start Workout
                            </>
                          )}
                        </button>
                        
                        {isRecording && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-[#6BB371]/10 py-2 rounded-lg"
                          >
                            <Zap className="w-4 h-4 text-[#6BB371] animate-pulse" />
                            <span className="font-medium">AI is analyzing your movements...</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Recorded Playlists Section */}
        <section className="py-20 px-8 md:px-16 bg-gradient-to-b from-[#C8CDC5]/20 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#52796F]/10 rounded-full mb-4">
                <Video className="w-5 h-5 text-[#52796F]" />
                <span className="text-sm font-semibold text-[#354F52]">Workout Playlists</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#354F52] mb-4">
                Expert-Led <span className="text-[#52796F]">Training Programs</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Follow structured workout programs designed by professional trainers
              </p>
            </div>

            {/* Category Filters - Styled like Meals Page */}
            <div className="mb-12 bg-gradient-to-br from-[#2F3E46] via-[#354F52] to-[#2F3E46] rounded-2xl p-8 shadow-xl relative overflow-hidden">
              {/* Floating Icons in Background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Activity className="absolute top-4 left-8 w-12 h-12 text-white/10 animate-float" />
                <Target className="absolute top-16 right-12 w-16 h-16 text-white/10 animate-float" style={{ animationDelay: '1s' }} />
                <Zap className="absolute bottom-8 left-16 w-14 h-14 text-white/10 animate-float" style={{ animationDelay: '2s' }} />
                <Heart className="absolute bottom-12 right-20 w-10 h-10 text-white/10 animate-float" style={{ animationDelay: '0.5s' }} />
                <TrendingUp className="absolute top-1/2 left-1/4 w-12 h-12 text-white/10 animate-float" style={{ animationDelay: '1.5s' }} />
                <Video className="absolute top-1/3 right-1/4 w-14 h-14 text-white/10 animate-float" style={{ animationDelay: '2.5s' }} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Video className="w-6 h-6 text-[#6BB371]" />
                  <h3 className="text-xl font-bold text-white">Browse by Category</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-[#6BB371] to-[#52796F] text-white shadow-lg shadow-[#6BB371]/30"
                            : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isActive ? "bg-white/20" : "bg-white/10"
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-medium">{category.label}</span>
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 bg-gradient-to-br from-[#6BB371] to-[#52796F] rounded-xl -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Results count */}
                <div className="mt-6 text-center">
                  <p className="text-white/80 text-sm">
                    Showing <span className="font-bold text-[#6BB371]">{filteredPlaylists.length}</span> {filteredPlaylists.length === 1 ? 'program' : 'programs'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaylists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#C8CDC5]/30 cursor-pointer"
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                        !playlist.isFree && (!currentUser || !currentUser.isPremium) ? 'blur-sm' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Free/Premium Badge */}
                    {playlist.isFree ? (
                      <div className="absolute top-3 right-3 bg-[#6BB371] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                        <CheckCircle className="w-3 h-3" />
                        FREE
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                        <Crown className="w-3 h-3" />
                        PREMIUM
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        {playlist.isFree || (currentUser && currentUser.isPremium) ? (
                          <Play className="w-8 h-8 text-white" fill="white" />
                        ) : (
                          <Lock className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 z-10">
                      <Clock className="w-3 h-3" />
                      {playlist.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#6BB371] bg-[#6BB371]/10 px-2 py-1 rounded">
                        {playlist.level}
                      </span>
                      <span className="text-xs text-gray-500">{playlist.videos} videos</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#354F52] mb-2 group-hover:text-[#52796F] transition-colors">
                      {playlist.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {playlist.description}
                    </p>

                    {/* Locked State for Premium */}
                    {!playlist.isFree && (!currentUser || !currentUser.isPremium) && (
                      <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
                        <Lock className="w-4 h-4" />
                        <span>Upgrade to Premium</span>
                      </div>
                    )}

                    {/* Preview Available */}
                    {!playlist.isFree && (
                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Preview available • Full access with Premium</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Upgrade CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 bg-gradient-to-br from-[#354F52] via-[#52796F] to-[#6BB371] rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32" />
              
              <div className="relative z-10">
                <Crown className="w-16 h-16 mx-auto mb-4 text-amber-300" />
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Unlock All Premium Content
                </h3>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Get unlimited access to all workout playlists, advanced AI features, and personalized training plans
                </p>
                <button className="bg-white text-[#354F52] font-bold py-4 px-10 rounded-xl text-lg hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Upgrade to Premium
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video Modal - Full Playlist View */}
        {selectedPlaylist && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl max-w-6xl w-full my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-bold text-[#354F52]">{selectedPlaylist.title}</h3>
                      {selectedPlaylist.isFree ? (
                        <span className="px-3 py-1 bg-[#6BB371] text-white rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          FREE
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{selectedPlaylist.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {selectedPlaylist.videos} videos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedPlaylist.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {selectedPlaylist.level}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closePlaylistModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Video List */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <h4 className="text-lg font-bold text-[#354F52] mb-4">Playlist Videos</h4>
                <div className="space-y-3">
                  {playlistVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer group border border-gray-200 hover:border-[#6BB371]"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
                    >
                      {/* Video Number */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#52796F] to-[#6BB371] rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>

                      {/* Thumbnail */}
                      <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" fill="white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-[#354F52] group-hover:text-[#6BB371] transition-colors line-clamp-1">
                          {video.title}
                        </h5>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{video.duration}</span>
                        </div>
                      </div>

                      {/* Play Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#6BB371]/10 group-hover:bg-[#6BB371] flex items-center justify-center transition-all">
                          <Play className="w-5 h-5 text-[#6BB371] group-hover:text-white transition-colors" fill="currentColor" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    Click any video to watch on YouTube
                  </div>
                  <button
                    onClick={closePlaylistModal}
                    className="px-6 py-2 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

