// A single analysis session
// File: src/lib/ai/session.js
//
// Port of the POST /analyze handler in AI/mediapipe_api.py -- everything that
// wrapped the per-exercise maths: rejecting frames where the pose is not
// trustworthy, keeping the rep counter across frames, and turning a verdict into
// a form score.
//
// Pose DETECTION happens in the browser now (see components/AI/PoseEngine.jsx),
// so this takes landmarks instead of a JPEG. The returned shape matches what the
// HTTP route used to answer with, which is why the page needed so little change.

import {
  LANDMARK_COUNT,
  EXERCISE_CONFIG,
  DEFAULT_REP_WINDOW,
  RepetitionCounter,
} from "./posture-utils";
import { ANALYSERS, DEFAULT_EXERCISE, isSupportedExercise } from "./analysers";

// A landmark below this confidence is treated as guesswork, not a measurement.
const VISIBILITY_THRESHOLD = 0.6;
// Fewer confident points than this and the "pose" is probably noise on furniture.
const MIN_CONFIDENT_POINTS = 12;
// A real person standing in frame spans at least this much of it. Anything
// smaller is too far away for joint angles to mean much.
const MIN_BOX_WIDTH = 0.12;
const MIN_BOX_HEIGHT = 0.18;

// The Python scored by grepping its own French feedback for keywords. Here the
// analyser states its verdict outright; these two numbers are what that
// keyword search produced (90 base, +5 for praise, -25 for a correction).
const SCORE_BY_STATUS = { good: 95, warn: 65 };

const NO_POSE = "Place your full body in frame (more light / step back).";
const LOW_CONFIDENCE =
  "Pose not confident — improve lighting, face the camera, and step back so your full body is visible.";
const TOO_SMALL = "Pose too small — step back and keep head-to-ankles in frame.";

/**
 * Start an analysis session for one exercise.
 *
 * Stateful on purpose: rep counting needs to remember the previous frame's
 * phase, so create one session per video stream and feed it every frame.
 *
 * @param {string} exercise - exercise id; an unknown id falls back to squat
 */
export function createAnalysisSession(exercise = DEFAULT_EXERCISE) {
  let currentExercise = isSupportedExercise(exercise) ? exercise : DEFAULT_EXERCISE;

  // EXERCISE_CONFIG maps plank to null (it is a hold, not reps). The reference
  // treats that the same as a missing entry and installs the default window,
  // which in practice never fires for a plank -- the back angle never gets near
  // 70 degrees -- so the count correctly stays at 0.
  const windowFor = (id) => EXERCISE_CONFIG[id] ?? DEFAULT_REP_WINDOW;

  let counter = new RepetitionCounter(
    windowFor(currentExercise).minAngle,
    windowFor(currentExercise).maxAngle
  );

  /** Frames where we decline to judge form still report the running rep count. */
  const rejected = (feedback) => ({
    ok: true,
    hasPose: false,
    feedback: [feedback],
    formScore: 0,
    reps: counter.count,
    angle: null,
  });

  return {
    get exercise() {
      return currentExercise;
    },

    /** Switch exercise mid-session. Reps restart, since they are not comparable. */
    setExercise(next) {
      const id = isSupportedExercise(next) ? next : DEFAULT_EXERCISE;
      if (id === currentExercise) return;
      currentExercise = id;
      counter = new RepetitionCounter(windowFor(id).minAngle, windowFor(id).maxAngle);
    },

    /** Back to zero reps, same exercise. */
    reset() {
      counter.reset();
    },

    /**
     * Judge one frame.
     *
     * @param {Array<{x:number,y:number,z?:number,visibility?:number}>|null} landmarks
     * @returns {{ok:boolean, hasPose:boolean, feedback:string[], formScore:number, reps:number, angle:number|null}}
     */
    analyse(landmarks) {
      if (!landmarks || landmarks.length < LANDMARK_COUNT) return rejected(NO_POSE);

      const confident = landmarks.filter((lm) => (lm.visibility ?? 1) >= VISIBILITY_THRESHOLD);
      if (confident.length < MIN_CONFIDENT_POINTS) return rejected(LOW_CONFIDENCE);

      const xs = confident.map((lm) => lm.x);
      const ys = confident.map((lm) => lm.y);
      const boxWidth = Math.max(...xs) - Math.min(...xs);
      const boxHeight = Math.max(...ys) - Math.min(...ys);
      if (boxWidth < MIN_BOX_WIDTH || boxHeight < MIN_BOX_HEIGHT) return rejected(TOO_SMALL);

      const { feedback, angle, status } = ANALYSERS[currentExercise](landmarks);

      // One counter update per frame, from the same angle the feedback was based on.
      const reps = Number.isFinite(angle) ? counter.update(angle) : counter.count;

      return {
        ok: true,
        hasPose: true,
        feedback,
        formScore: feedback.length ? (SCORE_BY_STATUS[status] ?? 0) : 0,
        reps,
        angle,
      };
    },
  };
}
