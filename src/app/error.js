"use client";

// Error boundary for every page
// File: src/app/error.js
//
// React calls this when a page or component throws while rendering. Without it,
// the visitor sees Next's raw error screen -- in production, a black page
// reading "Application error: a client-side exception has occurred", which tells
// them nothing and looks like the site is gone.
//
// Deliberately plain: no framer-motion, no icon library, no data fetching. This
// screen renders when something is already broken, so it must not depend on
// anything that might be the thing that broke.

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // The visitor never sees the real message; this is what makes it findable in
    // the browser console and in server logs.
    console.error("Page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#52796F]/10 to-[#6BB371]/10 px-6">
      <div className="text-center max-w-md">
        <h1 className="font-montserrat text-3xl sm:text-4xl font-bold text-[#354F52]">
          Something went wrong
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          This page didn&apos;t load properly. Trying again usually works.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {/* reset() re-renders the failed segment without a full page reload. */}
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-3 bg-[#52796F] text-white rounded-xl font-semibold hover:bg-[#354F52] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#52796F] text-[#354F52] rounded-xl font-semibold hover:bg-[#52796F] hover:text-white transition-all duration-300"
          >
            Back to home
          </Link>
        </div>

        {/* A support request that just says "it broke" is not actionable. Next
            attaches this digest to the matching server-side log entry. */}
        {error?.digest && (
          <p className="mt-8 text-xs text-gray-400 font-mono">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
