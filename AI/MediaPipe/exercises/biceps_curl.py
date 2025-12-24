from .base_exercise import BaseExercise, calculate_angle, get_landmark_coords

class BicepsCurlAnalyzer(BaseExercise):
    """Analyseur avancé pour les biceps curls"""
    
    def __init__(self):
        super().__init__()
        self.min_angle = 180
        self.max_angle = 0
        self.elbow_stable = True
        
    def analyze(self, landmarks, mp_pose):
        self.frame_count += 1
        self.rep_completed = False
        
        # Déterminer le côté à analyser
        side = self.get_body_side(landmarks, mp_pose)
        
        # Sélectionner les landmarks
        if side == "RIGHT":
            shoulder_lm = mp_pose.PoseLandmark.RIGHT_SHOULDER.value
            elbow_lm = mp_pose.PoseLandmark.RIGHT_ELBOW.value
            wrist_lm = mp_pose.PoseLandmark.RIGHT_WRIST.value
            hip_lm = mp_pose.PoseLandmark.RIGHT_HIP.value
        else:
            shoulder_lm = mp_pose.PoseLandmark.LEFT_SHOULDER.value
            elbow_lm = mp_pose.PoseLandmark.LEFT_ELBOW.value
            wrist_lm = mp_pose.PoseLandmark.LEFT_WRIST.value
            hip_lm = mp_pose.PoseLandmark.LEFT_HIP.value
        
        # Extraire les coordonnées
        shoulder = get_landmark_coords(landmarks[shoulder_lm])
        elbow = get_landmark_coords(landmarks[elbow_lm])
        wrist = get_landmark_coords(landmarks[wrist_lm])
        hip = get_landmark_coords(landmarks[hip_lm])
        
        # Calcul de l'angle du coude
        elbow_angle = self.smooth_angle(calculate_angle(shoulder, elbow, wrist))
        
        # Vérifier si le coude reste stable (position du coude par rapport à l'épaule et la hanche)
        elbow_shoulder_angle = calculate_angle(hip, shoulder, elbow)
        self.elbow_stable = 70 < elbow_shoulder_angle < 110
        
        # Tracking min/max
        self.min_angle = min(self.min_angle, elbow_angle)
        self.max_angle = max(self.max_angle, elbow_angle)
        
        # Détection de l'état
        feedback = []
        
        if elbow_angle > 150:
            new_state = "EXTENDED"
        elif elbow_angle < 50:
            new_state = "CONTRACTED"
        else:
            new_state = "CURLING"
        
        # Détection de répétition complète (extension -> contraction -> extension)
        if self.detect_rep_completion(new_state, ('CONTRACTED', 'EXTENDED')):
            self.rep_completed = True
            self.min_angle = 180
            self.max_angle = 0
        
        self.update_state_history(new_state)
        self.state = new_state
        
        # Analyse de la forme
        if new_state == "CONTRACTED":
            if elbow_angle > 60:
                feedback.append(self.create_feedback(
                    " Monte plus haut - contraction complète", "warning"
                ))
            elif elbow_angle < 30:
                feedback.append(self.create_feedback(
                    " Trop contracté - relaxe légèrement", "warning"
                ))
            else:
                feedback.append(self.create_feedback(
                    " Contraction parfaite !", "good"
                ))
            
            if not self.elbow_stable:
                feedback.append(self.create_feedback(
                    " Coude mobile - stabilise-le près du corps", "error"
                ))
        
        elif new_state == "EXTENDED":
            if elbow_angle < 160:
                feedback.append(self.create_feedback(
                    "⬇️ Descends complètement le bras", "warning"
                ))
            else:
                feedback.append(self.create_feedback(
                    " Extension complète - bien !", "good"
                ))
            
            if not self.elbow_stable:
                feedback.append(self.create_feedback(
                    " Garde les coudes près du corps", "warning"
                ))
        
        else:  # CURLING
            feedback.append(self.create_feedback(
                " Mouvement en cours - contrôle le tempo", "info"
            ))
            
            if not self.elbow_stable:
                feedback.append(self.create_feedback(
                    " Coudes qui bougent - fixe la position", "error"
                ))
        
        # Calcul du score
        ideal_ranges = {
            'elbow': (30, 60, 45),  # Pour position contractée
        }
        
        score = self.calculate_score(
            {'elbow': elbow_angle if new_state == "CONTRACTED" else 180 - elbow_angle},
            ideal_ranges
        )
        
        # Pénalité si coude instable
        if not self.elbow_stable:
            score = max(0, score - 30)
        
        # Calcul de la progression
        if self.max_angle - self.min_angle > 10:
            progress = ((elbow_angle - self.min_angle) / 
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
                'elbow_stability': elbow_shoulder_angle
            }
        }