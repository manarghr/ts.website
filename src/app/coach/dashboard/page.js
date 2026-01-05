"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import { Activity, Camera, Dumbbell, ExternalLink, Flame, Sparkles, Trophy } from "lucide-react";

function fmtErr(e) {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  return e.message || "Unknown error";
}

export default function CoachDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [coachId, setCoachId] = useState(null);
  const [coach, setCoach] = useState(null);
  const [tab, setTab] = useState("profile"); // profile | announcements | programs | blogs | videos
  const [err, setErr] = useState("");

  // profile form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Strength");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // announcements
  const [announcements, setAnnouncements] = useState([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annDate, setAnnDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [annContent, setAnnContent] = useState("");
  const [annSaving, setAnnSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: "", date: "", content: "" });

  // programs
  const [programs, setPrograms] = useState([]);
  const [programLoading, setProgramLoading] = useState(false);
  const [programSaving, setProgramSaving] = useState(false);
  const [programName, setProgramName] = useState("");
  const [programDuration, setProgramDuration] = useState("");
  const [programGoal, setProgramGoal] = useState("");
  const [programPrice, setProgramPrice] = useState(0);
  const [programDescription, setProgramDescription] = useState("");
  const [programEditingId, setProgramEditingId] = useState(null);
  const [programDraft, setProgramDraft] = useState({
    name: "",
    duration: "",
    goal: "",
    price: 0,
    description: "",
  });

  // blogs
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogSaving, setBlogSaving] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({
    id: "",
    title: "",
    excerpt: "",
    author: "",
    date: "",
    readTime: "",
    image: "",
    category: "training",
    sections: [{ title: "", content: "" }],
  });

  // videos
  const [videos, setVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumb, setVideoThumb] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState("");
  const [videoEditingId, setVideoEditingId] = useState(null);
  const [videoDraft, setVideoDraft] = useState({
    title: "",
    video_url: "",
    thumbnail_url: "",
    duration: "",
  });

  const profileDirty = useMemo(() => {
    if (!coach) return false;
    return (
      name !== (coach.name || "") ||
      category !== (coach.category || "Strength") ||
      bio !== (coach.bio || "") ||
      imageUrl !== (coach.image_url || "")
    );
  }, [coach, name, category, bio, imageUrl]);

  const avatarUrl = coach?.image_url || "/placeholder.svg";
  const effectivePreviewImage = imageUrl || coach?.image_url || "";

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) throw new Error(data.error || "Failed to upload image");
      setImageUrl(data.imageUrl || "");
    } catch (err) {
      alert(err?.message || "Failed to upload image");
    }
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a video file (MP4, WebM, OGG, MOV, or AVI)");
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert("Video size should be less than 500MB");
      return;
    }

    setVideoFile(file);
    setVideoUploading(true);
    setVideoUploadProgress("Uploading video...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/video", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) throw new Error(data.error || "Failed to upload video");
      setVideoUrl(data.videoUrl || "");
      setVideoUploadProgress("Video uploaded successfully!");
      setTimeout(() => setVideoUploadProgress(""), 3000);
    } catch (err) {
      alert(err?.message || "Failed to upload video");
      setVideoUploadProgress("");
      setVideoFile(null);
    } finally {
      setVideoUploading(false);
    }
  };

  const titleCase = (s) => {
    if (!s || typeof s !== "string") return "";
    return s
      .split(/[\s_-]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  };

  const displayName = titleCase(coach?.name || name || "Coach");
  const displayCategory = titleCase(coach?.category || category || "Fitness");

  const loadMe = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/coach/me", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setCoachId(data.coachId);
      setCoach(data.coach);

      setName(data.coach?.name || "");
      setCategory(data.coach?.category || "Strength");
      setBio(data.coach?.bio || "");
      setImageUrl(data.coach?.image_url || "");
    } catch (e) {
      setErr(fmtErr(e));
      setCoachId(null);
      setCoach(null);
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    setAnnLoading(true);
    try {
      const res = await fetch("/api/coach/announcements", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setAnnouncements(Array.isArray(data.announcements) ? data.announcements : []);
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setAnnLoading(false);
    }
  };

  const loadPrograms = async () => {
    setProgramLoading(true);
    try {
      const res = await fetch("/api/coach/programs", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setPrograms(Array.isArray(data.programs) ? data.programs : []);
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setProgramLoading(false);
    }
  };

  const loadBlogs = async () => {
    setBlogLoading(true);
    try {
      const res = await fetch("/api/coach/blogs", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setBlogLoading(false);
    }
  };

  const loadVideos = async () => {
    setVideoLoading(true);
    try {
      const res = await fetch("/api/coach/videos", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setVideos(Array.isArray(data.videos) ? data.videos : []);
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setVideoLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  useEffect(() => {
    if (!coachId) return;
    if (tab === "announcements") loadAnnouncements();
    if (tab === "programs") loadPrograms();
    if (tab === "blogs") loadBlogs();
    if (tab === "videos") loadVideos();
  }, [tab, coachId]);

  const logout = async () => {
    try {
      await fetch("/api/coach/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setErr("");
    try {
      const res = await fetch("/api/coach/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          bio,
          image_url: imageUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setCoach(data.coach);
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setSavingProfile(false);
    }
  };

  const createAnnouncement = async () => {
    setAnnSaving(true);
    setErr("");
    try {
      const res = await fetch("/api/coach/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: annTitle, content: annContent, date: annDate }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setAnnTitle("");
      setAnnContent("");
      await loadAnnouncements();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setAnnSaving(false);
    }
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    setEditDraft({ title: a.title || "", date: a.date || "", content: a.content || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ title: "", date: "", content: "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setAnnSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/coach/announcements/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      cancelEdit();
      await loadAnnouncements();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setAnnSaving(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!id) return;
    if (!confirm("Delete this announcement?")) return;
    setAnnSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/coach/announcements/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      await loadAnnouncements();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setAnnSaving(false);
    }
  };

  // -------- Programs CRUD --------
  const createProgram = async () => {
    setProgramSaving(true);
    setErr("");
    try {
      const res = await fetch("/api/coach/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: programName,
          description: programDescription,
          duration: programDuration,
          goal: programGoal,
          price: Number(programPrice || 0),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setProgramName("");
      setProgramDescription("");
      setProgramDuration("");
      setProgramGoal("");
      setProgramPrice(0);
      await loadPrograms();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setProgramSaving(false);
    }
  };

  const startProgramEdit = (p) => {
    setProgramEditingId(p.id);
    setProgramDraft({
      name: p.name || "",
      duration: p.duration || "",
      goal: p.goal || "",
      price: p.price || 0,
      description: p.description || "",
    });
  };
  const cancelProgramEdit = () => {
    setProgramEditingId(null);
    setProgramDraft({ name: "", duration: "", goal: "", price: 0, description: "" });
  };
  const saveProgramEdit = async () => {
    if (!programEditingId) return;
    setProgramSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/coach/programs/${programEditingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programDraft),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      cancelProgramEdit();
      await loadPrograms();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setProgramSaving(false);
    }
  };
  const deleteProgram = async (id) => {
    if (!id) return;
    if (!confirm("Delete this program?")) return;
    setProgramSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/coach/programs/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      await loadPrograms();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setProgramSaving(false);
    }
  };

  // -------- Blogs CRUD --------
  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.excerpt) {
      alert("Title and excerpt are required");
      return;
    }
    setBlogSaving(true);
    setErr("");
    try {
      const res = await fetch("/api/coach/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogForm.title,
          excerpt: blogForm.excerpt,
          author: blogForm.author || coach?.name || "Coach",
          date: blogForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          readTime: blogForm.readTime || "5 min read",
          image: blogForm.image || "",
          category: blogForm.category,
          sections: blogForm.sections || [{ title: "", content: "" }],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      alert(data.message || "Blog submitted for review. It will be published after admin approval.");
      setShowBlogForm(false);
      setBlogForm({
        id: "",
        title: "",
        excerpt: "",
        author: "",
        date: "",
        readTime: "",
        image: "",
        category: "training",
        sections: [{ title: "", content: "" }],
      });
      await loadBlogs();
    } catch (e) {
      setErr(fmtErr(e));
      alert(fmtErr(e));
    } finally {
      setBlogSaving(false);
    }
  };

  const openEditBlog = (blog) => {
    setBlogForm({
      id: blog.id,
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      author: blog.author || "",
      date: blog.date || "",
      readTime: blog.readTime || "",
      image: blog.image || "",
      category: blog.category || "training",
      sections: blog.sections || [{ title: "", content: "" }],
    });
    setShowBlogForm(true);
  };

  const addSection = () => {
    setBlogForm({
      ...blogForm,
      sections: [...blogForm.sections, { title: "", content: "" }]
    });
  };

  const removeSection = (index) => {
    const newSections = blogForm.sections.filter((_, i) => i !== index);
    setBlogForm({ ...blogForm, sections: newSections });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...blogForm.sections];
    newSections[index][field] = value;
    setBlogForm({ ...blogForm, sections: newSections });
  };

  const deleteBlog = async (id) => {
    if (!id) return;
    if (!confirm("Delete this blog post?")) return;
    setBlogSaving(true);
    setErr("");
    try {
      // Check if it's a pending blog or approved blog
      const blog = blogs.find(b => b.id === id);
      const endpoint = blog?.status === "pending" 
        ? `/api/admin/blogs/pending/${id}` 
        : `/api/coach/blogs/${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      await loadBlogs();
    } catch (e) {
      setErr(fmtErr(e));
      alert(fmtErr(e));
    } finally {
      setBlogSaving(false);
    }
  };

  // -------- Videos CRUD --------
  const createVideo = async () => {
    if (!videoUrl) {
      alert("Please upload a video file first");
      return;
    }
    if (!videoTitle.trim()) {
      alert("Please enter a video title");
      return;
    }
    setVideoSaving(true);
    setErr("");
    try {
      const res = await fetch("/api/coach/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: videoTitle,
          video_url: videoUrl,
          thumbnail_url: videoThumb,
          duration: videoDuration,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setVideoTitle("");
      setVideoUrl("");
      setVideoThumb("");
      setVideoDuration("");
      setVideoFile(null);
      setVideoUploadProgress("");
      await loadVideos();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setVideoSaving(false);
    }
  };
  const startVideoEdit = (v) => {
    setVideoEditingId(v.id);
    setVideoDraft({
      title: v.title || "",
      video_url: v.video_url || "",
      thumbnail_url: v.thumbnail_url || "",
      duration: v.duration || "",
    });
  };
  const cancelVideoEdit = () => {
    setVideoEditingId(null);
    setVideoDraft({ title: "", video_url: "", thumbnail_url: "", duration: "" });
  };
  const saveVideoEdit = async () => {
    if (!videoEditingId) return;
    setVideoSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/coach/videos/${videoEditingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoDraft),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      cancelVideoEdit();
      await loadVideos();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setVideoSaving(false);
    }
  };
  const deleteVideo = async (id) => {
    if (!id) return;
    if (!confirm("Delete this video?")) return;
    setVideoSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/coach/videos/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      await loadVideos();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setVideoSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen relative pb-16">
        {/* Animated soft background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8f0eb] via-[#f5f7f6] to-[#e2ebe4]" />
          <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_20%_20%,rgba(107,179,113,0.35),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(82,121,111,0.35),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(53,79,82,0.22),transparent_40%)]" />
          <div className="absolute -top-24 -left-16 w-[420px] h-[420px] bg-[#6BB371]/15 rounded-full blur-[140px]" />
          <div className="absolute top-10 right-[-120px] w-[520px] h-[520px] bg-[#52796F]/12 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-160px] left-1/2 -translate-x-1/2 w-[620px] h-[620px] bg-[#354F52]/10 rounded-full blur-[200px]" />
          {/* Grid overlay (subtle blueprint feel) */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(53,79,82,0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(53,79,82,0.08) 1px, transparent 1px),
                linear-gradient(to right, rgba(53,79,82,0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(53,79,82,0.04) 1px, transparent 1px)
              `,
              backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
              maskImage: "radial-gradient(circle at 50% 30%, black 0%, black 55%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(circle at 50% 30%, black 0%, black 55%, transparent 85%)",
            }}
          />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `
              radial-gradient(rgba(53,79,82,0.25) 1px, transparent 1px)
            `, backgroundSize: "18px 18px" }} />

          {/* Floating icons */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <Dumbbell
              className="absolute left-[8%] top-[18%] w-10 h-10 text-[#354F52]/20 animate-float hidden sm:block"
              style={{ animationDelay: "0.2s", animationDuration: "4.2s" }}
            />
            <Flame
              className="absolute right-[12%] top-[22%] w-9 h-9 text-[#6BB371]/25 animate-float hidden sm:block"
              style={{ animationDelay: "0.8s", animationDuration: "3.6s" }}
            />
            <Activity
              className="absolute left-[18%] bottom-[22%] w-11 h-11 text-[#52796F]/20 animate-float hidden md:block"
              style={{ animationDelay: "1.2s", animationDuration: "4.8s" }}
            />
            <Trophy
              className="absolute right-[20%] bottom-[18%] w-10 h-10 text-[#354F52]/18 animate-float hidden md:block"
              style={{ animationDelay: "0.5s", animationDuration: "5.1s" }}
            />
            <Sparkles
              className="absolute left-[48%] top-[10%] w-8 h-8 text-[#6BB371]/25 animate-float"
              style={{ animationDelay: "1.6s", animationDuration: "3.9s" }}
            />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-10 pt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#354F52]/10 text-[#354F52] text-xs font-semibold">
                Coach Control Center
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#354F52]">
                Coach Profile{displayName ? <span className="text-[#52796F]"> · {displayName}</span> : null}
              </h1>
              <div className="text-sm text-gray-600">
                {coachId ? (
                  <span>
                    Coach ID: <span className="font-semibold text-[#354F52]">{coachId}</span>{" "}
                    <Link className="text-[#52796F] underline ml-2" href={`/coaches/${coachId}`}>
                      View public profile
                    </Link>
                  </span>
                ) : (
                  <span>Log in as a coach to manage your profile.</span>
                )}
              </div>
            </div>
           
           
          </div>

          {coachId && (
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#6BB371] text-white shadow-2xl">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_20%,#fff,transparent_25%),radial-gradient(circle_at_80%_0%,#fff,transparent_20%)]" />
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-white/10">
                      {avatarUrl && avatarUrl !== "/placeholder.svg" ? (
                        <Image
                          src={avatarUrl}
                          alt={displayName || "Coach"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/80 font-black text-xl">
                          {(displayName || "C").charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-wide text-white/70 font-semibold">Coach</div>
                      <div className="text-2xl font-bold">{displayName || "Coach"}</div>
                      <div className="text-sm text-white/80">{displayCategory || "Fitness"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg border border-[#C8CDC5]/40 p-8">
              <div className="text-gray-600">Loading…</div>
            </div>
          ) : !coachId ? (
            <div className="bg-white rounded-2xl shadow-lg border border-[#C8CDC5]/40 p-8">
              <div className="text-red-700 font-semibold mb-2">Coach session not found</div>
              <div className="text-gray-700 mb-4">
                Please go back to the home page and log in using the coach form.
              </div>
              {err && <div className="text-sm text-red-600">Error: {err}</div>}
              <Link
                href="/"
                className="inline-flex px-5 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] transition-colors"
              >
                Go to Home
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-[240px_1fr] gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#d9e2dc] p-4 h-fit">
                <button
                  onClick={() => setTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${
                    tab === "profile" ? "bg-[#354F52] text-white" : "hover:bg-gray-50 text-[#354F52]"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setTab("announcements")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors mt-2 ${
                    tab === "announcements" ? "bg-[#354F52] text-white" : "hover:bg-gray-50 text-[#354F52]"
                  }`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => setTab("programs")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors mt-2 ${
                    tab === "programs" ? "bg-[#354F52] text-white" : "hover:bg-gray-50 text-[#354F52]"
                  }`}
                >
                  Programs
                </button>
                <button
                  onClick={() => setTab("blogs")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors mt-2 ${
                    tab === "blogs" ? "bg-[#354F52] text-white" : "hover:bg-gray-50 text-[#354F52]"
                  }`}
                >
                  Blogs
                </button>
                <button
                  onClick={() => setTab("videos")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors mt-2 ${
                    tab === "videos" ? "bg-[#354F52] text-white" : "hover:bg-gray-50 text-[#354F52]"
                  }`}
                >
                  Videos
                </button>

                {err && (
                  <div className="mt-4 text-sm bg-red-50/70 border border-red-200 rounded-xl p-3 text-red-700">
                    {err}
                  </div>
                )}
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#d9e2dc] p-6 md:p-8">
                {tab === "profile" && (
                  <div>
                    <div className="mb-6 rounded-3xl overflow-hidden border border-white/60 shadow-xl">
                      <div className="relative bg-gradient-to-r from-[#354F52] via-[#52796F] to-[#6BB371] text-white p-6">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#fff,transparent_28%),radial-gradient(circle_at_80%_0%,#fff,transparent_22%)]" />
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/40 bg-white/10 shadow-lg">
                              {effectivePreviewImage ? (
                                <Image
                                  src={effectivePreviewImage}
                                  alt={displayName || "Coach"}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-xl text-white/90">
                                  {(displayName || "C").charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold w-fit">
                                <Sparkles className="w-4 h-4" />
                                Your Coach Profile
                              </div>
                              <div className="mt-2 text-2xl font-black leading-tight">{displayName}</div>
                              <div className="text-sm text-white/85">{displayCategory}</div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                              href={coachId ? `/coaches/${coachId}` : "/coaches"}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-all border border-white/25 text-sm font-semibold shadow-md hover:shadow-lg"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Public Profile
                            </Link>
                            <button
                              type="button"
                              onClick={() => setTab("videos")}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#354F52] font-semibold shadow-md hover:shadow-lg transition-all"
                            >
                              Manage Videos
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-4 text-sm text-[#354F52] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-gray-700">
                          Tip: Upload a photo + write a strong bio to increase trust and conversions.
                        </div>
                        <div className="text-xs text-gray-500">
                          Changes are saved when you click <span className="font-semibold">Save changes</span>.
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-[#354F52] mb-6">Edit Profile</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Name</label>
                        <input
                          className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6BB371]"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select
                          className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6BB371]"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          {[
                            "Strength",
                            "Cardio",
                            "Yoga",
                            "Nutrition",
                            "CrossFit",
                            "Rehabilitation",
                            "Sports Performance",
                            "Personal Training",
                          ].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Bio</label>
                        <textarea
                          rows={5}
                          className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6BB371]"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Profile Picture</label>
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-white shadow-sm shrink-0">
                            {effectivePreviewImage ? (
                              <Image
                                src={effectivePreviewImage}
                                alt={coach?.name || "Coach"}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Camera className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 w-full">
                            <input
                              type="file"
                              id="coach-profile-image-upload"
                              accept="image/*"
                              onChange={handleProfileImageUpload}
                              className="hidden"
                            />
                            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                              <label
                                htmlFor="coach-profile-image-upload"
                                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#354F52] text-white font-semibold hover:bg-[#52796F] transition-colors cursor-pointer"
                              >
                                {effectivePreviewImage ? "Change Picture" : "Upload Picture"}
                              </label>
                              {effectivePreviewImage && (
                                <button
                                  type="button"
                                  onClick={() => setImageUrl("")}
                                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Max size: 5MB. Save changes to apply.
                            </div>

                            {/* Optional: allow pasting a URL too */}
                            <div className="mt-3">
                              <label className="text-xs font-semibold text-gray-600">Or paste image URL</label>
                              <input
                                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6BB371]"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://... or data:image/..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        disabled={!profileDirty || savingProfile}
                        onClick={saveProfile}
                        className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                          !profileDirty || savingProfile
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#6BB371] text-white hover:bg-[#5FA361]"
                        }`}
                      >
                        {savingProfile ? "Saving…" : "Save changes"}
                      </button>
                      {profileDirty && !savingProfile && (
                        <div className="text-sm text-gray-600">You have unsaved changes.</div>
                      )}
                    </div>
                  </div>
                )}

                {tab === "announcements" && (
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-[#354F52]">Announcements</h2>
                      <button
                        onClick={loadAnnouncements}
                        className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-[#354F52] hover:bg-gray-50"
                      >
                        Refresh
                      </button>
                    </div>

                    <div className="bg-[#C8CDC5]/10 border border-[#C8CDC5]/30 rounded-2xl p-5 mb-8">
                      <h3 className="font-bold text-[#354F52] mb-3">Create new</h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Title"
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          type="date"
                          value={annDate}
                          onChange={(e) => setAnnDate(e.target.value)}
                        />
                        <button
                          disabled={annSaving}
                          onClick={createAnnouncement}
                          className="px-6 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50"
                        >
                          {annSaving ? "Saving…" : "Publish"}
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl"
                        placeholder="Content…"
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                      />
                    </div>

                    {annLoading ? (
                      <div className="text-gray-600">Loading announcements…</div>
                    ) : announcements.length === 0 ? (
                      <div className="text-gray-600">No announcements yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {announcements.map((a) => (
                          <div key={a.id} className="border border-[#C8CDC5]/40 rounded-2xl p-5">
                            {editingId === a.id ? (
                              <>
                                <div className="grid md:grid-cols-3 gap-3">
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={editDraft.title}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    type="date"
                                    value={editDraft.date}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, date: e.target.value }))}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      disabled={annSaving}
                                      onClick={saveEdit}
                                      className="flex-1 px-4 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50"
                                    >
                                      Save
                                    </button>
                                    <button
                                      disabled={annSaving}
                                      onClick={cancelEdit}
                                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                                <textarea
                                  rows={4}
                                  className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl"
                                  value={editDraft.content}
                                  onChange={(e) => setEditDraft((d) => ({ ...d, content: e.target.value }))}
                                />
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="text-xl font-bold text-[#354F52]">{a.title}</div>
                                    <div className="text-sm text-gray-500">{a.date}</div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => startEdit(a)}
                                      className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-[#354F52] hover:bg-gray-50"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteAnnouncement(a.id)}
                                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-3 text-gray-700 whitespace-pre-line">{a.content}</div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tab === "programs" && (
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-[#354F52]">Programs</h2>
                      <button
                        onClick={loadPrograms}
                        className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-[#354F52] hover:bg-gray-50"
                      >
                        Refresh
                      </button>
                    </div>

                    <div className="bg-[#C8CDC5]/10 border border-[#C8CDC5]/30 rounded-2xl p-5 mb-8">
                      <h3 className="font-bold text-[#354F52] mb-3">Create new</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Program name"
                          value={programName}
                          onChange={(e) => setProgramName(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Duration (e.g. 12 weeks)"
                          value={programDuration}
                          onChange={(e) => setProgramDuration(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Goal (e.g. weight_loss)"
                          value={programGoal}
                          onChange={(e) => setProgramGoal(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          type="number"
                          placeholder="Price"
                          value={programPrice}
                          onChange={(e) => setProgramPrice(e.target.value)}
                        />
                      </div>
                      <textarea
                        rows={4}
                        className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl"
                        placeholder="Description…"
                        value={programDescription}
                        onChange={(e) => setProgramDescription(e.target.value)}
                      />
                      <button
                        disabled={programSaving}
                        onClick={createProgram}
                        className="mt-3 px-6 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50"
                      >
                        {programSaving ? "Saving…" : "Publish"}
                      </button>
                    </div>

                    {programLoading ? (
                      <div className="text-gray-600">Loading programs…</div>
                    ) : programs.length === 0 ? (
                      <div className="text-gray-600">No programs yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {programs.map((p) => (
                          <div key={p.id} className="border border-[#C8CDC5]/40 rounded-2xl p-5">
                            {programEditingId === p.id ? (
                              <>
                                <div className="grid md:grid-cols-2 gap-3">
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={programDraft.name}
                                    onChange={(e) => setProgramDraft((d) => ({ ...d, name: e.target.value }))}
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={programDraft.duration}
                                    onChange={(e) => setProgramDraft((d) => ({ ...d, duration: e.target.value }))}
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={programDraft.goal}
                                    onChange={(e) => setProgramDraft((d) => ({ ...d, goal: e.target.value }))}
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    type="number"
                                    value={programDraft.price}
                                    onChange={(e) => setProgramDraft((d) => ({ ...d, price: e.target.value }))}
                                  />
                                </div>
                                <textarea
                                  rows={4}
                                  className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl"
                                  value={programDraft.description}
                                  onChange={(e) => setProgramDraft((d) => ({ ...d, description: e.target.value }))}
                                />
                                <div className="mt-3 flex gap-2">
                                  <button
                                    disabled={programSaving}
                                    onClick={saveProgramEdit}
                                    className="px-6 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50"
                                  >
                                    Save
                                  </button>
                                  <button
                                    disabled={programSaving}
                                    onClick={cancelProgramEdit}
                                    className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="text-xl font-bold text-[#354F52]">{p.name}</div>
                                    <div className="text-sm text-gray-500">
                                      {p.duration ? `${p.duration} • ` : ""}
                                      {p.goal ? `Goal: ${p.goal} • ` : ""}
                                      ${p.price || 0}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => startProgramEdit(p)}
                                      className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-[#354F52] hover:bg-gray-50"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteProgram(p.id)}
                                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-3 text-gray-700 whitespace-pre-line">{p.description}</div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {tab === "blogs" && (
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-[#354F52]">Blogs</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowBlogForm(true);
                            setBlogForm({
                              id: "",
                              title: "",
                              excerpt: "",
                              author: "",
                              date: "",
                              readTime: "",
                              image: "",
                              category: "training",
                              sections: [{ title: "", content: "" }],
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] transition-all"
                        >
                          + Add Blog
                        </button>
                        <button
                          onClick={loadBlogs}
                          className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-[#354F52] hover:bg-gray-50"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    {blogLoading ? (
                      <div className="text-gray-600">Loading blog posts…</div>
                    ) : blogs.length === 0 ? (
                      <div className="text-gray-600">No blog posts yet.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {blogs.map((b) => (
                          <div key={b.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-200">
                            {b.image && (
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={b.image}
                                  alt={b.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800';
                                  }}
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="px-2 py-1 bg-[#52796F]/10 text-[#354F52] rounded text-xs font-medium capitalize">
                                  {b.category}
                                </span>
                                {b.status === "pending" && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                                    Pending
                                  </span>
                                )}
                                {b.status === "approved" && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                    Published
                                  </span>
                                )}
                              </div>
                              <h3 className="font-bold text-lg text-[#354F52] mb-2 line-clamp-2">{b.title}</h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{b.excerpt}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <span>{b.author || "Coach"}</span>
                                <span>•</span>
                                <span>{b.readTime}</span>
                              </div>
                              <div className="flex flex-col gap-2">
                                {/* View Button */}
                                <button
                                  onClick={() => window.location.href = `/blog/${b.id}`}
                                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#354F52] text-white rounded hover:bg-[#52796F] transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View Blog
                                </button>
                                {/* Edit and Delete Buttons */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEditBlog(b)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#52796F]/10 text-[#52796F] rounded hover:bg-[#52796F]/20 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteBlog(b.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Blog Form Modal */}
                    {showBlogForm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[#354F52]">Add New Blog</h3>
                            <button
                              onClick={() => {
                                setShowBlogForm(false);
                                setBlogForm({
                                  id: "",
                                  title: "",
                                  excerpt: "",
                                  author: "",
                                  date: "",
                                  readTime: "",
                                  image: "",
                                  category: "training",
                                  sections: [{ title: "", content: "" }],
                                });
                              }}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ×
                            </button>
                          </div>
                          <form onSubmit={handleAddBlog} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">Title *</label>
                              <input
                                type="text"
                                value={blogForm.title}
                                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">Excerpt *</label>
                              <textarea
                                value={blogForm.excerpt}
                                onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                rows="2"
                                placeholder="Brief description of the blog post"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Author</label>
                                <input
                                  type="text"
                                  value={blogForm.author}
                                  onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                  placeholder={coach?.name || "Coach name"}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Read Time</label>
                                <input
                                  type="text"
                                  value={blogForm.readTime}
                                  onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                  placeholder="e.g., 5 min read"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Date</label>
                                <input
                                  type="text"
                                  value={blogForm.date}
                                  onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                  placeholder="e.g., March 15, 2024"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Category</label>
                                <select
                                  value={blogForm.category}
                                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                >
                                  <option value="training">Training</option>
                                  <option value="nutrition">Nutrition</option>
                                  <option value="technology">Technology</option>
                                  <option value="wellness">Wellness</option>
                                  <option value="mindset">Mindset</option>
                                  <option value="progress">Progress</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">Image URL</label>
                              <input
                                type="text"
                                value={blogForm.image}
                                onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                placeholder="https://images.unsplash.com/..."
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-[#354F52]">Content Sections *</label>
                                <button
                                  type="button"
                                  onClick={addSection}
                                  className="text-[#52796F] hover:text-[#6BB371] font-medium text-sm flex items-center gap-1"
                                >
                                  <span>+ Add Section</span>
                                </button>
                              </div>
                              
                              <div className="space-y-4">
                                {blogForm.sections.map((section, index) => (
                                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-sm font-medium text-gray-700">Section {index + 1}</span>
                                      {blogForm.sections.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => removeSection(index)}
                                          className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                          Remove
                                        </button>
                                      )}
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">Section Title</label>
                                        <input
                                          type="text"
                                          value={section.title}
                                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                          placeholder="e.g., Introduction, Key Benefits, Getting Started..."
                                          required
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">Section Content</label>
                                        <textarea
                                          value={section.content}
                                          onChange={(e) => updateSection(index, 'content', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent font-mono text-sm"
                                          rows="8"
                                          placeholder="Write the content for this section..."
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="submit"
                                disabled={blogSaving}
                                className="flex-1 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white py-2 rounded-lg hover:from-[#6BB371] hover:to-[#52796F] transition-all shadow-lg hover:shadow-[#52796F]/30 disabled:opacity-50"
                              >
                                {blogSaving ? "Submitting..." : "Submit for Review"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowBlogForm(false);
                                  setBlogForm({
                                    id: "",
                                    title: "",
                                    excerpt: "",
                                    author: "",
                                    date: "",
                                    readTime: "",
                                    image: "",
                                    category: "training",
                                    sections: [{ title: "", content: "" }],
                                  });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tab === "videos" && (
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-[#354F52]">Videos</h2>
                      <button
                        onClick={loadVideos}
                        className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-[#354F52] hover:bg-gray-50"
                      >
                        Refresh
                      </button>
                    </div>

                    <div className="bg-[#C8CDC5]/10 border border-[#C8CDC5]/30 rounded-2xl p-5 mb-8">
                      <h3 className="font-bold text-[#354F52] mb-3">Create new</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Title"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Duration (e.g. 8:30)"
                          value={videoDuration}
                          onChange={(e) => setVideoDuration(e.target.value)}
                        />
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-[#354F52] mb-2">
                            Upload Video File
                          </label>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                            onChange={handleVideoFileChange}
                            disabled={videoUploading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          {videoUploadProgress && (
                            <div className={`mt-2 text-sm ${videoUploadProgress.includes("successfully") ? "text-green-600" : "text-blue-600"}`}>
                              {videoUploadProgress}
                            </div>
                          )}
                          {videoUrl && (
                            <div className="mt-2 text-sm text-gray-600">
                              Video URL: <span className="font-mono text-xs break-all">{videoUrl}</span>
                            </div>
                          )}
                        </div>
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                          placeholder="Thumbnail URL (optional)"
                          value={videoThumb}
                          onChange={(e) => setVideoThumb(e.target.value)}
                        />
                      </div>
                      <button
                        disabled={videoSaving || videoUploading || !videoUrl}
                        onClick={createVideo}
                        className="mt-3 px-6 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {videoSaving ? "Saving…" : videoUploading ? "Uploading…" : !videoUrl ? "Upload a video first" : "Publish"}
                      </button>
                    </div>

                    {videoLoading ? (
                      <div className="text-gray-600">Loading videos…</div>
                    ) : videos.length === 0 ? (
                      <div className="text-gray-600">No videos yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {videos.map((v) => (
                          <div key={v.id} className="border border-[#C8CDC5]/40 rounded-2xl p-5">
                            {videoEditingId === v.id ? (
                              <>
                                <div className="grid md:grid-cols-2 gap-3">
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={videoDraft.title}
                                    onChange={(e) => setVideoDraft((d) => ({ ...d, title: e.target.value }))}
                                    placeholder="Title"
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={videoDraft.duration}
                                    onChange={(e) => setVideoDraft((d) => ({ ...d, duration: e.target.value }))}
                                    placeholder="Duration (e.g. 8:30)"
                                  />
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-[#354F52] mb-2">
                                      Upload New Video File (or keep existing)
                                    </label>
                                    <input
                                      type="file"
                                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
                                        if (!validTypes.includes(file.type)) {
                                          alert("Please upload a video file (MP4, WebM, OGG, MOV, or AVI)");
                                          return;
                                        }
                                        if (file.size > 500 * 1024 * 1024) {
                                          alert("Video size should be less than 500MB");
                                          return;
                                        }
                                        setVideoUploading(true);
                                        try {
                                          const formData = new FormData();
                                          formData.append("file", file);
                                          const res = await fetch("/api/upload/video", { method: "POST", body: formData });
                                          const data = await res.json().catch(() => ({}));
                                          if (!res.ok || !data?.success) throw new Error(data.error || "Failed to upload video");
                                          setVideoDraft((d) => ({ ...d, video_url: data.videoUrl || "" }));
                                          alert("Video uploaded successfully!");
                                        } catch (err) {
                                          alert(err?.message || "Failed to upload video");
                                        } finally {
                                          setVideoUploading(false);
                                        }
                                      }}
                                      disabled={videoUploading}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <div className="mt-2 text-sm text-gray-600">
                                      Current: <span className="font-mono text-xs break-all">{videoDraft.video_url || "None"}</span>
                                    </div>
                                  </div>
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                                    value={videoDraft.thumbnail_url}
                                    onChange={(e) => setVideoDraft((d) => ({ ...d, thumbnail_url: e.target.value }))}
                                    placeholder="Thumbnail URL (optional)"
                                  />
                                </div>
                                <div className="mt-3 flex gap-2">
                                  <button
                                    disabled={videoSaving}
                                    onClick={saveVideoEdit}
                                    className="px-6 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50"
                                  >
                                    Save
                                  </button>
                                  <button
                                    disabled={videoSaving}
                                    onClick={cancelVideoEdit}
                                    className="px-6 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="text-xl font-bold text-[#354F52]">{v.title}</div>
                                    <div className="text-sm text-gray-500">
                                      {v.duration ? `${v.duration} • ` : ""}
                                      views: {v.views || 0} • likes: {v.likes || 0}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => startVideoEdit(v)}
                                      className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-[#354F52] hover:bg-gray-50"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteVideo(v.id)}
                                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-3 text-sm text-gray-600 break-all">Video: {v.video_url}</div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

