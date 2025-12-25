from posture_utils import calculate_angle, get_best_point

def analyse_biceps_curl(landmarks, mp_pose):
    shoulder = get_best_point(
        landmarks,
        mp_pose.PoseLandmark.LEFT_SHOULDER.value,
        mp_pose.PoseLandmark.RIGHT_SHOULDER.value
    )

    elbow = get_best_point(
        landmarks,
        mp_pose.PoseLandmark.LEFT_ELBOW.value,
        mp_pose.PoseLandmark.RIGHT_ELBOW.value
    )

    wrist = get_best_point(
        landmarks,
        mp_pose.PoseLandmark.LEFT_WRIST.value,
        mp_pose.PoseLandmark.RIGHT_WRIST.value
    )

    angle = calculate_angle(shoulder, elbow, wrist)

    feedback = []
    if angle > 160:
        feedback.append("Bras trop tendu — plie légèrement le coude")
    elif angle < 40:
        feedback.append("Bras trop plié — remonte doucement")
    else:
        feedback.append("Biceps Curl correct")

    return feedback

