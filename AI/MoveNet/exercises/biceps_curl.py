from exercises.base_exercise import BaseExercise
from logic.phase_detector import PhaseDetector
from logic.rep_counter import RepCounter
from logic.score_engine import ScoreEngine
from utils.angles import calculate_angle
from utils.smoothing import ExponentialSmoother

class BicepsCurl(BaseExercise):
    def __init__(self):
        super().__init__()
        self.phase = PhaseDetector(down_angle=160, up_angle=45)
        self.reps = RepCounter()
        self.score = ScoreEngine()
        self.smoother = ExponentialSmoother()

    def analyse(self, kp):
        shoulder = kp["shoulder"]
        elbow = kp["elbow"]
        wrist = kp["wrist"]

        raw_angle = calculate_angle(shoulder, elbow, wrist)
        angle = self.smoother.update(raw_angle)

        phase, completed = self.phase.update(angle)

        self.feedback.clear()

        if phase == "up" and angle < 50:
            self.feedback.append("Bonne contraction")
        if phase == "down" and angle > 150:
            self.feedback.append("Contrôle la descente")

        if completed:
            amplitude = 180 - angle
            self.reps.add()
            self.score.add(amplitude)

        return {
            "angle": int(angle),
            "phase": phase,
            "reps": self.reps.count,
            "score": self.score.current(),
            "feedback": self.feedback
        }
