import cv2
import mediapipe as mp
from pathlib import Path
from exercise_registry import EXERCISE_FUNCTIONS
from posture_utils import RepetitionCounter, EXERCISE_CONFIG



VIDEO_PATH = r"C:\Users\admin\website\ts.website\AI\Mp_helper\videos\biceps_curl.mp4"

if not Path(VIDEO_PATH).exists():
    raise FileNotFoundError(f"Vidéo introuvable : {VIDEO_PATH}")

EXO = Path(VIDEO_PATH).stem
print(f"Exercice détecté : {EXO}")




counter = RepetitionCounter(
    EXERCISE_CONFIG[EXO]["min_angle"],
    EXERCISE_CONFIG[EXO]["max_angle"]
)


mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    raise IOError("Impossible d'ouvrir la vidéo")

analyse_function = EXERCISE_FUNCTIONS.get(EXO)
if analyse_function is None:
    raise ValueError(f"Exercice '{EXO}' non supporté")

repetition_count = 0



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
                
                feedback, angle = analyse_function(landmarks, mp_pose)
                repetition_count = counter.update(angle)

            except Exception as e:
                feedback = [f"Erreur analyse : {str(e)}"]

            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS
            )

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
