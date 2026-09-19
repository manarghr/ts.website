"use client";

// Browser pose detection
// File: src/components/AI/PoseEngine.jsx
//
// Runs MediaPipe Pose on a <video> element and hands the landmarks to the
// parent. Detection only -- it renders nothing. Drawing belongs to PoseOverlay
// and judgement to lib/ai/session.js, which keeps each of the three testable on
// its own.
//
// This replaces the round trip to the Python server (AI/mediapipe_api.py). Same
// model, same 33 landmarks, but it runs on the viewer's machine: no per-frame
// network hop, no server to keep awake, and it works offline.

import { useEffect, useRef } from "react";

// Served by us out of public/, copied there by scripts/copy-mediapipe.mjs.
// Deliberately not a CDN: the AI page should not go down because someone
// else's CDN did.
const ASSET_PATH = "/mediapipe/pose";

// Loading the library via `import("@mediapipe/pose")` does NOT work here.
// Its package.json lists only the .data/.wasm asset files under "sideEffects",
// so pose.js is treated as side-effect-free -- and because the import's bindings
// are never used (the library registers itself globally instead), the bundler is
// free to drop the module entirely. The result is an import that resolves while
// window.Pose never appears.
//
// Loading it as a classic <script> sidesteps the bundler completely, and gives
// the bundle the `this === window` it expects when it registers its globals.
let poseScriptPromise = null;

function loadPoseScript() {
  if (poseScriptPromise) return poseScriptPromise;

  poseScriptPromise = new Promise((resolve, reject) => {
    // Already there: a previous mount loaded it, or it was server-rendered in.
    if (window.Pose) return resolve();

    const src = `${ASSET_PATH}/pose.js`;
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("pose.js failed to load")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => {
      // Let a later attempt retry rather than caching the failure forever.
      poseScriptPromise = null;
      script.remove();
      reject(new Error("Could not load the pose model script"));
    };
    document.head.appendChild(script);
  });

  return poseScriptPromise;
}

/**
 * @param {object} props
 * @param {React.RefObject<HTMLVideoElement>} props.videoRef - video to read frames from
 * @param {boolean} props.isActive - detect while true; tear down when false
 * @param {(landmarks: Array<{x:number,y:number,z:number,visibility:number}>|null) => void} props.onLandmarks
 *        called once per analysed frame; null when no pose was found
 * @param {(status: {state:"loading"|"ready"|"error", error?:string}) => void} [props.onStatus]
 * @param {number} [props.fps=15] - analysis rate cap; detection is the expensive part
 * @param {0|1|2} [props.modelComplexity=0] - 0 lite, 1 full, 2 heavy.
 *        Only 0 and 1 are available: the heavy model is not copied into public/.
 *        Lite by default: in step mode each detection gates the next frame, so a
 *        slower model shows up directly as slower playback.
 */
export default function PoseEngine({
  videoRef,
  isActive,
  onLandmarks,
  onStatus,
  fps = 15,
  modelComplexity = 0,
}) {
  // Callbacks live in refs, not in the dependency array. A parent that passes an
  // inline arrow function re-renders with a new identity every time, and if that
  // were a dependency this effect would tear down and re-initialise the whole
  // WASM runtime on every render -- several hundred ms of stall per frame.
  const onLandmarksRef = useRef(onLandmarks);
  const onStatusRef = useRef(onStatus);

  useEffect(() => {
    onLandmarksRef.current = onLandmarks;
    onStatusRef.current = onStatus;
  }, [onLandmarks, onStatus]);

  useEffect(() => {
    if (!isActive) return;

    let cancelled = false;
    let pose = null;
    let frameHandle = null;
    // MediaPipe rejects overlapping send() calls, so only one frame is ever in flight.
    let inFlight = false;
    let lastFrameAt = 0;

    // Frames are copied through this canvas rather than handing the <video>
    // straight to MediaPipe. A paused, seeked video does not present new frames,
    // and uploading its texture can yield a blank image -- which comes back as
    // "no pose detected" on every frame, with no error. drawImage always gives a
    // real decoded frame. It also lets us downscale: detection cost scales with
    // pixels, and pose does not need more than this.
    const frameCanvas = document.createElement("canvas");
    const frameCtx = frameCanvas.getContext("2d", { willReadFrequently: true });
    const MAX_FRAME_WIDTH = 640;
    // "ready" is reported on the first actual result, not when the loop starts:
    // the first send() is what fetches and compiles the WASM, so the wait the
    // viewer feels ends when landmarks appear, not before.
    let announced = false;

    const minFrameGapMs = 1000 / Math.max(1, fps);
    const report = (status) => {
      if (!cancelled) onStatusRef.current?.(status);
    };

    const start = async () => {
      report({ state: "loading" });

      try {
        await loadPoseScript();
        if (cancelled) return;

        if (!window.Pose) {
          throw new Error("MediaPipe loaded but did not register window.Pose");
        }

        pose = new window.Pose({ locateFile: (file) => `${ASSET_PATH}/${file}` });

        pose.setOptions({
          modelComplexity,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          // Off on purpose. selfieMode would hand back horizontally flipped
          // landmarks; the analysers read anatomical left/right, and PoseOverlay
          // does its own mirroring for the CSS-flipped preview. Flipping here
          // would mirror twice and swap the athlete's sides.
          selfieMode: false,
        });

        pose.onResults((results) => {
          if (cancelled) return;
          if (!announced) {
            announced = true;
            report({ state: "ready" });
          }
          onLandmarksRef.current?.(results?.poseLandmarks ?? null);
        });

        const pump = async () => {
          if (cancelled) return;

          const video = videoRef.current;
          const now = performance.now();
          const due = now - lastFrameAt >= minFrameGapMs;

          if (
            due &&
            !inFlight &&
            video &&
            !video.seeking &&
            video.readyState >= 2 &&
            video.videoWidth > 0
          ) {
            lastFrameAt = now;
            inFlight = true;
            try {
              const scale = Math.min(1, MAX_FRAME_WIDTH / video.videoWidth);
              const width = Math.max(1, Math.round(video.videoWidth * scale));
              const height = Math.max(1, Math.round(video.videoHeight * scale));

              if (frameCanvas.width !== width || frameCanvas.height !== height) {
                frameCanvas.width = width;
                frameCanvas.height = height;
              }

              frameCtx.drawImage(video, 0, 0, width, height);
              await pose.send({ image: frameCanvas });
            } catch (error) {
              // A send can reject while we are tearing down; that is not a fault.
              if (!cancelled) console.error("Pose detection frame failed:", error);
            } finally {
              inFlight = false;
            }
          }

          if (!cancelled) frameHandle = requestAnimationFrame(pump);
        };

        frameHandle = requestAnimationFrame(pump);
      } catch (error) {
        console.error("Failed to start pose detection:", error);
        report({
          state: "error",
          error: error?.message || "Could not start pose detection",
        });
      }
    };

    start();

    return () => {
      cancelled = true;
      if (frameHandle) cancelAnimationFrame(frameHandle);
      if (pose) {
        // close() can reject if a send is still settling. Nothing to do about
        // it, and letting it escape would surface as an unhandled rejection.
        Promise.resolve(pose.close()).catch(() => {});
      }
    };
  }, [videoRef, isActive, fps, modelComplexity]);

  return null;
}
