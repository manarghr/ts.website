from posture_utils import calculate_angle

def analyse_hip_thrust(landmarks, mp_pose):
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]

    angle = calculate_angle(shoulder, hip, knee)
    feedback = []
    if angle < 150:
        feedback.append("Monte les hanches plus haut")
    elif angle > 180:
        feedback.append("Trop cambré — redresse le dos")
    else:
        feedback.append("Hip Thrust correct")
    return feedback
