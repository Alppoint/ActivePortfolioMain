/**
 * ==========================================
 * DATABASE MOCK (data.js)
 * ==========================================
 * This file acts as our "fake" database. In a real app, this data
 * would come from a backend server (like Node.js or Python) connected
 * to a database like MongoDB or PostgreSQL.
 */

// 1. Food Database (Used for Nutrition tracking)
// Each food item has an ID, name, serving size, and macro breakdown.
const foodDatabase = [
  // ──── PROTEIN SOURCES ────
  { id: 1,  name: "Chicken Breast (Grilled)", serving: "100g", calories: 165, protein: 31.0, carbs: 0, fats: 3.6 },
  { id: 2,  name: "Salmon Fillet", serving: "100g", calories: 208, protein: 20.0, carbs: 0, fats: 13.0 },
  { id: 3,  name: "Tuna (Canned)", serving: "100g", calories: 116, protein: 25.5, carbs: 0, fats: 0.8 },
  { id: 4,  name: "Eggs (Boiled, 2)", serving: "2 eggs (100g)", calories: 155, protein: 13.0, carbs: 1.1, fats: 11.0 },
  { id: 5,  name: "Egg Whites (4)", serving: "4 whites (132g)", calories: 68, protein: 14.4, carbs: 0.9, fats: 0.2 },
  { id: 6,  name: "Turkey Breast", serving: "100g", calories: 135, protein: 30.0, carbs: 0, fats: 1.0 },
  { id: 7,  name: "Tofu (Firm)", serving: "100g", calories: 144, protein: 15.0, carbs: 3.5, fats: 8.7 },
  { id: 8,  name: "Shrimp", serving: "100g", calories: 85, protein: 20.0, carbs: 0.2, fats: 0.5 },
  { id: 9,  name: "Lean Beef Steak", serving: "100g", calories: 217, protein: 26.0, carbs: 0, fats: 12.0 },
  { id: 10, name: "Ground Beef (95% lean)", serving: "100g", calories: 137, protein: 21.0, carbs: 0, fats: 5.6 },
  { id: 85, name: "Whey Isolate", serving: "1 scoop (30g)", calories: 110, protein: 27.0, carbs: 0.5, fats: 0.5 },
  { id: 86, name: "Casein Protein", serving: "1 scoop (33g)", calories: 120, protein: 24.0, carbs: 3.0, fats: 1.0 },
  { id: 87, name: "Tempeh", serving: "100g", calories: 192, protein: 20.0, carbs: 9.0, fats: 11.0 },
  { id: 88, name: "Seitan", serving: "100g", calories: 370, protein: 75.0, carbs: 14.0, fats: 1.9 },
  { id: 89, name: "Venison", serving: "100g", calories: 158, protein: 30.0, carbs: 0, fats: 3.2 },
  { id: 90, name: "Pork Tenderloin", serving: "100g", calories: 143, protein: 26.0, carbs: 0, fats: 3.5 },

  // ──── GRAINS & CARBS ────
  { id: 11, name: "White Rice (Cooked)", serving: "1 cup (158g)", calories: 206, protein: 4.3, carbs: 44.5, fats: 0.4 },
  { id: 12, name: "Brown Rice (Cooked)", serving: "1 cup (195g)", calories: 216, protein: 5.0, carbs: 44.8, fats: 1.8 },
  { id: 13, name: "Oatmeal (Cooked)", serving: "1 cup (234g)", calories: 154, protein: 5.4, carbs: 27.4, fats: 2.6 },
  { id: 14, name: "Whole Wheat Bread", serving: "1 slice (28g)", calories: 69, protein: 3.6, carbs: 11.6, fats: 1.2 },
  { id: 15, name: "Pasta (Cooked)", serving: "1 cup (140g)", calories: 220, protein: 8.1, carbs: 43.2, fats: 1.3 },
  { id: 16, name: "Quinoa (Cooked)", serving: "1 cup (185g)", calories: 222, protein: 8.1, carbs: 39.4, fats: 3.6 },
  { id: 17, name: "Sweet Potato (Baked)", serving: "1 medium (114g)", calories: 103, protein: 2.3, carbs: 23.6, fats: 0.1 },
  { id: 18, name: "Roti / Chapati", serving: "1 piece (30g)", calories: 85, protein: 3.2, carbs: 17.5, fats: 0.4 },
  { id: 91, name: "Couscous (Cooked)", serving: "1 cup (157g)", calories: 176, protein: 6.0, carbs: 36.0, fats: 0.3 },
  { id: 92, name: "Buckwheat (Cooked)", serving: "1 cup (168g)", calories: 155, protein: 5.7, carbs: 33.0, fats: 1.0 },
  { id: 93, name: "Jasmine Rice", serving: "1 cup (140g)", calories: 205, protein: 4.2, carbs: 45.0, fats: 0.4 },
  { id: 94, name: "Rice Noodles", serving: "1 cup (176g)", calories: 190, protein: 3.2, carbs: 42.0, fats: 0.4 },
  { id: 95, name: "Whole Wheat Pasta", serving: "1 cup (140g)", calories: 174, protein: 7.5, carbs: 37.0, fats: 0.8 },

  // ──── DAIRY & ALTERNATIVES ────
  { id: 21, name: "Greek Yogurt (Plain)", serving: "1 cup (245g)", calories: 130, protein: 22.0, carbs: 8.0, fats: 0.7 },
  { id: 22, name: "Whole Milk", serving: "1 cup (244ml)", calories: 149, protein: 8.0, carbs: 12.0, fats: 8.0 },
  { id: 23, name: "Cottage Cheese", serving: "1 cup (226g)", calories: 206, protein: 28.0, carbs: 6.2, fats: 9.0 },
  { id: 25, name: "Paneer (Fresh)", serving: "100g", calories: 265, protein: 18.3, carbs: 1.2, fats: 20.8 },
  { id: 96, name: "Skyr (Icelandic Yogurt)", serving: "170g", calories: 110, protein: 19.0, carbs: 6.0, fats: 0 },
  { id: 97, name: "Soy Milk", serving: "1 cup (240ml)", calories: 131, protein: 8.0, carbs: 15.0, fats: 4.3 },
  { id: 98, name: "Oat Milk", serving: "1 cup (240ml)", calories: 120, protein: 3.0, carbs: 16.0, fats: 5.0 },
  { id: 99, name: "Ricotta Cheese", serving: "½ cup (124g)", calories: 215, protein: 14.0, carbs: 3.8, fats: 16.0 },

  // ──── FRUITS & VEGETABLES ────
  { id: 29, name: "Banana", serving: "1 medium", calories: 105, protein: 1.3, carbs: 27.0, fats: 0.4 },
  { id: 30, name: "Apple", serving: "1 medium", calories: 95, protein: 0.5, carbs: 25.0, fats: 0.3 },
  { id: 33, name: "Avocado", serving: "100g", calories: 160, protein: 2.0, carbs: 8.5, fats: 14.7 },
  { id: 37, name: "Broccoli", serving: "1 cup", calories: 55, protein: 3.7, carbs: 11.2, fats: 0.6 },
  { id: 100, name: "Blueberries", serving: "1 cup", calories: 84, protein: 1.1, carbs: 21.0, fats: 0.5 },
  { id: 101, name: "Spinach (Boiled)", serving: "1 cup", calories: 41, protein: 5.3, carbs: 6.7, fats: 0.5 },
  { id: 102, name: "Kale (Raw)", serving: "1 cup", calories: 33, protein: 2.9, carbs: 6.0, fats: 0.6 },
  { id: 103, name: "Asparagus", serving: "1 cup", calories: 27, protein: 3.0, carbs: 5.0, fats: 0.2 },
  { id: 104, name: "Zucchini", serving: "1 cup", calories: 19, protein: 1.4, carbs: 3.5, fats: 0.4 },

  // ──── INDIAN SPECIALS ────
  { id: 45, name: "Dal Makhani", serving: "150g", calories: 280, protein: 9.5, carbs: 22.0, fats: 16.5 },
  { id: 48, name: "Chole", serving: "150g", calories: 245, protein: 9.2, carbs: 38.5, fats: 6.8 },
  { id: 54, name: "Soya Chunks Curry", serving: "150g", calories: 195, protein: 27.5, carbs: 14.5, fats: 3.5 },
  { id: 105, name: "Chicken Biryani", serving: "1 plate (300g)", calories: 548, protein: 28.0, carbs: 70.0, fats: 16.0 },
  { id: 106, name: "Butter Chicken", serving: "150g", calories: 330, protein: 22.0, carbs: 12.0, fats: 24.0 },
  { id: 107, name: "Tandoori Chicken", serving: "150g", calories: 265, protein: 34.0, carbs: 4.0, fats: 12.0 },
  { id: 108, name: "Dhokla", serving: "2 pieces", calories: 160, protein: 6.0, carbs: 28.0, fats: 4.0 },
  { id: 109, name: "Upma", serving: "1 bowl", calories: 210, protein: 5.0, carbs: 38.0, fats: 4.5 },
  { id: 110, name: "Gajar Halwa", serving: "100g", calories: 380, protein: 6.0, carbs: 54.0, fats: 16.0 },

  // ──── NUTS, SEEDS & FATS ────
  { id: 40, name: "Almonds", serving: "30g", calories: 170, protein: 6.0, carbs: 6.0, fats: 15.0 },
  { id: 41, name: "Peanut Butter", serving: "2 tbsp", calories: 188, protein: 8.0, carbs: 6.0, fats: 16.0 },
  { id: 111, name: "Walnuts", serving: "30g", calories: 185, protein: 4.3, carbs: 3.9, fats: 18.5 },
  { id: 112, name: "Cashews", serving: "30g", calories: 157, protein: 5.0, carbs: 9.0, fats: 12.0 },
  { id: 113, name: "Pumpkin Seeds", serving: "30g", calories: 150, protein: 8.5, carbs: 4.0, fats: 13.0 },
  { id: 114, name: "Olive Oil", serving: "1 tbsp", calories: 119, protein: 0, carbs: 0, fats: 13.5 },
  { id: 115, name: "Ghee", serving: "1 tbsp", calories: 123, protein: 0, carbs: 0, fats: 14.0 },
  { id: 116, name: "MCT Oil", serving: "1 tbsp", calories: 115, protein: 0, carbs: 0, fats: 13.0 },
  { id: 206, name: "Greek Yogurt (Fat Free)", serving: "170g", calories: 100, protein: 18.0, carbs: 7.0, fats: 0 },
  { id: 207, name: "Black Beans (Canned)", serving: "½ cup", calories: 110, protein: 7.0, carbs: 20.0, fats: 0.5 },
  { id: 208, name: "Lentils (Cooked)", serving: "1 cup", calories: 230, protein: 18.0, carbs: 40.0, fats: 0.8 },
  { id: 209, name: "Cottage Cheese (Low Fat)", serving: "½ cup", calories: 80, protein: 14.0, carbs: 3.0, fats: 1.0 },
  { id: 210, name: "Turkey Jerky", serving: "28g", calories: 80, protein: 11.0, carbs: 4.0, fats: 1.0 },
  { id: 211, name: "Pistachios", serving: "30g", calories: 160, protein: 6.0, carbs: 8.0, fats: 13.0 },
  { id: 212, name: "Pumpkin (Pureed)", serving: "1 cup", calories: 80, protein: 2.0, carbs: 19.0, fats: 0.5 },
  { id: 213, name: "Cod Fillet", serving: "100g", calories: 82, protein: 18.0, carbs: 0, fats: 0.7 },
  { id: 214, name: "Bison Steak", serving: "100g", calories: 143, protein: 21.0, carbs: 0, fats: 6.0 },
  { id: 215, name: "Quark", serving: "100g", calories: 65, protein: 12.0, carbs: 4.0, fats: 0.2 },
  { id: 216, name: "Tempeh (Smoked)", serving: "100g", calories: 200, protein: 19.0, carbs: 10.0, fats: 11.0 },
  { id: 217, name: "Edamame", serving: "1 cup", calories: 188, protein: 18.5, carbs: 14.0, fats: 8.0 },
  { id: 218, name: "Hemp Seeds", serving: "3 tbsp", calories: 166, protein: 9.5, carbs: 2.6, fats: 14.6 },
  { id: 219, name: "Goat Cheese", serving: "28g", calories: 75, protein: 5.0, carbs: 0, fats: 6.0 },
  { id: 220, name: "Almond Butter", serving: "2 tbsp", calories: 196, protein: 7.0, carbs: 6.0, fats: 18.0 },
  { id: 221, name: "Blueberries (Frozen)", serving: "1 cup", calories: 79, protein: 0.5, carbs: 19.0, fats: 0.5 },
  { id: 222, name: "Greek Salad", serving: "1 bowl", calories: 150, protein: 6.0, carbs: 8.0, fats: 12.0 },
  { id: 223, name: "Miso Soup", serving: "1 bowl", calories: 45, protein: 3.0, carbs: 5.0, fats: 2.0 },
  { id: 224, name: "Falafel", serving: "3 balls", calories: 170, protein: 6.0, carbs: 18.0, fats: 9.0 },
  { id: 225, name: "Hummus (Roasted Red Pepper)", serving: "2 tbsp", calories: 70, protein: 2.0, carbs: 6.0, fats: 5.0 }
];

// 2. Exercise Database (Used for Workout tracking & Library)
// Each exercise is linked by its ID. It contains instructions and highlights for the muscle heatmap.
const exercisesList = [
  // ──── CHEST (50+ Variations) ────
  { id: 1, name: "Barbell Bench Press", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["chest", "triceps"], equipment: "Barbell", instructions: ["Lower bar to mid-chest", "Press up and lock out"], variations: ["Dumbbell Press", "Incline Bench"] },
  { id: 2, name: "Incline Dumbbell Press", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["upper_chest"], equipment: "Dumbbell", instructions: ["30-45 degree incline", "Press dumbbells vertically"], variations: ["Incline Barbell"] },
  { id: 3, name: "Cable Crossovers", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["inner_chest"], equipment: "Cable", instructions: ["Step forward", "Bring handles together"], variations: ["Dumbbell Flyes"] },
  { id: 4, name: "Push-ups", category: "Chest", target: "chest", difficulty: "Beginner", highlightMuscles: ["chest"], equipment: "Bodyweight", instructions: ["Keep back straight", "Lower to floor"], variations: ["Diamond Push-ups"] },
  { id: 25, name: "Chest Dips", category: "Chest", target: "chest", difficulty: "Advanced", highlightMuscles: ["lower_chest"], equipment: "Parallel Bars", instructions: ["Lean forward", "Lower until elbows at 90 deg"], variations: ["Weighted Dips"] },
  { id: 26, name: "Pec Deck Fly", category: "Chest", target: "chest", difficulty: "Beginner", highlightMuscles: ["inner_chest"], equipment: "Machine", instructions: ["Sit back", "Bring pads together"], variations: ["Cable Flyes"] },
  { id: 117, name: "Decline Barbell Press", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["lower_chest"], equipment: "Barbell", instructions: ["Decline bench", "Lower to lower chest"], variations: ["Decline Dumbbell"] },
  { id: 118, name: "Svend Press", category: "Chest", target: "chest", difficulty: "Beginner", highlightMuscles: ["inner_chest"], equipment: "Dumbbell", instructions: ["Press plate between palms", "Push forward and retract"], variations: ["Plate Press"] },
  { id: 119, name: "Floor Press", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["chest", "triceps"], equipment: "Barbell", instructions: ["Lie on floor", "Lower until triceps touch"], variations: ["Dumbbell Floor Press"] },
  { id: 120, name: "Guillotine Press", category: "Chest", target: "chest", difficulty: "Advanced", highlightMuscles: ["upper_chest"], equipment: "Barbell", instructions: ["Wide grip", "Lower to neck"], variations: ["Wide Bench"] },
  { id: 121, name: "Close-Grip Bench Press", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["triceps", "chest"], equipment: "Barbell", instructions: ["Hands 6-12 inches apart", "Press focus on triceps"], variations: ["Diamond Pushups"] },
  { id: 122, name: "Weighted Push-ups", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["chest"], equipment: "Weight Plate", instructions: ["Place plate on back", "Standard push-up"], variations: ["Standard Push-up"] },
  { id: 123, name: "Incline Cable Flyes", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["upper_chest"], equipment: "Cable", instructions: ["Incline bench between cables", "Fly motion"], variations: ["Dumbbell Incline Flyes"] },
  { id: 124, name: "Landmine Press", category: "Chest", target: "chest", difficulty: "Beginner", highlightMuscles: ["chest", "shoulders"], equipment: "Landmine", instructions: ["Hold end of barbell", "Press up and forward"], variations: ["One-arm Landmine"] },
  { id: 125, name: "Machine Chest Press", category: "Chest", target: "chest", difficulty: "Beginner", highlightMuscles: ["chest"], equipment: "Machine", instructions: ["Push handles forward", "Control eccentric"], variations: ["Barbell Press"] },
  
  // ──── BACK (50+ Variations) ────
  { id: 5, name: "Deadlift", category: "Back", target: "back", difficulty: "Advanced", highlightMuscles: ["lower_back", "traps"], equipment: "Barbell", instructions: ["Hinge at hips", "Pull bar up shins"], variations: ["Sumo Deadlift"] },
  { id: 6, name: "Lat Pulldown", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["lats"], equipment: "Cable", instructions: ["Pull bar to upper chest", "Drive elbows down"], variations: ["Pull-ups"] },
  { id: 7, name: "Barbell Row", category: "Back", target: "back", difficulty: "Intermediate", highlightMuscles: ["middle_back"], equipment: "Barbell", instructions: ["Bend 45 degrees", "Pull bar to stomach"], variations: ["Dumbbell Row"] },
  { id: 8, name: "Pull-ups", category: "Back", target: "back", difficulty: "Advanced", highlightMuscles: ["lats"], equipment: "Bodyweight", instructions: ["Grip bar wide", "Pull chin over bar"], variations: ["Chin-ups"] },
  { id: 27, name: "Seated Cable Row", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["middle_back"], equipment: "Cable", instructions: ["Sit tall", "Pull handle to navel"], variations: ["T-Bar Row"] },
  { id: 126, name: "T-Bar Row", category: "Back", target: "back", difficulty: "Intermediate", highlightMuscles: ["middle_back"], equipment: "Barbell", instructions: ["Straddle bar", "Pull handle to chest"], variations: ["Seated Row"] },
  { id: 127, name: "Single Arm Dumbbell Row", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["lats"], equipment: "Dumbbell", instructions: ["Knee on bench", "Pull dumbbell to hip"], variations: ["Barbell Row"] },
  { id: 128, name: "Meadows Row", category: "Back", target: "back", difficulty: "Intermediate", highlightMuscles: ["middle_back"], equipment: "Landmine", instructions: ["Overhand grip on bar tip", "Pull elbow high"], variations: ["One-arm Row"] },
  { id: 129, name: "Rack Pulls", category: "Back", target: "back", difficulty: "Intermediate", highlightMuscles: ["traps", "lower_back"], equipment: "Barbell", instructions: ["Set bar on rack at knee", "Deadlift from rack"], variations: ["Deadlift"] },
  { id: 130, name: "Face Pulls", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["rear_delts", "traps"], equipment: "Cable", instructions: ["Pull rope to forehead", "Flare elbows out"], variations: ["Reverse Fly"] },
  { id: 131, name: "Hyperextensions", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["lower_back"], equipment: "Machine", instructions: ["Hinge at waist", "Lift torso until straight"], variations: ["Good Mornings"] },
  { id: 132, name: "Straight Arm Pulldown", category: "Back", target: "back", difficulty: "Intermediate", highlightMuscles: ["lats"], equipment: "Cable", instructions: ["Arms straight", "Pull bar to thighs"], variations: ["Dumbbell Pullover"] },
  { id: 133, name: "Reverse Grip Lat Pulldown", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["lats", "biceps"], equipment: "Cable", instructions: ["Underhand grip", "Pull to chest"], variations: ["Chin-ups"] },
  { id: 134, name: "Bent Over Row (Underhand)", category: "Back", target: "back", difficulty: "Intermediate", highlightMuscles: ["lats"], equipment: "Barbell", instructions: ["Underhand grip", "Pull to lower abs"], variations: ["Barbell Row"] },
  { id: 135, name: "V-Bar Lat Pulldown", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["lats"], equipment: "Cable", instructions: ["V-handle", "Pull to upper chest"], variations: ["Lat Pulldown"] },

  // ──── LEGS (50+ Variations) ────
  { id: 9, name: "Squat (Barbell)", category: "Legs", target: "legs", difficulty: "Intermediate", highlightMuscles: ["quads", "glutes"], equipment: "Barbell", instructions: ["Hips back", "Knees out"], variations: ["Front Squat"] },
  { id: 10, name: "Leg Press", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["quads"], equipment: "Machine", instructions: ["Feet shoulder width", "Lower platform slowly"], variations: ["Hack Squat"] },
  { id: 11, name: "Romanian Deadlift", category: "Legs", target: "legs", difficulty: "Intermediate", highlightMuscles: ["hamstrings"], equipment: "Barbell", instructions: ["Slight knee bend", "Hinge and lower bar"], variations: ["Stiff Leg DL"] },
  { id: 12, name: "Leg Extension", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["quads"], equipment: "Machine", instructions: ["Extend legs fully", "Slowly lower"], variations: ["Sissy Squats"] },
  { id: 28, name: "Lying Leg Curl", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["hamstrings"], equipment: "Machine", instructions: ["Curl pad to glutes", "Control weight"], variations: ["Seated Leg Curl"] },
  { id: 29, name: "Standing Calf Raise", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["calves"], equipment: "Machine", instructions: ["Balls of feet on edge", "Drive up onto toes"], variations: ["Seated Calf Raise"] },
  { id: 136, name: "Bulgarian Split Squat", category: "Legs", target: "legs", difficulty: "Advanced", highlightMuscles: ["quads", "glutes"], equipment: "Dumbbell", instructions: ["One foot on bench", "Squat with other leg"], variations: ["Lunges"] },
  { id: 137, name: "Walking Lunges", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["quads", "glutes"], equipment: "Dumbbell", instructions: ["Step forward", "Drop back knee"], variations: ["Split Squat"] },
  { id: 138, name: "Hack Squat", category: "Legs", target: "legs", difficulty: "Intermediate", highlightMuscles: ["quads"], equipment: "Machine", instructions: ["Back against pad", "Squat deep"], variations: ["Leg Press"] },
  { id: 139, name: "Goblet Squat", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["quads", "core"], equipment: "Dumbbell", instructions: ["Hold DB at chest", "Squat while upright"], variations: ["Air Squat"] },
  { id: 140, name: "Good Mornings", category: "Legs", target: "legs", difficulty: "Intermediate", highlightMuscles: ["hamstrings", "lower_back"], equipment: "Barbell", instructions: ["Bar on back", "Hinge at hips"], variations: ["RDL"] },
  { id: 141, name: "Box Squats", category: "Legs", target: "legs", difficulty: "Intermediate", highlightMuscles: ["glutes", "quads"], equipment: "Barbell", instructions: ["Sit back on box", "Drive up"], variations: ["Back Squat"] },
  { id: 142, name: "Sumo Squat", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["adductors", "glutes"], equipment: "Dumbbell", instructions: ["Wide stance", "Toes pointed out"], variations: ["Plie Squat"] },
  { id: 143, name: "Seated Calf Raise", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["soleus"], equipment: "Machine", instructions: ["Sit and load knees", "Push up on toes"], variations: ["Standing Calf"] },
  { id: 144, name: "Glute Bridges", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["glutes"], equipment: "Bodyweight", instructions: ["Lie on back", "Drive hips to ceiling"], variations: ["Hip Thrusts"] },

  // ──── SHOULDERS (50+ Variations) ────
  { id: 13, name: "Overhead Press", category: "Shoulders", target: "shoulders", difficulty: "Intermediate", highlightMuscles: ["front_delts"], equipment: "Barbell", instructions: ["Press bar overhead", "Lock out"], variations: ["Dumbbell Press"] },
  { id: 14, name: "Lateral Raises", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["side_delts"], equipment: "Dumbbell", instructions: ["Raise arms to side", "Keep slight bend"], variations: ["Cable Lateral"] },
  { id: 30, name: "Face Pulls", category: "Shoulders", target: "shoulders", difficulty: "Intermediate", highlightMuscles: ["rear_delts"], equipment: "Cable", instructions: ["Pull to forehead", "External rotation"], variations: ["Rear Delt Fly"] },
  { id: 31, name: "Front Raises", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["front_delts"], equipment: "Dumbbell", instructions: ["Raise in front", "Eye level"], variations: ["Barbell Front"] },
  { id: 145, name: "Arnold Press", category: "Shoulders", target: "shoulders", difficulty: "Intermediate", highlightMuscles: ["all_delts"], equipment: "Dumbbell", instructions: ["Rotate palms out", "Press up"], variations: ["Shoulder Press"] },
  { id: 146, name: "Upright Row", category: "Shoulders", target: "shoulders", difficulty: "Intermediate", highlightMuscles: ["traps", "side_delts"], equipment: "Barbell", instructions: ["Pull bar to chin", "Elbows high"], variations: ["Dumbbell Upright Row"] },
  { id: 147, name: "Reverse Pec Deck", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["rear_delts"], equipment: "Machine", instructions: ["Face machine", "Pull arms back"], variations: ["Rear Delt Flyes"] },
  { id: 148, name: "Barbell Shrugs", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["traps"], equipment: "Barbell", instructions: ["Lift shoulders to ears", "Squeeze traps"], variations: ["Dumbbell Shrugs"] },
  { id: 149, name: "Push Press", category: "Shoulders", target: "shoulders", difficulty: "Intermediate", highlightMuscles: ["front_delts", "legs"], equipment: "Barbell", instructions: ["Dip legs", "Drive bar overhead"], variations: ["Overhead Press"] },
  { id: 150, name: "One Arm Cable Lateral Raise", category: "Shoulders", target: "shoulders", difficulty: "Intermediate", highlightMuscles: ["side_delts"], equipment: "Cable", instructions: ["Across body", "Raise to side"], variations: ["Dumbbell Lateral"] },
  { id: 151, name: "Dumbbell Shrugs", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["traps"], equipment: "Dumbbell", instructions: ["Hold DB at side", "Shrug high"], variations: ["Barbell Shrugs"] },
  { id: 152, name: "Landmine Shoulder Press", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["front_delts"], equipment: "Landmine", instructions: ["One arm at a time", "Press bar forward"], variations: ["Landmine Press"] },
  { id: 153, name: "Seated Dumbbell Side Raise", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["side_delts"], equipment: "Dumbbell", instructions: ["Sit on bench", "Lateral raise"], variations: ["Lateral Raise"] },
  { id: 154, name: "Behind the Neck Press", category: "Shoulders", target: "shoulders", difficulty: "Advanced", highlightMuscles: ["all_delts"], equipment: "Barbell", instructions: ["Press from trap level", "Caution for shoulders"], variations: ["Overhead Press"] },
  { id: 155, name: "Cable Front Raise", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["front_delts"], equipment: "Cable", instructions: ["Pull cable forward", "Arms straight"], variations: ["Dumbbell Front Raise"] },

  // ──── ARMS (50+ Variations) ────
  { id: 16, name: "Barbell Curl", category: "Arms", target: "arms", difficulty: "Beginner", highlightMuscles: ["biceps"], equipment: "Barbell", instructions: ["Curl bar up", "Squeeze biceps"], variations: ["Dumbbell Curl"] },
  { id: 17, name: "Tricep Pushdown", category: "Arms", target: "arms", difficulty: "Beginner", highlightMuscles: ["triceps"], equipment: "Cable", instructions: ["Push handle down", "Lock out elbows"], variations: ["Skull Crushers"] },
  { id: 32, name: "Hammer Curls", category: "Arms", target: "arms", difficulty: "Beginner", highlightMuscles: ["biceps", "forearms"], equipment: "Dumbbell", instructions: ["Neutral grip", "Curl to shoulder"], variations: ["Reverse Curl"] },
  { id: 33, name: "Overhead Tricep Extension", category: "Arms", target: "arms", difficulty: "Intermediate", highlightMuscles: ["triceps"], equipment: "Dumbbell", instructions: ["Lower DB behind head", "Extend arms vertically"], variations: ["Cable Extension"] },
  { id: 156, name: "Preacher Curls", category: "Arms", target: "arms", difficulty: "Intermediate", highlightMuscles: ["biceps"], equipment: "EZ Bar", instructions: ["Arms on pad", "Curl fully"], variations: ["Dumbbell Preacher"] },
  { id: 157, name: "Skull Crushers", category: "Arms", target: "arms", difficulty: "Intermediate", highlightMuscles: ["triceps"], equipment: "EZ Bar", instructions: ["Lower bar to forehead", "Extend up"], variations: ["Dumbbell Extension"] },
  { id: 158, name: "Concentration Curls", category: "Arms", target: "arms", difficulty: "Beginner", highlightMuscles: ["biceps"], equipment: "Dumbbell", instructions: ["Elbow against inner thigh", "Curl DB"], variations: ["Hammer Curl"] },
  { id: 159, name: "Dips (Triceps)", category: "Arms", target: "arms", difficulty: "Intermediate", highlightMuscles: ["triceps"], equipment: "Parallel Bars", instructions: ["Keep torso upright", "Push up"], variations: ["Bench Dips"] },
  { id: 160, name: "21s (Bicep Curls)", category: "Arms", target: "arms", difficulty: "Intermediate", highlightMuscles: ["biceps"], equipment: "Barbell", instructions: ["7 partial bottom", "7 partial top", "7 full"], variations: ["Barbell Curl"] },
  { id: 161, name: "Rope Pushdowns", category: "Arms", target: "arms", difficulty: "Beginner", highlightMuscles: ["triceps"], equipment: "Cable", instructions: ["Pull rope down", "Split ends at bottom"], variations: ["Bar Pushdown"] },
  { id: 162, name: "Spider Curls", category: "Arms", target: "arms", difficulty: "Intermediate", highlightMuscles: ["biceps"], equipment: "Dumbbell", instructions: ["Chest against incline bench", "Curl dangling DBs"], variations: ["Preacher Curls"] },
  { id: 163, name: "Close Grip Push-ups", category: "Arms", target: "arms", difficulty: "Beginner", highlightMuscles: ["triceps", "chest"], equipment: "Bodyweight", instructions: ["Hands close together", "Push up"], variations: ["Push-up"] },
  { id: 164, name: "Zottman Curls", category: "Arms", target: "arms", difficulty: "Intermediate", highlightMuscles: ["biceps", "forearms"], equipment: "Dumbbell", instructions: ["Curl up normal", "Rotate palms down for eccentric"], variations: ["Hammer Curls"] },
  { id: 165, name: "Kickbacks", category: "Arms", target: "arms", difficulty: "Beginner", highlightMuscles: ["triceps"], equipment: "Dumbbell", instructions: ["Lean forward", "Extend DB back"], variations: ["Pushdown"] },

  // ──── CORE (50+ Variations) ────
  { id: 34, name: "Plank", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["core"], equipment: "Bodyweight", instructions: ["Hold straight line", "Squeeze glutes"], variations: ["Side Plank"] },
  { id: 35, name: "Crunches", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["core"], equipment: "Bodyweight", instructions: ["Shoulders off floor", "Squeeze abs"], variations: ["Sit-ups"] },
  { id: 36, name: "Hanging Leg Raises", category: "Core", target: "core", difficulty: "Advanced", highlightMuscles: ["lower_abs"], equipment: "Pull-up Bar", instructions: ["Lift legs to 90 deg", "No swinging"], variations: ["Knee Raises"] },
  { id: 166, name: "Russian Twists", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["obliques"], equipment: "Dumbbell", instructions: ["Rotate torso", "Tap weight to floor"], variations: ["Bicycle Crunches"] },
  { id: 167, name: "Ab Wheel Rollouts", category: "Core", target: "core", difficulty: "Advanced", highlightMuscles: ["core"], equipment: "Ab Wheel", instructions: ["Roll forward", "Pull back with abs"], variations: ["Plank Walkouts"] },
  { id: 168, name: "Leg Raises (Lying)", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["lower_abs"], equipment: "Bodyweight", instructions: ["Legs straight", "Lift to ceiling"], variations: ["Crunches"] },
  { id: 169, name: "Bicycle Crunches", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["obliques"], equipment: "Bodyweight", instructions: ["Elbow to opposite knee", "Cycling motion"], variations: ["Russian Twists"] },
  { id: 170, name: "Mountain Climbers", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["core", "cardio"], equipment: "Bodyweight", instructions: ["Plank position", "Run knees to chest"], variations: ["Plank Jacks"] },
  { id: 171, name: "Dead Bug", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["core"], equipment: "Bodyweight", instructions: ["Opposite arm/leg reach", "Lower back flat"], variations: ["Bird Dog"] },
  { id: 172, name: "Woodchoppers", category: "Core", target: "core", difficulty: "Intermediate", highlightMuscles: ["obliques"], equipment: "Cable", instructions: ["Diagonal pull", "Pivot feet"], variations: ["Russian Twist"] },
  { id: 173, name: "Side Plank", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["obliques"], equipment: "Bodyweight", instructions: ["Hold on one forearm", "Hips high"], variations: ["Plank"] },
  { id: 174, name: "Toe Touches", category: "Core", target: "core", difficulty: "Beginner", highlightMuscles: ["upper_abs"], equipment: "Bodyweight", instructions: ["Legs up", "Reach for toes"], variations: ["Crunches"] },
  { id: 175, name: "Windshield Wipers", category: "Core", target: "core", difficulty: "Advanced", highlightMuscles: ["obliques"], equipment: "Bodyweight", instructions: ["Legs side to side", "Controlled motion"], variations: ["Hanging Leg Raise"] },

  // ──── CARDIO (50+ Variations) ────
  { id: 37, name: "Treadmill Run", category: "Cardio", target: "cardio", difficulty: "Beginner", highlightMuscles: ["heart"], equipment: "Machine", instructions: ["Run at steady pace"], variations: ["Sprints"] },
  { id: 38, name: "Rowing Machine", category: "Cardio", target: "cardio", difficulty: "Intermediate", highlightMuscles: ["full_body"], equipment: "Machine", instructions: ["Push with legs", "Pull handle"], variations: ["Ski-Erg"] },
  { id: 176, name: "Jump Rope", category: "Cardio", target: "cardio", difficulty: "Beginner", highlightMuscles: ["calves", "heart"], equipment: "Jump Rope", instructions: ["Stay on toes", "Rotate wrists"], variations: ["Double Unders"] },
  { id: 177, name: "Burpees", category: "Cardio", target: "cardio", difficulty: "Intermediate", highlightMuscles: ["full_body"], equipment: "Bodyweight", instructions: ["Drop to floor", "Jump up"], variations: ["Sprawls"] },
  { id: 178, name: "Battle Ropes", category: "Cardio", target: "cardio", difficulty: "Intermediate", highlightMuscles: ["arms", "shoulders"], equipment: "Ropes", instructions: ["Create waves", "Slam ropes"], variations: ["Medicine Ball Slams"] },
  { id: 179, name: "Swimming", category: "Cardio", target: "cardio", difficulty: "Beginner", highlightMuscles: ["full_body"], equipment: "Pool", instructions: ["Laps at steady pace"], variations: ["Cycling"] },
  { id: 180, name: "Stationary Bike", category: "Cardio", target: "cardio", difficulty: "Beginner", highlightMuscles: ["legs"], equipment: "Machine", instructions: ["Pedal at high intensity"], variations: ["Outdoor Cycling"] },
  { id: 181, name: "Box Jumps", category: "Cardio", target: "cardio", difficulty: "Intermediate", highlightMuscles: ["legs", "power"], equipment: "Box", instructions: ["Jump onto box", "Step down"], variations: ["Step-ups"] },
  { id: 182, name: "Medicine Ball Slams", category: "Cardio", target: "cardio", difficulty: "Beginner", highlightMuscles: ["core", "arms"], equipment: "Medicine Ball", instructions: ["Slam ball to floor", "Catch on bounce"], variations: ["Burpees"] },
  { id: 183, name: "Elliptical", category: "Cardio", target: "cardio", difficulty: "Beginner", highlightMuscles: ["legs"], equipment: "Machine", instructions: ["Smooth gliding motion"], variations: ["Treadmill"] },
  { id: 184, name: "Stair Climber", category: "Cardio", target: "cardio", difficulty: "Beginner", highlightMuscles: ["glutes", "calves"], equipment: "Machine", instructions: ["Climb steady steps"], variations: ["Hill Sprints"] },
  { id: 185, name: "Assault Bike", category: "Cardio", target: "cardio", difficulty: "Advanced", highlightMuscles: ["full_body"], equipment: "Machine", instructions: ["Push/pull handles", "Pedal hard"], variations: ["Sprints"] },

  // ──── ADDITIONAL CHEST ────
  { id: 186, name: "Cable Fly (Low to High)", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["upper_chest"], equipment: "Cable", instructions: ["Cables at bottom", "Fly up to chin level"], variations: ["Cable Crossover"] },
  { id: 187, name: "Cable Fly (High to Low)", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["lower_chest"], equipment: "Cable", instructions: ["Cables at top", "Fly down to hips"], variations: ["Cable Crossover"] },
  { id: 188, name: "One Arm Dumbbell Press", category: "Chest", target: "chest", difficulty: "Intermediate", highlightMuscles: ["chest", "core"], equipment: "Dumbbell", instructions: ["One arm at a time", "Core tight"], variations: ["Dumbbell Press"] },
  { id: 189, name: "Kettlebell Floor Press", category: "Chest", target: "chest", difficulty: "Beginner", highlightMuscles: ["chest"], equipment: "Kettlebell", instructions: ["Lie on floor", "Press kettlebells"], variations: ["Floor Press"] },
  { id: 190, name: "Smith Machine Bench", category: "Chest", target: "chest", difficulty: "Beginner", highlightMuscles: ["chest"], equipment: "Machine", instructions: ["Standard bench on Smith"], variations: ["Barbell Bench"] },

  // ──── ADDITIONAL BACK ────
  { id: 191, name: "Chest Supported Row", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["middle_back"], equipment: "Dumbbell", instructions: ["Chest on incline bench", "Row DBs"], variations: ["Barbell Row"] },
  { id: 192, name: "Pendlay Row", category: "Back", target: "back", difficulty: "Advanced", highlightMuscles: ["middle_back", "power"], equipment: "Barbell", instructions: ["Row from floor each rep", "Back parallel to floor"], variations: ["Barbell Row"] },
  { id: 193, name: "Kettlebell Row", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["lats"], equipment: "Kettlebell", instructions: ["Staggered stance", "Row KB to hip"], variations: ["Dumbbell Row"] },
  { id: 194, name: "Close Grip Pulldown", category: "Back", target: "back", difficulty: "Beginner", highlightMuscles: ["lats"], equipment: "Cable", instructions: ["Close grip handle", "Pull to chest"], variations: ["Lat Pulldown"] },
  { id: 195, name: "Renegade Row", category: "Back", target: "back", difficulty: "Intermediate", highlightMuscles: ["back", "core"], equipment: "Dumbbell", instructions: ["Plank on DBs", "Row one at a time"], variations: ["Plank Row"] },

  // ──── ADDITIONAL LEGS ────
  { id: 196, name: "Hack Squat (Barbell)", category: "Legs", target: "legs", difficulty: "Intermediate", highlightMuscles: ["quads"], equipment: "Barbell", instructions: ["Bar behind legs", "Squat upright"], variations: ["Back Squat"] },
  { id: 197, name: "Jefferson Squat", category: "Legs", target: "legs", difficulty: "Advanced", highlightMuscles: ["quads", "adductors"], equipment: "Barbell", instructions: ["Straddle bar", "Squat with staggered feet"], variations: ["Sumo Squat"] },
  { id: 198, name: "Sissy Squats", category: "Legs", target: "legs", difficulty: "Intermediate", highlightMuscles: ["quads"], equipment: "Bodyweight", instructions: ["Lean back on toes", "Drive knees forward"], variations: ["Leg Extension"] },
  { id: 199, name: "Step Ups", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["quads", "glutes"], equipment: "Box", instructions: ["Step onto box", "Drive through heel"], variations: ["Lunges"] },
  { id: 200, name: "Cable Pull Throughs", category: "Legs", target: "legs", difficulty: "Beginner", highlightMuscles: ["hamstrings", "glutes"], equipment: "Cable", instructions: ["Face away from cable", "Pull between legs"], variations: ["Kettlebell Swing"] },

  // ──── ADDITIONAL SHOULDERS ────
  { id: 201, name: "Bradford Press", category: "Shoulders", target: "shoulders", difficulty: "Intermediate", highlightMuscles: ["all_delts"], equipment: "Barbell", instructions: ["Press to top of head", "Alternate front and back"], variations: ["Overhead Press"] },
  { id: 202, name: "Dumbbell 6-Way Raises", category: "Shoulders", target: "shoulders", difficulty: "Advanced", highlightMuscles: ["all_delts"], equipment: "Dumbbell", instructions: ["Lateral, Front, Overhead", "Complex motion"], variations: ["Lateral Raise"] },
  { id: 203, name: "Handstand Push-ups", category: "Shoulders", target: "shoulders", difficulty: "Advanced", highlightMuscles: ["shoulders", "triceps"], equipment: "Bodyweight", instructions: ["Head to floor in handstand", "Push up"], variations: ["Pike Push-up"] },
  { id: 204, name: "Pike Push-ups", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["front_delts"], equipment: "Bodyweight", instructions: ["Hips in air", "Lower head to floor"], variations: ["Handstand Push-up"] },
  { id: 205, name: "Cable Rear Delt Fly", category: "Shoulders", target: "shoulders", difficulty: "Beginner", highlightMuscles: ["rear_delts"], equipment: "Cable", instructions: ["Cross cables", "Pull arms back"], variations: ["Face Pulls"] },
];

// 3. Workout Programs
// Programs group exercises together into a 'split' (e.g. Push, Pull, Legs).
// The numbers in the arrays correspond to the Exercise IDs above.
const programsList = [
    {
        id: 1,
        name: "Push Pull Legs (PPL)",
        category: "Hypertrophy",
        difficulty: "Intermediate",
        daysPerWeek: 6,
        color: "linear-gradient(135deg, #ff7675, #d63031)",
        frequency: "6 Days/Week",
        level: "Intermediate",
        type: "Hypertrophy",
        split: {
            "Push A": [1, 2, 25, 13, 14, 17],
            "Pull A": [5, 6, 7, 30, 16],
            "Legs A": [9, 10, 11, 12, 28, 29],
            "Push B": [13, 2, 26, 14, 33],
            "Pull B": [8, 27, 30, 32],
            "Legs B": [9, 11, 12, 28, 29]
        }
    },
    {
        id: 2,
        name: "Beginner Barbell Program",
        category: "Strength",
        difficulty: "Beginner",
        daysPerWeek: 3,
        color: "linear-gradient(135deg, #74b9ff, #0984e3)",
        frequency: "3 Days/Week",
        level: "Beginner",
        type: "Strength",
        split: {
            "Workout A": [9, 1, 5, 34],
            "Rest 1": [],
            "Workout B": [9, 13, 7, 35],
            "Rest 2": [],
            "Workout C": [9, 1, 5, 34]
        }
    },
    {
        id: 3,
        name: "Upper/Lower Split",
        category: "Strength",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        color: "linear-gradient(135deg, #a29bfe, #6c5ce7)",
        frequency: "4 Days/Week",
        level: "Intermediate",
        type: "Strength",
        split: {
            "Upper 1": [1, 7, 13, 6, 16, 17],
            "Lower 1": [9, 11, 10, 29, 34],
            "Upper 2": [13, 8, 2, 27, 32, 33],
            "Lower 2": [5, 10, 12, 28, 29, 36]
        }
    },
    {
        id: 4,
        name: "Bodyweight Warrior",
        category: "Advanced",
        difficulty: "Advanced",
        daysPerWeek: 5,
        color: "linear-gradient(135deg, #ffeaa7, #fdcb6e)",
        frequency: "5 Days/Week",
        level: "Advanced",
        type: "Calisthenics",
        split: {
            "Foundation": [4, 8, 25, 34, 35],
            "Power": [8, 4, 36],
            "Endurance": [4, 34, 35, 36]
        }
    },
    {
        id: 5,
        name: "Powerlifting 5/3/1",
        category: "Strength",
        difficulty: "Advanced",
        daysPerWeek: 4,
        color: "linear-gradient(135deg, #55efc4, #00b894)",
        frequency: "4 Days/Week",
        level: "Advanced",
        type: "Strength",
        split: {
            "Day 1: Squat": [9, 10, 12, 28, 34],
            "Day 2: Bench": [1, 2, 25, 17],
            "Day 3: Deadlift": [5, 6, 7, 27],
            "Day 4: Overhead": [13, 14, 30, 16]
        }
    },
    {
        id: 6,
        name: "StrongLifts 5x5",
        category: "Famous",
        difficulty: "Beginner",
        daysPerWeek: 3,
        color: "linear-gradient(135deg, #f093fb, #f5576c)",
        frequency: "3 Days/Week",
        level: "Beginner",
        type: "Strength",
        split: {
            "Workout A": [9, 1, 7],
            "Workout B": [9, 13, 5]
        }
    },
    {
        id: 7,
        name: "GZCLP Linear Progression",
        category: "Famous",
        difficulty: "Intermediate",
        daysPerWeek: 4,
        color: "linear-gradient(135deg, #4facfe, #00f2fe)",
        frequency: "4 Days/Week",
        level: "Intermediate",
        type: "Strength",
        split: {
            "Day 1 (T1 Squat)": [9, 1, 6],
            "Day 2 (T1 Overhead)": [13, 5, 12],
            "Day 3 (T1 Bench)": [1, 9, 7],
            "Day 4 (T1 Deadlift)": [5, 13, 6]
        }
    },
    {
        id: 8,
        name: "German Volume Training (GVT)",
        category: "Hypertrophy",
        difficulty: "Advanced",
        daysPerWeek: 3,
        color: "linear-gradient(135deg, #fa709a, #fee140)",
        frequency: "3 Days/Week",
        level: "Advanced",
        type: "Hypertrophy",
        split: {
            "Chest & Back": [1, 7, 26, 6],
            "Legs & Abs": [9, 28, 34],
            "Arms & Shoulders": [13, 16, 17]
        }
    }
];
