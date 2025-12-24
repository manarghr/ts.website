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

        # ==============================
        # 1️⃣ DÉTERMINER LE CÔTÉ DU CORPS
        # ==============================
        side = self.get_body_side(landmarks, mp_pose)

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

        # ==============================
        # 2️⃣ COORDONNÉES DES LANDMARKS
        # ==============================
        hip = get_landmark_coords(landmarks[hip_lm])
        knee = get_landmark_coords(landmarks[knee_lm])
        ankle = get_landmark_coords(landmarks[ankle_lm])
        shoulder = get_landmark_coords(landmarks[shoulder_lm])

        # ==============================
        # 3️⃣ CALCUL DES ANGLES
        # ==============================
        knee_angle = self.smooth_angle(calculate_angle(hip, knee, ankle))
        back_angle = calculate_angle(shoulder, hip, knee)

        # Tracking min / max pour la barre de progression
        self.min_angle = min(self.min_angle, knee_angle)
        self.max_angle = max(self.max_angle, knee_angle)

        # ==============================
        # 4️⃣ DÉTERMINATION DE L'ÉTAT
        # ==============================
        if knee_angle > 160:
            new_state = "UP"
        elif knee_angle < 100:
            new_state = "DOWN"
        else:
            new_state = "TRANSITION"

        # ==============================
        # 5️⃣ DÉTECTION D’UNE RÉPÉTITION
        # ==============================
        # UNE répétition = DOWN → UP
        if self.state == "DOWN" and new_state == "UP":
            self.rep_completed = True
            self.min_angle = 180
            self.max_angle = 0

        self.state = new_state

        # ==============================
        # 6️⃣ ANALYSE DE LA POSTURE
        # ==============================
        # ⚠️ On nettoie le feedback à chaque nouvelle phase DOWN
        if new_state == "DOWN":
            self.feedback_buffer.clear()

            # Profondeur du squat
            if knee_angle > 110:
                self.add_feedback(self.create_feedback(
                    "Descends plus bas (cuisses parallèles)", "warning"
                ))
            elif knee_angle < 70:
                self.add_feedback(self.create_feedback(
                    "Trop profond - danger pour les genoux", "error"
                ))
            else:
                self.add_feedback(self.create_feedback(
                    "Profondeur excellente", "good"
                ))

            # Position du dos
            if back_angle < 140:
                self.add_feedback(self.create_feedback(
                    "Dos trop penché - redresse le buste", "error"
                ))
            elif back_angle > 170:
                self.add_feedback(self.create_feedback(
                    "Dos trop droit - penche légèrement", "warning"
                ))
            else:
                self.add_feedback(self.create_feedback(
                    "Dos bien positionné", "good"
                ))

        elif new_state == "UP":
            self.add_feedback(self.create_feedback(
                "Position de départ", "info"
            ))

        # ==============================
        # 7️⃣ CALCUL DU SCORE (SEULEMENT EN BAS)
        # ==============================
        ideal_ranges = {
            'knee': (70, 110, 90),
            'back': (140, 170, 155)
        }

        if new_state == "DOWN":
            score = self.calculate_score(
                {'knee': knee_angle, 'back': back_angle},
                ideal_ranges
            )
        else:
            score = None

        # ==============================
        # 8️⃣ PROGRESSION DU MOUVEMENT
        # ==============================
        if self.max_angle - self.min_angle > 10:
            progress = ((self.max_angle - knee_angle) /
                        (self.max_angle - self.min_angle) * 100)
            progress = max(0, min(100, progress))
        else:
            progress = 0

        # ==============================
        # 9️⃣ RÉSULTAT FINAL
        # ==============================
        return {
            'state': new_state,
            'feedback': self.get_feedback(),
            'score': score,
            'progress': progress,
            'rep_completed': self.rep_completed,
            'angles': {
                'knee': knee_angle,
                'back': back_angle
            }
        }
