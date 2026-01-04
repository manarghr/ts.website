"use client"

import { useEffect, useState } from "react"
import {
  Users,
  UserCog,
  Video,
  Dumbbell,
  Menu,
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  XIcon,
  LogOut,
  Upload,
  TrendingUp,
  UserPlus,
  Activity,
  BarChart3,
  Cookie,
  BookOpen,
  Clock, 
  Check,
  User,
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [users, setUsers] = useState([])
  const [coaches, setCoaches] = useState([])
  const [videos, setVideos] = useState([])
  const [programs, setPrograms] = useState([])
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statsLoading, setStatsLoading] = useState(true)
  const [blogs, setBlogs] = useState([])
  const [showBlogForm, setShowBlogForm] = useState(false)

  // Form states
  const [showCoachForm, setShowCoachForm] = useState(false)
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [showMealForm, setShowMealForm] = useState(false)
  const [ingredientInput, setIngredientInput] = useState("")
  const [stepInput, setStepInput] = useState("")
  const [tipInput, setTipInput] = useState("")
  const [equipmentInput, setEquipmentInput] = useState("")
  const [detailedIngredientInput, setDetailedIngredientInput] = useState({ item: "", amount: "", notes: "" })
  const [showProgramForm, setShowProgramForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Image upload states
  const [coachImagePreview, setCoachImagePreview] = useState("")
  const [coachImageFile, setCoachImageFile] = useState(null)
  const [coachImageUploading, setCoachImageUploading] = useState(false)
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState("")
  const [videoThumbnailFile, setVideoThumbnailFile] = useState(null)
  const [videoThumbnailUploading, setVideoThumbnailUploading] = useState(false)

  // Form data
  const [coachForm, setCoachForm] = useState({ id: "", name: "", category: "", bio: "", image_url: "" })
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    video_url: "",
    thumbnail_url: "",
    bio: "",
    price: 0,
    discount: false,
    discount_percentage: 0,
  })
  const [mealForm, setMealForm] = useState({
    id: "",
    name: "",
    mealType: "breakfast",
    goal: "all",
    description: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    servings: 1,
    difficulty: "Easy",
    prepTime: 0,
    steps: [],
    tips: [],
    equipment: [],
    ingredients: [],
    detailedIngredients: [],
    image: "",
  })
  const [programForm, setProgramForm] = useState({
    name: "",
    description: "",
    duration: "",
    schedule: [],
    exercises: [],
    price: 0,
    discount: false,
    discount_percentage: 0,
  })
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
})

  useEffect(() => {
    if (activeSection === "dashboard") {
      fetchStats()
    } else {
      fetchData()
    }
  }, [activeSection])

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      // Fetch all data for stats
      const [usersRes, coachesRes, videosRes, programsRes, mealsRes, blogsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/coaches"),
        fetch("/api/admin/videos"),
        fetch("/api/admin/programs"),
        fetch("/api/admin/meals"),
        fetch("/api/admin/blogs"),
      ])

      const usersData = await usersRes.json()
      const coachesData = await coachesRes.json()
      const videosData = await videosRes.json()
      const programsData = await programsRes.json()
      const mealsData = await mealsRes.json()
      const blogsData = await blogsRes.json()

      if (usersData.success) setUsers(usersData.users || [])
      if (coachesData.success) setCoaches(coachesData.coaches || [])
      if (videosData.success) setVideos(videosData.videos || [])
      if (programsData.success) setPrograms(programsData.programs || [])
      if (mealsData.success) setMeals(mealsData.meals || [])
      if (blogsData.success) setBlogs(blogsData.blogs || [])

      
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeSection === "users") {
        const res = await fetch("/api/admin/users")
        const data = await res.json()
        if (data.success) setUsers(data.users || [])
      } else if (activeSection === "coaches") {
        const res = await fetch("/api/coaches")
        const data = await res.json()
        if (data.success) setCoaches(data.coaches || [])
      } else if (activeSection === "videos") {
        const res = await fetch("/api/admin/videos")
        const data = await res.json()
        if (data.success) setVideos(data.videos || [])
      } else if (activeSection === "programs") {
        const res = await fetch("/api/admin/programs")
        const data = await res.json()
        if (data.success) setPrograms(data.programs || [])
      } else if (activeSection === "meals") {
        const res = await fetch("/api/admin/meals");
        const data = await res.json();
        if (data.success) setMeals(data.meals || []);
      } else if (activeSection === "blogs") {
        const res = await fetch("/api/admin/blogs");
        const data = await res.json();
        if (data.success) setBlogs(data.blogs || []);
    }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    window.location.reload()
  }

  // Image upload handler
  const handleImageUpload = async (file, type) => {
    if (!file) return null

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).")
      return null
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size too large. Maximum size is 5MB.")
      return null
    }

    try {
      if (type === "coach") {
        setCoachImageUploading(true)
      } else if (type === "video") {
        setVideoThumbnailUploading(true)
      }

      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        return data.imageUrl
      } else {
        alert(data.error || "Failed to upload image")
        return null
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
      return null
    } finally {
      if (type === "coach") {
        setCoachImageUploading(false)
      } else if (type === "video") {
        setVideoThumbnailUploading(false)
      }
    }
  }

  // Coach image handler
  const handleCoachImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setCoachImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    setCoachImageFile(file)

    // Upload image
    const imageUrl = await handleImageUpload(file, "coach")
    if (imageUrl) {
      setCoachForm({ ...coachForm, image_url: imageUrl })
    }
  }

  // Video thumbnail handler
  const handleVideoThumbnailChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setVideoThumbnailPreview(reader.result)
    }
    reader.readAsDataURL(file)
    setVideoThumbnailFile(file)

    // Upload image
    const imageUrl = await handleImageUpload(file, "video")
    if (imageUrl) {
      setVideoForm({ ...videoForm, thumbnail_url: imageUrl })
    }
  }

  const handleAddCoach = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/coaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coachForm),
      })
      const data = await res.json()
      if (data.success) {
        setShowCoachForm(false)
        setCoachForm({ id: "", name: "", category: "", bio: "", image_url: "" })
        setCoachImagePreview("")
        setCoachImageFile(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error adding coach:", error)
    }
  }

  const handleUpdateCoach = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/coaches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coachForm),
      })
      const data = await res.json()
      if (data.success) {
        setShowCoachForm(false)
        setEditingItem(null)
        setCoachForm({ id: "", name: "", category: "", bio: "", image_url: "" })
        setCoachImagePreview("")
        setCoachImageFile(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error updating coach:", error)
    }
  }

  const handleDeleteCoach = async (id) => {
    if (!confirm("Are you sure you want to delete this coach?")) return
    try {
      const res = await fetch(`/api/coaches?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (error) {
      console.error("Error deleting coach:", error)
    }
  }

  const handleAddVideo = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoForm),
      })
      const data = await res.json()
      if (data.success) {
        setShowVideoForm(false)
        setVideoForm({
          title: "",
          description: "",
          video_url: "",
          thumbnail_url: "",
          bio: "",
          price: 0,
          discount: false,
          discount_percentage: 0,
        })
        setVideoThumbnailPreview("")
        setVideoThumbnailFile(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error adding video:", error)
    }
  }

  const handleUpdateVideo = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...videoForm, id: editingItem.id }),
      })
      const data = await res.json()
      if (data.success) {
        setShowVideoForm(false)
        setEditingItem(null)
        setVideoForm({
          title: "",
          description: "",
          video_url: "",
          thumbnail_url: "",
          bio: "",
          price: 0,
          discount: false,
          discount_percentage: 0,
        })
        setVideoThumbnailPreview("")
        setVideoThumbnailFile(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error updating video:", error)
    }
  }

  const handleDeleteVideo = async (id) => {
    if (!confirm("Are you sure you want to delete this video?")) return
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (error) {
      console.error("Error deleting video:", error)
    }
  }

const handleAddMeal = async (e) => {
  e.preventDefault();
  
  console.log("=== Adding Meal - Start ===");
  console.log("Form data:", mealForm);
  
  try {
    // Validation
    if (!mealForm.name || !mealForm.mealType) {
      alert("Name and meal type are required");
      return;
    }

    if (!mealForm.prepTime || parseInt(mealForm.prepTime) <= 0) {
      alert("Prep time must be a positive number greater than 0");
      return;
    }

    if (!mealForm.servings || parseInt(mealForm.servings) <= 0) {
      alert("Servings must be a positive number greater than 0");
      return;
    }

    // Prepare data - ensure all fields are properly formatted
    const mealData = {
      name: mealForm.name,
      mealType: mealForm.mealType,
      goal: mealForm.goal || 'all',
      description: mealForm.description || '',
      servings: parseInt(mealForm.servings) || 1,
      difficulty: mealForm.difficulty || 'Easy',
      prepTime: parseInt(mealForm.prepTime), // Send as number, API will format
      image: mealForm.image || '',
      // Nutrition
      calories: parseInt(mealForm.calories) || 0,
      protein: parseInt(mealForm.protein) || 0,
      carbs: parseInt(mealForm.carbs) || 0,
      fats: parseInt(mealForm.fats) || 0,
      fiber: parseInt(mealForm.fiber) || 0,
      sugar: parseInt(mealForm.sugar) || 0,
      sodium: parseInt(mealForm.sodium) || 0,
      // Recipe details
      detailedIngredients: mealForm.detailedIngredients || [],
      steps: mealForm.steps || [],
      tips: mealForm.tips || [],
      equipment: mealForm.equipment || [],
      ingredients: mealForm.ingredients || []
    };

    console.log("Sending meal data:", mealData);

    const res = await fetch("/api/admin/meals", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(mealData),
    });

    console.log("Response status:", res.status);
    
    const data = await res.json();
    console.log("Response data:", data);
    
    if (data.success) {
      console.log("Meal added successfully!");
      alert("Meal added successfully!");
      
      // Reset form
      setShowMealForm(false);
      setMealForm({
        id: "",
        name: "",
        mealType: "breakfast",
        goal: "all",
        description: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        servings: 1,
        difficulty: "Easy",
        prepTime: 0,
        steps: [],
        tips: [],
        equipment: [],
        ingredients: [],
        detailedIngredients: [],
        image: "",
      });
      setIngredientInput("");
      setStepInput("");
      setTipInput("");
      setEquipmentInput("");
      setDetailedIngredientInput({ item: "", amount: "", notes: "" });
      
      // Reload meals
      fetchData();
    } else {
      console.error("Error from API:", data.error);
      alert(`Error: ${data.error || 'Failed to add meal'}`);
    }
  } catch (error) {
    console.error("=== Error adding meal ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    alert(`Failed to add meal: ${error.message}`);
  }
};

const handleUpdateMeal = async (e) => {
  e.preventDefault();
  
  console.log("=== Updating Meal - Start ===");
  console.log("Editing item:", editingItem);
  console.log("Form data:", mealForm);
  
  try {
    // Validation
    if (!editingItem || !editingItem.id) {
      alert("No meal selected for editing");
      return;
    }

    if (!mealForm.prepTime || parseInt(mealForm.prepTime) <= 0) {
      alert("Prep time must be a positive number greater than 0");
      return;
    }

    if (!mealForm.servings || parseInt(mealForm.servings) <= 0) {
      alert("Servings must be a positive number greater than 0");
      return;
    }

    // Prepare data
    const mealData = {
      id: editingItem.id,
      name: mealForm.name,
      mealType: mealForm.mealType,
      goal: mealForm.goal || 'all',
      description: mealForm.description || '',
      servings: parseInt(mealForm.servings) || 1,
      difficulty: mealForm.difficulty || 'Easy',
      prepTime: parseInt(mealForm.prepTime), // Send as number
      image: mealForm.image || '',
      // Nutrition
      calories: parseInt(mealForm.calories) || 0,
      protein: parseInt(mealForm.protein) || 0,
      carbs: parseInt(mealForm.carbs) || 0,
      fats: parseInt(mealForm.fats) || 0,
      fiber: parseInt(mealForm.fiber) || 0,
      sugar: parseInt(mealForm.sugar) || 0,
      sodium: parseInt(mealForm.sodium) || 0,
      // Recipe details
      detailedIngredients: mealForm.detailedIngredients || [],
      steps: mealForm.steps || [],
      tips: mealForm.tips || [],
      equipment: mealForm.equipment || [],
      ingredients: mealForm.ingredients || []
    };

    console.log("Sending update data:", mealData);

    const res = await fetch("/api/admin/meals", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(mealData),
    });

    console.log("Response status:", res.status);
    
    const data = await res.json();
    console.log("Response data:", data);
    
    if (data.success) {
      console.log("Meal updated successfully!");
      alert("Meal updated successfully!");
      
      // Reset form
      setShowMealForm(false);
      setEditingItem(null);
      setMealForm({
        id: "",
        name: "",
        mealType: "breakfast",
        goal: "all",
        description: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        servings: 1,
        difficulty: "Easy",
        prepTime: 0,
        steps: [],
        tips: [],
        equipment: [],
        ingredients: [],
        detailedIngredients: [],
        image: "",
      });
      setIngredientInput("");
      setStepInput("");
      setTipInput("");
      setEquipmentInput("");
      setDetailedIngredientInput({ item: "", amount: "", notes: "" });
      
      // Reload meals
      fetchData();
    } else {
      console.error("Error from API:", data.error);
      alert(`Error: ${data.error || 'Failed to update meal'}`);
    }
  } catch (error) {
    console.error("=== Error updating meal ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    alert(`Failed to update meal: ${error.message}`);
  }
};


  const handleDeleteMeal = async (id) => {
  if (!confirm("Are you sure you want to delete this meal?")) return;
  try {
    const res = await fetch(`/api/admin/meals?id=${id}`, { 
      method: "DELETE" 
    });
    const data = await res.json();
    if (data.success) {
      fetchData(); // Reload meals from database
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    alert("Failed to delete meal. Please try again.");
  }
};

  const handleAddProgram = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programForm),
      })
      const data = await res.json()
      if (data.success) {
        setShowProgramForm(false)
        setProgramForm({
          name: "",
          description: "",
          duration: "",
          schedule: [],
          exercises: [],
          price: 0,
          discount: false,
          discount_percentage: 0,
        })
        fetchData()
      }
    } catch (error) {
      console.error("Error adding program:", error)
    }
  }

  const handleUpdateProgram = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...programForm, id: editingItem.id }),
      })
      const data = await res.json()
      if (data.success) {
        setShowProgramForm(false)
        setEditingItem(null)
        setProgramForm({
          name: "",
          description: "",
          duration: "",
          schedule: [],
          exercises: [],
          price: 0,
          discount: false,
          discount_percentage: 0,
        })
        fetchData()
      }
    } catch (error) {
      console.error("Error updating program:", error)
    }
  }

  const handleDeleteProgram = async (id) => {
    if (!confirm("Are you sure you want to delete this program?")) return
    try {
      const res = await fetch(`/api/admin/programs?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) fetchData()
    } catch (error) {
      console.error("Error deleting program:", error)
    }
  }

  const openEditCoach = (coach) => {
    setEditingItem(coach)
    setCoachForm({
      id: coach.id,
      name: coach.name,
      category: coach.category,
      bio: coach.bio || "",
      image_url: coach.image_url || "",
    })
    setCoachImagePreview(coach.image_url || "")
    setCoachImageFile(null)
    setShowCoachForm(true)
  }

  const openEditVideo = (video) => {
    setEditingItem(video)
    setVideoForm({
      title: video.title,
      description: video.description || "",
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || "",
      bio: video.bio || "",
      price: video.price || 0,
      discount: video.discount || false,
      discount_percentage: video.discount_percentage || 0,
    })
    setVideoThumbnailPreview(video.thumbnail_url || "")
    setVideoThumbnailFile(null)
    setShowVideoForm(true)
  }



  const openEditMeal = (meal) => {
  setEditingItem(meal)
  
  // Extract prepTime number from "X min" format
  const prepTimeNum = typeof meal.prepTime === 'string' 
    ? parseInt(meal.prepTime.replace(' min', '')) 
    : meal.prepTime || 0
  
  setMealForm({
    id: meal.id,
    name: meal.name || "",
    mealType: meal.mealType || "breakfast",
    goal: meal.goal || "all",
    description: meal.description || "",
    calories: meal.calories || meal.nutritionDetails?.calories || 0,
    protein: meal.protein || meal.nutritionDetails?.protein || 0,
    carbs: meal.carbs || meal.nutritionDetails?.carbs || 0,
    fats: meal.fats || meal.nutritionDetails?.fats || 0,
    fiber: meal.fiber || meal.nutritionDetails?.fiber || 0,
    sugar: meal.sugar || meal.nutritionDetails?.sugar || 0,
    sodium: meal.sodium || meal.nutritionDetails?.sodium || 0,
    servings: meal.servings || 1,
    difficulty: meal.difficulty || "Easy",
    prepTime: prepTimeNum,
    steps: meal.steps || [],
    tips: meal.tips || [],
    equipment: meal.equipment || [],
    ingredients: meal.ingredients || [],
    detailedIngredients: meal.detailedIngredients || [],
    image: meal.image || "",
  })
  setIngredientInput("")
  setStepInput("")
  setTipInput("")
  setEquipmentInput("")
  setDetailedIngredientInput({ item: "", amount: "", notes: "" })
  setShowMealForm(true)
  }
  const openEditProgram = (program) => {
    setEditingItem(program)
    setProgramForm({
      name: program.name,
      description: program.description,
      duration: program.duration || "",
      schedule: program.schedule || [],
      exercises: program.exercises || [],
      price: program.price || 0,
      discount: program.discount || false,
      discount_percentage: program.discount_percentage || 0,
    })
    setShowProgramForm(true)
  }

  const handleAddBlog = async (e) => {
  e.preventDefault();
  try {
    if (!blogForm.title || !blogForm.excerpt) {
      alert("Title and excerpt are required");
      return;
    }

    const blogData = {
      title: blogForm.title,
      excerpt: blogForm.excerpt,
      author: blogForm.author || "TrainSight Team", 
      date: blogForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: blogForm.readTime || "5 min read", 
      image: blogForm.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      category: blogForm.category,
      sections: blogForm.sections || [{ title: "", content: "" }],
    };

    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
    });

    const data = await res.json();
    if (data.success) {
      alert("Blog added successfully!");
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
      fetchData();
    } else {
      alert(`Error: ${data.error || 'Failed to add blog'}`);
    }
  } catch (error) {
    console.error("Error adding blog:", error);
    alert(`Failed to add blog: ${error.message}`);
  }
};

const handleUpdateBlog = async (e) => {
  e.preventDefault();
  try {
    if (!editingItem || !editingItem.id) {
      alert("No blog selected for editing");
      return;
    }

    const blogData = {
      id: blogForm.id,  
      title: blogForm.title,
      excerpt: blogForm.excerpt,
      author: blogForm.author || "TrainSight Team", 
      date: blogForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: blogForm.readTime || "5 min read", 
      image: blogForm.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      category: blogForm.category,
      sections: blogForm.sections || [{ title: "", content: "" }],
    };

    const res = await fetch("/api/admin/blogs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
    });

    const data = await res.json();
    if (data.success) {
      alert("Blog updated successfully!");
      setShowBlogForm(false);
      setEditingItem(null);
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
      fetchData();
    } else {
      alert(`Error: ${data.error || 'Failed to update blog'}`);
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    alert(`Failed to update blog: ${error.message}`);
  }
};

const handleDeleteBlog = async (id) => {
  if (!confirm("Are you sure you want to delete this blog?")) return;
  try {
    const res = await fetch(`/api/admin/blogs?id=${id}`, { 
      method: "DELETE" 
    });
    const data = await res.json();
    if (data.success) {
      fetchData();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    alert("Failed to delete blog. Please try again.");
  }
};

const openEditBlog = (blog) => {
  setEditingItem(blog);
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

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.bio?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "coaches", label: "Coaches", icon: UserCog },
    { id: "videos", label: "Videos", icon: Video },
    { id: "meals", label: "Meals", icon: Cookie },
    { id: "blogs", label: "Blogs", icon: BookOpen },
    { id: "programs", label: "Programs", icon: Dumbbell },
  ]

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    newUsersToday: users.filter((u) => {
      if (!u.createdAt) return false
      const today = new Date()
      const userDate = new Date(u.createdAt)
      return userDate.toDateString() === today.toDateString()
    }).length,
    totalCoaches: coaches.length,
    totalVideos: videos.length,
    totalPrograms: programs.length,
    totalMeals: meals.length,
    totalBlogs: blogs.length,
  }

  // Add state for pending blogs at the top
  const [pendingBlogs, setPendingBlogs] = useState([]);

  //load pending blogs
  useEffect(() => {
    // Fetch blogs
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Error fetching blogs:', err));
    
    // Fetch pending blogs
    fetch('/api/blogs/pending')
      .then(res => res.json())
      .then(data => setPendingBlogs(data))
      .catch(err => console.error('Error fetching pending blogs:', err));
  }, []);

  // Add handlers for approve/reject
  const handleApproveBlog = (blogId) => {
    const pending = JSON.parse(localStorage.getItem("trainsight_pending_blogs") || "[]");
    const blogToApprove = pending.find(b => b.id === blogId);
    
    if (blogToApprove) {
      // Remove from pending
      const updatedPending = pending.filter(b => b.id !== blogId);
      localStorage.setItem("trainsight_pending_blogs", JSON.stringify(updatedPending));
      
      // Add to blogs
      const existingBlogs = JSON.parse(localStorage.getItem("trainsight_blogs") || "[]");
      const approvedBlog = { ...blogToApprove, status: "approved" };
      delete approvedBlog.submittedBy;
      delete approvedBlog.submittedAt;
      existingBlogs.push(approvedBlog);
      localStorage.setItem("trainsight_blogs", JSON.stringify(existingBlogs));
      
      setPendingBlogs(updatedPending);
      setBlogs(existingBlogs);
      alert("Blog approved and published!");
    }
  };

  const handleRejectBlog = (blogId) => {
    if (confirm("Are you sure you want to reject this blog submission?")) {
      const pending = JSON.parse(localStorage.getItem("trainsight_pending_blogs") || "[]");
      const updatedPending = pending.filter(b => b.id !== blogId);
      localStorage.setItem("trainsight_pending_blogs", JSON.stringify(updatedPending));
      setPendingBlogs(updatedPending);
      alert("Blog rejected and removed from pending list.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white relative overflow-hidden h-screen w-screen">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#6BB371]/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#52796F]/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#354F52]/5 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      <div className="flex relative z-10 h-full">
        {/* Sidebar */}
        <div
          className={`bg-gradient-to-b from-[#354F52] to-[#2F3E46] shadow-xl transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden flex flex-col h-full`}
        >
          <div className="p-6 border-b border-[#52796F]/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-[#6BB371]" />
                TrainSight Admin
              </h2>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setSearchTerm("")
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="border-t border-[#52796F]/30 p-4 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 text-white/90 hover:bg-red-500/30 hover:text-white transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-white h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#354F52] to-[#52796F] shadow-md p-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white capitalize">
              {menuItems.find((m) => m.id === activeSection)?.label || "Dashboard"}
            </h1>
            <div className="w-6"></div>
          </div>

          <div className="p-6">
            {loading || statsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6BB371]"></div>
              </div>
            ) : (
              <>
                {/* Dashboard Stats Section */}
                {activeSection === "dashboard" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-xl p-6 text-white shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <Users className="w-6 h-6" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-[#6BB371]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.totalUsers}</h3>
                        <p className="text-white/80 text-sm">Total Users</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-[#6BB371] to-[#52796F] rounded-xl p-6 text-white shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <UserPlus className="w-6 h-6" />
                          </div>
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.newUsersToday}</h3>
                        <p className="text-white/80 text-sm">New Users Today</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-[#354F52] to-[#2F3E46] rounded-xl p-6 text-white shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <UserCog className="w-6 h-6" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-[#6BB371]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.totalCoaches}</h3>
                        <p className="text-white/80 text-sm">Total Coaches</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-[#52796F] to-[#6BB371] rounded-xl p-6 text-white shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <Video className="w-6 h-6" />
                          </div>
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.totalVideos}</h3>
                        <p className="text-white/80 text-sm">Total Videos</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-[#6BB371] to-[#52796F] rounded-xl p-6 text-white shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <Cookie className="w-6 h-6" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.totalMeals}</h3>
                        <p className="text-white/80 text-sm">Total Meals</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }} // Change delay
                        className="bg-gradient-to-br from-[#52796F] to-[#354F52] rounded-xl p-6 text-white shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-[#6BB371]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.totalBlogs}</h3>
                        <p className="text-white/80 text-sm">Total Blogs</p>
                      </motion.div>


                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-[#354F52] to-[#52796F] rounded-xl p-6 text-white shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-lg">
                            <Dumbbell className="w-6 h-6" />
                          </div>
                          <Activity className="w-5 h-5 text-[#6BB371]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.totalPrograms}</h3>
                        <p className="text-white/80 text-sm">Total Programs</p>
                      </motion.div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <h2 className="text-xl font-bold text-[#354F52] mb-4">Quick Actions</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {menuItems
                          .filter((item) => item.id !== "dashboard")
                          .map((item) => {
                            const Icon = item.icon
                            return (
                              <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#52796F]/10 to-[#354F52]/10 rounded-lg hover:from-[#52796F]/20 hover:to-[#354F52]/20 transition-all border border-[#52796F]/20 hover:border-[#6BB371]/40"
                              >
                                <Icon className="w-6 h-6 text-[#52796F]" />
                                <span className="text-sm font-medium text-[#354F52]">{item.label}</span>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                )}
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
                      {users.length === 0 && <div className="text-center py-12 text-gray-500">No users found</div>}
                    </div>
                  </div>
                )}

                {/* Coaches Section */}
                {activeSection === "coaches" && (
                  <div className="space-y-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Coaches Management</h2>
                        <div className="flex gap-3">
                          <button
                            onClick={async () => {
                              if (!confirm("This will create 15+ sample coaches. Continue?")) return
                              setLoading(true)
                              try {
                                const res = await fetch("/api/test-db/create-sample-coaches", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                })
                                const data = await res.json()
                                if (data.success) {
                                  alert(`✅ Successfully created ${data.coachesCreated} sample coaches!`)
                                  fetchData()
                                } else {
                                  alert(`Error: ${data.error || data.message}`)
                                }
                              } catch (error) {
                                console.error("Error creating sample coaches:", error)
                                alert("Error creating sample coaches. Check console for details.")
                              } finally {
                                setLoading(false)
                              }
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#6BB371] to-[#52796F] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#6BB371]/30 transition-all"
                          >
                            <Plus className="w-5 h-5" />
                            Create Sample Coaches
                          </button>
                          <button
                            onClick={() => {
                              setShowCoachForm(true)
                              setEditingItem(null)
                              setCoachForm({ id: "", name: "", category: "", bio: "", image_url: "" })
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#52796F]/30 transition-all"
                          >
                            <Plus className="w-5 h-5" />
                            Add Coach
                          </button>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search coaches by name or bio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCoaches.map((coach, idx) => (
                          <div
                            key={coach.id || idx}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                              {coach.image_url ? (
                                <img
                                  src={coach.image_url || "/placeholder.svg"}
                                  alt={coach.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                                  {coach.name?.charAt(0) || "?"}
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg text-gray-800 mb-2">{coach.name}</h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {coach.bio || "No bio available"}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  {coach.category}
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEditCoach(coach)}
                                    className="p-2 text-[#52796F] hover:bg-[#52796F]/10 rounded transition-colors"
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
                            <button
                              onClick={() => {
                                setShowCoachForm(false)
                                setEditingItem(null)
                              }}
                            >
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
                              <label className="block text-sm font-medium mb-1">Profile Image</label>
                              <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                  <label className="flex-1 cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleCoachImageChange}
                                      className="hidden"
                                      disabled={coachImageUploading}
                                    />
                                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                      <Upload className="w-5 h-5 text-gray-500" />
                                      <span className="text-sm text-gray-600">
                                        {coachImageUploading
                                          ? "Uploading..."
                                          : coachImageFile
                                            ? "Change Image"
                                            : "Upload Image"}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                                {(coachImagePreview || coachForm.image_url) && (
                                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                      src={coachImagePreview || coachForm.image_url}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCoachImagePreview("")
                                        setCoachImageFile(null)
                                        setCoachForm({ ...coachForm, image_url: "" })
                                      }}
                                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                      <XIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                                {coachForm.image_url && !coachImagePreview && (
                                  <p className="text-xs text-gray-500">Current image: {coachForm.image_url}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowCoachForm(false)
                                  setEditingItem(null)
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
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

                {/* Videos Section */}
                {activeSection === "videos" && (
                  <div className="space-y-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Videos Management</h2>
                        <button
                          onClick={() => {
                            setShowVideoForm(true)
                            setEditingItem(null)
                            setVideoForm({
                              title: "",
                              description: "",
                              video_url: "",
                              thumbnail_url: "",
                              bio: "",
                              price: 0,
                              discount: false,
                              discount_percentage: 0,
                            })
                            setVideoThumbnailPreview("")
                            setVideoThumbnailFile(null)
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#52796F]/30 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          Add Video
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video, idx) => (
                          <div
                            key={video.id || idx}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                          >
                            {video.thumbnail_url && (
                              <img
                                src={video.thumbnail_url || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {video.description || video.bio}
                              </p>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-blue-600">
                                  $
                                  {video.discount
                                    ? (video.price * (1 - video.discount_percentage / 100)).toFixed(2)
                                    : video.price}
                                  {video.discount && (
                                    <span className="text-xs text-gray-400 line-through ml-2">${video.price}</span>
                                  )}
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
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#52796F]/10 text-[#52796F] rounded hover:bg-[#52796F]/20 transition-colors"
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
                      {videos.length === 0 && <div className="text-center py-12 text-gray-500">No videos found</div>}
                    </div>

                    {/* Video Form Modal */}
                    {showVideoForm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">{editingItem ? "Edit Video" : "Add New Video"}</h3>
                            <button
                              onClick={() => {
                                setShowVideoForm(false)
                                setEditingItem(null)
                              }}
                            >
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
                              <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
                              <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                  <label className="flex-1 cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleVideoThumbnailChange}
                                      className="hidden"
                                      disabled={videoThumbnailUploading}
                                    />
                                    <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                      <Upload className="w-5 h-5 text-gray-500" />
                                      <span className="text-sm text-gray-600">
                                        {videoThumbnailUploading
                                          ? "Uploading..."
                                          : videoThumbnailFile
                                            ? "Change Image"
                                            : "Upload Thumbnail"}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                                {(videoThumbnailPreview || videoForm.thumbnail_url) && (
                                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                      src={videoThumbnailPreview || videoForm.thumbnail_url}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVideoThumbnailPreview("")
                                        setVideoThumbnailFile(null)
                                        setVideoForm({ ...videoForm, thumbnail_url: "" })
                                      }}
                                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                      <XIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                                {videoForm.thumbnail_url && !videoThumbnailPreview && (
                                  <p className="text-xs text-gray-500">Current thumbnail: {videoForm.thumbnail_url}</p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={videoForm.price}
                                  onChange={(e) =>
                                    setVideoForm({ ...videoForm, price: Number.parseFloat(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Discount %</label>
                                <input
                                  type="number"
                                  value={videoForm.discount_percentage}
                                  onChange={(e) =>
                                    setVideoForm({
                                      ...videoForm,
                                      discount_percentage: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
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
                              <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowVideoForm(false)
                                  setEditingItem(null)
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
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

                {/* Meals Section */}
                {activeSection === "meals" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      {/*Update header section to include Add Meal button on the right */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-[#354F52]">Meals Management</h2>
                          <div className="text-sm text-gray-600 mt-1">Total: {meals.length}</div>
                        </div>
                        {/*Add Meal button */}
                        <button
                          onClick={() => {
                            setShowMealForm(true)
                            setEditingItem(null)
                            // Reset form to empty values
                            setMealForm({
                              id: "",
                              name: "",
                              mealType: "breakfast",
                              calories: 0,
                              prepTime: 0,
                              protein: 0,
                              carbs: 0,
                              fats: 0,
                              fiber: 0,
                              sugar: 0,
                              sodium: 0,
                              servings: 1,
                              difficulty: "Easy",
                              steps: [],
                              tips: [],
                              equipment: [],
                              ingredients: [],
                              detailedIngredients: [],
                              goal: "all",
                              description: "",
                              image: "",
                            })
                            setIngredientInput("")
                            setStepInput("")
                            setTipInput("")
                            setEquipmentInput("")
                            setDetailedIngredientInput({ item: "", amount: "", notes: "" })
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#52796F]/30 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          Add Meal
                        </button>
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search meals by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meals
                          .filter((meal) => meal.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((meal, idx) => (
                            <div
                              key={meal.id || idx}
                              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-200"
                            >
                              {meal.image && (
                                <div className="h-48 overflow-hidden">
                                  <img
                                    src={meal.image || "/placeholder.svg"}
                                    alt={meal.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="p-4">
                                <h3 className="font-bold text-lg text-[#354F52] mb-2">{meal.name}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                  {meal.calories && (
                                    <span className="px-2 py-1 bg-[#6BB371]/10 text-[#52796F] rounded text-xs font-medium">
                                      {meal.calories} cal
                                    </span>
                                  )}
                                  {meal.mealType && (
                                    <span className="px-2 py-1 bg-[#52796F]/10 text-[#354F52] rounded text-xs font-medium capitalize">
                                      {meal.mealType}
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEditMeal(meal)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#52796F]/10 text-[#52796F] rounded hover:bg-[#52796F]/20 transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMeal(meal.id)}
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
                      {meals.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          No meals found. Click "Add Meal" to create your first meal.
                        </div>
                      )}
                    </div>

                    {/* Meal Form Modal*/}
                    {showMealForm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[#354F52]">
                              {editingItem ? "Edit Meal" : "Add New Meal"}
                            </h3>
                            <button
                              onClick={() => {
                                setShowMealForm(false)
                                setEditingItem(null)
                              }}
                            >
                              <XIcon className="w-6 h-6 text-gray-600" />
                            </button>
                          </div>
                          <form onSubmit={editingItem ? handleUpdateMeal : handleAddMeal} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Meal Name</label>
                                <input
                                  type="text"
                                  value={mealForm.name}
                                  onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Meal Type</label>
                                <select
                                  value={mealForm.mealType}
                                  onChange={(e) => setMealForm({ ...mealForm, mealType: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                >
                                  <option value="breakfast">Breakfast</option>
                                  <option value="lunch">Lunch</option>
                                  <option value="dinner">Dinner</option>
                                  <option value="snacks">Snacks</option>
                                </select>
                              </div>
                            </div>

                            {/* Description Field */}
                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">Description</label>
                              <textarea
                                value={mealForm.description}
                                onChange={(e) => setMealForm({ ...mealForm, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                rows="3"
                                placeholder="Brief description of the meal"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Servings</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={mealForm.servings}
                                  onChange={(e) =>
                                    setMealForm({ ...mealForm, servings: Number.parseInt(e.target.value) || 1 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Difficulty</label>
                                <select
                                  value={mealForm.difficulty}
                                  onChange={(e) => setMealForm({ ...mealForm, difficulty: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                >
                                  <option value="Easy">Easy</option>
                                  <option value="Medium">Medium</option>
                                  <option value="Hard">Hard</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Prep Time (min)</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={mealForm.prepTime}
                                  onChange={(e) => setMealForm({ ...mealForm, prepTime: e.target.value })}
                                  placeholder="Must be > 0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                  required
                                />
                              </div>
                            </div>



                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Calories</label>
                                <input
                                  type="number"
                                  value={mealForm.calories}
                                  onChange={(e) =>
                                    setMealForm({ ...mealForm, calories: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Goal</label>
                                <select
                                  value={mealForm.goal}
                                  onChange={(e) => setMealForm({ ...mealForm, goal: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                >
                                  <option value="all">All Goals</option>
                                  <option value="lose-weight">Lose Weight</option>
                                  <option value="gain-weight">Gain Weight</option>
                                  <option value="muscle-gain">Muscle Gain</option>
                                  <option value="maintenance">Maintenance</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Protein (g)</label>
                                <input
                                  type="number"
                                  value={mealForm.protein}
                                  onChange={(e) =>
                                    setMealForm({ ...mealForm, protein: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Carbs (g)</label>
                                <input
                                  type="number"
                                  value={mealForm.carbs}
                                  onChange={(e) =>
                                    setMealForm({ ...mealForm, carbs: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Fats (g)</label>
                                <input
                                  type="number"
                                  value={mealForm.fats}
                                  onChange={(e) =>
                                    setMealForm({ ...mealForm, fats: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Fiber (g)</label>
                                <input
                                  type="number"
                                  value={mealForm.fiber}
                                  onChange={(e) =>
                                    setMealForm({ ...mealForm, fiber: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Sugar (g)</label>
                                <input
                                  type="number"
                                  value={mealForm.sugar}
                                  onChange={(e) =>
                                    setMealForm({ ...mealForm, sugar: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1 text-[#354F52]">Sodium (mg)</label>
                                <input
                                  type="number"
                                  value={mealForm.sodium}
                                  onChange={(e) =>
                                    setMealForm({ ...mealForm, sodium: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">
                                Detailed Ingredients
                              </label>
                              <div className="space-y-2 mb-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    value={detailedIngredientInput.item}
                                    onChange={(e) =>
                                      setDetailedIngredientInput({ ...detailedIngredientInput, item: e.target.value })
                                    }
                                    placeholder="Item"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                  />
                                  <input
                                    type="text"
                                    value={detailedIngredientInput.amount}
                                    onChange={(e) =>
                                      setDetailedIngredientInput({ ...detailedIngredientInput, amount: e.target.value })
                                    }
                                    placeholder="Amount"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                  />
                                  <input
                                    type="text"
                                    value={detailedIngredientInput.notes}
                                    onChange={(e) =>
                                      setDetailedIngredientInput({ ...detailedIngredientInput, notes: e.target.value })
                                    }
                                    placeholder="Notes"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (detailedIngredientInput.item && detailedIngredientInput.amount) {
                                      setMealForm({
                                        ...mealForm,
                                        detailedIngredients: [...mealForm.detailedIngredients, detailedIngredientInput],
                                      })
                                      setDetailedIngredientInput({ item: "", amount: "", notes: "" })
                                    }
                                  }}
                                  className="w-full px-4 py-2 bg-[#52796F] text-white rounded-lg hover:bg-[#6BB371] transition-colors"
                                >
                                  Add Ingredient
                                </button>
                              </div>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {mealForm.detailedIngredients.map((ing, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center p-2 bg-[#52796F]/10 rounded text-sm"
                                  >
                                    <span className="text-[#354F52]">
                                      <strong>{ing.item}</strong> - {ing.amount} {ing.notes && `(${ing.notes})`}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMealForm({
                                          ...mealForm,
                                          detailedIngredients: mealForm.detailedIngredients.filter((_, i) => i !== idx),
                                        })
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <XIcon className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">Cooking Steps</label>
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={stepInput}
                                  onChange={(e) => setStepInput(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      if (stepInput.trim()) {
                                        setMealForm({ ...mealForm, steps: [...mealForm.steps, stepInput.trim()] })
                                        setStepInput("")
                                      }
                                    }
                                  }}
                                  placeholder="Add step and press Enter"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (stepInput.trim()) {
                                      setMealForm({ ...mealForm, steps: [...mealForm.steps, stepInput.trim()] })
                                      setStepInput("")
                                    }
                                  }}
                                  className="px-4 py-2 bg-[#52796F] text-white rounded-lg hover:bg-[#6BB371] transition-colors"
                                >
                                  Add
                                </button>
                              </div>
                              <ol className="space-y-1 max-h-40 overflow-y-auto">
                                {mealForm.steps.map((step, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 p-2 bg-[#52796F]/10 rounded text-sm text-[#354F52]"
                                  >
                                    <span className="font-bold">{idx + 1}.</span>
                                    <span className="flex-1">{step}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMealForm({ ...mealForm, steps: mealForm.steps.filter((_, i) => i !== idx) })
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <XIcon className="w-3 h-3" />
                                    </button>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">Tips</label>
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={tipInput}
                                  onChange={(e) => setTipInput(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      if (tipInput.trim()) {
                                        setMealForm({ ...mealForm, tips: [...mealForm.tips, tipInput.trim()] })
                                        setTipInput("")
                                      }
                                    }
                                  }}
                                  placeholder="Add tip and press Enter"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (tipInput.trim()) {
                                      setMealForm({ ...mealForm, tips: [...mealForm.tips, tipInput.trim()] })
                                      setTipInput("")
                                    }
                                  }}
                                  className="px-4 py-2 bg-[#52796F] text-white rounded-lg hover:bg-[#6BB371] transition-colors"
                                >
                                  Add
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {mealForm.tips.map((tip, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-[#52796F]/10 text-[#354F52] rounded-full text-sm flex items-center gap-2"
                                  >
                                    {tip}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMealForm({ ...mealForm, tips: mealForm.tips.filter((_, i) => i !== idx) })
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <XIcon className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">Equipment</label>
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={equipmentInput}
                                  onChange={(e) => setEquipmentInput(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      if (equipmentInput.trim()) {
                                        setMealForm({
                                          ...mealForm,
                                          equipment: [...mealForm.equipment, equipmentInput.trim()],
                                        })
                                        setEquipmentInput("")
                                      }
                                    }
                                  }}
                                  placeholder="Add equipment and press Enter"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (equipmentInput.trim()) {
                                      setMealForm({
                                        ...mealForm,
                                        equipment: [...mealForm.equipment, equipmentInput.trim()],
                                      })
                                      setEquipmentInput("")
                                    }
                                  }}
                                  className="px-4 py-2 bg-[#52796F] text-white rounded-lg hover:bg-[#6BB371] transition-colors"
                                >
                                  Add
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {mealForm.equipment.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-[#52796F]/10 text-[#354F52] rounded-full text-sm flex items-center gap-2"
                                  >
                                    {item}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMealForm({
                                          ...mealForm,
                                          equipment: mealForm.equipment.filter((_, i) => i !== idx),
                                        })
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <XIcon className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Original ingredients section */}
                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">
                                Simple Ingredients (Legacy)
                              </label>
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={ingredientInput}
                                  onChange={(e) => setIngredientInput(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      if (ingredientInput.trim()) {
                                        setMealForm({
                                          ...mealForm,
                                          ingredients: [...mealForm.ingredients, ingredientInput.trim()],
                                        })
                                        setIngredientInput("")
                                      }
                                    }
                                  }}
                                  placeholder="Add ingredient and press Enter"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (ingredientInput.trim()) {
                                      setMealForm({
                                        ...mealForm,
                                        ingredients: [...mealForm.ingredients, ingredientInput.trim()],
                                      })
                                      setIngredientInput("")
                                    }
                                  }}
                                  className="px-4 py-2 bg-[#52796F] text-white rounded-lg hover:bg-[#6BB371] transition-colors"
                                >
                                  Add
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {mealForm.ingredients.map((ing, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-[#52796F]/10 text-[#354F52] rounded-full text-sm flex items-center gap-2"
                                  >
                                    {ing}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMealForm({
                                          ...mealForm,
                                          ingredients: mealForm.ingredients.filter((_, i) => i !== idx),
                                        })
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <XIcon className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1 text-[#354F52]">Image URL</label>
                              <input
                                type="text"
                                value={mealForm.image}
                                onChange={(e) => setMealForm({ ...mealForm, image: e.target.value })}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                              />
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white py-2 rounded-lg hover:from-[#6BB371] hover:to-[#52796F] transition-all shadow-lg hover:shadow-[#52796F]/30"
                              >
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"} Meal
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowMealForm(false)
                                  setEditingItem(null)
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

                {/* Blogs Section */}
                {activeSection === "blogs" && (
                  <div className="space-y-6">
                    <button
                      onClick={() => setActiveSection("pending-blogs")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        activeSection === "pending-blogs"
                          ? "bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                      Pending Blogs
                      {pendingBlogs.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {pendingBlogs.length}
                        </span>
                      )}
                    </button>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-[#354F52]">Blogs Management</h2>
                          <div className="text-sm text-gray-600 mt-1">Total: {blogs.length}</div>
                        </div>
                        <button
                          onClick={() => {
                            setShowBlogForm(true);
                            setEditingItem(null);
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
                          className="flex items-center gap-2 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#52796F]/30 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          Add Blog
                        </button>
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search blogs by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6BB371] focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs
                          .filter((blog) => blog.title?.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((blog, idx) => (
                            <div
                              key={blog.id || idx}
                              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-200"
                            >
                              {blog.image && (
                                <div className="h-48 overflow-hidden">
                                  <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800';
                                    }}
                                  />
                                </div>
                              )}
                              <div className="p-4">
                                <div className="mb-2">
                                  <span className="px-2 py-1 bg-[#52796F]/10 text-[#354F52] rounded text-xs font-medium capitalize">
                                    {blog.category}
                                  </span>
                                </div>
                                <h3 className="font-bold text-lg text-[#354F52] mb-2 line-clamp-2">{blog.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                  <span>{blog.author}</span>
                                  <span>•</span>
                                  <span>{blog.readTime}</span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openEditBlog(blog)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#52796F]/10 text-[#52796F] rounded hover:bg-[#52796F]/20 transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBlog(blog.id)}
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
                      {blogs.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          No blogs found. Click "Add Blog" to create your first blog post.
                        </div>
                      )}
                    </div>

                    {/* Blog Form Modal */}
                    {showBlogForm && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[#354F52]">
                              {editingItem ? "Edit Blog" : "Add New Blog"}
                            </h3>
                            <button
                              onClick={() => {
                                setShowBlogForm(false);
                                setEditingItem(null);
                              }}
                            >
                              <XIcon className="w-6 h-6 text-gray-600" />
                            </button>
                          </div>
                          <form onSubmit={editingItem ? handleUpdateBlog : handleAddBlog} className="space-y-4">
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
                                  placeholder="e.g., John Smith"
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
                                className="flex-1 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white py-2 rounded-lg hover:from-[#6BB371] hover:to-[#52796F] transition-all shadow-lg hover:shadow-[#52796F]/30"
                              >
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"} Blog
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowBlogForm(false);
                                  setEditingItem(null);
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

                {/* pending blogs section */}
                {activeSection === "pending-blogs" && (
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h2 className="text-xl font-bold text-[#354F52]">Pending Blog Submissions</h2>
                              <div className="text-sm text-gray-600 mt-1">
                                {pendingBlogs.length} blog{pendingBlogs.length !== 1 ? 's' : ''} awaiting review
                              </div>
                            </div>
                          </div>

                          {pendingBlogs.length > 0 ? (
                            <div className="space-y-6">
                              {pendingBlogs.map((blog) => (
                                <div
                                  key={blog.id}
                                  className="bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all"
                                >
                                  <div className="flex gap-6">
                                    {blog.image && (
                                      <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                        <img
                                          src={blog.image}
                                          alt={blog.title}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800';
                                          }}
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between mb-3">
                                        <div>
                                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold mb-2 inline-block">
                                            Pending Review
                                          </span>
                                          <h3 className="font-bold text-xl text-[#354F52] mb-2">{blog.title}</h3>
                                          <p className="text-sm text-gray-600 mb-3">{blog.excerpt}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                          <User className="w-4 h-4" />
                                          {blog.author}
                                        </span>
                                        <span>•</span>
                                        <span className="capitalize">{blog.category}</span>
                                        {blog.readTime && (
                                          <>
                                            <span>•</span>
                                            <span>{blog.readTime}</span>
                                          </>
                                        )}
                                      </div>

                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-blue-800">
                                          <strong>{blog.sections.length}</strong> section{blog.sections.length !== 1 ? 's' : ''} in this blog
                                        </p>
                                      </div>

                                      <div className="flex gap-3">
                                        <button
                                          onClick={() => handleApproveBlog(blog.id)}
                                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                        >
                                          <Check className="w-4 h-4" />
                                          Approve & Publish
                                        </button>
                                        <button
                                          onClick={() => handleRejectBlog(blog.id)}
                                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-semibold"
                                        >
                                          <X className="w-4 h-4" />
                                          Reject
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <p>No pending blog submissions</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                {/* Programs Section */}
                {activeSection === "programs" && (
                  <div className="space-y-6 mt-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Training Programs Management</h2>
                        <div className="flex gap-3">
                          <button
                            onClick={async () => {
                              if (!confirm("This will create 12+ sample programs. Continue?")) return
                              setLoading(true)
                              try {
                                const res = await fetch("/api/test-db/create-sample-programs", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                })
                                const data = await res.json()
                                if (data.success) {
                                  alert(`✅ Successfully created ${data.programsCreated} sample programs!`)
                                  fetchData()
                                } else {
                                  alert(`Error: ${data.error || data.message}`)
                                }
                              } catch (error) {
                                console.error("Error creating sample programs:", error)
                                alert("Error creating sample programs. Check console for details.")
                              } finally {
                                setLoading(false)
                              }
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#6BB371] to-[#52796F] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#6BB371]/30 transition-all"
                          >
                            <Plus className="w-5 h-5" />
                            Create Sample Programs
                          </button>
                          <button
                            onClick={() => {
                              setShowProgramForm(true)
                              setEditingItem(null)
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
                                overview: "",
                              })
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#52796F] to-[#6BB371] text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#52796F]/30 transition-all"
                          >
                            <Plus className="w-5 h-5" />
                            Add Program
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program, idx) => (
                          <div
                            key={program.id || idx}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all"
                          >
                            <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{program.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold text-blue-600">
                                $
                                {program.discount
                                  ? (program.price * (1 - program.discount_percentage / 100)).toFixed(2)
                                  : program.price}
                                {program.discount && (
                                  <span className="text-xs text-gray-400 line-through ml-2">${program.price}</span>
                                )}
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
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#52796F]/10 text-[#52796F] rounded hover:bg-[#52796F]/20 transition-colors"
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
                            <button
                              onClick={() => {
                                setShowProgramForm(false)
                                setEditingItem(null)
                              }}
                            >
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
                                value={
                                  Array.isArray(programForm.equipment)
                                    ? programForm.equipment.join(", ")
                                    : programForm.equipment
                                }
                                onChange={(e) => {
                                  const equipmentList = e.target.value
                                    .split(",")
                                    .map((item) => item.trim())
                                    .filter((item) => item)
                                  setProgramForm({ ...programForm, equipment: equipmentList })
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
                                onChange={(e) =>
                                  setProgramForm({ ...programForm, coach_recommendation: e.target.value })
                                }
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
                              <label className="block text-sm font-medium mb-1">
                                Exercises (JSON Array or comma-separated)
                              </label>
                              <textarea
                                value={
                                  Array.isArray(programForm.exercises)
                                    ? JSON.stringify(programForm.exercises, null, 2)
                                    : programForm.exercises
                                }
                                onChange={(e) => {
                                  try {
                                    const parsed = JSON.parse(e.target.value)
                                    if (Array.isArray(parsed)) {
                                      setProgramForm({ ...programForm, exercises: parsed })
                                    } else {
                                      setProgramForm({
                                        ...programForm,
                                        exercises: e.target.value
                                          .split(",")
                                          .map((item) => item.trim())
                                          .filter((item) => item),
                                      })
                                    }
                                  } catch {
                                    // If not valid JSON, treat as comma-separated
                                    const exercises = e.target.value
                                      .split(",")
                                      .map((item) => item.trim())
                                      .filter((item) => item)
                                    setProgramForm({ ...programForm, exercises })
                                  }
                                }}
                                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                                rows="4"
                                placeholder='["Squats", "Deadlifts", "Bench Press"] or Squats, Deadlifts, Bench Press'
                              />
                              <p className="text-xs text-gray-500 mt-1">Enter as JSON array or comma-separated list</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Schedule (JSON Array - Day-by-Day)
                              </label>
                              <textarea
                                value={JSON.stringify(programForm.schedule, null, 2)}
                                onChange={(e) => {
                                  try {
                                    const parsed = JSON.parse(e.target.value)
                                    if (Array.isArray(parsed)) {
                                      setProgramForm({ ...programForm, schedule: parsed })
                                    }
                                  } catch {
                                    // Invalid JSON, keep as is
                                  }
                                }}
                                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                                rows="8"
                                placeholder={`[\n  {\n    "day": "Day 1",\n    "focus": "Upper Body",\n    "exercises": ["Bench Press", "Rows"],\n    "notes": "Focus on form"\n  },\n  {\n    "day": "Day 2",\n    "focus": "Lower Body",\n    "exercises": ["Squats", "Deadlifts"]\n  }\n]`}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Format: Array of objects with day, focus, exercises, and optional notes
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={programForm.price}
                                  onChange={(e) =>
                                    setProgramForm({ ...programForm, price: Number.parseFloat(e.target.value) || 0 })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Discount %</label>
                                <input
                                  type="number"
                                  value={programForm.discount_percentage}
                                  onChange={(e) =>
                                    setProgramForm({
                                      ...programForm,
                                      discount_percentage: Number.parseFloat(e.target.value) || 0,
                                    })
                                  }
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
                              <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Save className="w-4 h-4 inline mr-2" />
                                {editingItem ? "Update" : "Add"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowProgramForm(false)
                                  setEditingItem(null)
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
