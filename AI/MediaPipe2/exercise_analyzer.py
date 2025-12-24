import numpy as np
from datetime import datetime
from collections import deque
from exercises.squat import SquatAnalyzer
from exercises.pushup import PushupAnalyzer
from exercises.biceps_curl import BicepsCurlAnalyzer


class ExerciseAnalyzer:
    """Analyseur principal qui gère tous les exercices"""
    
    EXERCISE_MAP = {
        'squat': SquatAnalyzer,
        'pushup': PushupAnalyzer,
        'biceps_curl': BicepsCurlAnalyzer
    }
    
    def __init__(self, exercise_type):
        if exercise_type.lower() not in self.EXERCISE_MAP:
            raise ValueError(f"Exercice non reconnu: {exercise_type}")
        
        self.exercise_type = exercise_type.lower()
        self.analyzer = self.EXERCISE_MAP[self.exercise_type]()
        
        # Historique et statistiques
        self.rep_count = 0
        self.score_history = deque(maxlen=100)
        self.start_time = datetime.now()
        self.last_rep_time = None
        
        # Stockage des angles pour analyse
        self.angle_history = deque(maxlen=30)
        
    def analyze_frame(self, landmarks, mp_pose):
        """Analyse une frame et retourne les résultats"""
        
        # Obtenir l'analyse de l'exercice spécifique
        result = self.analyzer.analyze(landmarks, mp_pose)
        
        # Mise à jour du compteur de répétitions
        if result.get('rep_completed', False):
            if self.last_rep_time is None or \
            (datetime.now() - self.last_rep_time).total_seconds() > 0.8:
                self.rep_count += 1
                self.last_rep_time = datetime.now()
        
        # Enregistrer le score
        if result.get('score') is not None:
            self.score_history.append(result['score'])
        
        # Préparer la réponse complète
        analysis = {
            'reps': self.rep_count,
            'score': result.get('score', 0),
            'state': result.get('state', 'Unknown'),
            'feedback': result.get('feedback', []),
            'progress': result.get('progress'),
            'angles': result.get('angles', {}),
            'rep_completed': result.get('rep_completed', False)
        }
        
        return analysis
    
    def get_statistics(self):
        """Retourne les statistiques de la session"""
        duration = (datetime.now() - self.start_time).total_seconds()
        
        stats = {
            'total_reps': self.rep_count,
            'average_score': np.mean(self.score_history) if self.score_history else 0,
            'best_score': max(self.score_history) if self.score_history else 0,
            'worst_score': min(self.score_history) if self.score_history else 0,
            'duration': duration,
            'reps_per_minute': (self.rep_count / duration * 60) if duration > 0 else 0
        }
        
        return stats
    
    def reset(self):
        """Réinitialise les compteurs"""
        self.rep_count = 0
        self.score_history.clear()
        self.angle_history.clear()
        self.start_time = datetime.now()
        self.analyzer.reset()
    
    def change_exercise(self, exercise_type):
        """Change l'exercice en cours"""
        if exercise_type.lower() not in self.EXERCISE_MAP:
            raise ValueError(f"Exercice non reconnu: {exercise_type}")
        
        self.exercise_type = exercise_type.lower()
        self.analyzer = self.EXERCISE_MAP[self.exercise_type]()
        self.reset()