"use client";

import { useEffect, useRef } from "react";

export default function MediaPipePose({ 
  videoRef, 
  canvasRef, 
  onResults, 
  isActive,
  exercise = "squat"
}) {
  const poseRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaPipeLoadedRef = useRef(false);
  const lastSendRef = useRef(0);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !isActive) {
      // Cleanup when inactive
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (poseRef.current) {
        poseRef.current.close().catch(console.error);
        poseRef.current = null;
      }
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      return;
    }

    let isMounted = true;

    // Load MediaPipe using dynamic import
    const initMediaPipe = async () => {
      try {
        // Dynamically import MediaPipe modules (registered on window by the package bundle)
        await import("@mediapipe/pose");
        // drawing_utils is no longer used for drawing (we draw ourselves to correctly handle object-contain)
        await import("@mediapipe/drawing_utils");

        if (!isMounted) return;

        // Wait briefly for modules to register on window (retry a few times)
        for (let i = 0; i < 10; i++) {
          if (window.Pose && window.POSE_CONNECTIONS) break;
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 30));
        }

        // Get Pose class from window (it's registered globally by the module)
        const PoseClass = window.Pose;
        
        // Get POSE_CONNECTIONS from window (it's registered globally by the module)
        const POSE_CONNECTIONS = window.POSE_CONNECTIONS;

        if (!PoseClass) {
          console.error("Pose class not found on window.");
          console.error("Available window properties:", Object.keys(window).filter(k => k.includes('Pose') || k.includes('pose')));
          return;
        }

        if (!POSE_CONNECTIONS) {
          console.error("POSE_CONNECTIONS not found on window.");
          console.error("Available window properties:", Object.keys(window).filter(k => k.includes('POSE')));
          return;
        }

        // Create Pose instance
        const poseInstance = new PoseClass({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
        });

        poseInstance.setOptions({
          // Faster + more responsive
          modelComplexity: 0,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          selfieMode: true
        });

        poseInstance.onResults((results) => {
          if (!isMounted || !canvasRef.current || !videoRef.current) return;
          
          const canvasCtx = canvasRef.current.getContext("2d");
          if (!canvasCtx) return;
          
          // Resize canvas to match the container in CSS pixels, with DPR for sharpness
          const container = canvasRef.current.parentElement;
          if (!container) return;

          const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
          const cw = container.offsetWidth || 1;
          const ch = container.offsetHeight || 1;

          const desiredW = Math.round(cw * dpr);
          const desiredH = Math.round(ch * dpr);
          if (canvasRef.current.width !== desiredW || canvasRef.current.height !== desiredH) {
            canvasRef.current.width = desiredW;
            canvasRef.current.height = desiredH;
          }

          // Work in CSS pixel coordinates
          canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
          canvasCtx.clearRect(0, 0, cw, ch);

          // Always forward results to the parent (for feedback / reps), even if we don't draw.
          if (onResults) onResults(results, exercise);

          if (!results.poseLandmarks || !POSE_CONNECTIONS) return;

          // Compute the displayed video rect inside the container (object-contain letterboxing)
          const vw = videoRef.current.videoWidth || 0;
          const vh = videoRef.current.videoHeight || 0;
          if (!vw || !vh) return;

          const videoAspect = vw / vh;
          const containerAspect = cw / ch;

          let drawW = cw;
          let drawH = ch;
          let offsetX = 0;
          let offsetY = 0;

          if (containerAspect > videoAspect) {
            // fit height
            drawH = ch;
            drawW = ch * videoAspect;
            offsetX = (cw - drawW) / 2;
          } else {
            // fit width
            drawW = cw;
            drawH = cw / videoAspect;
            offsetY = (ch - drawH) / 2;
          }

          // Build pixel-space points that match the mirrored video (video is CSS flipped in page)
          const pts = results.poseLandmarks.map((lm) => {
            const vis = lm.visibility ?? 1;
            return {
              x: offsetX + (1 - lm.x) * drawW,
              y: offsetY + lm.y * drawH,
              v: vis,
            };
          });

          const minVis = 0.2;

          // Draw connections
          canvasCtx.strokeStyle = "#22c55e";
          canvasCtx.lineWidth = 2;
          canvasCtx.globalAlpha = 0.9;
          canvasCtx.beginPath();
          for (const [a, b] of POSE_CONNECTIONS) {
            const p1 = pts[a];
            const p2 = pts[b];
            if (!p1 || !p2) continue;
            if ((p1.v ?? 1) < minVis || (p2.v ?? 1) < minVis) continue;
            canvasCtx.moveTo(p1.x, p1.y);
            canvasCtx.lineTo(p2.x, p2.y);
          }
          canvasCtx.stroke();

          // Draw points
          canvasCtx.fillStyle = "#ef4444";
          canvasCtx.globalAlpha = 0.95;
          for (const p of pts) {
            if (!p) continue;
            if ((p.v ?? 1) < minVis) continue;
            canvasCtx.beginPath();
            canvasCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            canvasCtx.fill();
          }
        });

        poseRef.current = poseInstance;
        mediaPipeLoadedRef.current = true;

        // Process video frames
        const processFrame = async () => {
          if (!isMounted || !videoRef.current || !poseInstance) return;
          
          // Throttle to reduce lag on weaker machines (stable ~15fps AI)
          const now = performance.now();
          if (now - lastSendRef.current < 66) {
            animationFrameRef.current = requestAnimationFrame(processFrame);
            return;
          }
          lastSendRef.current = now;

          if (videoRef.current.readyState >= videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              await poseInstance.send({ image: videoRef.current });
            } catch (error) {
              console.error("Error sending frame to MediaPipe:", error);
            }
          }
          
          if (isMounted) {
            animationFrameRef.current = requestAnimationFrame(processFrame);
          }
        };

        // Start immediately
        processFrame();
      } catch (error) {
        console.error("Error initializing MediaPipe:", error);
        console.error("Error details:", error.message);
        if (error.stack) {
          console.error("Stack trace:", error.stack);
        }
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (poseRef.current) {
        poseRef.current.close().catch(console.error);
        poseRef.current = null;
      }
    };
  }, [videoRef, canvasRef, isActive, exercise, onResults]);

  return null;
}
