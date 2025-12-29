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

# MediaPipe Tasks (Python 3.13 wheels are tasks-only: no mp.solutions)
from mediapipe.tasks.python.core.base_options import BaseOptions
from mediapipe.tasks.python.vision import PoseLandmarker, PoseLandmarkerOptions
from mediapipe.tasks.python.vision.core.vision_task_running_mode import VisionTaskRunningMode

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
    model_path = os.path.join(models_dir, "pose_landmarker_lite.task")
    if os.path.exists(model_path):
        return model_path

    # Try a few known locations (Google-hosted). First one that downloads wins.
    urls = [
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float32/latest/pose_landmarker_lite.task",
    ]
    last_err = None
    for url in urls:
        try:
            urllib.request.urlretrieve(url, model_path)
            return model_path
        except Exception as e:
            last_err = e
            continue
    raise RuntimeError(f"Failed to download pose landmarker model: {last_err}")


# Global landmarker + lock (not guaranteed thread-safe)
_pose_lock = threading.Lock()
_landmarker = None


def _get_landmarker() -> PoseLandmarker:
    global _landmarker
    if _landmarker is not None:
        return _landmarker

    model_path = _ensure_task_model()
    options = PoseLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=model_path),
        running_mode=VisionTaskRunningMode.VIDEO,
        num_poses=1,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    _landmarker = PoseLandmarker.create_from_options(options)
    return _landmarker


class StartSessionResponse(BaseModel):
    sessionId: str


class AnalyzeRequest(BaseModel):
    imageBase64: str = Field(..., description="Base64 JPEG/PNG, with or without data: prefix")
    exercise: str = Field("squat", description="Exercise id")
    sessionId: Optional[str] = Field(None, description="Optional session id for rep counting")
    reset: bool = Field(False, description="Reset counters for this session")


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


def _run_pose(image_bgr: np.ndarray):
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
    ts_ms = int(time.time() * 1000)
    with _pose_lock:
        landmarker = _get_landmarker()
        result = landmarker.detect_for_video(mp_image, ts_ms)

    if not result or not result.pose_landmarks:
        return None
    one = result.pose_landmarks[0]
    out = []
    for lm in one:
        # tasks landmarks have x,y,z + presence/visibility (depending on build)
        vis = getattr(lm, "visibility", None)
        if vis is None:
            vis = getattr(lm, "presence", 1.0)
        out.append(_Landmark(lm.x, lm.y, getattr(lm, "z", 0.0), vis))
    return out


def _get_session(session_id: Optional[str], reset: bool) -> str:
    sid = session_id or str(uuid.uuid4())
    s = _sessions.get(sid)
    if s is None or reset:
        _sessions[sid] = {
            "reps": 0,
            "phase": "up",
            "lastCountAt": 0.0,
            "exercise": None,
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


def _rep_update(s: Dict[str, Any], landmarks, exo: str) -> None:
    # Simple rep counter per session (uses angle thresholds; consistent with your feedback logic)
    now = time.time()
    if now - s["lastCountAt"] < 0.25:
        return

    def get_knee_angle_right():
        hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
        knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
        ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
        return _angle([hip.x, hip.y], [knee.x, knee.y], [ankle.x, ankle.y])

    def get_elbow_angle_right():
        sh = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        el = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
        wr = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
        return _angle([sh.x, sh.y], [el.x, el.y], [wr.x, wr.y])

    # Choose angle + thresholds
    if exo in ["squat", "lunge", "hip_thrust", "deadlift"]:
        ang = get_knee_angle_right()
        down_th = 125
        up_th = 160
    elif exo in ["pushup", "dips", "shoulder_press", "biceps_curl", "pullup"]:
        ang = get_elbow_angle_right()
        down_th = 105
        up_th = 155
    else:
        return

    if s["phase"] == "up" and ang <= down_th:
        s["phase"] = "down"
        return

    if s["phase"] == "down" and ang >= up_th:
        s["phase"] = "up"
        s["reps"] += 1
        s["lastCountAt"] = now


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
    sid = _get_session(req.sessionId, req.reset)
    s = _sessions[sid]

    exo = (req.exercise or "squat").strip().lower()
    if exo not in ANALYZE_FUNCS:
        exo = "squat"

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

    landmarks = _run_pose(img)
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

    feedback = ANALYZE_FUNCS[exo](landmarks, mp_pose)
    if not isinstance(feedback, list):
        feedback = [str(feedback)]

    _rep_update(s, landmarks, exo)

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


