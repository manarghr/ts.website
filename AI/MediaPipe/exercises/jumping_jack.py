from posture_utils import calculate_angle

def analyse_jumping_jack(landmarks, mp_pose):
    wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]

    angle = calculate_angle(wrist, shoulder, hip)
    feedback = []

    if angle < 40:
        feedback.append("Bras trop bas — lève-les")
    elif angle > 130:
        feedback.append("Bras bien levés — mouvement correct")
    else:
        feedback.append("Continue le jumping jack")

    return feedback
