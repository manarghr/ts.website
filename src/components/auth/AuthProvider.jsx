"use client"

// Who is signed in, according to the server
// File: src/components/auth/AuthProvider.jsx
//
// One place asks the server who you are, and every component reads the answer
// from here.
//
// This replaces a copy of the user object that used to live in
// localStorage under "trainsight_current_user" / "currentCoach". That copy was
// writable from devtools, never expired with the session, and drifted out of
// date whenever a profile changed somewhere else -- so the interface could show
// a name, a plan or a signed-in state that was simply not true. The server was
// always the authority for the DATA; now it is the authority for the UI too.
//
// The session cookie is httpOnly, so nothing here can read it. That is the
// point: we ask /api/auth/me and believe the answer.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

const AuthContext = createContext(null)

/**
 * Distinguish "the server says you are signed out" from "we never reached the
 * server". A failed request must not log anyone out of the interface -- going
 * through a tunnel should not empty the navbar.
 */
async function ask(url) {
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return { reached: true, data: null }
    return { reached: true, data: await res.json().catch(() => null) }
  } catch {
    return { reached: false, data: null }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [coach, setCoach] = useState(null)
  // Starts true so the first paint shows neither a signed-in nor a signed-out
  // navbar. Server and client both render this state, so there is no hydration
  // mismatch to work around.
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    // One cookie, one identity: /api/auth/me reports the role even when the
    // caller is a coach, so the coach profile is only fetched when it exists.
    const me = await ask("/api/auth/me")

    if (!me.reached) {
      setLoading(false)
      return // offline: keep whatever we were already showing
    }

    if (me.data?.authenticated && me.data.user) {
      setUser(me.data.user)
      setCoach(null)
      setLoading(false)
      return
    }

    setUser(null)

    if (me.data?.role === "coach") {
      const c = await ask("/api/coach/me")
      setCoach(c.reached ? c.data?.coach || null : null)
    } else {
      setCoach(null)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()

    // The rest of the app already announces changes with these events, and
    // several files outside this migration still dispatch them. Rather than
    // rewrite every caller, each event now means the same thing: ask the server
    // again. Anything stale fixes itself on the next round trip.
    const events = [
      "userUpdated",
      "userLoggedOut",
      "coachUpdated",
      "coachLoggedOut",
      "coachSessionUpdated",
    ]

    // Returning to the tab re-checks the session, which is what keeps two tabs
    // agreeing after a logout in one of them.
    for (const name of events) window.addEventListener(name, refresh)
    window.addEventListener("focus", refresh)

    return () => {
      for (const name of events) window.removeEventListener(name, refresh)
      window.removeEventListener("focus", refresh)
    }
  }, [refresh])

  /** Called by the login modals so the UI updates without a second round trip. */
  const signedInAsUser = useCallback((nextUser) => {
    setUser(nextUser || null)
    setCoach(null)
    setLoading(false)
  }, [])

  const signedInAsCoach = useCallback((nextCoach) => {
    setCoach(nextCoach || null)
    setUser(null)
    setLoading(false)
  }, [])

  const logoutUser = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // The cookie may survive a failed request, so still clear the UI and let
      // the next refresh() find out the truth.
    }
    setUser(null)
  }, [])

  const logoutCoach = useCallback(async () => {
    try {
      await fetch("/api/coach/auth/logout", { method: "POST" })
    } catch {
      /* same reasoning as logoutUser */
    }
    setCoach(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      coach,
      loading,
      isAuthenticated: Boolean(user || coach),
      refresh,
      signedInAsUser,
      signedInAsCoach,
      logoutUser,
      logoutCoach,
    }),
    [user, coach, loading, refresh, signedInAsUser, signedInAsCoach, logoutUser, logoutCoach]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Read the current session. Throws when used outside the provider, because a
 * component silently receiving `user: null` forever is far harder to debug than
 * a message naming the problem.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
