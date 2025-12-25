"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { FaRegBell } from "react-icons/fa6"
import { FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

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

    const handleLogout = () => {
      setCurrentUser(null)
      setShowDropdown(false)
    }

    // Listen for custom event when user data is updated
    window.addEventListener("userUpdated", handleStorageChange)
    window.addEventListener("userLoggedOut", handleLogout)

    // Also check on focus in case localStorage was updated in another tab
    window.addEventListener("focus", handleStorageChange)

    return () => {
      window.removeEventListener("userUpdated", handleStorageChange)
      window.removeEventListener("userLoggedOut", handleLogout)
      window.removeEventListener("focus", handleStorageChange)
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".profile-dropdown-container")) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDropdown])

  const links = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Coaches", href: "/coaches" },
    { name: "Services", href: "/services" },
  ]

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] flex justify-between items-center px-6 bg-[#354F52] text-white shadow-md z-50">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-20">
        <Link href="/" className="font-bold text-xl tracking-wide hover:text-[#C1B8AE] transition-colors">
          TrainSight
        </Link>

        <ul className="flex gap-10 ml-80">
          {links.map((link, i) => (
            <li key={i}>
              <Link href={link.href} className="text-white hover:text-[#C1B8AE] transition-colors duration-300">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-10 pr-4">
        <FaSearch className="text-white text-lg cursor-pointer hover:text-[#C1B8AE] transition-colors" />
        <FaRegBell className="text-white text-lg cursor-pointer hover:text-[#C1B8AE] transition-colors" />

        <div className="relative profile-dropdown-container">
          {currentUser ? (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setShowDropdown(!showDropdown)
              }} 
              className="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
            >
              {currentUser?.profilePicture ? (
                <Image
                  src={currentUser.profilePicture || "/placeholder.svg"}
                  alt={currentUser.fullName || "Profile"}
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
            {showDropdown && currentUser && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 overflow-hidden border border-gray-100"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
