from posture_utils import calculate_angle

def analyse_lateral_raise(landmarks, mp_pose):
    elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]

    angle = calculate_angle(elbow, shoulder, hip)
    feedback = []

    if angle < 30:
        feedback.append("Bras trop bas — lève les bras")
    elif angle > 90:
        feedback.append("Bras trop haut — descends légèrement")
    else:
        feedback.append("Élévation latérale correcte")

    return feedback
