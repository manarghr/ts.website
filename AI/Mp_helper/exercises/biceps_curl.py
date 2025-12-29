from posture_utils import calculate_angle

def analyse_biceps_curl(landmarks, mp_pose):
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

    angle = calculate_angle(shoulder, elbow, wrist)
    feedback = []
    if angle > 160:
        feedback.append("Bras trop tendu — plie légèrement le coude")
    elif angle < 40:
        feedback.append("Bras trop plié — remonte doucement")
    else:
        feedback.append("Biceps Curl correct")
    return feedback
