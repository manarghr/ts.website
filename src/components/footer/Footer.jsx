import Link from "next/link";

// Footer
// File: src/components/footer/Footer.jsx
//
// Was four equal columns under a centred blurb -- the default shape. The brand
// column is now double width and the link groups sit tighter beside it, which
// gives the block a reading order instead of four interchangeable stacks.
//
// Every href points at a route that exists. The previous version linked to
// "#programs", "#help", "#contact" and similar anchors that went nowhere.

const EXPLORE = [
  { label: "Programs", href: "/services/programs" },
  { label: "Coaches", href: "/coaches" },
  { label: "Nutrition", href: "/services/meals" },
  { label: "Form analysis", href: "/services/ai-sports" },
];

const COMPANY = [
  { label: "About us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 5.3a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.4a2.9 2.9 0 110-5.8 2.9 2.9 0 010 5.8zm5.7-7.6a1.05 1.05 0 11-2.1 0 1.05 1.05 0 012.1 0z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.7-1.8C19.3 5 12 5 12 5s-7.3 0-8.9.5A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.7 1.8c1.6.5 8.9.5 8.9.5s7.3 0 8.9-.5a2.5 2.5 0 001.7-1.8C23 15.2 23 12 23 12zM9.8 15.1V8.9l6 3.1-6 3.1z",
  },
  {
    label: "X",
    href: "https://x.com",
    path: "M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3-5.8 7.3H2.8l7.5-8.6L2.4 2h6.6l4.5 6.7L18.9 2zm-1.1 18h1.8L7.4 3.9H5.5L17.8 20z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-bold tracking-tight">TrainSight</p>
            <p className="mt-4 max-w-prose leading-relaxed text-white/55">
              Form analysis that runs in your browser, training programmes written by
              coaches, and the numbers to tell whether any of it is working.
            </p>
          </div>

          <nav aria-label="Explore">
            <p className="eyebrow text-white/40">Explore</p>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="eyebrow text-white/40">Company</p>
            <ul className="mt-5 space-y-3">
              {COMPANY.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} TrainSight. All rights reserved.
          </p>

          <ul className="flex items-center gap-5">
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="block text-white/45 transition-colors duration-300 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d={item.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
