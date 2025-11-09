from posture_utils import calculate_angle

def analyse_pushup(landmarks, mp_pose):
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

    angle = calculate_angle(shoulder, elbow, wrist)

    feedback = []
    if angle < 60:
        feedback.append("Trop bas — risque pour les épaules.")
    elif angle > 160:
        feedback.append("Descends plus pour un push-up complet.")
    else:
        feedback.append("Bonne amplitude de mouvement !")
    
    return feedback
