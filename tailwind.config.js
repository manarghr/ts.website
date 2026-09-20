/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // `font-display` for headlines, `font-sans` everywhere else. Naming them
        // by role rather than by typeface means changing the face later is one
        // line here instead of a find-and-replace across the app.
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      colors: {
        // The old palette was three greens used interchangeably, which is why
        // every section looked the same. These have distinct jobs.
        ink: {
          DEFAULT: '#16211F', // near-black with a green cast, for body text
          soft: '#4A5A56',    // secondary text
          muted: '#7B8A86',   // metadata, captions
        },
        forest: {
          DEFAULT: '#1B2D2A', // deep sections, the "dark mode" of the brand
          700: '#25403B',
          600: '#354F52',     // the original brand green, now one step in a scale
        },
        moss: {
          DEFAULT: '#52796F', // mid green, supporting surfaces
          light: '#6BB371',   // the accent -- used sparingly, for emphasis only
        },
        bone: {
          DEFAULT: '#F6F5F1', // warm off-white, replaces pure white sections
          dark: '#EBE9E3',    // subtle separation without a border
        },
      },

      fontSize: {
        // An editorial display scale, clamped so it flexes with the viewport
        // instead of jumping at breakpoints.
        'display-sm': ['clamp(2.25rem, 4vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display': ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(3.25rem, 9vw, 6.75rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        // The small uppercase line above a headline.
        'eyebrow': ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },

      maxWidth: {
        // One measure for body copy, so paragraphs stay readable everywhere.
        prose: '62ch',
      },

      transitionTimingFunction: {
        // Slight overshoot-free ease used for hovers and reveals.
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
