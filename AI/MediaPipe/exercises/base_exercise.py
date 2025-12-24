import numpy as np
from abc import ABC, abstractmethod
from collections import deque

def calculate_angle(a, b, c):
    """Calcule l'angle entre trois points (a, b, c)"""
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0:
        angle = 360 - angle
    return angle

def calculate_distance(a, b):
    """Calcule la distance entre deux points"""
    a, b = np.array(a), np.array(b)
    return np.linalg.norm(a - b)

def get_landmark_coords(landmark):
    """Extrait les coordonnées d'un landmark"""
    return [landmark.x, landmark.y]

class BaseExercise(ABC):
    """Classe de base pour tous les exercices"""
    
    def __init__(self):
        self.state = "INIT"
        self.rep_count = 0
        self.angle_history = deque(maxlen=10)
        self.state_history = deque(maxlen=5)
        self.frame_count = 0
        self.rep_completed = False
        
    @abstractmethod
    def analyze(self, landmarks, mp_pose):
        """Méthode à implémenter pour chaque exercice"""
        pass
    
    def reset(self):
        """Réinitialise l'exercice"""
        self.state = "INIT"
        self.rep_count = 0
        self.angle_history.clear()
        self.state_history.clear()
        self.frame_count = 0
    
    def update_state_history(self, state):
        """Met à jour l'historique des états"""
        self.state_history.append(state)
        
    def detect_rep_completion(self, current_state, target_states):
        """
        Détecte si une répétition est complétée
        current_state: état actuel
        target_states: tuple d'états qui indiquent une répétition (ex: ('DOWN', 'UP'))
        """
        if len(self.state_history) >= len(target_states):
            recent_states = list(self.state_history)[-len(target_states):]
            if recent_states == list(target_states):
                return True
        return False
    
    def calculate_score(self, angles_dict, ideal_ranges):
        """
        Calcule un score basé sur les angles mesurés
        angles_dict: dictionnaire {nom: angle_mesuré}
        ideal_ranges: dictionnaire {nom: (min, max, optimal)}
        """
        scores = []
        
        for key, angle in angles_dict.items():
            if key in ideal_ranges:
                min_val, max_val, optimal = ideal_ranges[key]
                
                if min_val <= angle <= max_val:
                    # Calcul du score basé sur la proximité de l'optimal
                    deviation = abs(angle - optimal)
                    max_deviation = max(optimal - min_val, max_val - optimal)
                    score = 100 * (1 - deviation / max_deviation)
                    scores.append(max(0, score))
                else:
                    # Hors de la plage acceptable
                    scores.append(0)
        
        return int(np.mean(scores)) if scores else 0
    
    def create_feedback(self, message, severity="info"):
        """
        Crée un feedback formaté
        severity: "good", "warning", "error", "info"
        """
        colors = {
            "good": (0, 255, 0),      # Vert
            "warning": (0, 255, 255),  # Jaune
            "error": (0, 0, 255),      # Rouge
            "info": (255, 255, 255)    # Blanc
        }
        
        return {
            "message": message,
            "severity": severity,
            "color": colors.get(severity, colors["info"])
        }
    
    def smooth_angle(self, angle):
        """Lisse l'angle avec l'historique"""
        self.angle_history.append(angle)
        return np.mean(self.angle_history)
    
    def get_body_side(self, landmarks, mp_pose):
        """Détermine le côté du corps le plus visible"""
        left_visibility = (
            landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].visibility +
            landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].visibility +
            landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].visibility
        ) / 3
        
        right_visibility = (
            landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].visibility +
            landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].visibility +
            landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].visibility
        ) / 3
        
        return "RIGHT" if right_visibility > left_visibility else "LEFT"