from abc import ABC, abstractmethod

class BaseExercise(ABC):
    def __init__(self):
        self.feedback = []

    @abstractmethod
    def analyse(self, keypoints):
        pass
