from posture_utils import calculate_angle

def analyse_jumping_jacks(landmarks, mp_pose):
  
    shoulder_r = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                  landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
    elbow_r = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
               landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
    wrist_r = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
               landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

      
    hip_r = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
             landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    knee_r = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
              landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
    ankle_r = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
               landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

    arm_angle = calculate_angle(shoulder_r, elbow_r, wrist_r)
    leg_angle = calculate_angle(hip_r, knee_r, ankle_r)

    feedback = []
    if arm_angle > 140 and leg_angle > 160:
        feedback.append("Position fermée — saute et ouvre !")
    elif arm_angle < 100 and leg_angle < 130:
        feedback.append("Bonne ouverture — Jumping Jack correct !")
    else:
        feedback.append("Ouvre plus les bras et jambes")
    
    return feedback