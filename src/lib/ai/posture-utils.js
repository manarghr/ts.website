// Pose geometry helpers
// File: src/lib/ai/posture-utils.js
//
// Direct port of AI/Mp_helper/posture_utils.py so the browser produces the same
// numbers as the Python reference implementation. Keep the two in sync: if you
// change a threshold here, change it there.

/** MediaPipe Pose landmark indices (the 33-point BlazePose topology). */
export const LM = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

/** Total landmarks MediaPipe returns. A shorter array means a partial detection. */
export const LANDMARK_COUNT = 33;

/**
 * Angle ABC in degrees, via the dot product.
 *
 * The dot-product form is used (rather than the difference of two atan2 calls)
 * because it is numerically stable and always returns 0..180 -- never a signed
 * or reflex angle. Every threshold in analysers.js assumes that range.
 *
 * @param {number[]} a - [x, y] of the first point
 * @param {number[]} b - [x, y] of the vertex
 * @param {number[]} c - [x, y] of the third point
 * @returns {number} degrees, 0..180
 */
export function calculateAngle(a, b, c) {
  const baX = a[0] - b[0];
  const baY = a[1] - b[1];
  const bcX = c[0] - b[0];
  const bcY = c[1] - b[1];

  const denom = Math.hypot(baX, baY) * Math.hypot(bcX, bcY);
  // Degenerate: two of the points coincide, so there is no angle to measure.
  if (denom === 0) return 0;

  // Clamp because floating point can push the quotient just past +/-1,
  // and Math.acos of that is NaN.
  const cosine = Math.min(1, Math.max(-1, (baX * bcX + baY * bcY) / denom));

  return (Math.acos(cosine) * 180) / Math.PI;
}

/**
 * Counts repetitions from a single joint angle.
 *
 * Port of the Python RepetitionCounter, including its state machine: the rep is
 * banked at the BOTTOM of the movement (when the angle first drops below
 * min_angle), and re-arms only once the angle passes back above max_angle.
 * That is why the initial state is "down" -- the counter starts armed.
 */
export class RepetitionCounter {
  constructor(minAngle, maxAngle) {
    this.minAngle = minAngle;
    this.maxAngle = maxAngle;
    this.state = "down";
    this.count = 0;
  }

  update(angle) {
    if (angle > this.maxAngle) {
      this.state = "down";
    }

    if (angle < this.minAngle && this.state === "down") {
      this.state = "up";
      this.count += 1;
    }

    return this.count;
  }

  reset() {
    this.state = "down";
    this.count = 0;
  }
}

/**
 * Per-exercise rep-counting window, in degrees.
 * `null` means the exercise is a hold (plank) and has no reps to count.
 */
export const EXERCISE_CONFIG = {
  biceps_curl: { minAngle: 40, maxAngle: 160 },
  triceps_extension: { minAngle: 50, maxAngle: 170 },
  lateral_raise: { minAngle: 25, maxAngle: 90 },
  pushup: { minAngle: 60, maxAngle: 160 },
  dips: { minAngle: 60, maxAngle: 160 },
  pullup: { minAngle: 50, maxAngle: 170 },
  shoulder_press: { minAngle: 60, maxAngle: 170 },
  squat: { minAngle: 70, maxAngle: 170 },
  deadlift: { minAngle: 80, maxAngle: 170 },
  lunge: { minAngle: 75, maxAngle: 170 },
  hip_thrust: { minAngle: 90, maxAngle: 170 },
  leg_raise: { minAngle: 60, maxAngle: 170 },
  mountain_climbers: { minAngle: 70, maxAngle: 170 },
  jumping_jack: { minAngle: 40, maxAngle: 130 },
  plank: null,
};

/** Fallback window for an exercise with no entry above (matches the Python default). */
export const DEFAULT_REP_WINDOW = { minAngle: 70, maxAngle: 170 };
