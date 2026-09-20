// Demo meals
// File: scripts/demo-meals.mjs
//
// Six meals in each of the four meal types the page filters by, spread across
// the four goals.
//
// THE FILTER IDS ARE FIXED AND LOWERCASE. src/app/services/meals/page.js
// matches on exactly these:
//   mealType: breakfast | lunch | dinner | snacks   <- "snacks", not "snack"
//   goal:     lose-weight | gain-weight | muscle-gain | maintenance
// The first batch used "snack" and "fat-loss", so the Lose Weight filter
// returned nothing at all while the database was full.
//
// Photographs are only ever taken from VERIFIED below: ids that have been
// downloaded and looked at, with a comment saying what each one shows.

const VERIFIED = {
  fruitBowl: "photo-1490474418585-ba9bad8fd0ea", // bowl of fruit and berries
  lentilSoup: "photo-1547592166-23ac45744acd", // red lentil soup
  shakshuka: "photo-1590412200988-a436970781fa", // eggs poached in tomato
  curry: "photo-1565557623262-b51c2513a641", // curry with naan
  salmon: "photo-1467003909585-2f8a72700288", // baked salmon on greens
  vegBowl: "photo-1512621776951-a57141f2eefd", // grain and vegetable bowl
  smoothies: "photo-1505252585461-04db1eb84625", // smoothies in glasses
  salad: "photo-1512852939750-1305098529bf", // green salad
};

const img = (key) =>
  `https://images.unsplash.com/${VERIFIED[key]}?w=1600&h=900&fit=crop&q=85&auto=format`;

/**
 * Compact authoring shape. Order:
 * name, mealType, goal, photo, description, macros[kcal,P,C,F,fibre],
 * prepTime, servings, difficulty, equipment, ingredients[], steps[], tip,
 * comments[[author, text, rating]]
 */
const M = [
  // ---------------------------------------------------------------- breakfast
  ["Overnight oats with berries", "breakfast", "muscle-gain", "fruitBowl",
   "Five minutes the night before, a complete breakfast in the morning. High fibre, decent protein, no cooking.",
   [420, 24, 58, 11, 9], "5 min + overnight", 1, "Easy", "Jar or bowl",
   ["60g rolled oats", "150g Greek yoghurt", "120ml milk", "80g mixed berries", "1 tsp honey", "1 tbsp chia seeds"],
   ["Combine the oats, yoghurt, milk and chia seeds in a jar and stir well.",
    "Cover and refrigerate overnight, or for at least six hours.",
    "Top with berries and honey in the morning."],
   "Make three jars at once on Sunday. The texture is best between day one and day three.",
   [["Amel B.", "I make five on Sunday night and breakfast stops being a decision.", 5],
    ["Ryan T.", "Swapped the honey for half a mashed banana. Works.", 4]]],

  ["Shakshuka", "breakfast", "maintenance", "shakshuka",
   "Eggs poached in spiced tomato. A weekend breakfast that takes one pan and twenty-five minutes.",
   [380, 22, 24, 22, 6], "25 min", 2, "Medium", "Frying pan with lid",
   ["4 eggs", "1 tin chopped tomatoes", "1 red pepper", "1 onion", "1 tsp smoked paprika", "1 tsp cumin", "50g feta"],
   ["Soften the onion and pepper for eight minutes.",
    "Add the spices and tomatoes, simmer ten minutes until thickened.",
    "Make four wells, crack in the eggs, cover and cook six to eight minutes until the whites set.",
    "Crumble feta over the top."],
   "Keep the heat low once the eggs go in. Rushing gives rubbery whites and raw yolks.",
   [["Selma K.", "Made this for four people and there was none left. The feta is not optional.", 5],
    ["Nabil R.", "Took me closer to 35 minutes but worth it.", 4]]],

  ["Greek yoghurt protein bowl", "breakfast", "muscle-gain", "fruitBowl",
   "Thirty-five grams of protein before you have properly woken up, assembled in three minutes.",
   [390, 35, 34, 12, 5], "3 min", 1, "Easy", "Bowl",
   ["250g Greek yoghurt", "1 scoop protein powder", "80g berries", "20g almonds", "1 tsp honey"],
   ["Stir the protein powder through the yoghurt until smooth.",
    "Top with berries, almonds and honey."],
   "Add a splash of milk if the powder makes it too thick to eat comfortably.",
   [["Ines M.", "The fastest high-protein breakfast I have found that is not a shake.", 5]]],

  ["Savoury porridge with egg", "breakfast", "maintenance", "vegBowl",
   "Oats without the sweetness, finished with a soft egg. Strange for about two mouthfuls, then obvious.",
   [410, 20, 45, 16, 7], "15 min", 1, "Easy", "Saucepan",
   ["50g rolled oats", "300ml stock", "1 egg", "Handful of spinach", "20g grated cheese", "Black pepper"],
   ["Simmer the oats in stock for eight minutes, stirring.",
    "Wilt the spinach through at the end and stir in the cheese.",
    "Top with a soft-boiled or poached egg and plenty of pepper."],
   "Use a good stock. It is most of the flavour.",
   [["Hakim D.", "Sceptical, then converted. Cheaper than any breakfast I was buying.", 4]]],

  ["Banana oat pancakes", "breakfast", "gain-weight", "fruitBowl",
   "Three ingredients, no flour, and calorie-dense enough to matter if you are trying to gain.",
   [520, 22, 62, 20, 6], "15 min", 1, "Easy", "Frying pan, blender",
   ["2 ripe bananas", "80g rolled oats", "2 eggs", "1 tsp baking powder", "1 tbsp peanut butter"],
   ["Blend the bananas, oats, eggs and baking powder until smooth.",
    "Cook in a hot pan, two to three minutes a side.",
    "Stack and finish with peanut butter."],
   "Let the batter stand five minutes before cooking. The oats absorb the liquid and it holds together better.",
   [["Yacine L.", "My go-to on heavy training days. Easy to double.", 5],
    ["Dounia F.", "Kids ate them without noticing there was no sugar.", 5]]],

  ["Smoked salmon on rye", "breakfast", "lose-weight", "salmon",
   "High protein, high satiety, ready in four minutes and nothing to cook.",
   [310, 26, 28, 11, 6], "4 min", 1, "Easy", "None",
   ["2 slices rye bread", "80g smoked salmon", "60g cream cheese", "Half a lemon", "Dill", "Capers"],
   ["Spread the cream cheese over the rye.",
    "Lay the salmon on top with capers and dill.",
    "Finish with lemon and black pepper."],
   "Rye over white bread here: the fibre is most of why this holds you until lunch.",
   [["Mariam Z.", "Breakfast at my desk, no cooking, and I am not hungry at eleven.", 5]]],

  // -------------------------------------------------------------------- lunch
  ["Chicken and rice bowl", "lunch", "muscle-gain", "vegBowl",
   "The unglamorous staple of anyone who lifts. Fast, filling and easy to scale up or down.",
   [610, 48, 62, 16, 7], "25 min", 2, "Easy", "Pan, saucepan",
   ["300g chicken breast", "150g basmati rice", "200g broccoli", "1 tbsp olive oil", "2 cloves garlic", "Half a lemon", "1 tsp paprika"],
   ["Cook the rice according to the packet.",
    "Season the chicken with paprika, salt and pepper and pan-fry six to seven minutes a side.",
    "Steam the broccoli four minutes so it keeps some bite.",
    "Rest the chicken five minutes before slicing, then assemble with lemon."],
   "Cook double. The second portion is tomorrow's lunch and reheats in ninety seconds.",
   [["Omar F.", "I eat a version of this four times a week and have not got bored yet.", 5],
    ["Lina B.", "Added chilli flakes. Otherwise exactly as written.", 4]]],

  ["Tuna and white bean salad", "lunch", "lose-weight", "salad",
   "A no-cook lunch built from tins. Ready in six minutes and holds up in a lunchbox.",
   [340, 34, 28, 9, 11], "6 min", 1, "Easy", "Bowl",
   ["1 tin tuna in spring water", "150g cannellini beans", "Quarter red onion", "Handful of rocket", "Half a lemon", "1 tsp olive oil"],
   ["Drain the tuna and beans.",
    "Combine everything and dress with lemon and oil.",
    "Season and eat."],
   "Soak the sliced onion in cold water for five minutes to take the harsh edge off.",
   [["Sara M.", "34g of protein from two tins. This is in my rotation permanently.", 5],
    ["Karim H.", "Holds in a lunchbox without going soggy, which most salads do not.", 4]]],

  ["Falafel and hummus plate", "lunch", "maintenance", "vegBowl",
   "A mezze plate that eats like a full meal, with enough fibre to keep the afternoon quiet.",
   [520, 19, 58, 22, 14], "20 min", 2, "Easy", "Oven or air fryer",
   ["8 falafel", "150g hummus", "2 flatbreads", "Cucumber", "Tomatoes", "Pickled turnip", "Lemon"],
   ["Bake or air-fry the falafel until crisp, around twelve minutes.",
    "Spread the hummus across the plate and pile everything on top.",
    "Dress the vegetables with lemon and salt."],
   "Warm the flatbread for thirty seconds. It changes the whole plate.",
   [["Reda B.", "Made the falafel from scratch first time, shop-bought since. Still good.", 4]]],

  ["Turkey and avocado wrap", "lunch", "lose-weight", "salad",
   "Portable, high protein, and no reheating required.",
   [430, 35, 34, 18, 8], "8 min", 1, "Easy", "None",
   ["1 large tortilla", "120g sliced turkey", "Half an avocado", "Handful of spinach", "1 tbsp Greek yoghurt", "Mustard"],
   ["Spread the yoghurt and mustard across the tortilla.",
    "Layer the turkey, avocado and spinach.",
    "Roll tightly and cut on the diagonal."],
   "Roll it in baking paper and cut through the paper. It holds together until you finish it.",
   [["Nadia C.", "I make two before work. They survive a gym bag.", 5]]],

  ["Lentil and spinach stew", "lunch", "lose-weight", "lentilSoup",
   "Cheap, vegetarian, and genuinely high in protein for a plant-based meal. Better on day two.",
   [390, 22, 54, 8, 16], "35 min", 4, "Easy", "Large pot",
   ["300g red lentils", "200g spinach", "1 onion", "3 cloves garlic", "2 tsp cumin", "1 tin chopped tomatoes", "800ml stock"],
   ["Soften the onion and garlic for five minutes.",
    "Add the cumin, lentils, tomatoes and stock, simmer twenty-five minutes.",
    "Stir the spinach through until it wilts."],
   "16g of fibre per serving is a lot if you are not used to it. Introduce it gradually.",
   [["Meriem C.", "Four portions for the price of one sandwich. Freezes well too.", 5],
    ["Bilal A.", "Doubled the cumin. No regrets.", 5]]],

  ["Poke-style salmon bowl", "lunch", "muscle-gain", "salmon",
   "Raw salmon, rice and something sharp. Assembles faster than it looks.",
   [580, 38, 58, 20, 6], "15 min", 1, "Medium", "Bowl, saucepan",
   ["150g sushi-grade salmon", "150g cooked rice", "Half an avocado", "Edamame", "Soy sauce", "Sesame oil", "Spring onion"],
   ["Cube the salmon and toss with soy and sesame oil.",
    "Layer over warm rice with avocado and edamame.",
    "Finish with spring onion and sesame seeds."],
   "Only use salmon sold for eating raw. If in doubt, sear it for thirty seconds a side instead.",
   [["Amine B.", "Restaurant bowl for a third of the price.", 5]]],

  // ------------------------------------------------------------------- dinner
  ["Baked salmon with sweet potato", "dinner", "maintenance", "salmon",
   "One tray, forty minutes, almost no washing up. Omega-3s and slow carbohydrate in the same dish.",
   [560, 38, 44, 24, 8], "40 min", 2, "Easy", "Oven, baking tray",
   ["2 salmon fillets", "400g sweet potato", "200g asparagus", "2 tbsp olive oil", "1 lemon", "Fresh dill"],
   ["Heat the oven to 200C. Toss the sweet potato in oil and roast twenty minutes.",
    "Add the salmon and asparagus and return for twelve to fifteen minutes.",
    "Finish with lemon and dill."],
   "The salmon is done when it flakes under light pressure. Overcooking it is the usual way to ruin this.",
   [["Youssef H.", "One tray, one wash-up. Made it three Sundays running.", 5],
    ["Farah T.", "Used cod because that is what I had. Same method, works.", 4]]],

  ["Chickpea and spinach curry", "dinner", "maintenance", "curry",
   "A weeknight curry from store-cupboard ingredients. Freezes well in single portions.",
   [470, 19, 62, 16, 14], "30 min", 4, "Easy", "Large pan",
   ["2 tins chickpeas", "200g spinach", "1 tin light coconut milk", "2 tbsp curry paste", "1 onion", "300g rice"],
   ["Soften the onion, then fry the curry paste for a minute until fragrant.",
    "Add the chickpeas and coconut milk, simmer fifteen minutes.",
    "Stir the spinach through and serve with rice."],
   "Frying the paste before adding liquid makes a noticeable difference. Do not skip it.",
   [["Hiba S.", "Cheap, fast, and better the next day. Batch of four every Sunday.", 5],
    ["Tarek M.", "Added a squeeze of lime at the end. Recommended.", 5]]],

  ["Beef and broccoli stir fry", "dinner", "muscle-gain", "vegBowl",
   "Twelve minutes in the pan, high protein, and it does not need a wok.",
   [590, 45, 48, 22, 6], "20 min", 2, "Medium", "Large frying pan",
   ["350g beef strips", "300g broccoli", "2 tbsp soy sauce", "1 tbsp oyster sauce", "Garlic", "Ginger", "150g rice"],
   ["Get the pan genuinely hot before the beef goes in. Sear in two batches.",
    "Remove the beef, cook the broccoli three minutes with a splash of water.",
    "Return the beef, add the sauces, toss for one minute and serve over rice."],
   "Crowding the pan steams the beef instead of searing it. Two batches, always.",
   [["Wassim R.", "The two-batch tip is the whole recipe. Completely different result.", 5]]],

  ["Roast chicken traybake", "dinner", "gain-weight", "vegBowl",
   "A whole tray of dinner with one pan to wash and leftovers built in.",
   [680, 52, 54, 28, 9], "50 min", 4, "Easy", "Oven, roasting tin",
   ["6 chicken thighs", "600g new potatoes", "2 red onions", "1 lemon", "Rosemary", "3 tbsp olive oil"],
   ["Heat the oven to 200C.",
    "Halve the potatoes and onions, toss everything with oil, lemon and rosemary.",
    "Roast forty to forty-five minutes until the chicken skin is crisp."],
   "Thighs over breast here. They stay moist across the longer cook the potatoes need.",
   [["Samira H.", "Sunday dinner that also covers Monday lunch.", 5],
    ["Idriss K.", "Added carrots to the tray. No change to the timing.", 4]]],

  ["Miso aubergine with rice", "dinner", "lose-weight", "vegBowl",
   "Vegetarian, deeply savoury, and under 400 calories without feeling like a compromise.",
   [380, 12, 56, 12, 10], "35 min", 2, "Medium", "Oven, baking tray",
   ["2 aubergines", "2 tbsp miso paste", "1 tbsp honey", "1 tbsp rice vinegar", "150g rice", "Spring onion", "Sesame seeds"],
   ["Score the aubergine halves and roast cut-side down for twenty minutes.",
    "Mix the miso, honey and vinegar, brush over and roast a further ten minutes.",
    "Serve on rice with spring onion and sesame."],
   "Score the flesh in a diamond pattern. The glaze gets into it instead of sitting on top.",
   [["Leila N.", "Did not expect an aubergine to be the best thing I cooked that week.", 5]]],

  ["Prawn and courgette pasta", "dinner", "maintenance", "salad",
   "A twenty-minute pasta that does not rely on cream to taste like something.",
   [520, 34, 62, 14, 7], "20 min", 2, "Easy", "Two pans",
   ["200g linguine", "250g prawns", "2 courgettes", "Garlic", "Chilli flakes", "1 lemon", "Olive oil"],
   ["Cook the pasta, saving a cup of the water.",
    "Fry the garlic and chilli, add the courgette ribbons for three minutes, then the prawns for two.",
    "Toss with the pasta, lemon and a splash of the pasta water."],
   "The pasta water is what makes the sauce cling. Do not pour it all away.",
   [["Anis B.", "Prawns take two minutes, not five. Learned that the hard way.", 4]]],

  // ------------------------------------------------------------------- snacks
  ["Post-training smoothie", "snacks", "muscle-gain", "smoothies",
   "Liquid calories for when you finish training with no appetite. Thirty seconds to make.",
   [450, 32, 56, 10, 6], "3 min", 1, "Easy", "Blender",
   ["1 banana", "30g protein powder", "40g oats", "300ml milk", "1 tbsp peanut butter"],
   ["Put everything in the blender.", "Blend thirty seconds.", "Drink within the hour."],
   "Freeze the banana in advance. It changes the texture completely and costs nothing.",
   [["Hamza L.", "The frozen banana tip is the difference between this and a sad milkshake.", 5],
    ["Rim A.", "I add spinach. You cannot taste it.", 4]]],

  ["Greek yoghurt and honey", "snacks", "lose-weight", "fruitBowl",
   "Twenty grams of protein for under two hundred calories, and no preparation at all.",
   [190, 20, 18, 4, 1], "1 min", 1, "Easy", "None",
   ["200g Greek yoghurt", "1 tsp honey", "Cinnamon"],
   ["Spoon the yoghurt into a bowl.", "Add honey and a dusting of cinnamon."],
   "Full-fat Greek yoghurt keeps you full longer than the low-fat version, for very few extra calories.",
   [["Sonia R.", "Replaced my afternoon biscuit habit with this. Took a week to stop missing it.", 5]]],

  ["Hummus and vegetable sticks", "snacks", "lose-weight", "vegBowl",
   "The snack that actually stops you eating at five o'clock, because of the fibre rather than willpower.",
   [210, 8, 22, 11, 8], "5 min", 1, "Easy", "None",
   ["100g hummus", "1 carrot", "Half a cucumber", "1 red pepper"],
   ["Cut the vegetables into sticks.", "Serve with the hummus."],
   "Cut a week of sticks on Sunday and keep them in water in the fridge. They stay crisp.",
   [["Ghada O.", "Prepping them on Sunday is the only reason I actually eat them.", 4]]],

  ["Trail mix, portioned", "snacks", "gain-weight", "fruitBowl",
   "Calorie-dense and genuinely useful if you struggle to eat enough — provided you weigh it.",
   [340, 10, 28, 22, 5], "5 min", 1, "Easy", "Kitchen scale",
   ["30g almonds", "20g walnuts", "20g raisins", "15g dark chocolate"],
   ["Weigh everything into a small container.", "Repeat for the week."],
   "Weigh it. Eaten from the bag this is a thousand calories without noticing, which is the point for some people and the problem for others.",
   [["Bassem T.", "Portioning it is the whole trick. From the bag I ate the week's worth in a night.", 5]]],

  ["Cottage cheese on toast", "snacks", "muscle-gain", "salad",
   "Unfashionable, twenty-five grams of protein, and ready before the kettle boils.",
   [280, 25, 26, 8, 4], "4 min", 1, "Easy", "Toaster",
   ["2 slices wholemeal bread", "200g cottage cheese", "Black pepper", "Chilli flakes"],
   ["Toast the bread.", "Spoon the cottage cheese over it.", "Season generously."],
   "Season it properly. Underseasoned cottage cheese is why people think they dislike it.",
   [["Zakaria H.", "It is back in fashion for a reason. Cheapest protein in the shop.", 4]]],

  ["Apple and peanut butter", "snacks", "maintenance", "fruitBowl",
   "Fibre and fat together, which is why it holds rather than spiking and dropping.",
   [270, 8, 28, 16, 6], "2 min", 1, "Easy", "None",
   ["1 apple", "2 tbsp peanut butter"],
   ["Slice the apple.", "Serve with the peanut butter."],
   "Check the peanut butter label. It should list peanuts, and possibly salt. Nothing else.",
   [["Nour B.", "Obvious, but I forgot about it for about ten years.", 4]]],
];

const slug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 44);

export const meals = M.map(
  ([name, mealType, goal, photo, description, macros, prepTime, servings, difficulty, equipment, ingredients, steps, tips, comments]) => ({
    id: `demo_meal_${slug(name)}`,
    name,
    mealType,
    goal,
    image: img(photo),
    description,
    calories: macros[0],
    protein: macros[1],
    carbs: macros[2],
    fats: macros[3],
    fiber: macros[4],
    prepTime,
    servings,
    difficulty,
    equipment,
    // The list page searches `ingredients`; the detail page prints the
    // quantities. Same array serves both.
    ingredients,
    detailedIngredients: ingredients,
    steps,
    tips,
    nutritionDetails: {
      Calories: `${macros[0]} kcal`,
      Protein: `${macros[1]}g`,
      Carbohydrate: `${macros[2]}g`,
      Fat: `${macros[3]}g`,
      Fibre: `${macros[4]}g`,
    },
    comments: (comments || []).map(([author, text, rating]) => ({ author, text, rating })),
  })
);
