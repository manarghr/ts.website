"use client";

import { useEffect } from "react";

// MediaPipe Pose connections (same as POSE_CONNECTIONS)
const POSE_CONNECTIONS = [
  [0, 1],[1, 2],[2, 3],[3, 7],[0, 4],[4, 5],[5, 6],[6, 8],
  [9, 10],[11, 12],[11, 13],[13, 15],[15, 17],[15, 19],[15, 21],[17, 19],
  [12, 14],[14, 16],[16, 18],[16, 20],[16, 22],[18, 20],
  [11, 23],[12, 24],[23, 24],[23, 25],[24, 26],[25, 27],[26, 28],
  [27, 29],[28, 30],[29, 31],[30, 32],[27, 31],[28, 32],
];

export default function PoseOverlay({ videoRef, canvasRef, landmarks, enabled }) {
  // Exponential moving average smoothing (per landmark, in pixel space)
  const smoothRef = useRef({ pts: Array(33).fill(null) });

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

    // Filter low-confidence landmarks aggressively (reduces random points)
    const minVis = 0.6;

    const rawPts = landmarks.map((lm) => ({
      // mirror horizontally to match the video (page uses scaleX(-1))
      x: offsetX + (1 - lm.x) * drawW,
      y: offsetY + lm.y * drawH,
      v: lm.visibility ?? 1,
    }));

    // If we barely see a person, don't draw anything (prevents "random constellation")
    const visibleCount = rawPts.reduce((acc, p) => acc + ((p.v ?? 1) >= minVis ? 1 : 0), 0);
    if (visibleCount < 10) {
      smoothRef.current.pts = Array(33).fill(null);
      return;
    }

    // Smooth in pixel space (EMA)
    // Lower alpha => smoother (less jitter) but more lag
    const alpha = 0.35;
    const pts = rawPts.map((p, i) => {
      if ((p.v ?? 1) < minVis) return null;
      const prev = smoothRef.current.pts[i];
      if (!prev) {
        smoothRef.current.pts[i] = { x: p.x, y: p.y, v: p.v };
        return smoothRef.current.pts[i];
      }
      const nx = prev.x + alpha * (p.x - prev.x);
      const ny = prev.y + alpha * (p.y - prev.y);
      const nv = p.v;
      smoothRef.current.pts[i] = { x: nx, y: ny, v: nv };
      return smoothRef.current.pts[i];
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
  }, [enabled, videoRef, canvasRef, landmarks]);

  return null;
}


