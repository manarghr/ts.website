// Shared loading state
// File: src/components/layout/LoadingScreen.jsx
//
// Used by the loading.js files Next renders while a route's data is on its way.
// Before these existed, every data-heavy page sat blank and then jumped as the
// content arrived, which reads as a broken page rather than a busy one.
//
// A card skeleton rather than a lone spinner: showing roughly the shape of what
// is coming stops the layout shifting when it lands.

export default function LoadingScreen({ label = "Loading", cards = 6 }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#52796F]/10 to-[#6BB371]/10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-5 w-5 rounded-full border-2 border-[#52796F]/30 border-t-[#52796F] animate-spin"
            aria-hidden="true"
          />
          {/* The only text a screen reader needs; the skeleton below is decorative. */}
          <p className="font-montserrat text-lg font-semibold text-[#354F52]">{label}…</p>
        </div>

        <div
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-hidden="true"
        >
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/60 p-5 shadow-sm">
              <div className="h-40 rounded-xl bg-[#52796F]/10 animate-pulse" />
              <div className="mt-4 h-4 w-3/4 rounded bg-[#52796F]/10 animate-pulse" />
              <div className="mt-2 h-4 w-1/2 rounded bg-[#52796F]/10 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
