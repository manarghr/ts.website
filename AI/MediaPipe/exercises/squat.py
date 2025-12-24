from .base_exercise import BaseExercise, calculate_angle, get_landmark_coords

class SquatAnalyzer(BaseExercise):
    """Analyseur avancé pour les squats"""
    
    def __init__(self):
        super().__init__()
        self.min_angle = 180
        self.max_angle = 0
        
    def analyze(self, landmarks, mp_pose):
        self.frame_count += 1
        self.rep_completed = False
        
        # Déterminer le côté à analyser
        side = self.get_body_side(landmarks, mp_pose)
        
        # Sélectionner les landmarks selon le côté
        if side == "RIGHT":
            hip_lm = mp_pose.PoseLandmark.RIGHT_HIP.value
            knee_lm = mp_pose.PoseLandmark.RIGHT_KNEE.value
            ankle_lm = mp_pose.PoseLandmark.RIGHT_ANKLE.value
            shoulder_lm = mp_pose.PoseLandmark.RIGHT_SHOULDER.value
        else:
            hip_lm = mp_pose.PoseLandmark.LEFT_HIP.value
            knee_lm = mp_pose.PoseLandmark.LEFT_KNEE.value
            ankle_lm = mp_pose.PoseLandmark.LEFT_ANKLE.value
            shoulder_lm = mp_pose.PoseLandmark.LEFT_SHOULDER.value
        
        # Extraire les coordonnées
        hip = get_landmark_coords(landmarks[hip_lm])
        knee = get_landmark_coords(landmarks[knee_lm])
        ankle = get_landmark_coords(landmarks[ankle_lm])
        shoulder = get_landmark_coords(landmarks[shoulder_lm])
        
        # Calculs des angles
        knee_angle = self.smooth_angle(calculate_angle(hip, knee, ankle))
        back_angle = calculate_angle(shoulder, hip, knee)
        
        # Tracking min/max pour progression
        self.min_angle = min(self.min_angle, knee_angle)
        self.max_angle = max(self.max_angle, knee_angle)
        
        # Détection de l'état
        feedback = []
        
        if knee_angle > 160:
            new_state = "UP"
        elif knee_angle < 100:
            new_state = "DOWN"
        else:
            new_state = "TRANSITION"
        
        # Détection de répétition complète
        if self.detect_rep_completion(new_state, ('DOWN', 'UP')):
            self.rep_completed = True
            self.min_angle = 180
            self.max_angle = 0
        
        self.update_state_history(new_state)
        self.state = new_state
        
        # Analyse de la forme
        if new_state == "DOWN":
            # Vérifier la profondeur
            if knee_angle > 110:
                feedback.append(self.create_feedback(
                    "Descends plus bas (parallèle aux cuisses)", "warning"
                ))
            elif knee_angle < 70:
                feedback.append(self.create_feedback(
                    "Trop profond - risque pour les genoux", "error"
                ))
            else:
                feedback.append(self.create_feedback(
                    "Profondeur excellente !", "good"
                ))
            
            # Vérifier le dos
            if back_angle < 140:
                feedback.append(self.create_feedback(
                    " Dos trop penché - redresse le buste", "error"
                ))
            elif back_angle > 170:
                feedback.append(self.create_feedback(
                    " Trop droit - penche légèrement en avant", "warning"
                ))
            else:
                feedback.append(self.create_feedback(
                    "✓ Position du dos correcte", "good"
                ))
        
        elif new_state == "UP":
            feedback.append(self.create_feedback(
                " Position de départ - prêt pour la prochaine", "info"
            ))
        
        else:  # TRANSITION
            feedback.append(self.create_feedback(
                " Continue le mouvement...", "info"
            ))
        
        # Calcul du score
        ideal_ranges = {
            'knee': (70, 110, 90),    # min, max, optimal
            'back': (140, 170, 155)
        }
        
        score = self.calculate_score(
            {'knee': knee_angle, 'back': back_angle},
            ideal_ranges
        )
        
        # Calcul de la progression du mouvement
        if self.max_angle - self.min_angle > 10:
            progress = ((self.max_angle - knee_angle) / 
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
                'knee': knee_angle,
                'back': back_angle
            }
        }