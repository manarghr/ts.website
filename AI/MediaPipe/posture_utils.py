import numpy as np

def calculate_angle(a, b, c):
    """Calcule l'angle entre trois points (a, b, c)"""
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    if angle > 180.0:
        angle = 360 - angle
    return angle

def get_angle_thresholds(user_level, exercise):
    thresholds = {
        "beginner": {
            "squat": (80, 140),
            "pushup": (50, 160),
            "biceps_curl": (50, 150),
            # Ajoute les autres exercices ici
        },
        "intermediate": {
            "squat": (70, 150),
            "pushup": (40, 170),
            "biceps_curl": (40, 160),
        },
        "advanced": {
            "squat": (60, 160),
            "pushup": (30, 180),
            "biceps_curl": (30, 170),
        }
    }
    return thresholds[user_level].get(exercise, (80, 140))  # Valeurs par défaut
