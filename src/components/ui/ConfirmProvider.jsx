"use client"

// Ask before destroying something
// File: src/components/ui/ConfirmProvider.jsx
//
// This replaces window.confirm(). Fifteen of the sixteen call sites it stood in
// for were deletions, and the native dialog gave all of them the same voice:
// browser chrome, the site's name in the corner, an OK button. Nothing told the
// user that "Delete this program?" was irreversible, and nothing tied the
// question to the thing being deleted.
//
// confirm() is synchronous -- it blocks the thread and hands back a boolean. A
// real dialog cannot do that, so this returns a promise instead:
//
//     if (!(await confirm({ title: "Delete this program?" }))) return
//
// Focus moves into the dialog on open and returns to whatever opened it on
// close, so a keyboard user is not dropped at the top of the document.

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

const ConfirmContext = createContext(null)

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null)
  const resolver = useRef(null)
  const panelRef = useRef(null)
  const opener = useRef(null)
  const reduceMotion = useReducedMotion()

  const confirm = useCallback((options = {}) => {
    // Remember where focus was so it can be handed back on close.
    opener.current = typeof document !== "undefined" ? document.activeElement : null

    return new Promise((resolve) => {
      resolver.current = resolve
      setRequest({
        title: options.title ?? "Are you sure?",
        message: options.message ?? "",
        confirmText: options.confirmText ?? "Confirm",
        cancelText: options.cancelText ?? "Cancel",
        // Deletions get a red button; everything else stays in brand colour, so
        // "destructive" is visible before the click rather than after it.
        danger: options.danger ?? true,
      })
    })
  }, [])

  const settle = useCallback((answer) => {
    resolver.current?.(answer)
    resolver.current = null
    setRequest(null)
    // Let the exit animation start before focus jumps back.
    requestAnimationFrame(() => opener.current?.focus?.())
  }, [])

  // Escape cancels, and Tab is kept inside the dialog. Without the trap, tabbing
  // walks into the page behind the backdrop, which is still visually covered --
  // the user loses the cursor entirely.
  useEffect(() => {
    if (!request) return

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault()
        settle(false)
        return
      }
      if (event.key !== "Tab") return

      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE)
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)

    // The page behind a modal must not scroll under it.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [request, settle])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <AnimatePresence>
        {request && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-end justify-center bg-[#2f3e46]/60 p-4 backdrop-blur-[2px] sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.18 }}
            onClick={() => settle(false)}
          >
            <motion.div
              ref={panelRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby={request.message ? "confirm-message" : undefined}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              // Clicking the panel must not reach the backdrop's cancel handler.
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(47,62,70,0.3)]"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: request.danger ? "#dc26261a" : "#52796f1a" }}
                  aria-hidden="true"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={request.danger ? "#dc2626" : "#52796f"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <h2 id="confirm-title" className="m-0 text-lg font-bold leading-snug text-[#2f3e46]">
                    {request.title}
                  </h2>
                  {request.message && (
                    <p id="confirm-message" className="mb-0 mt-1.5 text-sm leading-relaxed text-[#354f52]/80">
                      {request.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => settle(false)}
                  className="rounded-lg border border-[#c8cdc5] bg-white px-4 py-2.5 text-sm font-semibold text-[#354f52] transition-colors hover:bg-[#d9e2dc]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f] focus-visible:ring-offset-2"
                >
                  {request.cancelText}
                </button>
                <button
                  type="button"
                  // Focused on open: the safe default is that Enter confirms the
                  // action the user just asked for, and Escape backs out.
                  autoFocus
                  onClick={() => settle(true)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    request.danger
                      ? "bg-[#dc2626] hover:bg-[#b91c1c] focus-visible:ring-[#dc2626]"
                      : "bg-[#52796f] hover:bg-[#354f52] focus-visible:ring-[#52796f]"
                  }`}
                >
                  {request.confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  )
}

/**
 * Returns an async confirm(options) -> Promise<boolean>.
 *
 * Resolves false when the provider is missing, which fails safe: a destructive
 * action is skipped rather than silently carried out.
 */
export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (ctx) return ctx
  if (process.env.NODE_ENV !== "production") {
    console.warn("useConfirm() called outside <ConfirmProvider>; treated as cancelled.")
  }
  return async () => false
}
