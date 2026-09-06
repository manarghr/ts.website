/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy, written as data so each source has a reason next to it.
//
// Two entries here are weaker than we would like, and both are forced:
//   'unsafe-inline' on style-src  -- Next.js and framer-motion both set inline
//                                    styles; a nonce cannot cover framer's
//                                    per-frame animation styles.
//   'unsafe-eval'   on script-src -- MediaPipe compiles WebAssembly. Browsers
//                                    that support 'wasm-unsafe-eval' use that
//                                    instead; the older keyword stays for the
//                                    rest, and Next needs it for dev HMR.
const csp = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'wasm-unsafe-eval'", "https://cdn.jsdelivr.net"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  // blob:/data: cover the pose canvas and camera frames drawn client-side.
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://images.unsplash.com",
    "https://plus.unsplash.com",
    "https://img.youtube.com",
    "https://via.placeholder.com",
  ],
  "media-src": ["'self'", "blob:"],
  // jsdelivr is fetched, not just scripted: MediaPipe pulls its .wasm and model
  // files at runtime. ws: is dev-only, for Next's hot-reload socket.
  "connect-src": isDev
    ? ["'self'", "https://cdn.jsdelivr.net", "ws:", "wss:"]
    : ["'self'", "https://cdn.jsdelivr.net"],
  "worker-src": ["'self'", "blob:"],
  // Nothing on this site is meant to be framed, and no form should post away.
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
};

const cspHeader = Object.entries(csp)
  .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  // Belt and braces with frame-ancestors, for browsers that predate CSP level 2.
  { key: "X-Frame-Options", value: "DENY" },
  // Stops a browser second-guessing a Content-Type, which is how an uploaded
  // file gets treated as a script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL within our own site, only the origin when leaving it.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The AI coaching page needs the camera; nothing here needs the rest.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), interest-cohort=()" },
];

// HSTS only means anything over HTTPS, and pinning it on a local http server is
// a good way to lock yourself out of localhost. Production only.
if (!isDev) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

const nextConfig = {
  images: {
    // Only hosts we actually load images from.
    //
    // This used to be `hostname: "**"` on both http and https, which made
    // /_next/image an open proxy: anyone could ask our server to fetch, resize
    // and cache any URL on the internet, on our bandwidth and from our IP.
    //
    // User uploads are served same-origin from /uploads/... and need no entry
    // here. When uploads move to Cloudinary/S3, add that hostname below.
    //
    // An image from a host that is not listed will not render -- that is the
    // point. Add the host here rather than widening the pattern.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // Webpack configuration for production builds
  webpack: (config, { isServer }) => {
    // Fix MediaPipe in Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
