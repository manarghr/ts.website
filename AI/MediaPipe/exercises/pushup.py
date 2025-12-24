from .base_exercise import BaseExercise, calculate_angle, get_landmark_coords

class PushupAnalyzer(BaseExercise):
    """Analyseur avancé pour les push-ups"""
    
    def __init__(self):
        super().__init__()
        self.min_angle = 180
        self.max_angle = 0
        
    def analyze(self, landmarks, mp_pose):
        self.frame_count += 1
        self.rep_completed = False
        
        # Analyse du côté droit
        shoulder = get_landmark_coords(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value])
        elbow = get_landmark_coords(landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value])
        wrist = get_landmark_coords(landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value])
        hip = get_landmark_coords(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value])
        ankle = get_landmark_coords(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value])
        
        # Calculs des angles
        elbow_angle = self.smooth_angle(calculate_angle(shoulder, elbow, wrist))
        body_angle = calculate_angle(shoulder, hip, ankle)
        
        # Tracking pour progression
        self.min_angle = min(self.min_angle, elbow_angle)
        self.max_angle = max(self.max_angle, elbow_angle)
        
        feedback = []
        
        # Détection de l'état
        if elbow_angle > 150:
            new_state = "UP"
        elif elbow_angle < 90:
            new_state = "DOWN"
        else:
            new_state = "TRANSITION"
        
        # Détection de répétition
        if self.detect_rep_completion(new_state, ('DOWN', 'UP')):
            self.rep_completed = True
            self.min_angle = 180
            self.max_angle = 0
        
        self.update_state_history(new_state)
        self.state = new_state
        
        # Vérification de l'alignement du corps
        body_straight = 160 < body_angle < 200
        
        # Analyse de la forme
        if new_state == "DOWN":
            if elbow_angle > 100:
                feedback.append(self.create_feedback(
                    " Descends plus bas - coudes à 90°", "warning"
                ))
            elif elbow_angle < 60:
                feedback.append(self.create_feedback(
                    " Trop bas - risque pour les épaules", "error"
                ))
            else:
                feedback.append(self.create_feedback(
                    "✓ Profondeur parfaite !", "good"
                ))
            
            if not body_straight:
                if body_angle < 160:
                    feedback.append(self.create_feedback(
                        " Hanches trop basses - engage les abdos", "error"
                    ))
                else:
                    feedback.append(self.create_feedback(
                        " Hanches trop hautes - aligne le corps", "error"
                    ))
            else:
                feedback.append(self.create_feedback(
                    "✓ Corps bien aligné", "good"
                ))
        
        elif new_state == "UP":
            if not body_straight:
                if body_angle < 160:
                    feedback.append(self.create_feedback(
                        " Engage ton core - corps droit", "warning"
                    ))
                else:
                    feedback.append(self.create_feedback(
                        " Baisse les hanches", "warning"
                    ))
            else:
                feedback.append(self.create_feedback(
                    "✓ Position haute excellente", "good"
                ))
        
        else:  # TRANSITION
            feedback.append(self.create_feedback(
                " Continue le mouvement contrôlé", "info"
            ))
            
            if not body_straight:
                feedback.append(self.create_feedback(
                    " Maintiens l'alignement du corps", "warning"
                ))
        
        # Calcul du score
        ideal_ranges = {
            'elbow': (60, 100, 80),
            'body': (160, 200, 180)
        }
        
        angles_to_score = {
            'elbow': elbow_angle if new_state == "DOWN" else 180,
            'body': body_angle
        }
        
        score = self.calculate_score(angles_to_score, ideal_ranges)
        
        # Calcul de la progression
        if self.max_angle - self.min_angle > 10:
            progress = ((self.max_angle - elbow_angle) / 
                       (self.max_angle - self.min_angle) * 100)
            progress = max(0, min(100, progress))
        else:
            progress = 0
        
        return {
            'state': new_state,
            'feedback': feedback,
            'score': score,
            'progress': progress,
            'rep_completed': self.rep_completed,
            'angles': {
                'elbow': elbow_angle,
                'body': body_angle
            }
        }