// 404 page
// File: src/app/not-found.js
//
// Shown for any URL that does not match a route, and by any page that calls
// notFound(). Before this existed, a mistyped link produced Next's unstyled
// default page, which looks like the site is broken rather than like the
// address was wrong.
//
// A plain server component: no client JavaScript is needed to say "that page
// does not exist", and this way it renders even if something else fails to load.

import Link from "next/link";

export const metadata = {
  title: "Page not found - TrainSight",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#52796F]/10 to-[#6BB371]/10 px-6">
      <div className="text-center max-w-md">
        <p className="font-montserrat text-7xl font-extrabold text-[#52796F]/30 leading-none">404</p>

        <h1 className="font-montserrat mt-4 text-3xl sm:text-4xl font-bold text-[#354F52]">
          This page doesn&apos;t exist
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          The link may be out of date, or the address may have a typo in it.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#52796F] text-white rounded-xl font-semibold hover:bg-[#354F52] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Back to home
          </Link>
          <Link
            href="/coaches"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#52796F] text-[#354F52] rounded-xl font-semibold hover:bg-[#52796F] hover:text-white transition-all duration-300"
          >
            Browse coaches
          </Link>
        </div>
      </div>
    </main>
  );
}
