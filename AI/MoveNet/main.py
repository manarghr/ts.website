from exercises.biceps_curl import BicepsCurl

exercise = BicepsCurl()

fake_keypoints = {
    "shoulder": [0.5, 0.4],
    "elbow": [0.5, 0.5],
    "wrist": [0.5, 0.7]
}

for _ in range(10):
    print(exercise.analyse(fake_keypoints))
