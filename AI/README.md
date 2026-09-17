# TrainSight AI — pose-based form analysis

Real-time exercise form feedback: find the athlete's joints, measure the angles
that matter for the lift, and say what to fix.

There are **two implementations of the same analysis**, and it is worth being
clear about which one the site runs:

| | `AI/` (Python) | `src/lib/ai/` + `src/components/AI/` (JS) |
|---|---|---|
| Role | reference implementation | **what the website runs** |
| Detection | MediaPipe Python (`mediapipe`, `opencv`) | MediaPipe WASM, in the browser |
| Runs on | a machine you start yourself | the visitor's device |
| Used for | developing and validating the maths | production |

The Python came first. The analysis logic was then ported to JavaScript so the
feature works on a static deploy with no AI server to host — see
*Why it moved to the browser* below.

---

## How the browser path works

```
camera / uploaded video
        |
        v
PoseEngine.jsx ........ MediaPipe Pose (WASM) -> 33 landmarks
        |
        +--> PoseOverlay.jsx ...... draws the skeleton on a canvas
        |
        v
lib/ai/session.js ..... rejects untrustworthy frames, counts reps
        |
        v
lib/ai/analysers.js ... joint angles -> feedback + form score
```

| File | Responsibility |
|---|---|
| `src/components/AI/PoseEngine.jsx` | Runs the model on a `<video>`; emits landmarks. Detection only. |
| `src/components/AI/PoseOverlay.jsx` | Draws landmarks, handling letterboxing and mirroring. |
| `src/lib/ai/posture-utils.js` | Angle maths, `RepetitionCounter`, per-exercise rep windows. |
| `src/lib/ai/analysers.js` | One function per exercise: the thresholds that define good form. |
| `src/lib/ai/session.js` | Per-stream state: frame sanity checks, rep count, form score. |

Split three ways on purpose: the maths is pure functions (testable with no
browser), detection is isolated behind one component, and drawing knows nothing
about exercises.

### The model files

`@mediapipe/pose` fetches its WASM runtime and `.tflite` models over HTTP at
runtime. `scripts/copy-mediapipe.mjs` copies them from `node_modules` into
`public/mediapipe/pose/` and runs automatically before `npm run dev` and
`npm run build`.

They are **not** loaded from a CDN, so the page cannot be broken by someone
else's outage, and **not** committed, because ~24MB of binaries do not belong in
git. `pose_landmark_heavy.tflite` (27MB) is deliberately skipped — the page uses
`modelComplexity` 0 or 1.

---

## Why it moved to the browser

The original design sent a base64 JPEG to the Python server every 200ms and drew
the landmarks it sent back. That works locally and has real problems once
deployed:

- **Nowhere free to host it.** Vercel runs the Next.js app, not a Python
  process. On typical free tiers the service sleeps after ~15 minutes, so the
  first visitor waits ~50s, and `mediapipe` + `opencv` + `numpy` resident
  together do not fit in 512MB.
- **5 requests/second, per user**, each carrying a full frame.
- **Latency showed on screen.** The skeleton was drawn for a frame that had
  already gone, which is exactly what the old "lead compensation" and
  frame-stepping code existed to paper over. Both are gone: local detection has
  no round trip to compensate for.

In the browser it runs at ~15fps against the displayed frame, costs nothing to
host, and works offline.

The Python path is still wired up behind `/api/ai/analyze` and
`/api/ai/start-session` (guarded, signed-in users only) if you want to run the
two side by side.

---

## Parity with the Python

The port is verified, not assumed: the same synthetic poses were fed through
both implementations — 10 exercises x 27 joint angles each, sweeping a full
rep — and the **form score and rep count matched on every frame**.

Two intentional differences:

1. **Feedback is English**, the Python is French.
2. **Each analyser returns a `status`** (`"good"` / `"warn"`) instead of the
   score being recovered by searching the feedback text for French keywords
   (`_score_from_feedback` in `mediapipe_api.py`). That coupling meant
   translating a string silently changed a score. The numbers are unchanged:
   95 for good form, 65 for a correction, 0 for a frame with no usable pose.

---

## Known limits

Carried over from the reference implementation, and worth fixing:

- **Right side only.** Every analyser reads `RIGHT_*` landmarks. Film the
  athlete from their left and it is measuring occluded joints.
  `posture_utils.get_best_point` exists for this but is not used.
- **Three unreachable branches.** `analysePlank`, `analyseShoulderPress` and
  `analyseHipThrust` each test `angle > 180`, which cannot happen: the
  dot-product angle is always 0..180. So a sagging plank is never reported as
  sagging — it reads as the same "not aligned" as an arched one. Telling them
  apart needs the *sign* of the hip's offset from the shoulder-ankle line, not
  just the angle.
- **A phantom first rep.** `RepetitionCounter` starts in the `down` state, so
  beginning a set already at the bottom of the movement banks a rep that was
  never performed.

---

## Running the Python reference

Only needed to work on the Python itself; the website does not require it.

```powershell
python -m venv .venv
.venv\Scripts\pip install -r AI\requirements.txt
.venv\Scripts\python AI\mediapipe_api.py     # http://127.0.0.1:8001
```

Then set `AI_SERVER_URL=http://127.0.0.1:8001` in `.env.local`.

> `requirements.txt` pins `opencv-python`, which needs system GUI libraries. If
> you ever containerise this, switch to `opencv-python-headless` or the import
> will fail on a headless host.
