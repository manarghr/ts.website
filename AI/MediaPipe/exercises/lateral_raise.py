from posture_utils import calculate_angle

def analyse_lateral_raise(landmarks, mp_pose):
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

    angle = calculate_angle(hip, knee, ankle)
    feedback = []

    if angle < 150:
        feedback.append("Garde les jambes tendues")
    else:
        feedback.append("Leg raise correct")

    return feedback
