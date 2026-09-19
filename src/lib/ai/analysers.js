// Per-exercise form analysis
// File: src/lib/ai/analysers.js
//
// Port of AI/Mp_helper/exercises/*.py. Same joints, same thresholds, same
// branches -- so a frame analysed here scores what the Python server would score.
//
// Two deliberate differences from the Python:
//
// 1. Feedback is English. The site is English; the Python strings are French.
// 2. Each analyser returns an explicit `status`. The Python derives the form
//    score by searching the feedback text for French keywords
//    (mediapipe_api.py:_score_from_feedback). That coupling means translating a
//    string silently changes a score, so the judgement is returned as data
//    instead of being re-read out of prose. Scores come out identical.
//
// Every analyser takes the raw MediaPipe landmark array and returns:
//   { feedback: string[], angle: number, status: "good" | "warn" }

import { LM, calculateAngle } from "./posture-utils";

/**
 * The angle band each exercise is trying to hit, in degrees.
 *
 * Single source of truth: the analysers below grade against these, and the
 * on-screen guide (lib/ai/exercise-guide.js) draws its target band from the
 * same numbers. Hardcoding them in both places means the app eventually
 * demonstrates one range while scoring another.
 *
 * `min`/`max` are the edges of good form; `null` means that side is unbounded.
 */
export const FORM_RANGES = {
  squat: { min: 90, max: 140 },
  pushup: { min: 60, max: 160 },
  lunge: { min: 80, max: 120 },
  plank: { min: 160, max: 180 },
  deadlift: { min: 150, max: null },
  pullup: { min: 70, max: 160 },
  shoulder_press: { min: 70, max: 180 },
  biceps_curl: { min: 40, max: 160 },
  dips: { min: 70, max: 160 },
  hip_thrust: { min: 150, max: 180 },
};

/** Landmark -> [x, y]. Normalised 0..1 coordinates, which is what the angles need. */
const at = (landmarks, index) => [landmarks[index].x, landmarks[index].y];

// The reference implementation measures the right side of the body only.
// If the athlete is side-on with their right side away from the camera, those
// landmarks are the occluded ones -- see the "known limits" note in AI/README.md.

export function analyseSquat(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_HIP),
    at(landmarks, LM.RIGHT_KNEE),
    at(landmarks, LM.RIGHT_ANKLE)
  );

  if (angle < FORM_RANGES.squat.min) return { feedback: ["Squat too deep — come up a little."], angle, status: "warn" };
  if (angle > FORM_RANGES.squat.max) return { feedback: ["Go a little lower for a full squat."], angle, status: "warn" };
  return { feedback: ["Good squat depth!"], angle, status: "good" };
}

export function analysePushup(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_SHOULDER),
    at(landmarks, LM.RIGHT_ELBOW),
    at(landmarks, LM.RIGHT_WRIST)
  );

  if (angle < FORM_RANGES.pushup.min) return { feedback: ["Too low — hard on the shoulders."], angle, status: "warn" };
  if (angle > FORM_RANGES.pushup.max) return { feedback: ["Go lower for a full push-up."], angle, status: "warn" };
  return { feedback: ["Good range of motion!"], angle, status: "good" };
}

export function analyseLunge(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_HIP),
    at(landmarks, LM.RIGHT_KNEE),
    at(landmarks, LM.RIGHT_ANKLE)
  );

  if (angle < FORM_RANGES.lunge.min) return { feedback: ["Lunge too deep."], angle, status: "warn" };
  if (angle > FORM_RANGES.lunge.max) return { feedback: ["Go a little lower."], angle, status: "warn" };
  return { feedback: ["Good lunge."], angle, status: "good" };
}

export function analysePlank(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_SHOULDER),
    at(landmarks, LM.RIGHT_HIP),
    at(landmarks, LM.RIGHT_ANKLE)
  );

  if (angle < FORM_RANGES.plank.min) return { feedback: ["Body not aligned — flatten your back."], angle, status: "warn" };
  // Unreachable: calculateAngle caps at 180. Mirrors the reference branch; a real
  // sag/arch test needs the sign of the hip's offset from the shoulder-ankle line.
  if (angle > FORM_RANGES.plank.max) return { feedback: ["Hips sagging — lift slightly."], angle, status: "warn" };
  return { feedback: ["Good plank."], angle, status: "good" };
}

export function analyseDeadlift(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_SHOULDER),
    at(landmarks, LM.RIGHT_HIP),
    at(landmarks, LM.RIGHT_KNEE)
  );

  if (angle < FORM_RANGES.deadlift.min) return { feedback: ["Back leaning too far — lift your chest."], angle, status: "warn" };
  return { feedback: ["Good back position!"], angle, status: "good" };
}

export function analysePullup(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_SHOULDER),
    at(landmarks, LM.RIGHT_ELBOW),
    at(landmarks, LM.RIGHT_WRIST)
  );

  if (angle < FORM_RANGES.pullup.min) return { feedback: ["Too low — pull a little higher."], angle, status: "warn" };
  if (angle > FORM_RANGES.pullup.max) return { feedback: ["Lower yourself slightly."], angle, status: "warn" };
  return { feedback: ["Good pull-up."], angle, status: "good" };
}

export function analyseShoulderPress(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_SHOULDER),
    at(landmarks, LM.RIGHT_ELBOW),
    at(landmarks, LM.RIGHT_WRIST)
  );

  if (angle < FORM_RANGES.shoulder_press.min) return { feedback: ["Arms too low — press up."], angle, status: "warn" };
  // Unreachable, as in analysePlank: a locked-out arm measures 180, never more.
  if (angle > FORM_RANGES.shoulder_press.max) return { feedback: ["Arms over-extended — ease off."], angle, status: "warn" };
  return { feedback: ["Good shoulder press."], angle, status: "good" };
}

export function analyseBicepsCurl(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_SHOULDER),
    at(landmarks, LM.RIGHT_ELBOW),
    at(landmarks, LM.RIGHT_WRIST)
  );

  if (angle > FORM_RANGES.biceps_curl.max) return { feedback: ["Curl your arm up."], angle, status: "warn" };
  if (angle < FORM_RANGES.biceps_curl.min) return { feedback: ["Lower your arm."], angle, status: "warn" };
  return { feedback: ["Good biceps curl."], angle, status: "good" };
}

export function analyseDips(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_SHOULDER),
    at(landmarks, LM.RIGHT_ELBOW),
    at(landmarks, LM.RIGHT_WRIST)
  );

  if (angle < FORM_RANGES.dips.min) return { feedback: ["Dropping too low — mind your shoulders."], angle, status: "warn" };
  if (angle > FORM_RANGES.dips.max) return { feedback: ["Press up a little further."], angle, status: "warn" };
  return { feedback: ["Good dip."], angle, status: "good" };
}

export function analyseHipThrust(landmarks) {
  const angle = calculateAngle(
    at(landmarks, LM.RIGHT_SHOULDER),
    at(landmarks, LM.RIGHT_HIP),
    at(landmarks, LM.RIGHT_KNEE)
  );

  if (angle < FORM_RANGES.hip_thrust.min) return { feedback: ["Drive your hips higher."], angle, status: "warn" };
  // Unreachable, as in analysePlank.
  if (angle > FORM_RANGES.hip_thrust.max) return { feedback: ["Over-arching — flatten your back."], angle, status: "warn" };
  return { feedback: ["Good hip thrust."], angle, status: "good" };
}

/** Exercise id -> analyser. Ids match EXERCISE_CONFIG and the Python ANALYZE_FUNCS. */
export const ANALYSERS = {
  squat: analyseSquat,
  pushup: analysePushup,
  lunge: analyseLunge,
  plank: analysePlank,
  deadlift: analyseDeadlift,
  pullup: analysePullup,
  shoulder_press: analyseShoulderPress,
  biceps_curl: analyseBicepsCurl,
  dips: analyseDips,
  hip_thrust: analyseHipThrust,
};

/** The exercise used when an unknown id arrives, matching the Python fallback. */
export const DEFAULT_EXERCISE = "squat";

export const isSupportedExercise = (id) => Object.hasOwn(ANALYSERS, id);
