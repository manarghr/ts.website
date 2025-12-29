from exercises.squat import analyse_squat
from exercises.pushup import analyse_pushup
from exercises.deadlift import analyse_deadlift
from exercises.lunge import analyse_lunge
from exercises.pullup import analyse_pullup
from exercises.plank import analyse_plank
from exercises.shoulder_press import analyse_shoulder_press
from exercises.biceps_curl import analyse_biceps_curl
from exercises.dips import analyse_dips
from exercises.hip_thrust import analyse_hip_thrust
from exercises.jumping_jack import analyse_jumping_jack
from exercises.mountain_climbers import analyse_mountain_climber
from exercises.triceps_extension import analyse_triceps_extension
from exercises.lateral_raise import analyse_lateral_raise
from exercises.leg_raise import analyse_leg_raise


EXERCISE_FUNCTIONS = {
    "squat": analyse_squat,
    "pushup": analyse_pushup,
    "deadlift": analyse_deadlift,
    "lunge": analyse_lunge,
    "pullup": analyse_pullup,
    "plank": analyse_plank,
    "shoulder_press": analyse_shoulder_press,
    "biceps_curl": analyse_biceps_curl,
    "dips": analyse_dips,
    "hip_thrust": analyse_hip_thrust,
    "jumping_jack": analyse_jumping_jack,
    "mountain_climbers": analyse_mountain_climber,
    "triceps_extension": analyse_triceps_extension,
    "lateral_raise": analyse_lateral_raise,
    "leg_raise": analyse_leg_raise,
}
