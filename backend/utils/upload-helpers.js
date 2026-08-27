// Upload validation and storage
// File: backend/utils/upload-helpers.js
//
// Two rules here, both learned from what this code used to do:
//
//  1. The extension comes from THIS table, never from the uploader's filename.
//     Taking it from `file.name` let someone upload "evil.html", have it written
//     into public/uploads, and served back as a page on our own domain.
//
//  2. `file.type` is just a header the uploader writes, so it proves nothing.
//     Every type is checked against the first bytes of the actual file as well.

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

/** Validation failures the caller is allowed to see. Anything else is a 500. */
export class UploadError extends Error {}

const ascii = (buffer, start, text) =>
  buffer.slice(start, start + text.length).toString("latin1") === text;

const startsWith = (buffer, bytes) => bytes.every((b, i) => buffer[i] === b);

export const IMAGE_TYPES = {
  "image/jpeg": { ext: "jpg", check: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  "image/jpg": { ext: "jpg", check: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  "image/png": {
    ext: "png",
    check: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  "image/gif": { ext: "gif", check: (b) => ascii(b, 0, "GIF8") },
  "image/webp": { ext: "webp", check: (b) => ascii(b, 0, "RIFF") && ascii(b, 8, "WEBP") },
};

export const VIDEO_TYPES = {
  "video/mp4": { ext: "mp4", check: (b) => ascii(b, 4, "ftyp") },
  "video/quicktime": { ext: "mov", check: (b) => ascii(b, 4, "ftyp") },
  "video/webm": { ext: "webm", check: (b) => startsWith(b, [0x1a, 0x45, 0xdf, 0xa3]) },
  "video/ogg": { ext: "ogv", check: (b) => ascii(b, 0, "OggS") },
  "video/x-msvideo": { ext: "avi", check: (b) => ascii(b, 0, "RIFF") && ascii(b, 8, "AVI ") },
};

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

// Vercel caps a serverless request body at 4.5MB, so anything this size has to go
// straight from the browser to Cloudinary/S3 eventually. 50MB keeps local dev usable.
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

const mb = (bytes) => Math.round(bytes / 1024 / 1024);

/**
 * Validate an uploaded file and write it under public/<subdir>.
 * Throws UploadError for anything the user should see. Returns the public URL.
 */
export async function saveUpload(file, { allowed, maxBytes, subdir }) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new UploadError("No file uploaded");
  }

  const spec = allowed[file.type];
  if (!spec) {
    throw new UploadError(`Unsupported file type. Allowed: ${Object.keys(allowed).join(", ")}`);
  }

  if (file.size > maxBytes) {
    throw new UploadError(`File is too large. Maximum size is ${mb(maxBytes)}MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // file.size is reported by the sender; this is the size we actually received.
  if (buffer.length > maxBytes) {
    throw new UploadError(`File is too large. Maximum size is ${mb(maxBytes)}MB.`);
  }

  if (!spec.check(buffer)) {
    throw new UploadError("File contents do not match its type.");
  }

  const dir = join(process.cwd(), "public", ...subdir);
  await mkdir(dir, { recursive: true });

  // Random rather than Math.random(): predictable names let someone guess the URL
  // of a file another person just uploaded.
  const filename = `${Date.now()}_${crypto.randomBytes(8).toString("hex")}.${spec.ext}`;
  await writeFile(join(dir, filename), buffer);

  return { url: `/${subdir.join("/")}/${filename}`, filename };
}
