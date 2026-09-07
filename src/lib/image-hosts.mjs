// Hosts whose images may go through /_next/image
// File: src/lib/image-hosts.mjs
//
// One list, imported by two places that must never disagree:
//   next.config.mjs          -- builds `images.remotePatterns` from it
//   components/ui/SafeImage  -- decides whether next/image can take a URL
//
// They have to match, because next/image does not fail softly: given a hostname
// that is not configured it THROWS while rendering, which takes the page down
// rather than showing a broken image. SafeImage checks this list first and
// falls back to a plain <img> when the answer is no.
//
// User uploads are served same-origin from /uploads/... and need no entry here.
// When uploads move to Cloudinary/S3, add that hostname and both sides update.
export const OPTIMIZED_IMAGE_HOSTS = [
  "images.unsplash.com",
  "plus.unsplash.com",
  "img.youtube.com",
  "via.placeholder.com",
]

/**
 * Can next/image be trusted with this src?
 *
 * Same-origin paths ("/uploads/x.jpg", "/placeholder.svg") always qualify.
 * Remote URLs qualify only on an allowlisted https host. Everything else --
 * data: previews from FileReader, blob:, http:, an unlisted CDN, or a string
 * that is not a URL at all -- does not.
 */
export function canOptimizeImage(src) {
  if (typeof src !== "string" || src === "") return false
  if (src.startsWith("/")) return true

  try {
    const url = new URL(src)
    return url.protocol === "https:" && OPTIMIZED_IMAGE_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}
