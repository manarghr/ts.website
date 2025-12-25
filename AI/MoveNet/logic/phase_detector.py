class PhaseDetector:
    def __init__(self, down_angle, up_angle):
        self.down_angle = down_angle
        self.up_angle = up_angle
        self.state = "down"

    def update(self, angle):
        if self.state == "down" and angle < self.up_angle:
            self.state = "up"
            return "up", False

        if self.state == "up" and angle > self.down_angle:
            self.state = "down"
            return "down", True

        return self.state, False
