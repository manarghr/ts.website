"use client"

// An image that optimizes when it can and never crashes when it cannot
// File: src/components/ui/SafeImage.jsx
//
// The admin dashboard shows images whose URLs an admin typed in. next/image
// cannot take those blind: a hostname missing from `remotePatterns` makes it
// throw during render, so one pasted link from an unlisted CDN would blank the
// whole dashboard rather than one card. The previews are worse still -- they
// are `data:` URLs straight out of FileReader, which the optimizer cannot
// process at all.
//
// So: same-origin and allowlisted hosts go through next/image and get resizing,
// lazy loading and modern formats. Everything else renders as a plain <img>,
// exactly as it did before. Nothing regresses, and the common case gets faster.
//
// Both branches fall back to `fallbackSrc` if the image 404s, replacing the
// mutate-e.target.src trick that does not work on next/image -- it manages its
// own src, so an assignment is overwritten on the next render.

import Image from "next/image"
import { useEffect, useState } from "react"
import { canOptimizeImage } from "@/lib/image-hosts.mjs"

export default function SafeImage({
  src,
  alt = "",
  fallbackSrc = "/placeholder.svg",
  className = "",
  // `fill` needs a positioned ancestor; every call site here already has a
  // fixed-size wrapper, so this is the useful default.
  sizes = "(max-width: 768px) 100vw, 33vw",
  ...rest
}) {
  const [failed, setFailed] = useState(false)

  // A new src deserves a fresh attempt -- otherwise editing a record leaves the
  // previous failure latched and shows the placeholder for a perfectly good URL.
  useEffect(() => {
    setFailed(false)
  }, [src])

  const resolved = failed || !src ? fallbackSrc : src

  if (!canOptimizeImage(resolved)) {
    return (
      // `fill` lays next/image out as absolute inset-0, so the fallback copies
      // that. Otherwise the two branches would size differently and swapping
      // between them would visibly reflow the card.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
        onError={() => setFailed(true)}
        {...rest}
      />
    )
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
