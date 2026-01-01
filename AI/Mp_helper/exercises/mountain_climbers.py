from posture_utils import calculate_angle

def analyse_mountain_climber(landmarks, mp_pose):
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]

    angle = calculate_angle(shoulder, hip, knee)
    feedback = []

    if angle > 160:
        feedback.append("Genou trop loin — ramène vers la poitrine")
    elif angle < 90:
        feedback.append("Mountain climber correct")
    else:
        feedback.append("Accelere le mouvement")

    return feedback , angle
