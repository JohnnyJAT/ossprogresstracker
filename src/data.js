export const exerciseCategories = {
  Chest: ["Bench Press", "Dumbbell Press", "Incline Bench Press", "Push-ups", "Dips"],
  Back: ["Pull-ups", "Deadlift", "Bent-over Row", "Lat Pulldown"],
  Legs: ["Squat", "Leg Press", "Lunges", "Calf Raises"],
  Shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Shrugs"],
  Arms: ["Bicep Curls", "Tricep Extensions", "Hammer Curls", "Skull Crushers"],
  Core: ["Plank", "Crunches", "Leg Raises", "Russian Twists"],
};

export const allPredefinedExercises = Object.values(exerciseCategories).flat();
