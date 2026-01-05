"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FaRegBell } from "react-icons/fa6"
import { FaSearch, FaUser, FaSignOutAlt, FaDumbbell, FaBrain, FaUtensils } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import logo from "../assets/logo1.png"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)

  // Use lazy initializer to avoid setState in effect
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("trainsight_current_user")
      if (user) {
        return JSON.parse(user)
      }
    }
    return null
  })

  const [currentCoach, setCurrentCoach] = useState(() => {
    if (typeof window !== "undefined") {
      const coach = localStorage.getItem("currentCoach")
      if (coach) {
        return JSON.parse(coach)
      }
    }
    return null
  })

  // Listen for storage changes to update profile picture in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("trainsight_current_user")
      if (user) {
        setCurrentUser(JSON.parse(user))
      } else {
        setCurrentUser(null)
      }
    }

    const handleCoachStorageChange = () => {
      const coach = localStorage.getItem("currentCoach")
      if (coach) {
        setCurrentCoach(JSON.parse(coach))
      } else {
        setCurrentCoach(null)
      }
    }

    const handleLogout = () => {
      setCurrentUser(null)
      setShowDropdown(false)
    }

    const handleCoachLogout = () => {
      setCurrentCoach(null)
      setShowDropdown(false)
    }

    // Listen for custom event when user data is updated
    window.addEventListener("userUpdated", handleStorageChange)
    window.addEventListener("userLoggedOut", handleLogout)
    window.addEventListener("coachUpdated", handleCoachStorageChange)
    window.addEventListener("coachLoggedOut", handleCoachLogout)

    // IMPORTANT: hydrate state from localStorage on first client mount
    // (useState initializers ran during SSR, so they may be null even if storage has data)
    handleStorageChange()
    handleCoachStorageChange()

    // Also check on focus in case localStorage was updated in another tab
    window.addEventListener("focus", handleStorageChange)
    window.addEventListener("focus", handleCoachStorageChange)

    return () => {
      window.removeEventListener("userUpdated", handleStorageChange)
      window.removeEventListener("userLoggedOut", handleLogout)
      window.removeEventListener("coachUpdated", handleCoachStorageChange)
      window.removeEventListener("coachLoggedOut", handleCoachLogout)
      window.removeEventListener("focus", handleStorageChange)
      window.removeEventListener("focus", handleCoachStorageChange)
    }
  }, [])

  const handleLogout = () => {
    // Remove current user but keep users data
    localStorage.removeItem("trainsight_current_user")
    setShowDropdown(false)
    // Dispatch event to notify other components about logout
    window.dispatchEvent(new Event("userLoggedOut"))
    router.push("/")
    router.refresh()
  }

  const handleCoachLogout = () => {
    // Remove current coach but keep coaches data
    localStorage.removeItem("currentCoach")
    setShowDropdown(false)
    // Dispatch event to notify other components about logout
    window.dispatchEvent(new Event("coachLoggedOut"))
    router.push("/")
    router.refresh()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".profile-dropdown-container")) {
        setShowDropdown(false)
      }
      if (showServicesDropdown && !event.target.closest(".services-dropdown-container")) {
        setShowServicesDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDropdown, showServicesDropdown])

  const links = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Coaches", href: "/coaches" },
  ]

  const services = [
    { 
      name: "Our Programs", 
      href: "/services/programs",
      icon: FaDumbbell,
      color: "#354F52"
    },
    { 
      name: "AI Sports", 
      href: "/services/ai-sports",
      icon: FaBrain,
      color: "#52796F"
    },
    { 
      name: "Meal Prep", 
      href: "/services/meals",
      icon: FaUtensils,
      color: "#52796F"
    },
  ]

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] flex justify-between items-center px-6 bg-[#354F52] text-white shadow-md z-50">
      <div className="flex items-center gap-20">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-wide hover:text-[#C1B8AE] transition-colors group">
          <Image 
            src={logo} 
            alt="TrainSight Logo" 
            width={40} 
            height={40} 
            className="group-hover:scale-110 transition-transform duration-300"
          />
          TrainSight
        </Link>

        <ul className="flex gap-10 ml-80 items-center">
          {links.map((link, i) => (
            <li key={i}>
              <Link 
                href={link.href} 
                className={`text-white hover:text-[#C1B8AE] transition-colors duration-300 relative pb-1 ${
                  isActive(link.href) ? 'text-[#6BB371]' : ''
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6BB371]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
          
          {/* Services Link with Dropdown */}
          <li 
            className="relative services-dropdown-container"
            onMouseEnter={() => setShowServicesDropdown(true)}
            onMouseLeave={() => setShowServicesDropdown(false)}
          >
            <Link 
              href="/services"
              className={`text-white hover:text-[#C1B8AE] transition-colors duration-300 relative pb-1 ${
                pathname.startsWith('/services') ? 'text-[#6BB371]' : ''
              }`}
            >
              Services
              {pathname.startsWith('/services') && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6BB371]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            <AnimatePresence>
              {showServicesDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 overflow-hidden border border-gray-100"
                >
                  {services.map((service, i) => {
                    const Icon = service.icon
                    return (
                      <Link
                        key={i}
                        href={service.href}
                        className={`flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all group ${
                          pathname === service.href ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => setShowServicesDropdown(false)}
                      >
                        <div 
                          className="mr-3 p-2 rounded-lg transition-colors"
                          style={{ 
                            backgroundColor: pathname === service.href ? service.color : '#f3f4f6',
                            color: pathname === service.href ? 'white' : service.color
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <span className={`font-medium ${pathname === service.href ? 'text-[#354F52]' : ''}`}>
                          {service.name}
                        </span>
                        {pathname === service.href && (
                          <motion.div
                            layoutId="activeService"
                            className="ml-auto w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: service.color }}
                            initial={false}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>

      <div className="flex justify-between items-center gap-10 pr-4">
        <FaSearch className="text-white text-lg cursor-pointer hover:text-[#C1B8AE] transition-colors" />
        <FaRegBell className="text-white text-lg cursor-pointer hover:text-[#C1B8AE] transition-colors" />

        <div className="relative profile-dropdown-container">
          {currentCoach || currentUser ? (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setShowDropdown(!showDropdown)
              }} 
              className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
            >
              {(currentCoach?.image_url || currentUser?.profilePicture) ? (
                <Image
                  src={currentCoach?.image_url || currentUser?.profilePicture || "/placeholder.svg"}
                  alt={currentCoach?.name || currentUser?.fullName || "Profile"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer hover:border-[#C1B8AE] transition-all hover:scale-110"
                  unoptimized
                />
              ) : (
                <FaUser className="w-6 h-6 text-white cursor-pointer" />
              )}
            </button>
          ) : (
            <FaUser className="w-6 h-6 text-white opacity-50 cursor-not-allowed" />
          )}

          <AnimatePresence>
            {showDropdown && (currentCoach || currentUser) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 overflow-hidden border border-gray-100"
              >
                {currentCoach ? (
                  <>
                    <Link
                      href="/coach/dashboard"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="mr-3 text-gray-500" size={14} />
                      Coach Dashboard
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleCoachLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-left text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" size={14} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="mr-3 text-gray-500" size={14} />
                      View Profile
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-left text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" size={14} />
                      Logout
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}