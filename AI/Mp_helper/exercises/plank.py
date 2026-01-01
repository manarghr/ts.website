from posture_utils import calculate_angle

def analyse_plank(landmarks, mp_pose):
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

    back_angle = calculate_angle(shoulder, hip, ankle)
    feedback = []
    if back_angle < 160:
        feedback.append("Dos trop cambré — aligne le corps")
    elif back_angle > 180:
        feedback.append("Dos trop creusé — redresse légèrement")
    else:
        feedback.append("Planche correcte")
    return feedback , back_angle
