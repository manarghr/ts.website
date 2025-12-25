import cv2
import mediapipe as mp
import numpy as np
import os
from pathlib import Path
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


EXO = "squat"  
VIDEO_PATH = "C:\\Users\\zine\\Documents\\NIT\\genie logiciel\\projet\\ts.website\\AI\\MediaPipe\\videos\\squat.mp4"


# Vérification du chemin de la vidéo
if not Path(VIDEO_PATH).exists():
    raise FileNotFoundError(f"La vidéo est introuvable au chemin : {VIDEO_PATH}")

# Initialisation de MediaPipe
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# Ouverture de la vidéo
cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    raise IOError(f"Impossible d'ouvrir la vidéo : {VIDEO_PATH}")

# Initialisation du compteur de répétitions
repetition_count = 0
last_feedback = None

# Boucle principale
with mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Fin de la vidéo ou erreur de lecture.")
            break

        # Conversion de l'image pour MediaPipe
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        feedback = []

        # Analyse de la posture si des landmarks sont détectés
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            try:
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
            except Exception as e:
                feedback = [f"Erreur lors de l'analyse : {str(e)}"]

            # Dessine le squelette
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            # Compteur de répétitions (exemple pour le squat)
            if EXO == "squat" and feedback and "Bonne profondeur de squat" in feedback[0]:
                if last_feedback != feedback[0]:
                    repetition_count += 1
                    last_feedback = feedback[0]

        # Affiche le feedback sur la vidéo
        y0, dy = 30, 30
        for i, f in enumerate(feedback):
            y = y0 + i * dy
            cv2.putText(frame, f, (30, y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)

        # Affiche le compteur de répétitions
        cv2.putText(frame, f"Repetitions: {repetition_count}", (30, y0 + len(feedback) * dy + 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2, cv2.LINE_AA)

        # Affiche la frame
        cv2.imshow("Analyse Posture", frame)

        # Quitte avec la touche Échap
        if cv2.waitKey(5) & 0xFF == 27:
            break

# Libère les ressources
cap.release()
cv2.destroyAllWindows()
