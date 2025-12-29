from posture_utils import calculate_angle

def analyse_squat(landmarks, mp_pose):
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
           landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
    
    angle = calculate_angle(hip, knee, ankle)
    
    feedback = []
    if angle < 90:
        feedback.append("Squat trop bas — remonte un peu.")
    elif angle > 140:
        feedback.append(" Descends un peu plus pour un squat complet.")
    else:
        feedback.append("Bonne profondeur de squat !")
    
    return feedback
