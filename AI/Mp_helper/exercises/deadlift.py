from posture_utils import calculate_angle

def analyse_deadlift(landmarks, mp_pose):
    shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]

    back_angle = calculate_angle(shoulder, hip, knee)
    feedback = []
    
    if back_angle < 150:
        feedback.append(" Dos trop penché — redresse un peu ton buste.")
    else:
        feedback.append(" Bonne position du dos !")
    
    return feedback, back_angle
