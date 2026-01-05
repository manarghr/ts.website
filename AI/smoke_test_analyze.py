import base64
import json
import urllib.request

import cv2
import numpy as np


def post_json(url: str, payload: dict) -> tuple[int, str]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace")


if __name__ == "__main__":
    # Tiny JPEG (matches the website upload/camera pipeline)
    img = np.zeros((64, 64, 3), dtype=np.uint8)
    ok, buf = cv2.imencode(".jpg", img, [int(cv2.IMWRITE_JPEG_QUALITY), 82])
    assert ok
    jpg_b64 = base64.b64encode(buf.tobytes()).decode("ascii")
    payload = {
        "imageBase64": "data:image/jpeg;base64," + jpg_b64,
        "exercise": "squat",
        "sessionId": None,
        "reset": True,
        "timestampMs": 1,
    }
    status, text = post_json("http://127.0.0.1:8001/analyze", payload)
    print("status:", status)
    print("body:", text[:800])

