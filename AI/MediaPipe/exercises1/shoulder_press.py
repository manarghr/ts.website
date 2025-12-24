from posture_utils import calculate_angle

def analyse_shoulder_press(landmarks, mp_pose):
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

    angle = calculate_angle(shoulder, elbow, wrist)
    feedback = []
    if angle < 70:
        feedback.append("Bras trop bas — monte les bras")
    elif angle > 180:
        feedback.append("Bras trop tendus — baisse légèrement")
    else:
        feedback.append("Shoulder Press correct")
    return feedback
