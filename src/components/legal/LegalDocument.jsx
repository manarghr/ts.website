// Shared layout for the policy pages
// File: src/components/legal/LegalDocument.jsx
//
// /privacy and /terms are the same shape: a title, a date, and numbered
// sections of prose. One shell so they cannot drift apart visually, and so the
// reading width and heading rhythm are decided in a single place.
//
// A plain server component. Nothing here needs client JavaScript, and a policy
// page should render even if a script fails.

export function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-montserrat text-xl sm:text-2xl font-bold text-[#354F52] mt-10 mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

/** A definition-style row list, for "what we store and why" tables. */
export function DataTable({ caption, rows }) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-b-2 border-[#C8CDC5]">
            <th scope="col" className="py-2 pr-4 font-semibold text-[#354F52] whitespace-nowrap">
              What
            </th>
            <th scope="col" className="py-2 font-semibold text-[#354F52]">
              Why we have it
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([what, why]) => (
            <tr key={what} className="border-b border-[#C8CDC5]/50 align-top">
              <th scope="row" className="py-2 pr-4 font-medium text-gray-800">
                {what}
              </th>
              <td className="py-2 text-gray-700">{why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Pulled-out statement for the things worth not missing. */
export function Highlight({ children }) {
  return (
    <div className="my-5 border-l-4 border-[#6BB371] bg-[#6BB371]/10 px-4 py-3 text-[15px] leading-relaxed text-[#354F52]">
      {children}
    </div>
  );
}

/** Same, for a warning that carries actual risk (injury, money). */
export function Warning({ children }) {
  return (
    <div className="my-5 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-[15px] leading-relaxed text-amber-900">
      {children}
    </div>
  );
}

export default function LegalDocument({ title, lastUpdated, summary, children }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <h1 className="font-montserrat text-3xl sm:text-4xl font-extrabold text-[#354F52]">
          {title}
        </h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: {lastUpdated}</p>

        {summary && (
          <p className="mt-6 text-base leading-relaxed text-gray-700 border-b border-[#C8CDC5] pb-8">
            {summary}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
