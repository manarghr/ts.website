import numpy as np
from collections import deque
def calculate_angle(a, b, c):
    """
    Calcule l'angle ABC en degrés avec produit scalaire (stable)
    a, b, c = [x, y, z]
    """
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    ba = a - b
    bc = c - b

    # Produit scalaire
    cosine_angle = np.dot(ba, bc) / (
        np.linalg.norm(ba) * np.linalg.norm(bc)
    )

    # Sécurité numérique
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)

    angle = np.degrees(np.arccos(cosine_angle))
    return angle


def get_best_point(landmarks, left_id, right_id):
    left = landmarks[left_id]
    right = landmarks[right_id]

    if left.visibility > 0.7 and right.visibility > 0.7:
        return [
            (left.x + right.x) / 2,
            (left.y + right.y) / 2,
            (left.z + right.z) / 2
        ]

    if left.visibility > right.visibility:
        return [left.x, left.y, left.z]
    else:
        return [right.x, right.y, right.z]


class RepetitionCounter:
    def __init__(self, min_angle, max_angle):
        self.min_angle = min_angle
        self.max_angle = max_angle
        self.state = "down"
        self.count = 0

    def update(self, angle):
        if angle > self.max_angle:
            self.state = "down"

        if angle < self.min_angle and self.state == "down":
            self.state = "up"
            self.count += 1

        return self.count


EXERCISE_CONFIG = {
    "biceps_curl": {
        "min_angle": 40,
        "max_angle": 160
    },
    "squat": {
        "min_angle": 70,
        "max_angle": 170
    },
    "pushup": {
        "min_angle": 60,
        "max_angle": 160
    }
}