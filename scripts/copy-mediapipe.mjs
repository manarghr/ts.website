// Copy the MediaPipe Pose runtime into public/
// File: scripts/copy-mediapipe.mjs
//
// @mediapipe/pose ships its WASM runtime and models as data files that the
// library fetches over HTTP at runtime. Two ways to serve them:
//
//   - point locateFile at a CDN (jsdelivr). One less build step, but the AI page
//     is then only as reliable as someone else's CDN, and it cannot work offline.
//   - serve them ourselves from public/. That is this script.
//
// They are copied rather than committed: ~24MB of binaries do not belong in git,
// and npm already pins the exact version we want. Runs automatically before
// `npm run dev` and `npm run build` (see the predev/prebuild scripts).

import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "node_modules", "@mediapipe", "pose");
const DEST = join(ROOT, "public", "mediapipe", "pose");

// Exactly what the runtime asks for, and nothing else. Notably absent:
// pose_landmark_heavy.tflite (27MB) -- the page uses modelComplexity 0 or 1,
// so the heavy model would be dead weight on every deploy.
const REQUIRED = [
  // The library itself. Loaded with a <script> tag rather than imported, so it
  // runs as a classic script where `this` is the window and it can register
  // window.Pose. Bundling it does not work: package.json marks pose.js as
  // side-effect-free, so webpack is entitled to drop an import whose bindings
  // are never used -- and then the global never appears.
  "pose.js",
  "pose_solution_packed_assets_loader.js",
  "pose_solution_packed_assets.data",
  "pose_solution_simd_wasm_bin.js",
  "pose_solution_simd_wasm_bin.wasm",
  "pose_solution_wasm_bin.js",
  "pose_solution_wasm_bin.wasm",
  "pose_web.binarypb",
  "pose_landmark_lite.tflite",
  "pose_landmark_full.tflite",
];

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

async function main() {
  try {
    await readdir(SOURCE);
  } catch {
    console.error(`@mediapipe/pose not found at ${SOURCE}`);
    console.error("Run `npm install` first.");
    process.exit(1);
  }

  await mkdir(DEST, { recursive: true });

  let copied = 0;
  let total = 0;

  for (const name of REQUIRED) {
    const from = join(SOURCE, name);
    const to = join(DEST, name);

    let size;
    try {
      ({ size } = await stat(from));
    } catch {
      // A missing file means @mediapipe/pose changed its layout. Fail loudly:
      // silently shipping an incomplete runtime breaks the page at load time.
      console.error(`missing from @mediapipe/pose: ${name}`);
      console.error("The package layout changed. Update REQUIRED in this script.");
      process.exit(1);
    }

    // Skip files already copied at the same size -- keeps repeat dev starts fast.
    try {
      const existing = await stat(to);
      if (existing.size === size) {
        total += size;
        continue;
      }
    } catch {
      // Not copied yet; fall through.
    }

    await copyFile(from, to);
    copied += 1;
    total += size;
  }

  const where = "public/mediapipe/pose";
  console.log(
    copied === 0
      ? `mediapipe: ${REQUIRED.length} files already in ${where} (${mb(total)})`
      : `mediapipe: copied ${copied} file(s) to ${where} (${mb(total)} total)`
  );
}

main().catch((error) => {
  console.error("Failed to copy the MediaPipe runtime:", error);
  process.exit(1);
});
