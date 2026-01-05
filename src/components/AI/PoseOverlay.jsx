"use client";

import { useEffect, useRef } from "react";

// MediaPipe Pose connections (same as POSE_CONNECTIONS)
const POSE_CONNECTIONS = [
  [0, 1],[1, 2],[2, 3],[3, 7],[0, 4],[4, 5],[5, 6],[6, 8],
  [9, 10],[11, 12],[11, 13],[13, 15],[15, 17],[15, 19],[15, 21],[17, 19],
  [12, 14],[14, 16],[16, 18],[16, 20],[16, 22],[18, 20],
  [11, 23],[12, 24],[23, 24],[23, 25],[24, 26],[25, 27],[26, 28],
  [27, 29],[28, 30],[29, 31],[30, 32],[27, 31],[28, 32],
];

export default function PoseOverlay({ videoRef, canvasRef, landmarks, enabled, mirror = true }) {

  useEffect(() => {
    if (!enabled) return;
    if (!videoRef?.current || !canvasRef?.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const container = canvasRef.current.parentElement;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = container.offsetWidth || 1;
    const ch = container.offsetHeight || 1;

    const desiredW = Math.round(cw * dpr);
    const desiredH = Math.round(ch * dpr);
    if (canvasRef.current.width !== desiredW || canvasRef.current.height !== desiredH) {
      canvasRef.current.width = desiredW;
      canvasRef.current.height = desiredH;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    if (!landmarks || landmarks.length < 33) return;

    const vw = videoRef.current.videoWidth || 0;
    const vh = videoRef.current.videoHeight || 0;
    if (!vw || !vh) return;

    // object-contain letterboxing rect
    const videoAspect = vw / vh;
    const containerAspect = cw / ch;
    let drawW = cw;
    let drawH = ch;
    let offsetX = 0;
    let offsetY = 0;
    if (containerAspect > videoAspect) {
      drawH = ch;
      drawW = ch * videoAspect;
      offsetX = (cw - drawW) / 2;
    } else {
      drawW = cw;
      drawH = cw / videoAspect;
      offsetY = (ch - drawH) / 2;
    }

    // Confidence threshold:
    // Hands/wrists often have lower confidence than torso (occlusion / fast motion),
    // so use per-landmark thresholds to keep hands responsive without letting the whole pose go noisy.
    const minVisCore = 0.55; // torso/legs
    const minVisHands = 0.25; // wrists + fingers
    const handIdx = new Set([15, 16, 17, 18, 19, 20, 21, 22]);

    const rawPts = landmarks.map((lm, i) => ({
      // Mirror horizontally only if the video element is mirrored (e.g. live selfie camera).
      x: offsetX + (mirror ? (1 - lm.x) : lm.x) * drawW,
      y: offsetY + lm.y * drawH,
      v: lm.visibility ?? 1,
      t: handIdx.has(i) ? minVisHands : minVisCore,
    }));

    // If we barely see a person, don't draw anything (prevents "random constellation")
    const visibleCount = rawPts.reduce((acc, p) => acc + ((p.v ?? 1) >= (p.t ?? minVisCore) ? 1 : 0), 0);
    if (visibleCount < 8) {
      return;
    }

    // IMPORTANT: Draw raw points only (no prediction).
    // Prediction can overshoot when landmarks jump between frames and looks like "random" points.
    const pts = rawPts.map((p) => {
      if ((p.v ?? 1) < (p.t ?? minVisCore)) return null;
      return { x: p.x, y: p.y, v: p.v };
    });

    // lines
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    for (const [a, b] of POSE_CONNECTIONS) {
      const p1 = pts[a];
      const p2 = pts[b];
      if (!p1 || !p2) continue;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();

    // dots
    ctx.fillStyle = "#ef4444";
    ctx.globalAlpha = 0.95;
    for (const p of pts) {
      if (!p) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [enabled, videoRef, canvasRef, landmarks, mirror]);

  return null;
}


