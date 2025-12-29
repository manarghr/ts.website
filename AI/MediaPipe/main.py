import cv2
import mediapipe as mp
from pathlib import Path
from exercise_registry import EXERCISE_FUNCTIONS



VIDEO_PATH = r"C:\Users\zine\Documents\NIT\genie logiciel\projet\ts.website\AI\MediaPipe\videos\pushup.mp4"

if not Path(VIDEO_PATH).exists():
    raise FileNotFoundError(f"Vidéo introuvable : {VIDEO_PATH}")


EXO = Path(VIDEO_PATH).stem  
print(f"Exercice détecté : {EXO}")



mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    raise IOError("Impossible d'ouvrir la vidéo")



repetition_count = 0
last_feedback = None

analyse_function = EXERCISE_FUNCTIONS.get(EXO)
if analyse_function is None:
    raise ValueError(f"Exercice '{EXO}' non supporté")


with mp_pose.Pose(
    static_image_mode=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
) as pose:

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Fin de la vidéo.")
            break

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        feedback = []

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            try:
                feedback = analyse_function(landmarks, mp_pose)
            except Exception as e:
                feedback = [f"Erreur analyse : {str(e)}"]

            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS
            )

            # Exemple simple de comptage (à adapter par exercice)
            if feedback and feedback[0] != last_feedback:
                if "correct" in feedback[0].lower():
                    repetition_count += 1
                    last_feedback = feedback[0]

     

        y0, dy = 30, 30
        for i, text in enumerate(feedback):
            y = y0 + i * dy
            cv2.putText(
                frame,
                text,
                (30, y),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
                cv2.LINE_AA
            )

        cv2.putText(
            frame,
            f"Repetitions: {repetition_count}",
            (30, y0 + len(feedback) * dy + 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2,
            cv2.LINE_AA
        )

        cv2.imshow("Analyse Posture", frame)

        if cv2.waitKey(25) & 0xFF == 27:
            break


cap.release()
cv2.destroyAllWindows()
