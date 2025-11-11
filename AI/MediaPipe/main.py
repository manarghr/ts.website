import cv2
import mediapipe as mp
import numpy as np
from exercises.squat import analyse_squat
from exercises.pushup import analyse_pushup
from exercises.deadlift import analyse_deadlift
from exercises.lunge import analyse_lunge
from exercises.pullup import analyse_pullup
from exercises.plank import analyse_plank
from exercises.shoulder_press import analyse_shoulder_press
from exercises.biceps_curl import analyse_biceps_curl
from exercises.dips import analyse_dips
from exercises.hip_thrust import analyse_hip_thrust

EXO = "lunge" # Choisissez l'exercice: "squat", "pushup", "deadlift", "lunge", "pullup"  
VIDEO_PATH ="C:\\Users\\admin\\website\\ts.website\\AI\\MediaPipe\\videos\\lunge.mp4"



mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture(VIDEO_PATH)

with mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        feedback = []

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            
            if EXO == "squat":
                feedback = analyse_squat(landmarks, mp_pose)
            elif EXO == "pushup":
                feedback = analyse_pushup(landmarks, mp_pose)
            elif EXO == "deadlift":
                feedback = analyse_deadlift(landmarks, mp_pose)
            elif EXO == "lunge":
                feedback = analyse_lunge(landmarks, mp_pose) 
            elif EXO == "pullup":
                    feedback = analyse_pullup(landmarks, mp_pose) 
            elif EXO == "plank":
                feedback = analyse_plank(landmarks, mp_pose)      
            elif EXO == "shoulder_press":
                feedback = analyse_shoulder_press(landmarks, mp_pose) 
            elif EXO == "biceps_curl":
                feedback = analyse_biceps_curl(landmarks, mp_pose)  
            elif EXO == "dips":
                feedback = analyse_dips(landmarks, mp_pose)  
            elif EXO == "hip_thrust":
                feedback = analyse_hip_thrust(landmarks, mp_pose)                    
            else:
                feedback = ["Exercice inconnu."]
              

            # Dessine le squelette
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            # Affiche le feedback sur la vidéo
            y0, dy = 30, 30
            for i, f in enumerate(feedback):
                y = y0 + i * dy
                cv2.putText(frame, f, (30, y), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2, cv2.LINE_AA)

        cv2.imshow("Analyse Posture", frame)
        if cv2.waitKey(5) & 0xFF == 27:  # touche Échap pour quitter
            break

cap.release()
cv2.destroyAllWindows()
