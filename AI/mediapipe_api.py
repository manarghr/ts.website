import os
import sys
import base64
import threading
import time
import uuid
import urllib.request
from typing import Any, Dict, List, Optional

# Ensure project root is on sys.path so imports like `AI.MediaPipe...` work
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

# Ensure AI/Mp_helper is on sys.path because your exercise modules use `from posture_utils import ...`
_MP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "Mp_helper"))
if _MP_DIR not in sys.path:
    sys.path.insert(0, _MP_DIR)

import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from enum import IntEnum

# MediaPipe Tasks (needed for Python 3.13 tasks-only builds where `mp.solutions` is not available)
try:
    from mediapipe.tasks.python import vision
    from mediapipe.tasks.python.core.base_options import BaseOptions
    from mediapipe.tasks.python.vision.core.vision_task_running_mode import (
        VisionTaskRunningMode,
    )
except Exception:  # pragma: no cover - allow environments that have only mp.solutions
    vision = None
    BaseOptions = None
    VisionTaskRunningMode = None

# Use mp.solutions.pose like main.py for better accuracy (full model vs lite)
# Note: This requires mp.solutions to be available (may not work with Python 3.13+ tasks-only builds)

# Import YOUR existing analysis functions (your "model")
from AI.Mp_helper.exercises.squat import analyse_squat
from AI.Mp_helper.exercises.pushup import analyse_pushup
from AI.Mp_helper.exercises.lunge import analyse_lunge
from AI.Mp_helper.exercises.plank import analyse_plank
from AI.Mp_helper.exercises.deadlift import analyse_deadlift
from AI.Mp_helper.exercises.pullup import analyse_pullup
from AI.Mp_helper.exercises.shoulder_press import analyse_shoulder_press
from AI.Mp_helper.exercises.biceps_curl import analyse_biceps_curl
from AI.Mp_helper.exercises.dips import analyse_dips
from AI.Mp_helper.exercises.hip_thrust import analyse_hip_thrust
from AI.Mp_helper.posture_utils import RepetitionCounter, EXERCISE_CONFIG


app = FastAPI(title="TrainSight AI (MediaPipe Python API)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PoseLandmark(IntEnum):
    NOSE = 0
    LEFT_EYE_INNER = 1
    LEFT_EYE = 2
    LEFT_EYE_OUTER = 3
    RIGHT_EYE_INNER = 4
    RIGHT_EYE = 5
    RIGHT_EYE_OUTER = 6
    LEFT_EAR = 7
    RIGHT_EAR = 8
    MOUTH_LEFT = 9
    MOUTH_RIGHT = 10
    LEFT_SHOULDER = 11
    RIGHT_SHOULDER = 12
    LEFT_ELBOW = 13
    RIGHT_ELBOW = 14
    LEFT_WRIST = 15
    RIGHT_WRIST = 16
    LEFT_PINKY = 17
    RIGHT_PINKY = 18
    LEFT_INDEX = 19
    RIGHT_INDEX = 20
    LEFT_THUMB = 21
    RIGHT_THUMB = 22
    LEFT_HIP = 23
    RIGHT_HIP = 24
    LEFT_KNEE = 25
    RIGHT_KNEE = 26
    LEFT_ANKLE = 27
    RIGHT_ANKLE = 28
    LEFT_HEEL = 29
    RIGHT_HEEL = 30
    LEFT_FOOT_INDEX = 31
    RIGHT_FOOT_INDEX = 32


class _MpPoseShim:
    PoseLandmark = PoseLandmark


mp_pose = _MpPoseShim()


class _Landmark:
    __slots__ = ("x", "y", "z", "visibility")

    def __init__(self, x: float, y: float, z: float = 0.0, visibility: float = 1.0):
        self.x = float(x)
        self.y = float(y)
        self.z = float(z)
        self.visibility = float(visibility)


def _ensure_task_model() -> str:
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    # Prefer higher-quality model for better stability (especially arms/hands).
    preferred = [
        ("pose_landmarker_full.task", [
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float32/latest/pose_landmarker_full.task",
        ]),
        ("pose_landmarker_lite.task", [
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float32/latest/pose_landmarker_lite.task",
        ]),
    ]

    for fname, _ in preferred:
        model_path = os.path.join(models_dir, fname)
        if os.path.exists(model_path):
            return model_path

    # Download preferred model (full -> lite fallback). First successful download wins.
    last_err = None
    for fname, urls in preferred:
        model_path = os.path.join(models_dir, fname)
        for url in urls:
            try:
                urllib.request.urlretrieve(url, model_path)
                return model_path
            except Exception as e:
                last_err = e
                continue
    raise RuntimeError(f"Failed to download pose landmarker model(s): {last_err}")


# Global pose detector like in main.py (full model instead of lite)
# Re-entrant because _run_pose() and _get_pose_detector() both need to guard access to the shared detector.
_pose_lock = threading.RLock()
_pose_detector = None
_landmarker_lock = threading.RLock()
_landmarker_image = None
_landmarker_video = None
_last_ts_ms = 0


def _get_pose_detector():
    global _pose_detector
    if _pose_detector is not None:
        return _pose_detector

    with _pose_lock:
        if _pose_detector is None:
            _pose_detector = mp.solutions.pose.Pose(
                static_image_mode=False,
                min_detection_confidence=0.5,  # Same as main.py for better detection
                min_tracking_confidence=0.5,   # Same as main.py for better tracking
            )
    return _pose_detector


def _get_landmarker_image():
    """
    MediaPipe Tasks PoseLandmarker in IMAGE mode (per-frame, deterministic).
    """
    global _landmarker_image
    if _landmarker_image is not None:
        return _landmarker_image

    if vision is None or BaseOptions is None or VisionTaskRunningMode is None:
        raise RuntimeError("MediaPipe Tasks is not available in this environment.")

    with _landmarker_lock:
        if _landmarker_image is None:
            model_path = _ensure_task_model()
            options = vision.PoseLandmarkerOptions(
                base_options=BaseOptions(model_asset_path=model_path),
                running_mode=VisionTaskRunningMode.IMAGE,
                num_poses=1,
                # Slightly higher confidences to reduce 'random' poses
                min_pose_detection_confidence=0.7,
                min_pose_presence_confidence=0.7,
                min_tracking_confidence=0.7,
            )
            _landmarker_image = vision.PoseLandmarker.create_from_options(options)
    return _landmarker_image


def _get_landmarker_video():
    """
    MediaPipe Tasks PoseLandmarker in VIDEO mode (stateful tracking).
    Only use when frames are truly sequential and timestamps are meaningful.
    """
    global _landmarker_video
    if _landmarker_video is not None:
        return _landmarker_video

    if vision is None or BaseOptions is None or VisionTaskRunningMode is None:
        raise RuntimeError("MediaPipe Tasks is not available in this environment.")

    with _landmarker_lock:
        if _landmarker_video is None:
            model_path = _ensure_task_model()
            options = vision.PoseLandmarkerOptions(
                base_options=BaseOptions(model_asset_path=model_path),
                running_mode=VisionTaskRunningMode.VIDEO,
                num_poses=1,
                min_pose_detection_confidence=0.7,
                min_pose_presence_confidence=0.7,
                min_tracking_confidence=0.7,
            )
            _landmarker_video = vision.PoseLandmarker.create_from_options(options)
    return _landmarker_video


class StartSessionResponse(BaseModel):
    sessionId: str


class AnalyzeRequest(BaseModel):
    imageBase64: str = Field(..., description="Base64 JPEG/PNG, with or without data: prefix")
    exercise: str = Field("squat", description="Exercise id")
    sessionId: Optional[str] = Field(None, description="Optional session id for rep counting")
    reset: bool = Field(False, description="Reset counters for this session")
    mode: Optional[str] = Field(
        "image",
        description="Tasks mode when mp.solutions isn't available: 'image' (recommended) or 'video'.",
    )
    timestampMs: Optional[int] = Field(
        None,
        description="Optional timestamp in ms for video-based tracking (PoseLandmarker video mode expects monotonic timestamps)",
    )


class AnalyzeResponse(BaseModel):
    ok: bool
    sessionId: str
    hasPose: bool
    feedback: List[str]
    formScore: int
    reps: int
    poseLandmarks: Optional[List[Dict[str, Any]]] = None


_sessions: Dict[str, Dict[str, Any]] = {}


def _clean_base64(data: str) -> str:
    if "," in data and data.strip().lower().startswith("data:"):
        return data.split(",", 1)[1]
    return data


def _decode_image(b64: str) -> Optional[np.ndarray]:
    try:
        raw = base64.b64decode(_clean_base64(b64))
        arr = np.frombuffer(raw, dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img
    except Exception:
        return None


def _run_pose(image_bgr: np.ndarray, timestamp_ms: Optional[int] = None, mode: str = "image"):
    # Prefer mp.solutions when available (closest to your main.py),
    # otherwise fall back to MediaPipe Tasks (Python 3.13 compatible).
    if hasattr(mp, "solutions") and hasattr(mp.solutions, "pose"):
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        with _pose_lock:
            detector = _get_pose_detector()
            result = detector.process(image_rgb)

        # mp.solutions.pose.Pose returns `result.pose_landmarks` as a landmark list
        if not result or not result.pose_landmarks:
            return None
        out = []
        for lm in result.pose_landmarks.landmark:
            vis = getattr(lm, "visibility", 1.0)
            out.append(_Landmark(lm.x, lm.y, getattr(lm, "z", 0.0), vis))
        return out

    # ---- MediaPipe Tasks fallback ----
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

    run_mode = (mode or "image").strip().lower()
    if run_mode == "video":
        ts_ms = int(timestamp_ms) if timestamp_ms is not None else int(time.time() * 1000)
        global _last_ts_ms
        ts_ms = max(_last_ts_ms + 1, ts_ms)
        _last_ts_ms = ts_ms
        landmarker = _get_landmarker_video()
        result = landmarker.detect_for_video(mp_image, ts_ms)
    else:
        landmarker = _get_landmarker_image()
        result = landmarker.detect(mp_image)

    if not result or not result.pose_landmarks:
        return None
    one = result.pose_landmarks[0]
    out = []
    for lm in one:
        vis = getattr(lm, "visibility", None)
        if vis is None:
            vis = getattr(lm, "presence", 1.0)
        out.append(_Landmark(lm.x, lm.y, getattr(lm, "z", 0.0), vis))
    return out


def _get_session(session_id: Optional[str], reset: bool, exercise: Optional[str] = None) -> str:
    sid = session_id or str(uuid.uuid4())
    s = _sessions.get(sid)
    exo = (exercise or "squat").strip().lower()
    
    if s is None or reset or s.get("exercise") != exo:
        # Initialize RepetitionCounter like in main.py
        config = EXERCISE_CONFIG.get(exo)
        if config is None:
            # Default config for unknown exercises
            counter = RepetitionCounter(70, 170)
        else:
            counter = RepetitionCounter(config["min_angle"], config["max_angle"])
        
        _sessions[sid] = {
            "reps": 0,
            "counter": counter,
            "exercise": exo,
            "createdAt": time.time(),
        }
    return sid


def _score_from_feedback(feedback: List[str]) -> int:
    if not feedback:
        return 0
    joined = " ".join(feedback).lower()
    good_words = ["bonne", "correct", "excell", "good"]
    bad_words = ["trop", "risque", "penché", "cambré", "creusé", "descends", "redresse", "baisse", "monte"]
    score = 90
    if any(w in joined for w in bad_words):
        score -= 25
    if any(w in joined for w in good_words):
        score += 5
    return max(0, min(100, score))


def _angle(a, b, c) -> float:
    # robust 2D angle
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    c = np.array(c, dtype=np.float32)
    ba = a - b
    bc = c - b
    denom = (np.linalg.norm(ba) * np.linalg.norm(bc)) + 1e-8
    cosang = np.dot(ba, bc) / denom
    cosang = float(np.clip(cosang, -1.0, 1.0))
    return float(np.degrees(np.arccos(cosang)))


# Removed _rep_update - now using RepetitionCounter like main.py


ANALYZE_FUNCS = {
    "squat": analyse_squat,
    "pushup": analyse_pushup,
    "lunge": analyse_lunge,
    "plank": analyse_plank,
    "deadlift": analyse_deadlift,
    "pullup": analyse_pullup,
    "shoulder_press": analyse_shoulder_press,
    "biceps_curl": analyse_biceps_curl,
    "dips": analyse_dips,
    "hip_thrust": analyse_hip_thrust,
}


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/start-session", response_model=StartSessionResponse)
def start_session():
    sid = _get_session(None, True)
    return StartSessionResponse(sessionId=sid)


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    exo = (req.exercise or "squat").strip().lower()
    if exo not in ANALYZE_FUNCS:
        exo = "squat"
    
    sid = _get_session(req.sessionId, req.reset, exo)
    s = _sessions[sid]

    img = _decode_image(req.imageBase64)
    if img is None:
        return AnalyzeResponse(
            ok=False,
            sessionId=sid,
            hasPose=False,
            feedback=["Invalid image"],
            formScore=0,
            reps=int(s.get("reps", 0)),
            poseLandmarks=None,
        )

    landmarks = _run_pose(img, req.timestampMs, req.mode or "image")
    if not landmarks:
        return AnalyzeResponse(
            ok=True,
            sessionId=sid,
            hasPose=False,
            feedback=["Place your full body in frame (more light / step back)."],
            formScore=0,
            reps=int(s.get("reps", 0)),
            poseLandmarks=None,
        )

    # Extra sanity filter: sometimes the model returns a weak/incorrect pose.
    # If we don't have enough confident points or the body box is implausible, don't draw anything.
    vis_th = 0.6
    good = [lm for lm in landmarks if getattr(lm, "visibility", 1.0) >= vis_th]
    if len(good) < 12:
        return AnalyzeResponse(
            ok=True,
            sessionId=sid,
            hasPose=False,
            feedback=["Pose not confident — improve lighting / face camera / step back so full body is visible."],
            formScore=0,
            reps=int(s.get("reps", 0)),
            poseLandmarks=None,
        )
    xs = [lm.x for lm in good]
    ys = [lm.y for lm in good]
    bw = (max(xs) - min(xs)) if xs else 0.0
    bh = (max(ys) - min(ys)) if ys else 0.0
    if bw < 0.12 or bh < 0.18:
        return AnalyzeResponse(
            ok=True,
            sessionId=sid,
            hasPose=False,
            feedback=["Pose too small/unclear — step back and keep head-to-ankles visible."],
            formScore=0,
            reps=int(s.get("reps", 0)),
            poseLandmarks=None,
        )

    # Call analysis function like in main.py - returns (feedback, angle)
    result = ANALYZE_FUNCS[exo](landmarks, mp_pose)
    if isinstance(result, tuple) and len(result) == 2:
        feedback, angle = result
    else:
        # Fallback if function doesn't return angle
        feedback = result if isinstance(result, list) else [str(result)]
        angle = None
    
    if not isinstance(feedback, list):
        feedback = [str(feedback)]

    # Update reps using RepetitionCounter like in main.py
    if angle is not None and "counter" in s:
        s["reps"] = s["counter"].update(angle)

    pose_landmarks = [
        {"x": float(lm.x), "y": float(lm.y), "z": float(lm.z), "visibility": float(getattr(lm, "visibility", 1.0))}
        for lm in landmarks
    ]

    return AnalyzeResponse(
        ok=True,
        sessionId=sid,
        hasPose=True,
        feedback=feedback,
        formScore=_score_from_feedback(feedback),
        reps=int(s.get("reps", 0)),
        poseLandmarks=pose_landmarks,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("AI.mediapipe_api:app", host="127.0.0.1", port=8001, reload=True)


