from posture_utils import calculate_angle

def analyse_pullup(landmarks, mp_pose):
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

    angle = calculate_angle(shoulder, elbow, wrist)
    feedback = []
    if angle < 70:
        feedback.append("Trop bas — remonte un peu")
    elif angle > 160:
        feedback.append("Redescends légèrement")
    else:
        feedback.append("Pull-up correct")
    return feedback
