class ScoreEngine:
    def __init__(self):
        self.scores = []

    def add(self, amplitude):
        score = min(100, int(amplitude))
        self.scores.append(score)

    def current(self):
        if not self.scores:
            return 0
        return int(sum(self.scores) / len(self.scores))
