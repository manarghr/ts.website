import cv2
import mediapipe as mp
import numpy as np
from exercises.squat import analyse_squat
from exercises.pushup import analyse_pushup
from exercises.deadlift import analyse_deadlift


EXO = "squat"  
VIDEO_PATH = "AI/MediaPipe/videos/squat.mp4"

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture(VIDEO_PATH)

with mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            if EXO == "squat":
                feedback = analyse_squat(landmarks, mp_pose)
            elif EXO == "pushup":
                feedback = analyse_pushup(landmarks, mp_pose)
            elif EXO == "deadlift":
                feedback = analyse_deadlift(landmarks, mp_pose)
            else:
                feedback = ["Exercice inconnu."]

            for f in feedback:
                print(f)

            mp_drawing.draw_landmarks(
                frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        cv2.imshow("Analyse Posture", frame)
        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
