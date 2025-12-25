import numpy as np
from collections import deque
def calculate_angle(a, b, c):
    """Calcule l'angle entre trois points (a, b, c)"""
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    if angle > 180.0:
        angle = 360 - angle
    return angle

def get_best_point(landmarks, left_id, right_id):
    left = landmarks[left_id]
    right = landmarks[right_id]

    
    if left.visibility > 0.7 and right.visibility > 0.7:
        return [
            (left.x + right.x) / 2,
            (left.y + right.y) / 2
        ]

    if left.visibility > right.visibility:
        return [left.x, left.y]
    else:
        return [right.x, right.y]



class AngleSmoother:
    def __init__(self, window_size=5):
        self.window = deque(maxlen=window_size)

    def smooth(self, angle):
        self.window.append(angle)
        return sum(self.window) / len(self.window)
