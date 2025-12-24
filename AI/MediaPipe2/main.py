import cv2
import mediapipe as mp
import numpy as np
from exercise_analyzer import ExerciseAnalyzer
from exercises import *

# ==============================
# CONFIGURATION
# ==============================
EXO = "squat"   # squat | pushup | biceps_curl
VIDEO_PATH = r"C:\Users\zine\Documents\NIT\genie logiciel\projet\ts.website\AI\MediaPipe\videos\squat.mp4"
USE_WEBCAM = False

# ==============================
# INITIALISATION MEDIAPIPE
# ==============================
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

analyzer = ExerciseAnalyzer(exercise_type=EXO)

# ==============================
# CAPTURE VIDÉO
# ==============================
cap = cv2.VideoCapture(0 if USE_WEBCAM else VIDEO_PATH)

if not cap.isOpened():
    print("ERREUR : Impossible d'ouvrir la vidéo !")
    print(f"Chemin : {VIDEO_PATH}")
    exit()

print("Vidéo chargée avec succès.")
print("ÉCHAP = quitter | R = reset | S = stats")

drawing_spec = mp_drawing.DrawingSpec(thickness=2, circle_radius=2, color=(0, 255, 0))
connection_spec = mp_drawing.DrawingSpec(thickness=2, color=(255, 255, 255))

# ==============================
# BOUCLE PRINCIPALE
# ==============================
with mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
) as pose:

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Fin de la vidéo.")
            break

        if USE_WEBCAM:
            frame = cv2.flip(frame, 1)

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            analysis = analyzer.analyze_frame(landmarks, mp_pose)

            # ==============================
            # DESSIN DU SQUELETTE
            # ==============================
            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                drawing_spec,
                connection_spec
            )

            h, w, _ = frame.shape

            # ==============================
            # PANNEAU STATS (HAUT DROITE)
            # ==============================
            stats_panel = np.zeros((160, 320, 3), dtype=np.uint8)
            stats_panel[:] = (30, 30, 50)

            cv2.putText(stats_panel, f"Exercice: {EXO.upper()}",
                        (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

            cv2.putText(stats_panel, f"Reps: {analysis['reps']}",
                        (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

            cv2.putText(stats_panel, f"Phase: {analysis['state']}",
                        (10, 105), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

            # ✅ CORRECTION CRASH SCORE (None)
            if analysis['score'] is None:
                score_text = "Score: --/100"
            else:
                score_text = f"Score: {analysis['score']:.1f}/100"

            cv2.putText(stats_panel, score_text,
                        (10, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (100, 200, 255), 2)

            frame[10:170, w - 330:w - 10] = stats_panel

            # ==============================
            # FEEDBACK À GAUCHE
            # ==============================
            feedback_y = 50
            for fb in analysis['feedback']:
                text_size = cv2.getTextSize(
                    fb['message'], cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2
                )[0]

                cv2.rectangle(
                    frame,
                    (20, feedback_y - 30),
                    (30 + text_size[0], feedback_y + 10),
                    (0, 0, 0), -1
                )

                cv2.rectangle(
                    frame,
                    (20, feedback_y - 30),
                    (30 + text_size[0], feedback_y + 10),
                    fb['color'], 2
                )

                cv2.putText(
                    frame,
                    fb['message'],
                    (25, feedback_y),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    fb['color'],
                    2
                )

                feedback_y += 45

            # ==============================
            # BARRE DE PROGRESSION
            # ==============================
            if analysis['progress'] is not None:
                bar_width, bar_height = 400, 30
                bar_x = (w - bar_width) // 2
                bar_y = h - 60

                cv2.rectangle(frame,
                              (bar_x, bar_y),
                              (bar_x + bar_width, bar_y + bar_height),
                              (50, 50, 50), -1)

                progress_width = int(bar_width * analysis['progress'] / 100)
                color = (0, 255, 0) if analysis['progress'] > 50 else (0, 150, 255)

                cv2.rectangle(frame,
                              (bar_x, bar_y),
                              (bar_x + progress_width, bar_y + bar_height),
                              color, -1)

                cv2.putText(frame,
                            f"{int(analysis['progress'])}%",
                            (bar_x + bar_width // 2 - 20, bar_y + 22),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                            (255, 255, 255), 2)

        # ==============================
        # AFFICHAGE
        # ==============================
        cv2.imshow("Analyse Posture - Video", frame)

        key = cv2.waitKey(30) & 0xFF
        if key == 27:  # ESC
            break
        elif key == ord('r'):
            analyzer.reset()
            print("Compteur réinitialisé")
        elif key == ord('s'):
            stats = analyzer.get_statistics()
            print("\n--- Stats ---")
            print(f"Reps: {stats['total_reps']}")
            print(f"Score moyen: {stats['average_score']:.1f}/100")

# ==============================
# FIN
# ==============================
cap.release()
cv2.destroyAllWindows()

final_stats = analyzer.get_statistics()
print("\n=== SESSION TERMINÉE ===")
print(f"Exercice: {EXO}")
print(f"Répétitions: {final_stats['total_reps']}")
print(f"Score moyen: {final_stats['average_score']:.1f}/100")
print(f"Durée: {final_stats['duration']:.1f}s")
