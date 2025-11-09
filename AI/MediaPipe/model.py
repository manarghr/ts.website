import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def calculate_angle(a, b, c):
    """ Calcule l'angle entre trois points (ex: hanche, genou, cheville) """
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)

    if angle > 180.0:
        angle = 360 - angle
    return angle

# Charge la vidéo
cap = cv2.VideoCapture("C:/Users/zine/Documents/NIT/genie logiciel/projet/ts.website/AI/MediaPipe/squat.mp4")

# Vérifie que la vidéo s'ouvre correctement
if not cap.isOpened():
    print(" Erreur : impossible d’ouvrir la vidéo squat.mp4")
    exit()

# Initialise MediaPipe
with mp_pose.Pose(static_image_mode=False, 
                  min_detection_confidence=0.5, 
                  min_tracking_confidence=0.5) as pose:

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        # Conversion BGR → RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        # Détection de la pose
        results = pose.process(image)

        # Reconvertit en BGR pour affichage
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Si on a détecté une pose
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Points de la jambe droite
            hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
                   landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
                    landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
                     landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

            # Calcule l’angle du genou
            angle = calculate_angle(hip, knee, ankle)

            # Feedback
            if angle < 90:
                feedback = " Trop bas - risque pour les genoux"
            elif angle > 140:
                feedback = "⬆ Descends un peu plus"
            else:
                feedback = " Bonne position"

            # Affiche l’angle sur la vidéo
            cv2.putText(image, f'Angle genou: {int(angle)}°', 
                        (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2, cv2.LINE_AA)
            cv2.putText(image, feedback, 
                        (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2, cv2.LINE_AA)

            # Dessine les points du squelette
            mp_drawing.draw_landmarks(
                image,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2)
            )

        cv2.imshow("Analyse de posture", image)

        # Appuie sur 'Esc' pour quitter
        if cv2.waitKey(10) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
