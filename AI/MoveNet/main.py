import time
from exercises.biceps_curl import BicepsCurl

exercise = BicepsCurl()

# Simulation d'un curl (angles approximés)
movement = [
    [0.5, 0.70],  # bras tendu
    [0.5, 0.65],
    [0.5, 0.60],
    [0.5, 0.55],
    [0.5, 0.50],  # bras plié
    [0.5, 0.55],
    [0.5, 0.60],
    [0.5, 0.65],
    [0.5, 0.70]   # retour bras tendu
]

for wrist_y in movement * 3:  # 3 répétitions
    keypoints = {
        "shoulder": [0.5, 0.4],
        "elbow": [0.5, 0.5],
        "wrist": wrist_y
    }

    result = exercise.analyse(keypoints)
    print(result)
    time.sleep(0.3)