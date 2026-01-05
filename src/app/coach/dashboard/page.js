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
  const [isLocalCoach, setIsLocalCoach] = useState(false);
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
  const [blogTitle, setBlogTitle] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogCategory, setBlogCategory] = useState("training");
  const [blogImage, setBlogImage] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("3 min read");
  const [blogDate, setBlogDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [blogContent, setBlogContent] = useState("");
  const [blogEditingId, setBlogEditingId] = useState(null);
  const [blogDraft, setBlogDraft] = useState({
    title: "",
    excerpt: "",
    category: "training",
    image: "",
    readTime: "3 min read",
    date: "",
    content: "",
  });

  // videos
  const [videos, setVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumb, setVideoThumb] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
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

  const handleProfileImageUpload = (e) => {
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

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImageUrl(typeof base64 === "string" ? base64 : "");
    };
    reader.readAsDataURL(file);
  };

  const persistLocalCoach = (updatedCoach) => {
    try {
      localStorage.setItem("currentCoach", JSON.stringify(updatedCoach));
      const coaches = JSON.parse(localStorage.getItem("coaches") || "[]");
      const updated = Array.isArray(coaches)
        ? coaches.map((c) => (c?.id === updatedCoach?.id ? updatedCoach : c))
        : [];
      localStorage.setItem("coaches", JSON.stringify(updated));
      window.dispatchEvent(new Event("coachUpdated"));
    } catch (_) {
      // ignore
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
      setIsLocalCoach(false);
      setCoachId(data.coachId);
      setCoach(data.coach);

      setName(data.coach?.name || "");
      setCategory(data.coach?.category || "Strength");
      setBio(data.coach?.bio || "");
      setImageUrl(data.coach?.image_url || "");
    } catch (e) {
      // Fallback to localStorage-based coach session (used by CoachAuthModal)
      try {
        const raw = localStorage.getItem("currentCoach");
        if (!raw) throw e;
        const stored = JSON.parse(raw);
        const normalized = {
          ...stored,
          category: stored?.category || titleCase(stored?.specialization) || "Strength",
          image_url: stored?.image_url || stored?.imageUrl || "",
          announcements: Array.isArray(stored?.announcements) ? stored.announcements : [],
          programs: Array.isArray(stored?.programs) ? stored.programs : [],
          blogs: Array.isArray(stored?.blogs) ? stored.blogs : [],
          videos: Array.isArray(stored?.videos) ? stored.videos : [],
        };
        setIsLocalCoach(true);
        setCoachId(normalized?.id || normalized?._id || normalized?.coachId || null);
        setCoach(normalized);
        setName(normalized?.name || "");
        setCategory(normalized?.category || "Strength");
        setBio(normalized?.bio || "");
        setImageUrl(normalized?.image_url || "");

        // Seed tab data from local coach payload
        setAnnouncements(normalized.announcements);
        setPrograms(normalized.programs);
        setBlogs(normalized.blogs);
        setVideos(normalized.videos);
      } catch (e2) {
        setIsLocalCoach(false);
        setErr(fmtErr(e2));
        setCoachId(null);
        setCoach(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    setAnnLoading(true);
    try {
      if (isLocalCoach) {
        const raw = localStorage.getItem("currentCoach");
        const stored = raw ? JSON.parse(raw) : null;
        setAnnouncements(Array.isArray(stored?.announcements) ? stored.announcements : []);
        return;
      }
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
      if (isLocalCoach) {
        const raw = localStorage.getItem("currentCoach");
        const stored = raw ? JSON.parse(raw) : null;
        setPrograms(Array.isArray(stored?.programs) ? stored.programs : []);
        return;
      }
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
      if (isLocalCoach) {
        const raw = localStorage.getItem("currentCoach");
        const stored = raw ? JSON.parse(raw) : null;
        setBlogs(Array.isArray(stored?.blogs) ? stored.blogs : []);
        return;
      }
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
      if (isLocalCoach) {
        const raw = localStorage.getItem("currentCoach");
        const stored = raw ? JSON.parse(raw) : null;
        setVideos(Array.isArray(stored?.videos) ? stored.videos : []);
        return;
      }
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
      if (isLocalCoach) {
        localStorage.removeItem("currentCoach");
        window.dispatchEvent(new Event("coachLoggedOut"));
        return;
      }
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
      if (isLocalCoach) {
        const updatedCoach = {
          ...(coach || {}),
          name,
          category,
          specialization: (coach?.specialization ? coach.specialization : category)?.toString(),
          bio,
          image_url: imageUrl,
        };
        setCoach(updatedCoach);
        persistLocalCoach(updatedCoach);
        return;
      }
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
      if (isLocalCoach) {
        const next = {
          id: Date.now(),
          title: annTitle,
          content: annContent,
          date: annDate,
        };
        const updatedCoach = {
          ...(coach || {}),
          announcements: [next, ...(Array.isArray(coach?.announcements) ? coach.announcements : [])],
        };
        setCoach(updatedCoach);
        setAnnouncements(updatedCoach.announcements);
        persistLocalCoach(updatedCoach);
        setAnnTitle("");
        setAnnContent("");
        return;
      }
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
      if (isLocalCoach) {
        const list = Array.isArray(coach?.announcements) ? coach.announcements : [];
        const updated = list.map((a) => (a?.id === editingId ? { ...a, ...editDraft } : a));
        const updatedCoach = { ...(coach || {}), announcements: updated };
        setCoach(updatedCoach);
        setAnnouncements(updated);
        persistLocalCoach(updatedCoach);
        cancelEdit();
        return;
      }
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
      if (isLocalCoach) {
        const list = Array.isArray(coach?.announcements) ? coach.announcements : [];
        const updated = list.filter((a) => a?.id !== id);
        const updatedCoach = { ...(coach || {}), announcements: updated };
        setCoach(updatedCoach);
        setAnnouncements(updated);
        persistLocalCoach(updatedCoach);
        return;
      }
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
      if (isLocalCoach) {
        const next = {
          id: Date.now(),
          name: programName,
          description: programDescription,
          duration: programDuration,
          goal: programGoal,
          price: Number(programPrice || 0),
        };
        const updatedCoach = {
          ...(coach || {}),
          programs: [next, ...(Array.isArray(coach?.programs) ? coach.programs : [])],
        };
        setCoach(updatedCoach);
        setPrograms(updatedCoach.programs);
        persistLocalCoach(updatedCoach);
        setProgramName("");
        setProgramDescription("");
        setProgramDuration("");
        setProgramGoal("");
        setProgramPrice(0);
        return;
      }
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
      if (isLocalCoach) {
        const list = Array.isArray(coach?.programs) ? coach.programs : [];
        const updated = list.map((p) => (p?.id === programEditingId ? { ...p, ...programDraft } : p));
        const updatedCoach = { ...(coach || {}), programs: updated };
        setCoach(updatedCoach);
        setPrograms(updated);
        persistLocalCoach(updatedCoach);
        cancelProgramEdit();
        return;
      }
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
      if (isLocalCoach) {
        const list = Array.isArray(coach?.programs) ? coach.programs : [];
        const updated = list.filter((p) => p?.id !== id);
        const updatedCoach = { ...(coach || {}), programs: updated };
        setCoach(updatedCoach);
        setPrograms(updated);
        persistLocalCoach(updatedCoach);
        return;
      }
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
  const createBlog = async () => {
    setBlogSaving(true);
    setErr("");
    try {
      if (isLocalCoach) {
        const next = {
          id: Date.now(),
          title: blogTitle,
          excerpt: blogExcerpt,
          category: blogCategory,
          image: blogImage,
          readTime: blogReadTime,
          date: blogDate,
          sections: [{ content: blogContent }],
        };
        const updatedCoach = {
          ...(coach || {}),
          blogs: [next, ...(Array.isArray(coach?.blogs) ? coach.blogs : [])],
        };
        setCoach(updatedCoach);
        setBlogs(updatedCoach.blogs);
        persistLocalCoach(updatedCoach);
        setBlogTitle("");
        setBlogExcerpt("");
        setBlogContent("");
        return;
      }
      const res = await fetch("/api/coach/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogTitle,
          excerpt: blogExcerpt,
          category: blogCategory,
          image: blogImage,
          readTime: blogReadTime,
          date: blogDate,
          content: blogContent,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setBlogTitle("");
      setBlogExcerpt("");
      setBlogContent("");
      await loadBlogs();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setBlogSaving(false);
    }
  };

  const startBlogEdit = (b) => {
    setBlogEditingId(b.id);
    setBlogDraft({
      title: b.title || "",
      excerpt: b.excerpt || "",
      category: b.category || "training",
      image: b.image || "",
      readTime: b.readTime || "3 min read",
      date: b.date || "",
      content: b.sections?.[0]?.content || "",
    });
  };
  const cancelBlogEdit = () => {
    setBlogEditingId(null);
    setBlogDraft({ title: "", excerpt: "", category: "training", image: "", readTime: "3 min read", date: "", content: "" });
  };
  const saveBlogEdit = async () => {
    if (!blogEditingId) return;
    setBlogSaving(true);
    setErr("");
    try {
      if (isLocalCoach) {
        const list = Array.isArray(coach?.blogs) ? coach.blogs : [];
        const updated = list.map((b) =>
          b?.id === blogEditingId
            ? {
                ...b,
                title: blogDraft.title,
                excerpt: blogDraft.excerpt,
                category: blogDraft.category,
                image: blogDraft.image,
                readTime: blogDraft.readTime,
                date: blogDraft.date,
                sections: [{ content: blogDraft.content }],
              }
            : b
        );
        const updatedCoach = { ...(coach || {}), blogs: updated };
        setCoach(updatedCoach);
        setBlogs(updated);
        persistLocalCoach(updatedCoach);
        cancelBlogEdit();
        return;
      }
      const res = await fetch(`/api/coach/blogs/${blogEditingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogDraft),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      cancelBlogEdit();
      await loadBlogs();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setBlogSaving(false);
    }
  };
  const deleteBlog = async (id) => {
    if (!id) return;
    if (!confirm("Delete this blog post?")) return;
    setBlogSaving(true);
    setErr("");
    try {
      if (isLocalCoach) {
        const list = Array.isArray(coach?.blogs) ? coach.blogs : [];
        const updated = list.filter((b) => b?.id !== id);
        const updatedCoach = { ...(coach || {}), blogs: updated };
        setCoach(updatedCoach);
        setBlogs(updated);
        persistLocalCoach(updatedCoach);
        return;
      }
      const res = await fetch(`/api/coach/blogs/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      await loadBlogs();
    } catch (e) {
      setErr(fmtErr(e));
    } finally {
      setBlogSaving(false);
    }
  };

  // -------- Videos CRUD --------
  const createVideo = async () => {
    setVideoSaving(true);
    setErr("");
    try {
      if (isLocalCoach) {
        const next = {
          id: Date.now(),
          title: videoTitle,
          video_url: videoUrl,
          thumbnail_url: videoThumb,
          duration: videoDuration,
        };
        const updatedCoach = {
          ...(coach || {}),
          videos: [next, ...(Array.isArray(coach?.videos) ? coach.videos : [])],
        };
        setCoach(updatedCoach);
        setVideos(updatedCoach.videos);
        persistLocalCoach(updatedCoach);
        setVideoTitle("");
        setVideoUrl("");
        setVideoThumb("");
        setVideoDuration("");
        return;
      }
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
      if (isLocalCoach) {
        const list = Array.isArray(coach?.videos) ? coach.videos : [];
        const updated = list.map((v) => (v?.id === videoEditingId ? { ...v, ...videoDraft } : v));
        const updatedCoach = { ...(coach || {}), videos: updated };
        setCoach(updatedCoach);
        setVideos(updated);
        persistLocalCoach(updatedCoach);
        cancelVideoEdit();
        return;
      }
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
      if (isLocalCoach) {
        const list = Array.isArray(coach?.videos) ? coach.videos : [];
        const updated = list.filter((v) => v?.id !== id);
        const updatedCoach = { ...(coach || {}), videos: updated };
        setCoach(updatedCoach);
        setVideos(updated);
        persistLocalCoach(updatedCoach);
        return;
      }
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
            <div className="flex gap-3">
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-[#354F52] text-white font-semibold shadow-md hover:shadow-lg hover:bg-[#52796F] transition-all"
              >
                Logout
              </button>
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
                  <div className="flex gap-3 flex-wrap">
                    <Link
                      href={`/coaches/${coachId}`}
                      className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 transition-all border border-white/25 text-sm font-semibold shadow-md hover:shadow-lg"
                    >
                      View public profile
                    </Link>
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-xl bg-white text-[#354F52] font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Logout
                    </button>
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
                      <button
                        onClick={loadBlogs}
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
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          placeholder="Read time (e.g. 5 min read)"
                          value={blogReadTime}
                          onChange={(e) => setBlogReadTime(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          type="date"
                          value={blogDate}
                          onChange={(e) => setBlogDate(e.target.value)}
                        />
                        <select
                          className="px-4 py-3 border border-gray-300 rounded-xl"
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                        >
                          {["training", "nutrition", "technology", "wellness", "mindset", "progress"].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                          placeholder="Cover image URL"
                          value={blogImage}
                          onChange={(e) => setBlogImage(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                          placeholder="Excerpt"
                          value={blogExcerpt}
                          onChange={(e) => setBlogExcerpt(e.target.value)}
                        />
                      </div>
                      <textarea
                        rows={6}
                        className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl"
                        placeholder="Content…"
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                      />
                      <button
                        disabled={blogSaving}
                        onClick={createBlog}
                        className="mt-3 px-6 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50"
                      >
                        {blogSaving ? "Saving…" : "Publish"}
                      </button>
                    </div>

                    {blogLoading ? (
                      <div className="text-gray-600">Loading blog posts…</div>
                    ) : blogs.length === 0 ? (
                      <div className="text-gray-600">No blog posts yet.</div>
                    ) : (
                      <div className="space-y-4">
                        {blogs.map((b) => (
                          <div key={b.id} className="border border-[#C8CDC5]/40 rounded-2xl p-5">
                            {blogEditingId === b.id ? (
                              <>
                                <div className="grid md:grid-cols-2 gap-3">
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={blogDraft.title}
                                    onChange={(e) => setBlogDraft((d) => ({ ...d, title: e.target.value }))}
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={blogDraft.readTime}
                                    onChange={(e) => setBlogDraft((d) => ({ ...d, readTime: e.target.value }))}
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    type="date"
                                    value={blogDraft.date}
                                    onChange={(e) => setBlogDraft((d) => ({ ...d, date: e.target.value }))}
                                  />
                                  <select
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={blogDraft.category}
                                    onChange={(e) => setBlogDraft((d) => ({ ...d, category: e.target.value }))}
                                  >
                                    {["training", "nutrition", "technology", "wellness", "mindset", "progress"].map((c) => (
                                      <option key={c} value={c}>
                                        {c}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                                    value={blogDraft.image}
                                    onChange={(e) => setBlogDraft((d) => ({ ...d, image: e.target.value }))}
                                    placeholder="Cover image URL"
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                                    value={blogDraft.excerpt}
                                    onChange={(e) => setBlogDraft((d) => ({ ...d, excerpt: e.target.value }))}
                                    placeholder="Excerpt"
                                  />
                                </div>
                                <textarea
                                  rows={6}
                                  className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl"
                                  value={blogDraft.content}
                                  onChange={(e) => setBlogDraft((d) => ({ ...d, content: e.target.value }))}
                                />
                                <div className="mt-3 flex gap-2">
                                  <button
                                    disabled={blogSaving}
                                    onClick={saveBlogEdit}
                                    className="px-6 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50"
                                  >
                                    Save
                                  </button>
                                  <button
                                    disabled={blogSaving}
                                    onClick={cancelBlogEdit}
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
                                    <div className="text-xl font-bold text-[#354F52]">{b.title}</div>
                                    <div className="text-sm text-gray-500">
                                      {b.category ? `${b.category} • ` : ""}
                                      {b.date || ""} • {b.readTime || ""}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => startBlogEdit(b)}
                                      className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-[#354F52] hover:bg-gray-50"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteBlog(b.id)}
                                      className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-3 text-gray-700">{b.excerpt}</div>
                                <div className="mt-2 text-sm text-gray-500">
                                  Public link:{" "}
                                  <a className="text-[#52796F] underline" href={`/blog/${b.id}`}>
                                    /blog/{b.id}
                                  </a>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
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
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                          placeholder="Video URL"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                          placeholder="Thumbnail URL"
                          value={videoThumb}
                          onChange={(e) => setVideoThumb(e.target.value)}
                        />
                      </div>
                      <button
                        disabled={videoSaving}
                        onClick={createVideo}
                        className="mt-3 px-6 py-3 rounded-xl bg-[#6BB371] text-white font-semibold hover:bg-[#5FA361] disabled:opacity-50"
                      >
                        {videoSaving ? "Saving…" : "Publish"}
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
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl"
                                    value={videoDraft.duration}
                                    onChange={(e) => setVideoDraft((d) => ({ ...d, duration: e.target.value }))}
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                                    value={videoDraft.video_url}
                                    onChange={(e) => setVideoDraft((d) => ({ ...d, video_url: e.target.value }))}
                                    placeholder="Video URL"
                                  />
                                  <input
                                    className="px-4 py-3 border border-gray-300 rounded-xl md:col-span-2"
                                    value={videoDraft.thumbnail_url}
                                    onChange={(e) => setVideoDraft((d) => ({ ...d, thumbnail_url: e.target.value }))}
                                    placeholder="Thumbnail URL"
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

