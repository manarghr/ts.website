"use client"

// Non-blocking feedback messages
// File: src/components/ui/ToastProvider.jsx
//
// This replaces alert(). alert() is a native modal: it freezes the page, it
// cannot be styled, it stacks badly when two things fail at once, and on mobile
// it reads as a browser warning rather than as part of the site. A user who
// saved a meal and a user whose upload failed both got the same grey box.
//
// Toasts are announced to screen readers through a live region. Errors are
// assertive (they interrupt, because the user's action did not happen) and
// everything else is polite (it waits for a pause, because it is only
// confirmation).

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion"
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"

const ToastContext = createContext(null)

// How long each kind stays on screen. Errors linger: the user has to read them
// and often has to act again. Confirmations are disposable.
const LIFETIME = {
  success: 4000,
  info: 4000,
  warning: 6000,
  error: 6500,
}

const STYLES = {
  success: { bar: "#6bb371", icon: "M20 6 9 17l-5-5" },
  error: { bar: "#dc2626", icon: "M18 6 6 18M6 6l12 12" },
  warning: { bar: "#ff8c42", icon: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" },
  info: { bar: "#52796f", icon: "M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
}

// Only ever show a few at once. A burst of failures should not become a wall
// that covers the interface it is describing.
const MAX_VISIBLE = 4

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())
  const reduceMotion = useReducedMotion()

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message, options = {}) => {
      // Guard against objects and Errors reaching the DOM as "[object Object]",
      // which is what happens when a caller forwards a raw catch value.
      const text =
        message instanceof Error
          ? message.message
          : typeof message === "string"
            ? message
            : String(message ?? "")

      if (!text.trim()) return null

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const duration = options.duration ?? LIFETIME[type] ?? LIFETIME.info

      setToasts((current) => [...current, { id, type, text, title: options.title }].slice(-MAX_VISIBLE))

      if (duration > 0) {
        timers.current.set(id, setTimeout(() => dismiss(id), duration))
      }
      return id
    },
    [dismiss]
  )

  // A stable object, so components that take `toast` as a dependency do not
  // re-run their effects on every render of the provider.
  const toast = useMemo(
    () => ({
      success: (message, options) => push("success", message, options),
      error: (message, options) => push("error", message, options),
      warning: (message, options) => push("warning", message, options),
      info: (message, options) => push("info", message, options),
      dismiss,
    }),
    [push, dismiss]
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-3 top-3 z-[9999] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-5 sm:top-5 sm:items-end"
        // The region is always mounted so screen readers register it before the
        // first message arrives; a live region added at the same time as its
        // content is frequently not announced at all.
        aria-live="polite"
        aria-relevant="additions"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const style = STYLES[t.type] ?? STYLES.info
            return (
              <motion.div
                key={t.id}
                layout={!reduceMotion}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.97 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.97 }}
                transition={{ duration: reduceMotion ? 0.12 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                role={t.type === "error" ? "alert" : "status"}
                className="pointer-events-auto flex w-full max-w-md items-start gap-3 overflow-hidden rounded-xl border border-black/5 bg-white py-3 pl-3 pr-2.5 shadow-[0_8px_30px_rgba(47,62,70,0.16)] sm:w-auto sm:min-w-[19rem]"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${style.bar}1a` }}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={style.bar} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={style.icon} />
                  </svg>
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  {t.title && (
                    <p className="mb-0.5 text-sm font-semibold leading-snug text-[#2f3e46]">{t.title}</p>
                  )}
                  <p className="m-0 break-words text-sm leading-snug text-[#354f52]">{t.text}</p>
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="-mr-0.5 shrink-0 rounded-md p-1.5 text-[#52796f]/60 transition-colors hover:bg-[#52796f]/10 hover:text-[#354f52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

/**
 * Feedback messages. Returns { success, error, warning, info, dismiss }.
 *
 * Falls back to a no-op-ish shim rather than throwing when the provider is
 * missing, so a component rendered outside the tree (a stray test, a portal)
 * cannot take a page down over a status message.
 */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (ctx) return ctx
  if (process.env.NODE_ENV !== "production") {
    console.warn("useToast() called outside <ToastProvider>; message dropped.")
  }
  const noop = () => null
  return { success: noop, error: noop, warning: noop, info: noop, dismiss: noop }
}
