"use client";

// How-to panel for the current exercise
// File: src/components/AI/ExerciseGuide.jsx
//
// Shows the movement being performed correctly, next to a gauge of the
// athlete's own joint angle against the band the analyser grades on. A score on
// its own tells someone they are wrong without telling them what to change.
//
// The figure is drawn in the same visual language as the pose overlay -- same
// green bones, same red joint -- so the reference and the live skeleton read as
// two views of the same thing.
//
// The animation runs on requestAnimationFrame and writes SVG attributes
// directly through refs. Driving it through React state instead would re-render
// the whole panel sixty times a second, on a page that is already running pose
// detection.

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { FIGURE_LAYERS, FIGURE_PALETTE, HANDS, getGuide } from "@/lib/ai/exercise-guide";

const VIEW = 100;
const GROUND_Y = 92;
/** Gauge covers the full range calculateAngle can return. */
const ANGLE_MAX = 180;

const lerp = (a, b, t) => a + (b - a) * t;

const HEAD_R = 6.6;

/** Ease in and out so the figure slows at the top and bottom of the rep. */
const easeInOut = (phase) => (1 - Math.cos(phase * 2 * Math.PI)) / 2;

function posesAt(guide, t) {
  const out = {};
  for (const key of Object.keys(guide.top)) {
    const from = guide.top[key];
    const to = guide.bottom[key];
    out[key] = [lerp(from[0], to[0], t), lerp(from[1], to[1], t)];
  }
  return out;
}

const f = (n) => n.toFixed(2);

/**
 * One limb as a closed, tapered capsule: a quad from width `w1` at p1 to `w2`
 * at p2, with a round cap on each end.
 *
 * A filled shape rather than a thick stroke, because a stroke cannot taper --
 * and uniform-width limbs are what made the figure read as wire. Being closed
 * also means one outline stroke traces the whole silhouette, the way flat
 * vector character art is drawn.
 *
 * Both caps use sweep-flag 0: on screen (y pointing down) that is the direction
 * that bulges away from the limb rather than biting back into it.
 */
function capsulePath([x1, y1], [x2, y2], w1, w2, bulge = 0) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Unit normal to the bone.
  const nx = -dy / len;
  const ny = dx / len;
  const r1 = w1 / 2;
  const r2 = w2 / 2;

  // Control points sit at the midpoint of each side, pushed out along the
  // normal, so the sides bow instead of running dead straight.
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const mr = (r1 + r2) / 2 + bulge;

  return (
    `M${f(x1 + nx * r1)},${f(y1 + ny * r1)}` +
    `Q${f(mx + nx * mr)},${f(my + ny * mr)} ${f(x2 + nx * r2)},${f(y2 + ny * r2)}` +
    `A${f(r2)},${f(r2)} 0 0 0 ${f(x2 - nx * r2)},${f(y2 - ny * r2)}` +
    `Q${f(mx - nx * mr)},${f(my - ny * mr)} ${f(x1 - nx * r1)},${f(y1 - ny * r1)}` +
    `A${f(r1)},${f(r1)} 0 0 0 ${f(x1 + nx * r1)},${f(y1 + ny * r1)}Z`
  );
}

/** A circle as a closed path, so it can join the merged silhouette. */
function circlePath([x, y], r) {
  return `M${f(x - r)},${f(y)}a${f(r)},${f(r)} 0 1,0 ${f(r * 2)},0a${f(r)},${f(r)} 0 1,0 ${f(-r * 2)},0Z`;
}

function limbPath(points, layer) {
  let d = "";
  for (const [a, b] of layer.bones) {
    const p1 = points[a];
    const p2 = points[b];
    if (!p1 || !p2) continue;
    d += capsulePath(p1, p2, layer.w1, layer.w2, layer.bulge);
  }
  return d;
}

/**
 * Every part of the body as one path.
 *
 * Drawn once underneath, filled and stroked in the outline colour, it produces
 * a single contour around the whole figure. Outlining each limb separately --
 * which is what this replaces -- drew a seam at every joint, so the body read
 * as a pile of separate capsules rather than one character.
 */
function silhouettePath(points, layers, headRadius) {
  let d = "";
  for (const layer of layers) d += limbPath(points, layer);
  if (points.head) d += circlePath(points.head, headRadius);
  return d;
}

/**
 * Several circles as one path, so every joint can be drawn with a single
 * element instead of one <circle> per joint kept in sync through its own ref.
 * Two half-arcs make a full circle.
 */
const setCircle = (el, x, y) => {
  if (!el) return;
  el.setAttribute("cx", x.toFixed(2));
  el.setAttribute("cy", y.toFixed(2));
};

function circlesPath(points, names, r) {
  let d = "";
  for (const name of names) {
    const p = points[name];
    if (!p) continue;
    const left = (p[0] - r).toFixed(2);
    const y = p[1].toFixed(2);
    d += `M${left},${y}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;
  }
  return d;
}

export default function ExerciseGuide({ exercise, angle = null, className = "" }) {
  const guide = getGuide(exercise);

  // Cues and mistakes as tabs rather than two stacked lists: they are
  // alternatives to read, not a sequence, and stacking them buried the
  // analysis controls below a wall of bullet points.
  const [tab, setTab] = useState("cues");

  // One ref per body part, keyed by layer. A plain object beats an array here:
  // the draw loop looks parts up by name, not by position.
  const silhouetteRef = useRef(null);
  const partsRef = useRef({});
  const handsRef = useRef(null);
  const headOutlineRef = useRef(null);
  const hairRef = useRef(null);
  const faceRef = useRef(null);
  const focusRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    if (!guide) return;

    let frame = null;
    const started = performance.now();

    const draw = (now) => {
      const phase = ((now - started) % guide.tempoMs) / guide.tempoMs;
      const points = posesAt(guide, easeInOut(phase));

      silhouetteRef.current?.setAttribute(
        "d",
        silhouettePath(points, FIGURE_LAYERS, HEAD_R)
      );

      for (const layer of FIGURE_LAYERS) {
        partsRef.current[layer.key]?.setAttribute("d", limbPath(points, layer));
      }

      handsRef.current?.setAttribute("d", circlesPath(points, HANDS, 2.9));

      // A soft ellipse under the figure, sized to how much floor it covers.
      // Without it the body appears to float above the ground line.
      if (shadowRef.current) {
        const xs = Object.values(points).map((p) => p[0]);
        const spread = Math.max(...xs) - Math.min(...xs);
        const centre = (Math.max(...xs) + Math.min(...xs)) / 2;
        shadowRef.current.setAttribute("cx", centre.toFixed(2));
        shadowRef.current.setAttribute("rx", (spread * 0.45).toFixed(2));
      }

      const head = points.head;
      if (head) {
        // Hair sits back and up from the face, which is offset toward the
        // direction of travel -- enough to read as a head facing forward
        // rather than a featureless ball.
        setCircle(headOutlineRef.current, head[0], head[1]);
        setCircle(hairRef.current, head[0] - 1.1, head[1] - 1.1);
        setCircle(faceRef.current, head[0] + 1.2, head[1] + 0.5);
      }

      const focus = points[guide.focus];
      if (focus && focusRef.current) {
        focusRef.current.setAttribute("cx", focus[0].toFixed(2));
        focusRef.current.setAttribute("cy", focus[1].toFixed(2));
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
    // Re-arms only when the exercise changes, never on an angle update.
  }, [guide]);

  if (!guide) return null;

  const min = guide.range?.min ?? 0;
  const max = guide.range?.max ?? ANGLE_MAX;
  const bandLeft = (min / ANGLE_MAX) * 100;
  const bandWidth = ((max - min) / ANGLE_MAX) * 100;

  const hasAngle = Number.isFinite(angle);
  const inRange = hasAngle && angle >= min && angle <= max;
  const markerLeft = hasAngle ? (Math.min(ANGLE_MAX, Math.max(0, angle)) / ANGLE_MAX) * 100 : 0;

  return (
    <div className={`rounded-xl border-2 border-[#C8CDC5] bg-white p-4 ${className}`}>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h4 className="font-semibold text-[#354F52]">How to do it: {guide.label}</h4>
        <span className="text-[11px] text-gray-500">{guide.isHold ? "hold" : "loop"}</span>
      </div>

      {/* The movement, performed correctly, on repeat. */}
      <div className="rounded-lg bg-[#354F52] p-2">
        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="h-40 w-full"
          role="img"
          aria-label={`Animated demonstration of a ${guide.label}`}
        >
          <line
            x1="4"
            y1={GROUND_Y + 2}
            x2={VIEW - 4}
            y2={GROUND_Y + 2}
            stroke="#ffffff"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          {/* Grounding shadow, drawn first so the body sits on it. */}
          <ellipse
            ref={shadowRef}
            cy={GROUND_Y + 2}
            ry="2.2"
            fill="#000000"
            fillOpacity="0.22"
          />

          {/* One merged silhouette underneath: every limb plus the head in a
              single path, filled and stroked in the outline colour. This is
              what gives the figure one continuous contour instead of a seam at
              every joint. */}
          <path
            ref={silhouetteRef}
            fill={FIGURE_PALETTE.outline}
            stroke={FIGURE_PALETTE.outline}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* The colours, sitting inside that contour. No stroke of their own --
              the silhouette already supplies the outline, and stroking these
              would put the seams straight back. */}
          {FIGURE_LAYERS.map((layer) => (
            <path
              key={layer.key}
              ref={(el) => {
                partsRef.current[layer.key] = el;
              }}
              fill={
                layer.depth === "far"
                  ? FIGURE_PALETTE.farTint
                  : FIGURE_PALETTE[layer.part]
              }
            />
          ))}

          {/* Hands. */}
          <path ref={handsRef} fill={FIGURE_PALETTE.skin} />

          {/* Head: outline, hair behind, face in front. */}
          <circle ref={headOutlineRef} r={HEAD_R - 0.4} fill={FIGURE_PALETTE.hair} />
          <circle ref={hairRef} r={HEAD_R - 1} fill={FIGURE_PALETTE.hair} />
          <circle ref={faceRef} r={HEAD_R - 1.9} fill={FIGURE_PALETTE.skin} />

          {/* The joint the analyser is measuring. */}
          {/* Small on purpose: at its old size it read as a target stuck to
              the body rather than a pointer at the measured joint. */}
          <circle
            ref={focusRef}
            r="2.4"
            fill="#ef4444"
            fillOpacity="0.9"
            stroke="#ffffff"
            strokeWidth="0.9"
          />
        </svg>
      </div>

      {/* Your angle against the band that counts as good form. */}
      <div className="mt-4">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-xs font-medium text-gray-600">{guide.measures}</span>
          <span
            className={`text-sm font-bold ${
              !hasAngle ? "text-gray-400" : inRange ? "text-[#6BB371]" : "text-amber-600"
            }`}
          >
            {hasAngle ? `${Math.round(angle)}°` : "—"}
          </span>
        </div>

        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
          {/* Target band, straight from the analyser's own thresholds. */}
          <div
            className="absolute inset-y-0 bg-[#6BB371]/40"
            style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
          />
          {hasAngle && (
            <div
              className={`absolute inset-y-0 w-1 rounded-full ${
                inRange ? "bg-[#6BB371]" : "bg-amber-500"
              }`}
              style={{ left: `calc(${markerLeft}% - 2px)` }}
            />
          )}
        </div>

        <div className="mt-1 flex justify-between text-[10px] text-gray-500">
          <span>0°</span>
          <span>
            target {min}°–{max}°
          </span>
          <span>180°</span>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#52796F]/10 px-3 py-2 text-xs text-[#354F52]">
        <Camera className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#52796F]" />
        <span>
          <strong className="font-semibold">Set up:</strong> {guide.setup}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex gap-1 rounded-lg bg-[#C8CDC5]/30 p-1">
          {[
            { id: "cues", label: "Key points", count: guide.cues.length },
            { id: "mistakes", label: "Common mistakes", count: guide.mistakes.length },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTab(option.id)}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                tab === option.id
                  ? "bg-white text-[#354F52] shadow-sm"
                  : "text-gray-600 hover:text-[#354F52]"
              }`}
            >
              {option.label}
              <span className="ml-1 opacity-50">{option.count}</span>
            </button>
          ))}
        </div>

        <ul className="mt-3 space-y-2">
          {(tab === "cues" ? guide.cues : guide.mistakes).map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-snug text-gray-700">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                  tab === "cues" ? "bg-[#6BB371]" : "bg-amber-500"
                }`}
              >
                {tab === "cues" ? "✓" : "!"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
