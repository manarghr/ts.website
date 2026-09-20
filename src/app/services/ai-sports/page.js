"use client";

import { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import PoseOverlay from "@/components/AI/PoseOverlay";
import PoseEngine from "@/components/AI/PoseEngine";
import ExerciseGuide from "@/components/AI/ExerciseGuide";
import { createAnalysisSession } from "@/lib/ai/session";
import { hasPremiumAccess } from "@/lib/plans";
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
import { useToast } from "@/components/ui/ToastProvider";

export default function AISportsPage() {
  const toast = useToast();
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  // Premium comes from the plan on the account, checked against one shared list.
  const hasPremium = hasPremiumAccess(currentUser);
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState("squat");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState([]);
  const [useMediaPipe, setUseMediaPipe] = useState(true);
  const [backendLandmarks, setBackendLandmarks] = useState(null);
  // Upload video analysis (separate from live camera)
  const uploadVideoRef = useRef(null);
  const uploadCanvasRef = useRef(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [uploadLandmarks, setUploadLandmarks] = useState(null);
  const [uploadFeedback, setUploadFeedback] = useState([]);
  const [uploadFormScore, setUploadFormScore] = useState(0);
  const [uploadReps, setUploadReps] = useState(0);
  const [uploadAnalyzing, setUploadAnalyzing] = useState(false);
  // true = step through the clip one analysed frame at a time (form review),
  // false = analyse it at normal playback speed. Both stay in sync now that
  // detection is local; stepping is for studying a rep, not for alignment.
  const [uploadSyncMode, setUploadSyncMode] = useState(true);
  const uploadStepActiveRef = useRef(false);

  const exercises = [
    { id: "squat", name: "Squats", icon: Activity },
    { id: "pushup", name: "Push-ups", icon: TrendingUp },
    { id: "lunge", name: "Lunges", icon: Target },
    { id: "plank", name: "Planks", icon: Timer }
  ];

  // -----------------------------
  // Pose analysis (in this browser)
  // -----------------------------
  // PoseEngine finds the 33 landmarks and calls the handlers below; the session
  // in lib/ai/session.js turns them into feedback, a form score and reps.
  //
  // This used to POST a JPEG to the Python service every 200ms. The maths was
  // ported to JS instead (lib/ai/), so AI/mediapipe_api.py is now the reference
  // implementation rather than a runtime dependency: nothing to host, no
  // per-frame network hop, and the overlay lines up because there is no latency
  // to compensate for.

  const liveSessionRef = useRef(null);
  const uploadSessionRef = useRef(null);
  const liveRepsRef = useRef(0);
  const [aiStatus, setAiStatus] = useState({ state: "loading" });

  // The joint angle behind the score, shown live against the target band.
  const [liveAngle, setLiveAngle] = useState(null);
  const [uploadAngle, setUploadAngle] = useState(null);

  // Per-rep quality. The live score swings through every rep by nature, so
  // these are the numbers that actually say how the set went.
  const [liveRepScores, setLiveRepScores] = useState({ last: null, average: null, best: null });
  const [uploadRepScores, setUploadRepScores] = useState({ last: null, average: null, best: null });

  // Playback position, so the panel can show how far through the clip we are.
  const [uploadTime, setUploadTime] = useState(0);
  const [uploadDuration, setUploadDuration] = useState(0);

  // Form score averaged over the whole session. The displayed score is whatever
  // the latest frame said, which is a poor summary -- a set that ended mid-rep
  // would be judged by that one frame.
  const scoreSumRef = useRef(0);
  const scoreCountRef = useRef(0);

  // The saved training log: summary numbers only, never footage (see /privacy).
  const [history, setHistory] = useState([]);
  const [totals, setTotals] = useState(null);
  const [savingWorkout, setSavingWorkout] = useState(false);

  // Rep counting is stateful, so each stream keeps one session across frames.
  const sessionFor = (ref) => {
    if (!ref.current) {
      ref.current = createAnalysisSession(selectedExercise);
    } else {
      // No-op unless the athlete picked a different exercise mid-session.
      ref.current.setExercise(selectedExercise);
    }
    return ref.current;
  };

  const handleLiveLandmarks = (landmarks) => {
    // Draw as soon as the camera is on, so the skeleton is visible before the
    // workout starts and you can frame yourself properly.
    setBackendLandmarks(landmarks);

    // But only judge form and bank reps once recording has begun.
    if (!isRecording) return;

    const result = sessionFor(liveSessionRef).analyse(landmarks);
    setFeedback(result.feedback);
    setFormScore(result.formScore);
    setRepCount(result.reps);
    setLiveAngle(result.angle);
    setLiveRepScores({
      last: result.lastRepScore,
      average: result.averageRepScore,
      best: result.bestRepScore,
    });

    // Only frames where a pose was actually judged count towards the average;
    // frames we declined to score would drag it towards zero.
    if (result.hasPose) {
      scoreSumRef.current += result.formScore;
      scoreCountRef.current += 1;
    }

    const gained = result.reps - liveRepsRef.current;
    liveRepsRef.current = result.reps;
    if (gained > 0) setCalories((prev) => prev + gained * 0.5);
  };

  // -----------------------------
  // Training log
  // -----------------------------
  const loadHistory = async () => {
    try {
      const res = await fetch("/api/workouts?limit=10", { cache: "no-store" });
      if (!res.ok) return; // signed out, or nothing saved yet
      const data = await res.json();
      setHistory(Array.isArray(data.workouts) ? data.workouts : []);
      setTotals(data.totals || null);
    } catch {
      // The log is a nicety; failing to load it must not break the workout page.
    }
  };

  const saveWorkout = async ({ exercise, reps, formScore, durationSeconds, calories }) => {
    setSavingWorkout(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercise, reps, formScore, durationSeconds, calories }),
      });

      if (res.status === 401) {
        toast.info("Sign in to keep a history of your workouts.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success(`Saved: ${reps} reps in ${formatTime(durationSeconds)}.`);
      await loadHistory();
    } catch (error) {
      console.error("Could not save the workout:", error);
      toast.error("Could not save this workout. Your numbers are still on screen.");
    } finally {
      setSavingWorkout(false);
    }
  };

  // How far the frame-by-frame reviewer jumps per analysed frame.
  const UPLOAD_STEP_SECONDS = 1 / 15;

  // Step mode is paced by the analysis, so it needs one decoded frame to get
  // going. A paused <video> that has never played sits at HAVE_METADATA, and
  // MediaPipe cannot read a frame that was never decoded -- which deadlocks:
  // no frame -> no landmarks -> no step -> no frame. A seek forces the decode.
  const waitForDecodedFrame = (video, timeoutMs = 5000) =>
    new Promise((resolve) => {
      if (video.readyState >= 2) return resolve(true);

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        video.removeEventListener("loadeddata", finish);
        video.removeEventListener("seeked", finish);
        resolve(video.readyState >= 2);
      };

      video.addEventListener("loadeddata", finish, { once: true });
      video.addEventListener("seeked", finish, { once: true });

      // Nudge the browser into decoding something.
      try {
        const duration = Number.isFinite(video.duration) ? video.duration : 0;
        const nudge = video.currentTime + 0.001;
        video.currentTime = duration ? Math.min(duration - 0.01, nudge) : nudge;
      } catch {}

      const timer = setTimeout(finish, timeoutMs);
    });

  // If the analysis stalls -- a dropped frame, a detection that throws -- the
  // self-paced loop would stop silently. This keeps it moving.
  const uploadWatchdogRef = useRef(null);
  const lastStepAtRef = useRef(0);

  const startUploadWatchdog = () => {
    if (uploadWatchdogRef.current) clearInterval(uploadWatchdogRef.current);
    lastStepAtRef.current = performance.now();

    uploadWatchdogRef.current = setInterval(() => {
      if (!uploadStepActiveRef.current) return;
      if (performance.now() - lastStepAtRef.current < 2000) return;
      advanceUploadFrame();
    }, 1000);
  };

  const advanceUploadFrame = () => {
    const video = uploadVideoRef.current;
    if (!video || !uploadStepActiveRef.current) return;

    // The previous jump has not landed yet; the frame on screen is still stale.
    if (video.seeking) return;

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (video.ended || (duration && video.currentTime >= duration - 0.001)) {
      stopUploadAnalysis();
      return;
    }

    lastStepAtRef.current = performance.now();
    const next = video.currentTime + UPLOAD_STEP_SECONDS;
    video.currentTime = duration ? Math.min(duration, next) : next;
  };

  const handleUploadLandmarks = (landmarks) => {
    setUploadLandmarks(landmarks);
    if (!uploadAnalyzing) return;

    const result = sessionFor(uploadSessionRef).analyse(landmarks);
    setUploadFeedback(result.feedback);
    setUploadFormScore(result.formScore);
    setUploadReps(result.reps);
    setUploadAngle(result.angle);
    setUploadRepScores({
      last: result.lastRepScore,
      average: result.averageRepScore,
      best: result.bestRepScore,
    });

    // Step mode is paced BY the analysis: advance only after the frame that is
    // currently on screen has been measured. That is what keeps the skeleton on
    // the body rather than trailing a frame or two behind it.
    if (uploadStepActiveRef.current) advanceUploadFrame();
  };

  const stopUploadAnalysis = () => {
    uploadStepActiveRef.current = false;
    if (uploadWatchdogRef.current) {
      clearInterval(uploadWatchdogRef.current);
      uploadWatchdogRef.current = null;
    }
    setUploadAnalyzing(false);
  };

  const startUploadAnalysis = async () => {
    const video = uploadVideoRef.current;
    if (!video || !uploadUrl) return;

    setUploadAnalyzing(true);
    setUploadFeedback([]);
    setUploadFormScore(0);
    setUploadReps(0);
    setUploadLandmarks(null);
    // Drop the old session so this run starts from zero reps.
    uploadSessionRef.current = null;

    if (uploadSyncMode) {
      // Frame-by-frame review. The video is paused and stepped forward by
      // handleUploadLandmarks, one analysed frame at a time.
      try {
        video.pause();
      } catch {}

      const ready = await waitForDecodedFrame(video);
      if (!ready) {
        toast.error("Could not read this video. Try another file, or an MP4 (H.264).");
        stopUploadAnalysis();
        return;
      }

      uploadStepActiveRef.current = true;
      startUploadWatchdog();
    } else {
      // Normal playback, analysed as it plays.
      uploadStepActiveRef.current = false;
      try {
        await video.play();
      } catch {}
    }
  };

  const onUploadFile = (file) => {
    if (!file) return;
    if (uploadUrl) URL.revokeObjectURL(uploadUrl);
    const url = URL.createObjectURL(file);
    setUploadUrl(url);
    setUploadAnalyzing(false);
    // Stop any frame-stepping still running for the previous clip, and drop its
    // analysis session so the new video starts from zero reps.
    uploadStepActiveRef.current = false;
    uploadSessionRef.current = null;
    setUploadLandmarks(null);
    setUploadAngle(null);
    setUploadRepScores({ last: null, average: null, best: null });
    setUploadTime(0);
    setUploadDuration(0);
    setUploadFeedback([]);
    setUploadFormScore(0);
    setUploadReps(0);
  };

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

  // Ask the server who is signed in. This used to read localStorage["currentUser"],
  // a key nothing ever writes -- so it was always null and every premium playlist
  // stayed locked, including for people paying for one.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.authenticated && data.user) {
          setCurrentUser(data.user);
          loadHistory();
        }
      } catch (error) {
        console.error("Could not load the signed-in user:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const startCamera = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("This browser cannot access the camera. Try Chrome, Firefox, or Edge.", { title: "Camera unavailable" });
        return;
      }

      // Request camera with specific constraints for better compatibility
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Store stream first, then render the video by enabling cameraActive.
      // The actual attachment to <video> happens in a useEffect once the element exists.
      streamRef.current = stream;
      setStreamReady(false);
      setCameraStream(stream);
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
      
      toast.error(errorMessage, { title: "Camera error" });
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
    setStreamReady(false);
    setCameraStream(null);
    setIsRecording(false);
    setBackendLandmarks(null);
  };

  // Attach stream to the video element once it is mounted.
  useEffect(() => {
    if (!cameraActive) return;
    if (!cameraStream) return;
    if (!videoRef.current) return;

    const videoEl = videoRef.current;

    try {
      videoEl.srcObject = cameraStream;
    } catch (e) {
      // Fallback for older browsers (rare)
      console.error("Failed to set video.srcObject:", e);
    }

    const updateCanvasToContainer = () => {
      if (!canvasRef.current) return;
      const container = canvasRef.current.parentElement;
      if (!container) return;
      canvasRef.current.width = container.offsetWidth;
      canvasRef.current.height = container.offsetHeight;
    };

    const tryPlay = async () => {
      try {
        await videoEl.play();
      } catch (err) {
        console.error("Video play() failed:", err);
      }
    };

    const onLoadedMetadata = () => {
      updateCanvasToContainer();
      setStreamReady(true);
      tryPlay();
    };

    const onCanPlay = () => {
      setStreamReady(true);
      tryPlay();
    };

    videoEl.addEventListener("loadedmetadata", onLoadedMetadata);
    videoEl.addEventListener("canplay", onCanPlay);

    // If metadata is already available (rare), proceed immediately
    if (videoEl.readyState >= 1) {
      onLoadedMetadata();
    }

    // Give it an extra nudge after mount
    setTimeout(() => {
      if (!videoEl.paused) return;
      tryPlay();
    }, 150);

    return () => {
      videoEl.removeEventListener("loadedmetadata", onLoadedMetadata);
      videoEl.removeEventListener("canplay", onCanPlay);
    };
  }, [cameraActive, cameraStream]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRepCount(0);
      setFormScore(0);
      setWorkoutTime(0);
      setCalories(0);
      liveRepsRef.current = 0;
      scoreSumRef.current = 0;
      scoreCountRef.current = 0;
      // Fresh session so reps and rep-counter phase start clean.
      liveSessionRef.current = null;
      
      // Timer for workout duration
      const timeInterval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
      
      // Store interval IDs for cleanup
      if (videoRef.current) {
        videoRef.current.dataset.timeIntervalId = timeInterval;
      }

      // No analysis loop to start: PoseEngine is already running whenever the
      // camera is on, and handleLiveLandmarks begins scoring once isRecording
      // flips to true.
    } else {
      setIsRecording(false);
      if (videoRef.current) {
        if (videoRef.current.dataset.timeIntervalId) {
          clearInterval(parseInt(videoRef.current.dataset.timeIntervalId));
        }
      }

      // Record the session, but not an accidental one -- a tap of start/stop
      // with nothing counted is not a workout worth keeping.
      const averageScore = scoreCountRef.current
        ? Math.round(scoreSumRef.current / scoreCountRef.current)
        : 0;

      if (repCount > 0 || workoutTime >= 10) {
        saveWorkout({
          exercise: selectedExercise,
          reps: repCount,
          formScore: averageScore,
          durationSeconds: workoutTime,
          calories: Math.round(calories),
        });
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaylistClick = (playlist) => {
    if (!playlist.isFree && !hasPremium) {
      toast.warning("This playlist is part of the premium plan. Upgrade to unlock it.", { title: "Premium only" });
      return;
    }
    setSelectedPlaylist(playlist);
    setPlaylistVideos(playlist.videoList || []);
  };

  const closePlaylistModal = () => {
    setSelectedPlaylist(null);
    setPlaylistVideos([]);
  };

  // Initialize canvas dimensions when camera becomes active
  useEffect(() => {
    if (cameraActive && canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const updateCanvasSize = () => {
          if (canvasRef.current && container) {
            canvasRef.current.width = container.offsetWidth;
            canvasRef.current.height = container.offsetHeight;
          }
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
      }
    }
  }, [cameraActive]);

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

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#C8CDC5]/30">
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
                    <div className="relative w-full h-full min-h-[400px] md:min-h-[600px] bg-black flex items-center justify-center overflow-hidden">
                      {!streamReady && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p>Initializing camera...</p>
                          </div>
                        </div>
                      )}
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-contain ${streamReady ? 'opacity-100' : 'opacity-0'}`}
                        style={{ 
                          transform: 'scaleX(-1)',
                          display: 'block',
                          maxWidth: '100%',
                          maxHeight: '100%',
                          minHeight: '100%'
                        }}
                      />
                      {/* Debug info */}
                      {useMediaPipe && (
                        <canvas
                          ref={canvasRef}
                          className="absolute inset-0 pointer-events-none z-10"
                          style={{ 
                            backgroundColor: 'transparent',
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      )}
                      <PoseEngine
                        videoRef={videoRef}
                        isActive={useMediaPipe && cameraActive && streamReady}
                        onLandmarks={handleLiveLandmarks}
                        onStatus={setAiStatus}
                      />
                      <PoseOverlay
                        videoRef={videoRef}
                        canvasRef={canvasRef}
                        landmarks={backendLandmarks}
                        enabled={useMediaPipe && cameraActive && streamReady}
                        // The preview video is CSS-flipped (scaleX(-1)) so it reads
                        // like a mirror, so the landmarks have to be flipped to match.
                        mirror={true}
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
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white/90 px-3 py-1.5 rounded-full text-xs z-10">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Processed on your device — nothing uploaded</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Analytics Panel */}
                <div className="p-8 bg-gradient-to-br from-white to-[#C8CDC5]/10">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-bold text-[#354F52]">AI Analysis</h3>
                    {cameraActive && (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          isRecording ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isRecording ? "animate-pulse bg-red-500" : "bg-gray-400"
                          }`}
                        />
                        {isRecording ? "Recording" : "Ready"}
                      </span>
                    )}
                  </div>
                  
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

                      {/* The saved log. Summary numbers only: this is what makes
                          progress tracking possible without keeping footage. */}
                      {currentUser && (
                        <div className="mt-6 rounded-xl border-2 border-[#C8CDC5] p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-[#354F52]">Your recent sessions</h4>
                            {totals?.sessions > 0 && (
                              <span className="text-xs text-gray-500">
                                {totals.sessions} total
                              </span>
                            )}
                          </div>

                          {history.length === 0 ? (
                            <p className="text-sm text-gray-600">
                              Finish a workout and it will be saved here — the exercise,
                              your reps, your average form score and how long it took.
                              Never any video.
                            </p>
                          ) : (
                            <>
                              {totals && (
                                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                                  <div className="rounded-lg bg-[#6BB371]/10 py-2">
                                    <div className="text-lg font-bold text-[#354F52]">
                                      {totals.reps}
                                    </div>
                                    <div className="text-[11px] text-gray-600">total reps</div>
                                  </div>
                                  <div className="rounded-lg bg-[#52796F]/10 py-2">
                                    <div className="text-lg font-bold text-[#354F52]">
                                      {formatTime(totals.seconds)}
                                    </div>
                                    <div className="text-[11px] text-gray-600">total time</div>
                                  </div>
                                  <div className="rounded-lg bg-[#354F52]/10 py-2">
                                    <div className="text-lg font-bold text-[#354F52]">
                                      {totals.averageFormScore}
                                    </div>
                                    <div className="text-[11px] text-gray-600">avg form</div>
                                  </div>
                                </div>
                              )}

                              <ul className="divide-y divide-[#C8CDC5]/60">
                                {history.map((w) => (
                                  <li key={w.id} className="flex items-center justify-between py-2">
                                    <div>
                                      <span className="text-sm font-medium text-[#354F52] capitalize">
                                        {w.exercise.replace(/_/g, " ")}
                                      </span>
                                      <span className="block text-[11px] text-gray-500">
                                        {new Date(w.created_at).toLocaleDateString(undefined, {
                                          day: "numeric",
                                          month: "short",
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-700">
                                      <span>
                                        <strong className="text-[#354F52]">{w.reps}</strong> reps
                                      </span>
                                      <span>{formatTime(w.duration_seconds)}</span>
                                      <span
                                        className={
                                          w.form_score >= 85
                                            ? "text-[#6BB371] font-semibold"
                                            : "text-amber-600 font-semibold"
                                        }
                                      >
                                        {w.form_score}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      )}

                      {/* Stated here, next to the permission prompt, because that is
                          where it is relevant. Claims only what the code does: the
                          camera path is local, uploads elsewhere on the site are not
                          covered by this. */}
                      <div className="flex items-start gap-3 p-4 bg-[#6BB371]/10 rounded-xl border-2 border-[#6BB371]/30">
                        <Lock className="w-6 h-6 text-[#6BB371] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-[#354F52] mb-1">
                            Your camera stays on your device
                          </h4>
                          <p className="text-sm text-gray-600">
                            The pose model runs inside your browser. No image or video from
                            your camera is uploaded, sent to our servers, or stored anywhere —
                            only you ever see it. Reps and form scores are worked out on your
                            device too.{" "}
                            <a
                              href="/privacy#camera"
                              className="font-medium text-[#52796F] underline hover:text-[#354F52]"
                            >
                              How this works
                            </a>
                            .
                          </p>
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
                      {/* Step 1 -- the choice everything else depends on. */}
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#354F52] text-xs font-bold text-white">
                            1
                          </span>
                          <h4 className="text-sm font-semibold text-[#354F52]">
                            Choose your exercise
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {exercises.map((exercise) => {
                            const active = selectedExercise === exercise.id;
                            return (
                              <button
                                key={exercise.id}
                                onClick={() => setSelectedExercise(exercise.id)}
                                disabled={isRecording}
                                className={`flex items-center gap-2.5 rounded-xl p-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                                  active
                                    ? "bg-[#6BB371] text-white shadow-md"
                                    : "border-2 border-[#C8CDC5] bg-white text-[#354F52] hover:border-[#6BB371]"
                                }`}
                              >
                                <exercise.icon className="h-4 w-4 shrink-0" />
                                {exercise.name}
                              </button>
                            );
                          })}
                        </div>
                        {isRecording && (
                          <p className="mt-2 text-[11px] text-gray-500">
                            Stop the set to switch exercise.
                          </p>
                        )}
                      </div>

                      {/* Step 2 -- what good looks like, before you attempt it. */}
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#354F52] text-xs font-bold text-white">
                            2
                          </span>
                          <h4 className="text-sm font-semibold text-[#354F52]">
                            Learn the movement
                          </h4>
                        </div>
                        <ExerciseGuide exercise={selectedExercise} angle={liveAngle} />
                      </div>

                      {/* Step 3 -- train. */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#354F52] text-xs font-bold text-white">
                          3
                        </span>
                        <h4 className="text-sm font-semibold text-[#354F52]">Train</h4>
                      </div>

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

                        {/* This slot used to show an invented heart rate. A camera
                            cannot measure one -- but it can measure how good the
                            last rep was, which is worth the space. */}
                        <div className="rounded-xl bg-gradient-to-br from-[#52796F] to-[#354F52] p-4 text-white">
                          <div className="mb-1 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            <span className="text-xs font-medium opacity-90">Last rep</span>
                          </div>
                          <div className="text-3xl font-bold tabular-nums">
                            {liveRepScores.last ?? "-"}
                          </div>
                          <div className="mt-0.5 text-[11px] opacity-80">
                            {liveRepScores.average != null
                              ? `avg ${liveRepScores.average} - best ${liveRepScores.best}`
                              : "scored at the bottom of each rep"}
                          </div>
                        </div>
                      </div>

                      {/* Form Score */}
                      <div className="bg-white border-2 border-[#C8CDC5] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[#354F52]">
                            Live form
                            <span className="ml-1.5 font-normal text-gray-500">this frame</span>
                          </span>
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
                            {formScore >= 90 ? "Excellent form" :
                             formScore >= 80 ? "Good form — keep it up" :
                             "Focus on your form"}
                          </p>
                        )}
                      </div>

                      {/* Model status: the first load fetches and compiles the
                          pose WASM, which is a visible wait on a cold cache. */}
                      {useMediaPipe && cameraActive && aiStatus.state !== "ready" && (
                        <div
                          className={`border-2 rounded-xl p-4 ${
                            aiStatus.state === "error"
                              ? "bg-red-50 border-red-200"
                              : "bg-amber-50 border-amber-200"
                          }`}
                        >
                          {aiStatus.state === "error" ? (
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-red-900">
                                  Pose detection could not start
                                </p>
                                <p className="text-sm text-red-800">
                                  {aiStatus.error} — this needs a browser with WebAssembly
                                  enabled. Try Chrome, Edge or Safari.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600" />
                              <span className="text-sm font-semibold text-amber-900">
                                Loading the pose model…
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Coloured by the verdict rather than always blue, so a
                          correction is distinguishable from praise at a glance. */}
                      {feedback.length > 0 && (
                        <div
                          className={`rounded-xl border-2 p-4 ${
                            formScore >= 88
                              ? "border-[#6BB371]/40 bg-[#6BB371]/10"
                              : "border-amber-200 bg-amber-50"
                          }`}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <Zap
                              className={`h-4 w-4 ${
                                formScore >= 88 ? "text-[#6BB371]" : "text-amber-600"
                              }`}
                            />
                            <span
                              className={`text-sm font-semibold ${
                                formScore >= 88 ? "text-[#2f6b39]" : "text-amber-900"
                              }`}
                            >
                              Coaching cue
                            </span>
                          </div>
                          <div className="space-y-1">
                            {feedback.map((fb, index) => (
                              <p
                                key={index}
                                className={`text-sm ${
                                  formScore >= 88 ? "text-[#354F52]" : "text-amber-900"
                                }`}
                              >
                                {fb}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Controls */}
                      <div className="space-y-3">
                        <button
                          onClick={toggleRecording}
                          disabled={savingWorkout}
                          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                            isRecording
                              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                              : "bg-gradient-to-r from-[#354F52] to-[#52796F] hover:from-[#52796F] hover:to-[#6BB371] text-white"
                          }`}
                        >
                          {savingWorkout ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                              Saving…
                            </>
                          ) : isRecording ? (
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

        {/* Upload Video AI Analysis Section */}
        <section className="py-16 px-8 md:px-16 bg-gradient-to-b from-white to-[#C8CDC5]/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#354F52]/10 rounded-full mb-4">
                <Video className="w-5 h-5 text-[#354F52]" />
                <span className="text-sm font-semibold text-[#354F52]">Upload Video</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#354F52] mb-3">
                Analyze an <span className="text-[#6BB371]">Uploaded Video</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload a workout video and let the AI analyze it (same model as the live camera).
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#C8CDC5]/30">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Video Preview */}
                <div className="relative bg-black min-h-[320px] md:min-h-[520px] flex items-center justify-center">
                  {!uploadUrl ? (
                    <div className="p-8 text-center">
                      <p className="text-white/80 mb-4">Choose a video to analyze</p>
                      <label className="inline-flex items-center gap-2 bg-[#6BB371] text-white px-6 py-3 rounded-xl font-semibold cursor-pointer hover:bg-[#5FA361] transition-all">
                        <Video className="w-5 h-5" />
                        Select Video
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => onUploadFile(e.target.files?.[0])}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        ref={uploadVideoRef}
                        src={uploadUrl}
                        // Without this the browser fetches metadata only, so a paused
                        // video has no decoded frame for the pose model to read.
                        preload="auto"
                        // Native controls add a bottom bar that breaks overlay alignment (canvas covers full element).
                        // Hide controls while analyzing so landmarks map 1:1 to the displayed video image.
                        controls={!uploadAnalyzing}
                        onLoadedMetadata={(e) =>
                          setUploadDuration(Number.isFinite(e.target.duration) ? e.target.duration : 0)
                        }
                        onTimeUpdate={(e) => setUploadTime(e.target.currentTime || 0)}
                        onSeeked={(e) => setUploadTime(e.target.currentTime || 0)}
                        className="w-full h-full object-contain"
                        // Uploaded videos are typically already in correct orientation; don't mirror.
                        onEnded={() => stopUploadAnalysis()}
                      />
                      <canvas
                        ref={uploadCanvasRef}
                        className="absolute inset-0 pointer-events-none"
                        style={{ backgroundColor: "transparent", width: "100%", height: "100%" }}
                      />
                      <PoseEngine
                        videoRef={uploadVideoRef}
                        isActive={useMediaPipe && !!uploadUrl}
                        onLandmarks={handleUploadLandmarks}
                        onStatus={setAiStatus}
                      />
                      <PoseOverlay
                        videoRef={uploadVideoRef}
                        canvasRef={uploadCanvasRef}
                        landmarks={uploadLandmarks}
                        enabled={useMediaPipe && !!uploadUrl}
                        // An uploaded video is shown as-is, not mirrored.
                        mirror={false}
                      />
                    </div>
                  )}
                </div>

                {/* Analysis Panel */}
                <div className="p-8 bg-gradient-to-br from-white to-[#C8CDC5]/10">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-bold text-[#354F52]">Video Analysis</h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        uploadAnalyzing
                          ? "bg-[#6BB371]/15 text-[#3d7a45]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          uploadAnalyzing ? "animate-pulse bg-[#6BB371]" : "bg-gray-400"
                        }`}
                      />
                      {uploadAnalyzing ? "Analysing" : "Paused"}
                    </span>
                  </div>

                  {/* Step 1 -- the choice everything else depends on. Picking the
                      wrong exercise measures the wrong joints, so it leads. */}
                  <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#354F52] text-xs font-bold text-white">
                        1
                      </span>
                      <h4 className="text-sm font-semibold text-[#354F52]">
                        Which exercise is in this video?
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {exercises.map((exercise) => {
                        const active = selectedExercise === exercise.id;
                        return (
                          <button
                            key={exercise.id}
                            onClick={() => setSelectedExercise(exercise.id)}
                            disabled={uploadAnalyzing}
                            className={`flex items-center gap-2.5 rounded-xl p-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                              active
                                ? "bg-[#6BB371] text-white shadow-md"
                                : "border-2 border-[#C8CDC5] bg-white text-[#354F52] hover:border-[#6BB371]"
                            }`}
                          >
                            <exercise.icon className="h-4 w-4 shrink-0" />
                            {exercise.name}
                          </button>
                        );
                      })}
                    </div>
                    {uploadAnalyzing && (
                      <p className="mt-2 text-[11px] text-gray-500">
                        Stop the analysis to switch exercise.
                      </p>
                    )}
                  </div>

                  {/* Step 2 -- what good looks like, for the exercise just chosen. */}
                  <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#354F52] text-xs font-bold text-white">
                        2
                      </span>
                      <h4 className="text-sm font-semibold text-[#354F52]">
                        Learn the movement
                      </h4>
                    </div>
                    <ExerciseGuide exercise={selectedExercise} angle={uploadAngle} />
                  </div>

                  {/* Step 3 -- run it. */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#354F52] text-xs font-bold text-white">
                      3
                    </span>
                    <h4 className="text-sm font-semibold text-[#354F52]">Analyse the clip</h4>
                  </div>

                  {/* Progress through the clip. In step mode the video never
                      plays, so this is the only indication that it is moving. */}
                  {uploadDuration > 0 && (
                    <div className="mb-5">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#C8CDC5]/50">
                        <div
                          className="h-full rounded-full bg-[#6BB371] transition-[width] duration-150"
                          style={{
                            width: `${Math.min(100, (uploadTime / uploadDuration) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[11px] tabular-nums text-gray-500">
                        <span>{formatTime(Math.floor(uploadTime))}</span>
                        <span>{formatTime(Math.floor(uploadDuration))}</span>
                      </div>
                    </div>
                  )}

                  {/* Mode. A two-option segmented control reads as a choice;
                      the old single button did not say what the other state was. */}
                  <div className="mb-5">
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Analysis mode
                      </span>
                      {uploadAnalyzing && (
                        <span className="text-[11px] text-gray-400">stop to change</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#C8CDC5]/30 p-1">
                      {[
                        { on: true, label: "Step", hint: "frame by frame" },
                        { on: false, label: "Play", hint: "at normal speed" },
                      ].map((mode) => (
                        <button
                          key={mode.label}
                          type="button"
                          disabled={uploadAnalyzing}
                          onClick={() => setUploadSyncMode(mode.on)}
                          className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed ${
                            uploadSyncMode === mode.on
                              ? "bg-white text-[#354F52] shadow-sm"
                              : "text-gray-600 hover:text-[#354F52]"
                          } ${uploadAnalyzing ? "opacity-60" : ""}`}
                        >
                          {mode.label}
                          <span className="block text-[11px] font-normal opacity-70">
                            {mode.hint}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {uploadUrl && (
                    <button
                      onClick={uploadAnalyzing ? stopUploadAnalysis : startUploadAnalysis}
                      className={`mb-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold shadow-lg transition-all ${
                        uploadAnalyzing
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                          : "bg-gradient-to-r from-[#354F52] to-[#52796F] text-white hover:from-[#52796F] hover:to-[#6BB371]"
                      }`}
                    >
                      {uploadAnalyzing ? (
                        <>
                          <div className="h-4 w-4 rounded-sm bg-white" />
                          Stop Analysis
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" fill="white" />
                          Start Analysis
                        </>
                      )}
                    </button>
                  )}

                  {/* Reps and the live score are instantaneous; the rep scores
                      are the ones that say whether the set was any good. */}
                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-[#6BB371] to-[#52796F] p-4 text-white">
                      <div className="mb-1 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span className="text-xs font-medium opacity-90">Reps</span>
                      </div>
                      <div className="text-3xl font-bold tabular-nums">{uploadReps}</div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-[#354F52] to-[#52796F] p-4 text-white">
                      <div className="mb-1 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-xs font-medium opacity-90">Live score</span>
                      </div>
                      <div className="text-3xl font-bold tabular-nums">{uploadFormScore}</div>
                      <div className="mt-0.5 text-[11px] opacity-80">this frame</div>
                    </div>
                  </div>

                  <div className="mb-5 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Last rep", uploadRepScores.last],
                      ["Average", uploadRepScores.average],
                      ["Best", uploadRepScores.best],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl border-2 border-[#C8CDC5] py-2.5">
                        <div
                          className={`text-xl font-bold tabular-nums ${
                            value == null
                              ? "text-gray-300"
                              : value >= 88
                                ? "text-[#6BB371]"
                                : "text-amber-600"
                          }`}
                        >
                          {value ?? "—"}
                        </div>
                        <div className="text-[11px] text-gray-500">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Model status for the upload flow. Without this, a failure to
                      start the pose model shows up as nothing happening at all:
                      no skeleton, no feedback, no explanation. */}
                  {useMediaPipe && uploadUrl && aiStatus.state !== "ready" && (
                    <div
                      className={`border-2 rounded-xl p-4 mb-4 ${
                        aiStatus.state === "error"
                          ? "bg-red-50 border-red-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      {aiStatus.state === "error" ? (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-red-900">
                              Pose detection could not start
                            </p>
                            <p className="text-sm text-red-800">{aiStatus.error}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600" />
                          <span className="text-sm font-semibold text-amber-900">
                            Loading the pose model…
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {uploadFeedback.length > 0 && (
                    <div
                      className={`mb-5 rounded-xl border-2 p-4 ${
                        uploadFormScore >= 88
                          ? "border-[#6BB371]/40 bg-[#6BB371]/10"
                          : "border-amber-200 bg-amber-50"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Zap
                          className={`h-4 w-4 ${
                            uploadFormScore >= 88 ? "text-[#6BB371]" : "text-amber-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            uploadFormScore >= 88 ? "text-[#2f6b39]" : "text-amber-900"
                          }`}
                        >
                          Coaching cue
                        </span>
                      </div>
                      <div className="space-y-1">
                        {uploadFeedback.map((fb, index) => (
                          <p
                            key={index}
                            className={`text-sm ${
                              uploadFormScore >= 88 ? "text-[#354F52]" : "text-amber-900"
                            }`}
                          >
                            {fb}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {!uploadUrl ? (
                      <p className="text-sm text-gray-600">Upload a video to start.</p>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            stopUploadAnalysis();
                            if (uploadUrl) URL.revokeObjectURL(uploadUrl);
                            setUploadUrl(null);
                          }}
                          className="w-full rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 hover:text-[#354F52]"
                        >
                          Choose a different video
                        </button>

                        {/* Replaces the old tip, which described the removed
                            server-analysis flow ("press Play, the AI analyzes
                            while the video is playing"). */}
                        <p className="flex items-start gap-1.5 text-xs text-gray-500">
                          <Lock className="mt-0.5 h-3 w-3 shrink-0" />
                          <span>
                            Analysed in your browser — this video is never uploaded.
                            {uploadSyncMode
                              ? " Step mode advances one analysed frame at a time, so it runs slower than real time."
                              : " Play mode analyses the clip as it plays."}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
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
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-lg transition-all duration-300 border border-[#C8CDC5]/30 cursor-pointer"
                  onClick={() => handlePlaylistClick(playlist)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                        !playlist.isFree && !hasPremium ? 'blur-sm' : ''
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
                        {playlist.isFree || hasPremium ? (
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
                    {!playlist.isFree && !hasPremium && (
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
              className="mt-16 bg-gradient-to-br from-[#354F52] via-[#52796F] to-[#6BB371] rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden"
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

