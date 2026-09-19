// Turning an angle into a score
// File: src/lib/ai/scoring.js
//
// This is a deliberate departure from the Python reference, and the only one
// that changes a number rather than a language.
//
// AI/mediapipe_api.py derived the form score by searching its own feedback text
// for keywords: 90 base, +5 if it found praise, -25 if it found a correction.
// That yields exactly two values -- 95 or 65 -- so the score sat frozen on 65
// and then jumped to 95, telling the athlete nothing about how close they were
// to the target or whether they were improving through the rep.
//
// Feedback and rep counting still match the Python exactly (see AI/README.md).
// Only the score is computed differently.

/**
 * Degrees outside the target band at which the live score reaches zero.
 * Wide enough that the number keeps moving through a normal rep instead of
 * pinning at 0 the moment form drifts.
 */
const GRACE_DEGREES = 45;

/** Score at the very edge of the band; inside it rises toward 100. */
const EDGE_SCORE = 88;

/**
 * Score a single joint angle against the band that counts as good form.
 *
 * Inside the band the score runs from EDGE_SCORE at the edges to 100 at the
 * centre, so a well-centred position still reads better than a borderline one.
 * Outside, it decays linearly to zero across GRACE_DEGREES.
 *
 * @param {number} angle - measured joint angle in degrees
 * @param {{min: number|null, max: number|null}} range - the good-form band
 * @returns {number} 0..100
 */
export function scoreAngle(angle, range) {
  if (!Number.isFinite(angle)) return 0;

  const low = range?.min ?? 0;
  const high = range?.max ?? 180;

  if (angle >= low && angle <= high) {
    const centre = (low + high) / 2;
    const halfWidth = (high - low) / 2 || 1;
    // 0 at the centre of the band, 1 at either edge.
    const offset = Math.min(1, Math.abs(angle - centre) / halfWidth);
    return Math.round(100 - (100 - EDGE_SCORE) * offset);
  }

  const distance = angle < low ? low - angle : angle - high;
  const decay = 1 - Math.min(1, distance / GRACE_DEGREES);
  return Math.max(0, Math.round(EDGE_SCORE * decay));
}

/**
 * Tracks the quality of each completed repetition.
 *
 * A per-frame score cannot say whether a rep was good: the angle passes through
 * the whole range every repetition, so it is high at the top and low at the
 * bottom no matter how well the movement was performed. What matters is the
 * turning point -- how deep the athlete actually got -- so that is what gets
 * scored, once per rep.
 */
export class RepScorer {
  constructor(range) {
    this.range = range;
    this.reset();
  }

  reset() {
    // Tracks the deepest (smallest) angle seen since the last completed rep.
    this.deepestAngle = Infinity;
    this.scores = [];
    this.lastScore = null;
  }

  /**
   * Feed one frame.
   *
   * @param {number} angle - this frame's joint angle
   * @param {boolean} repCompleted - true on the frame the rep counter banked a rep
   */
  update(angle, repCompleted) {
    if (Number.isFinite(angle) && angle < this.deepestAngle) {
      this.deepestAngle = angle;
    }

    if (!repCompleted) return;

    // Score the turning point of the rep that just finished, then re-arm.
    const deepest = Number.isFinite(this.deepestAngle) ? this.deepestAngle : angle;
    this.lastScore = scoreAngle(deepest, this.range);
    this.scores.push(this.lastScore);
    this.deepestAngle = Infinity;
  }

  /** Mean score across completed reps, or null before the first one. */
  get average() {
    if (!this.scores.length) return null;
    const total = this.scores.reduce((sum, value) => sum + value, 0);
    return Math.round(total / this.scores.length);
  }

  /** Best rep so far, or null. */
  get best() {
    return this.scores.length ? Math.max(...this.scores) : null;
  }
}
