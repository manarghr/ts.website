// How to perform each exercise
// File: src/lib/ai/exercise-guide.js
//
// The teaching half of the feature. analysers.js says whether a rep was good;
// this says what good looks like and how to get there.
//
// The target band is NOT repeated here -- it is read from FORM_RANGES in
// analysers.js, so the figure demonstrates exactly the range the analyser
// grades against. Change a threshold there and the guide follows.
//
// POSES
// -----
// Each exercise has two keyframes, `top` and `bottom`, which the guide
// interpolates between to animate the movement. Coordinates are in a 100x100
// box, origin top-left, ground at y=92, athlete side-on and facing right --
// the same view the analysers assume, since they measure a flat 2D angle.
//
// Explicit keyframes rather than a jointed rig: two hand-checked poses always
// look anatomically right, where a rig with the wrong constraint quietly
// produces a broken-looking figure.

import { FORM_RANGES } from "./analysers";

/**
 * Bones grouped by how they are drawn.
 *
 * Split into three layers rather than one flat list so the figure reads as a
 * body instead of a stick: the far-side leg is drawn dimmer and behind, the
 * torso much thicker than the limbs, and the near side brightest and on top.
 * Uniform stroke weight was the main reason the earlier version looked flat --
 * torso, thigh and forearm were all the same line.
 */
export const FIGURE_LAYERS = [
  // Every limb is a tapered capsule: `w1` is its width at the first point,
  // `w2` at the second, and `bulge` bows its sides outward at the midpoint.
  //
  // Both matter. Uniform width reads as tubing, and perfectly straight sides
  // read as a geometric pill -- real limbs are both tapered and convex.
  //
  // Far side first, so the near side overlaps it.
  { key: "farThigh", bones: [["hip", "kneeB"]], w1: 8, w2: 6, bulge: 0.9, depth: "far", part: "shorts" },
  { key: "farShin", bones: [["kneeB", "ankleB"]], w1: 6, w2: 4.4, bulge: 0.5, depth: "far", part: "skin" },
  { key: "farFoot", bones: [["ankleB", "footB"]], w1: 4.6, w2: 4, bulge: 0.3, depth: "far", part: "shoe" },
  { key: "farUpperArm", bones: [["shoulder", "elbowB"]], w1: 6, w2: 4.8, bulge: 0.6, depth: "far", part: "skin" },
  { key: "farForearm", bones: [["elbowB", "wristB"]], w1: 4.8, w2: 3.8, bulge: 0.4, depth: "far", part: "skin" },

  // The trunk: broad at the shoulders, narrowing to the waist.
  { key: "torso", bones: [["shoulder", "hip"]], w1: 14, w2: 10.5, bulge: 1.6, depth: "near", part: "shirt" },

  { key: "thigh", bones: [["hip", "kneeF"]], w1: 9.5, w2: 7, bulge: 1.1, depth: "near", part: "shorts" },
  { key: "shin", bones: [["kneeF", "ankleF"]], w1: 7, w2: 5, bulge: 0.6, depth: "near", part: "skin" },
  { key: "foot", bones: [["ankleF", "footF"]], w1: 5.4, w2: 4.6, bulge: 0.35, depth: "near", part: "shoe" },
  { key: "neck", bones: [["neck", "shoulder"]], w1: 5, w2: 6, bulge: 0.2, depth: "near", part: "skin" },
  { key: "upperArm", bones: [["shoulder", "elbow"]], w1: 7, w2: 5.4, bulge: 0.75, depth: "near", part: "skin" },
  { key: "forearm", bones: [["elbow", "wrist"]], w1: 5.4, w2: 4.2, bulge: 0.5, depth: "near", part: "skin" },
];

/**
 * Flat-illustration palette. Deliberately a character rather than a green
 * skeleton: the live overlay already draws the skeleton, and a demonstration
 * reads better as somebody performing the movement than as a second wireframe.
 * Colours are drawn from the site palette so it belongs to the page.
 */
export const FIGURE_PALETTE = {
  skin: "#E8B48C",
  shirt: "#6BB371",
  shorts: "#354F52",
  shoe: "#1F2E30",
  hair: "#2F2A26",
  outline: "#22403B",
  // Far-side limbs are knocked back so the near side reads as nearer.
  farTint: "#1d3b36",
};

/** Hands, drawn as solid shapes so the arm does not end in a stump. */
export const HANDS = ["wrist"];


// Standing upright -- the start of squats and lunges. Both legs coincide, so
// the figure reads as one leg until they separate.
const STANDING = {
  head: [50, 14],
  shoulder: [50, 26],
  elbow: [51, 38],
  wrist: [52, 49],
  hip: [50, 52],
  kneeF: [50, 71],
  ankleF: [50, 88],
  footF: [58, 91],
  kneeB: [50, 71],
  ankleB: [50, 88],
  footB: [58, 91],
};

export const GUIDES = {
  squat: {
    label: "Squat",
    // Which angle the analyser is watching, in words the athlete can act on.
    measures: "Knee angle — hip → knee → ankle",
    setup: "Stand side-on to the camera with your right side nearest, full body in frame.",
    cues: [
      "Feet about shoulder-width, toes turned out slightly",
      "Send your hips back first, like reaching for a chair behind you",
      "Knees track over your toes — don't let them fall inward",
      "Chest up, back flat, weight through your mid-foot",
    ],
    mistakes: [
      "Heels lifting off the floor",
      "Lower back rounding at the bottom",
      "Stopping short of depth",
    ],
    tempoMs: 1600,
    // Knee measures 180° standing and ~92° at the bottom of the rep.
    top: STANDING,
    bottom: {
      head: [42, 32],
      shoulder: [44, 43],
      elbow: [50, 50],
      wrist: [56, 53],
      hip: [37, 63],
      kneeF: [55, 68],
      ankleF: [50, 88],
      footF: [58, 91],
      kneeB: [55, 68],
      ankleB: [50, 88],
      footB: [58, 91],
    },
  },

  pushup: {
    label: "Push-up",
    measures: "Elbow angle — shoulder → elbow → wrist",
    setup: "Side-on to the camera so the bend of your elbow is visible.",
    cues: [
      "Hands just wider than your shoulders",
      "One straight line from head to heels",
      "Elbows about 45° to your body, not flared straight out",
      "Lower until your chest is just above the floor",
    ],
    mistakes: [
      "Hips sagging toward the floor",
      "Hips piked up in the air",
      "Half reps — not lowering far enough",
    ],
    tempoMs: 1500,
    // Elbow goes from locked out (180°) to roughly 75° at the bottom.
    top: {
      head: [78, 44],
      shoulder: [68, 48],
      elbow: [68, 62],
      wrist: [68, 76],
      hip: [46, 56],
      kneeF: [30, 64],
      ankleF: [14, 72],
      footF: [10, 76],
      kneeB: [30, 64],
      ankleB: [14, 72],
      footB: [10, 76],
    },
    bottom: {
      head: [80, 58],
      shoulder: [70, 62],
      elbow: [60, 70],
      wrist: [68, 76],
      hip: [48, 66],
      kneeF: [32, 72],
      ankleF: [16, 78],
      footF: [12, 82],
      kneeB: [32, 72],
      ankleB: [16, 78],
      footB: [12, 82],
    },
  },

  lunge: {
    label: "Lunge",
    measures: "Front knee angle — hip → knee → ankle",
    setup: "Side-on, full body in frame, stepping toward the right of the picture.",
    cues: [
      "Step far enough forward that both knees can reach 90°",
      "Drop straight down rather than leaning forward",
      "Front shin stays close to vertical",
      "Torso tall, core braced",
    ],
    mistakes: [
      "Front knee travelling well past the toes",
      "Torso tipping forward over the front leg",
      "Back knee crashing into the floor",
    ],
    tempoMs: 1800,
    // Front knee reaches ~100° at the bottom, inside the 80-120 band.
    top: STANDING,
    bottom: {
      head: [48, 32],
      shoulder: [48, 44],
      elbow: [49, 56],
      wrist: [50, 64],
      hip: [48, 70],
      kneeF: [66, 73],
      ankleF: [66, 88],
      footF: [73, 91],
      kneeB: [32, 84],
      ankleB: [22, 90],
      footB: [18, 92],
    },
  },

  plank: {
    label: "Plank",
    measures: "Body line — shoulder → hip → ankle",
    setup: "Side-on so the line from your shoulder to your ankle is visible.",
    cues: [
      "Elbows directly under your shoulders",
      "One straight line: shoulders, hips, heels",
      "Squeeze your glutes and brace your abs",
      "Breathe steadily — don't hold your breath",
    ],
    mistakes: [
      "Hips sagging toward the floor",
      "Hips lifted into a pike",
      "Head craning upward",
    ],
    // A hold, not a rep: the two keyframes differ only slightly, so the figure
    // breathes rather than pumping up and down.
    tempoMs: 3000,
    isHold: true,
    top: {
      head: [78, 50],
      shoulder: [68, 54],
      elbow: [68, 68],
      wrist: [79, 68],
      hip: [46, 62],
      kneeF: [30, 68],
      ankleF: [14, 74],
      footF: [10, 78],
      kneeB: [30, 68],
      ankleB: [14, 74],
      footB: [10, 78],
    },
    bottom: {
      head: [78, 51],
      shoulder: [68, 55],
      elbow: [68, 69],
      wrist: [79, 69],
      hip: [46, 63],
      kneeF: [30, 69],
      ankleF: [14, 75],
      footF: [10, 79],
      kneeB: [30, 69],
      ankleB: [14, 75],
      footB: [10, 79],
    },
  },
};

/** Which point the measured angle is centred on, for the highlight marker. */
export const FOCUS_JOINT = {
  squat: "kneeF",
  lunge: "kneeF",
  pushup: "elbow",
  plank: "hip",
};

const LEG_OFFSET = [3.5, 1.5];
const ARM_OFFSET = [-3, 1.5];
const NECK_LIFT = 0.55;

const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
const shift = ([x, y], [dx, dy]) => [x + dx, y + dy];

/**
 * Prepare one keyframe for drawing.
 *
 * - separates the far leg where it exactly overlaps the near one, so the figure
 *   has two legs rather than one thick one;
 * - adds a `neck` point between head and shoulder, so the head sits on a short
 *   neck instead of directly on the shoulder joint.
 */
function prepareFrame(frame) {
  const out = { ...frame };

  if (same(frame.kneeB, frame.kneeF)) {
    out.kneeB = shift(frame.kneeB, LEG_OFFSET);
    out.ankleB = shift(frame.ankleB, LEG_OFFSET);
    out.footB = shift(frame.footB, LEG_OFFSET);
  }

  // The far arm, offset behind the near one. A side-on figure with a single
  // arm looks amputated; a second one a few units back reads as depth.
  out.elbowB = shift(frame.elbow, ARM_OFFSET);
  out.wristB = shift(frame.wrist, ARM_OFFSET);

  out.neck = [
    frame.head[0] + (frame.shoulder[0] - frame.head[0]) * NECK_LIFT,
    frame.head[1] + (frame.shoulder[1] - frame.head[1]) * NECK_LIFT,
  ];

  return out;
}

/**
 * Everything the guide panel needs for one exercise, or null if we have no
 * guide for it yet (the six analysers not currently offered in the UI).
 */
export function getGuide(exercise) {
  const guide = GUIDES[exercise];
  if (!guide) return null;

  return {
    ...guide,
    top: prepareFrame(guide.top),
    bottom: prepareFrame(guide.bottom),
    // Straight from the analyser, never a second copy.
    range: FORM_RANGES[exercise],
    focus: FOCUS_JOINT[exercise] || "hip",
  };
}

export const hasGuide = (exercise) => Boolean(GUIDES[exercise]);
