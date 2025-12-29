from posture_utils import calculate_angle

def analyse_lunge(landmarks, mp_pose):
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

    angle = calculate_angle(hip, knee, ankle)
    feedback = []
    if angle < 80:
        feedback.append("Fente trop basse")
    elif angle > 120:
        feedback.append("Descends un peu plus")
    else:
        feedback.append("Fente correcte")
    return feedback , angle
