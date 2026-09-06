"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"

import { FaUser, FaSignOutAlt, FaDumbbell, FaBrain, FaUtensils, FaBars, FaTimes } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import logo from "../assets/logo1.png"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Who is signed in now comes from the server through AuthProvider, not from a
  // localStorage copy that anyone could edit in devtools. `loading` replaces the
  // old isMounted flag: until the session is known we render neither the signed-in
  // nor the signed-out state, which is also what keeps the server and client
  // markup identical on first paint.
  const { user: currentUser, coach: currentCoach, loading, logoutUser, logoutCoach } = useAuth()
  const isMounted = !loading

  const handleLogout = async () => {
    await logoutUser()
    setShowDropdown(false)
    router.push("/")
    router.refresh()
  }

  const handleCoachLogout = async () => {
    await logoutCoach()
    setShowDropdown(false)
    router.push("/")
    router.refresh()
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".profile-dropdown-container")) {
        setShowDropdown(false)
      }
      if (showServicesDropdown && !event.target.closest(".services-dropdown-container")) {
        setShowServicesDropdown(false)
      }
    }

    // Close mobile menu on escape key
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [showDropdown, showServicesDropdown])

  const links = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Coaches", href: "/coaches" },
  ]

  const services = [
    { name: "Our Programs", href: "/services/programs", icon: FaDumbbell, color: "#354F52" },
    { name: "AI Sports", href: "/services/ai-sports", icon: FaBrain, color: "#52796F" },
    { name: "Meal Prep", href: "/services/meals", icon: FaUtensils, color: "#52796F" },
  ]

  const isActive = (href) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 w-full h-[var(--nav-h)] flex justify-between items-center px-4 sm:px-6 bg-[#354F52] text-white shadow-md z-50">
      <div className="flex items-center gap-4 sm:gap-20 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#C1B8AE] transition-colors z-50"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <Link href="/" className="flex items-center gap-2 sm:gap-3 font-bold text-xl sm:text-2xl tracking-wide hover:text-[#C1B8AE] transition-colors group">
          <Image
            src={logo}
            alt="TrainSight Logo"
            width={48}
            height={48}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <span className="hidden sm:inline">TrainSight</span>
        </Link>

        {/* Desktop Navigation - original position (same gap after logo as before) */}
        <ul className="hidden lg:flex gap-10 items-center lg:ml-80">
          {links.map((link, i) => (
            <li key={i}>
              <Link
                href={link.href}
                className={`text-white hover:text-[#C1B8AE] transition-colors duration-300 relative pb-1 text-[17px] font-semibold ${
                  isActive(link.href) ? "text-[#6BB371]" : ""
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

          {/* Services Dropdown */}
          <li
            className="relative services-dropdown-container"
            onMouseEnter={() => setShowServicesDropdown(true)}
            onMouseLeave={() => setShowServicesDropdown(false)}
          >
            <Link
              href="/services"
              className={`text-white hover:text-[#C1B8AE] transition-colors duration-300 relative pb-1 text-[17px] font-semibold ${
                pathname.startsWith("/services") ? "text-[#6BB371]" : ""
              }`}
            >
              Services
              {pathname.startsWith("/services") && (
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
                          pathname === service.href ? "bg-gray-50" : ""
                        }`}
                        onClick={() => setShowServicesDropdown(false)}
                      >
                        <div
                          className="mr-3 p-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: pathname === service.href ? service.color : "#f3f4f6",
                            color: pathname === service.href ? "white" : service.color,
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <span className={`font-medium ${pathname === service.href ? "text-[#354F52]" : ""}`}>
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-[var(--nav-h)] left-0 w-80 max-w-[85vw] h-[calc(100vh-var(--nav-h))] bg-[#354F52] shadow-2xl z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6 space-y-4">
                {/* Mobile Links */}
                {links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 text-white hover:bg-[#52796F] rounded-lg transition-colors ${
                      isActive(link.href) ? "bg-[#52796F] text-[#6BB371]" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Services Section */}
                <div className="pt-4 border-t border-white/20">
                  <div className="px-4 py-2 text-sm font-semibold text-white/70 uppercase tracking-wider">
                    Services
                  </div>
                  {services.map((service, i) => {
                    const Icon = service.icon
                    return (
                      <Link
                        key={i}
                        href={service.href}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setShowServicesDropdown(false)
                        }}
                        className={`flex items-center py-3 px-4 text-white hover:bg-[#52796F] rounded-lg transition-colors ${
                          pathname === service.href ? "bg-[#52796F]" : ""
                        }`}
                      >
                        <Icon className="mr-3" size={18} />
                        <span>{service.name}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* Mobile Profile Section */}
                {isMounted && (currentCoach || currentUser) && (
                  <div className="pt-4 border-t border-white/20">
                    {currentCoach ? (
                      <>
                        <Link
                          href="/coach/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center py-3 px-4 text-white hover:bg-[#52796F] rounded-lg transition-colors"
                        >
                          <FaUser className="mr-3" size={16} />
                          Coach Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleCoachLogout()
                            setMobileMenuOpen(false)
                          }}
                          className="flex items-center w-full py-3 px-4 text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <FaSignOutAlt className="mr-3" size={16} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center py-3 px-4 text-white hover:bg-[#52796F] rounded-lg transition-colors"
                        >
                          <FaUser className="mr-3" size={16} />
                          View Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout()
                            setMobileMenuOpen(false)
                          }}
                          className="flex items-center w-full py-3 px-4 text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <FaSignOutAlt className="mr-3" size={16} />
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Profile */}
      <div className="hidden lg:flex justify-between items-center gap-4 xl:gap-10">
        {/* isMounted-gated like everything else here: the server does not know who is
            signed in, so rendering the name before hydration would mismatch. */}
        {isMounted && (currentCoach || currentUser) && (
          <span className="hidden xl:block text-white/85 font-semibold whitespace-nowrap">
            Hey,{" "}
            <span className="text-[#6BB371]">
              {(currentCoach?.name || currentUser?.fullName || "there").trim().split(" ")[0]}
            </span>
          </span>
        )}
        <div className="relative profile-dropdown-container">
          <button
            onClick={(e) => {
              if (isMounted && (currentCoach || currentUser)) {
                e.stopPropagation()
                setShowDropdown(!showDropdown)
              }
            }}
            className={`flex items-center focus:outline-none transition-opacity ${
              isMounted && (currentCoach || currentUser)
                ? "hover:opacity-80 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!(isMounted && (currentCoach || currentUser))}
          >
            {/* Consistent fallback on server + initial client render */}
            {isMounted && (currentCoach?.image_url || currentUser?.profilePicture) ? (
              <Image
                src={currentCoach?.image_url || currentUser?.profilePicture || "/placeholder.svg"}
                alt={currentCoach?.name || currentUser?.fullName || "Profile"}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-white hover:border-[#C1B8AE] transition-all hover:scale-110"
                unoptimized
              />
            ) : (
              <FaUser className="w-7 h-7 text-white" />
            )}
          </button>

          <AnimatePresence>
            {showDropdown && isMounted && (currentCoach || currentUser) && (
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