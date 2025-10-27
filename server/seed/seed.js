import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Recipe from '../models/Recipe.js';
import Country from '../models/Country.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kithelp';

// API 
const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';
const COCKTAILDB_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

// Country Data
const countries = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IT', name: 'Italy' },
  { code: 'FR', name: 'France' },
  { code: 'MX', name: 'Mexico' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AU', name: 'Australia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'TR', name: 'Turkey' },
  { code: 'DE', name: 'Germany' },
  { code: 'TH', name: 'Thailand' },
  { code: 'KR', name: 'South Korea' },
  { code: 'ES', name: 'Spain' },
  { code: 'CA', name: 'Canada' },
  { code: 'GR', name: 'Greece' },
  { code: 'MA', name: 'Morocco' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'INT', name: 'International' },
];

// Curated Healthy Fresh Juices (20+ Professional Recipes)
const healthyJuices = [
  {
    name: 'Green Juice',
    description: 'A nutrient-packed green juice ideal for beginners, rich in vitamins and minerals.',
    ingredients: [
      '1 bunch kale, washed well',
      '8 stalks celery, washed well',
      '1 apple, any variety',
      '1 lemon, peeled',
      '3 inch piece of ginger'
    ],
    instructions: [
      'Wash all produce well, trimming any ends or leaves as needed.',
      'Assemble your juicer and place a pitcher under the spout.',
      'With the motor running, slowly feed the produce into the juicer using the food pusher.',
      'Once juicing is complete, dilute with 4 cups of water if desired, then divide into 4 servings.',
      'Store in sealed glass containers in the fridge for up to 3 days.'
    ],
    category: 'juice',
    tags: ['healthy', 'detox', 'green'],
    countryCode: 'INT'
  },
  {
    name: 'Beet Juice',
    description: 'Earthy and energizing beet juice to boost stamina and support liver health.',
    ingredients: [
      '4 large beets, washed well & trimmed',
      '4 carrots, washed well',
      '6 stalks celery, washed well',
      '1 apple, any variety',
      '3 inch piece of ginger'
    ],
    instructions: [
      'Wash all produce well, trimming the ends/leaves off of beets and carrots.',
      'Assemble your juicer and place a pitcher under the spout.',
      'With the motor running, slowly feed the produce into the juicer using the food pusher.',
      'Once juicing is complete, dilute with 4 cups of water if desired, then divide into 4 servings.',
      'Store in sealed glass containers in the fridge for up to 3 days.'
    ],
    category: 'juice',
    tags: ['healthy', 'energizing', 'beet'],
    countryCode: 'INT'
  },
  {
    name: 'Carrot Juice',
    description: 'Bright and immune-boosting carrot juice with a tropical twist.',
    ingredients: [
      '8 carrots, washed well',
      '1 orange, peeled',
      '2 cups frozen pineapple, defrosted',
      '2 inch piece of ginger',
      '6 pieces fresh turmeric root (or 1 tsp dried turmeric)'
    ],
    instructions: [
      'Wash all produce well, trimming the ends off of carrots.',
      'Assemble your juicer and place a pitcher under the spout.',
      'With the motor running, slowly feed the produce into the juicer using the food pusher.',
      'Once juicing is complete, dilute with 4 cups of water if desired, then divide into 4 servings.',
      'Store in sealed glass containers in the fridge for up to 3 days.'
    ],
    category: 'juice',
    tags: ['healthy', 'immune-boost', 'carrot'],
    countryCode: 'INT'
  },
  {
    name: 'Healthy Green Juice',
    description: 'Detox green juice featuring kale and cucumber for hydration and cleansing.',
    ingredients: [
      '4 stalks celery, leaves removed',
      '2 green apples, halved',
      '1 cucumber',
      '6 leaves kale',
      '½ lemon, peeled',
      '1 (1 inch) piece fresh ginger'
    ],
    instructions: [
      'Process celery, apples, cucumber, kale, lemon, and ginger through a juicer.',
      'Serve immediately or store in a glass jar in the fridge for up to one day; shake before drinking.'
    ],
    category: 'juice',
    tags: ['healthy', 'detox', 'green'],
    countryCode: 'INT'
  },
  {
    name: 'Cucumber, Apple & Spinach Juice',
    description: 'Refreshing morning juice packed with antioxidants and fiber.',
    ingredients: [
      '1 cucumber',
      '2 apples',
      '2 handfuls spinach'
    ],
    instructions: [
      'Juice the cucumber, apples, and spinach together.',
      'Drink pulp and all for full nutritional benefits.'
    ],
    category: 'juice',
    tags: ['healthy', 'refreshing', 'spinach'],
    countryCode: 'INT'
  },
  {
    name: 'Green Power Fusion Juice',
    description: 'Nutrient-packed green juice with dark leafy greens and hydrating vegetables.',
    ingredients: [
      '1 bunch celery',
      '2 bunches kale',
      '1 cucumber',
      '2 limes',
      '1 apple',
      '¼ cup parsley'
    ],
    instructions: [
      'Assemble all fruits and vegetables listed. Wash produce well to remove any soil.',
      'Add a pitcher or container under juicer spout. With the motor running, place produce bit by bit into the feed chute of the juicer, using the food pusher to gently and slowly guide the produce down.',
      'Once juice has been made in your pitcher, add another 4 cups of water and divide among four 16 oz glass bottles.',
      'Juice will keep up to 3 days in a sealed container in the fridge.'
    ],
    category: 'juice',
    tags: ['healthy', 'detox', 'green'],
    countryCode: 'INT'
  },
  {
    name: 'Carrot Pineapple Ginger Juice',
    description: 'Sweet-and-tangy tropical juice with fiber and vitamin A-rich carrots.',
    ingredients: [
      '4 carrots',
      '1/2 pineapple',
      '1 inch ginger'
    ],
    instructions: [
      'Juice all ingredients in a juicer.',
      'Serve fresh over ice.'
    ],
    category: 'juice',
    tags: ['healthy', 'tropical', 'ginger'],
    countryCode: 'INT'
  },
  {
    name: 'Celery Juice',
    description: 'Gut-healing celery juice to reduce inflammation and support digestion.',
    ingredients: [
      '1 bunch organic celery'
    ],
    instructions: [
      'Juice the entire bunch of celery.',
      'Drink fresh on an empty stomach.'
    ],
    category: 'juice',
    tags: ['healthy', 'gut-health', 'celery'],
    countryCode: 'INT'
  },
  {
    name: 'Lemon-Ginger Turmeric Wellness Shot',
    description: 'Immunity-boosting shot with anti-inflammatory spices.',
    ingredients: [
      '1 orange',
      '1 lemon',
      '1 inch turmeric',
      '1 inch ginger'
    ],
    instructions: [
      'Juice all ingredients.',
      'Serve as a shot or dilute with water.'
    ],
    category: 'juice',
    tags: ['healthy', 'immunity', 'shot'],
    countryCode: 'INT'
  },
  {
    name: 'Simple Green Juice',
    description: 'Balanced green juice with tart apple to curb bitterness.',
    ingredients: [
      '4 kale leaves',
      '1 Granny Smith apple',
      '2 celery stalks',
      '1 cucumber'
    ],
    instructions: [
      'Juice all ingredients.',
      'Add honey if needed for sweetness.'
    ],
    category: 'juice',
    tags: ['healthy', 'green', 'simple'],
    countryCode: 'INT'
  },
  {
    name: 'Watermelon Juice',
    description: 'Hydrating watermelon juice with antioxidants.',
    ingredients: [
      '4 cups watermelon',
      '1 lime'
    ],
    instructions: [
      'Juice watermelon and lime.',
      'Blend if no juicer, then strain.'
    ],
    category: 'juice',
    tags: ['healthy', 'hydrating', 'summer'],
    countryCode: 'INT'
  },
  {
    name: 'Vitamin Boost Detox Juice',
    description: 'Citrus and greens for a palatable detox.',
    ingredients: [
      '2 carrots',
      '1 orange',
      '1 apple',
      '2 kale leaves',
      '1 handful spinach'
    ],
    instructions: [
      'Juice all ingredients.',
      'Peel lemon if using whole.'
    ],
    category: 'juice',
    tags: ['healthy', 'detox', 'vitamin'],
    countryCode: 'INT'
  },
  {
    name: 'Kiwi Agua Fresca',
    description: 'Gut-friendly kiwi juice diluted for refreshment.',
    ingredients: [
      '4 kiwis',
      '2 cups water',
      '1 lime'
    ],
    instructions: [
      'Juice kiwis and lime, dilute with water.',
      'Stir and chill.'
    ],
    category: 'juice',
    tags: ['healthy', 'gut', 'kiwi'],
    countryCode: 'INT'
  },
  {
    name: 'Super-Powered Orange Juice',
    description: 'Immune-supporting mix of root veggies and citrus.',
    ingredients: [
      '2 carrots',
      '2 oranges',
      '1 lemon',
      '1 nectarine',
      'handful mint'
    ],
    instructions: [
      'Juice all ingredients.',
      'Serve fresh.'
    ],
    category: 'juice',
    tags: ['healthy', 'immune', 'citrus'],
    countryCode: 'INT'
  },
  {
    name: 'Immune-Boosting Kickstart Juice',
    description: 'Tomato-based juice with greens and spices.',
    ingredients: [
      '2 tomatoes',
      '1 handful spinach',
      '1 handful parsley',
      '1 lemon',
      'pinch cayenne'
    ],
    instructions: [
      'Juice tomatoes, spinach, parsley, and lemon.',
      'Stir in cayenne.'
    ],
    category: 'juice',
    tags: ['healthy', 'kickstart', 'tomato'],
    countryCode: 'INT'
  },
  {
    name: 'Apple Carrot Beet Ginger Juice',
    description: 'Vitamin-rich juice with polyphenols.',
    ingredients: [
      '1 beet',
      '1 apple',
      '2 carrots',
      '1 inch ginger'
    ],
    instructions: [
      'Juice all ingredients.',
      'Add splash of apple juice if sweeter desired.'
    ],
    category: 'juice',
    tags: ['healthy', 'polyphenol', 'beet'],
    countryCode: 'INT'
  },
  {
    name: 'Carrot Pineapple Orange Juice',
    description: 'Tropical three-ingredient juice.',
    ingredients: [
      '3 carrots',
      '1/2 pineapple',
      '2 oranges'
    ],
    instructions: [
      'Juice all ingredients.',
      'Serve over crushed ice.'
    ],
    category: 'juice',
    tags: ['healthy', 'tropical', 'orange'],
    countryCode: 'INT'
  },
  {
    name: 'Sparkling Pomegranate Juice',
    description: 'Pomegranate juice spiked with soda for fizz.',
    ingredients: [
      '2 cups pomegranate arils',
      '1 lemon',
      'sparkling water'
    ],
    instructions: [
      'Juice pomegranate and lemon, top with sparkling water.'
    ],
    category: 'juice',
    tags: ['healthy', 'fizz', 'pomegranate'],
    countryCode: 'INT'
  },
  {
    name: '3-Ingredient Lemon Ginger Water',
    description: 'Nourishing digestive drink, hot or cold.',
    ingredients: [
      '1 lemon',
      '1 inch ginger',
      '2 cups water'
    ],
    instructions: [
      'Juice lemon and ginger, dilute with water.',
      'Add cayenne for heat.'
    ],
    category: 'juice',
    tags: ['healthy', 'digestive', 'lemon'],
    countryCode: 'INT'
  },
  {
    name: 'Pink Drink Juice',
    description: 'Berry and citrus blend for a caffeine-free pink refreshment.',
    ingredients: [
      '1 cup strawberries',
      '1 orange',
      '1 handful spinach',
      'coconut water'
    ],
    instructions: [
      'Juice strawberries, orange, and spinach.',
      'Dilute with coconut water.'
    ],
    category: 'juice',
    tags: ['healthy', 'pink', 'berry'],
    countryCode: 'INT'
  },
  {
    name: 'Jamu Indonesian Turmeric Ginger Drink',
    description: 'Vitamin C-rich Indonesian specialty, versatile hot or cold.',
    ingredients: [
      '1 inch turmeric',
      '1 inch ginger',
      '1 lemon',
      '1 tsp honey'
    ],
    instructions: [
      'Juice turmeric, ginger, and lemon.',
      'Stir in honey.'
    ],
    category: 'juice',
    tags: ['healthy', 'indonesian', 'turmeric'],
    countryCode: 'INT'
  }
];

// Curated Healthy Milkshakes (20+ Professional Recipes, No Ice Cream)
const healthyMilkshakes = [
  {
    name: 'Healthy Chocolate Milkshake (Under 50 Calories)',
    description: 'Thick, creamy low-calorie chocolate milkshake using wholesome ingredients.',
    ingredients: [
      '1 1/2 cups unsweetened almond milk',
      '3 tablespoons unsweetened cocoa powder',
      '2 tablespoons granulated sweetener (allulose)',
      '1/2 cup ice cubes'
    ],
    instructions: [
      'Add all ingredients to a high-speed blender.',
      'Blend until thick and creamy.',
      'Pour into glasses and serve immediately.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'low-calorie', 'chocolate', 'dairy-free'],
    countryCode: 'INT'
  },
  {
    name: 'Healthy Strawberry Milkshake',
    description: 'Naturally sweetened strawberry milkshake with frozen berries for creaminess.',
    ingredients: [
      '1 1/2 cups unsweetened almond milk',
      '2 tablespoons granulated sweetener (allulose)',
      '1/2 cup frozen strawberries'
    ],
    instructions: [
      'Add all ingredients to a high-speed blender.',
      'Blend until thick and creamy.',
      'Pour into glasses and serve immediately.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'strawberry', 'dairy-free'],
    countryCode: 'INT'
  },
  {
    name: 'Healthy Vanilla Milkshake',
    description: 'Classic vanilla flavor with natural extract for a smooth treat.',
    ingredients: [
      '1 1/2 cups unsweetened vanilla almond milk',
      '2 tablespoons granulated sweetener (allulose)',
      '1/2 teaspoon vanilla extract',
      '1/2 cup ice cubes'
    ],
    instructions: [
      'Add all ingredients to a high-speed blender.',
      'Blend until thick and creamy.',
      'Pour into glasses and serve immediately.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'vanilla', 'dairy-free'],
    countryCode: 'INT'
  },
  {
    name: 'Banana Milkshake',
    description: 'Creamy banana milkshake using frozen bananas for natural sweetness.',
    ingredients: [
      '1 1/2 cups unsweetened almond milk',
      '2 tablespoons granulated sweetener (allulose)',
      '1-2 frozen bananas',
      'Dash of cinnamon'
    ],
    instructions: [
      'Add all ingredients to a high-speed blender.',
      'Blend until thick and creamy.',
      'Pour into glasses and serve immediately.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'banana', 'dairy-free'],
    countryCode: 'INT'
  },
  {
    name: 'Oreo Milkshake (Healthy Twist)',
    description: 'Indulgent Oreo flavor with low-calorie cookies.',
    ingredients: [
      '1 1/2 cups unsweetened almond milk',
      '2 tablespoons granulated sweetener (allulose)',
      '2 low-sugar Oreo cookies',
      '1/2 cup ice cubes'
    ],
    instructions: [
      'Add all ingredients to a high-speed blender.',
      'Blend until thick and creamy.',
      'Pour into glasses and serve immediately.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'oreo', 'dairy-free'],
    countryCode: 'INT'
  },
  {
    name: 'Avocado Chocolate Milkshake',
    description: 'Silky avocado adds creaminess to this chocolate delight.',
    ingredients: [
      '1 1/2 cups unsweetened almond milk',
      '3 tablespoons unsweetened cocoa powder',
      '2 tablespoons granulated sweetener (allulose)',
      '1/2 large avocado',
      '1/2 cup ice cubes'
    ],
    instructions: [
      'Add all ingredients to a high-speed blender.',
      'Blend until thick and creamy.',
      'Pour into glasses and serve immediately.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'avocado', 'chocolate'],
    countryCode: 'INT'
  },
  {
    name: 'Peanut Butter Milkshake',
    description: 'Nutty peanut butter blended with chocolate for protein boost.',
    ingredients: [
      '1 1/2 cups unsweetened almond milk',
      '3 tablespoons unsweetened cocoa powder',
      '2 tablespoons granulated sweetener (allulose)',
      '2 tablespoons peanut butter',
      '1/2 cup ice cubes'
    ],
    instructions: [
      'Add all ingredients to a high-speed blender.',
      'Blend until thick and creamy.',
      'Pour into glasses and serve immediately.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'peanut-butter', 'protein'],
    countryCode: 'INT'
  },
  {
    name: 'Triple Berry Milkshake',
    description: 'Antioxidant-rich berry blend for a vibrant shake.',
    ingredients: [
      '1 1/2 cups unsweetened almond milk',
      '2 tablespoons granulated sweetener (allulose)',
      '1/2 cup mixed frozen berries (strawberries, blueberries, raspberries)'
    ],
    instructions: [
      'Add all ingredients to a high-speed blender.',
      'Blend until thick and creamy.',
      'Pour into glasses and serve immediately.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'berry', 'antioxidant'],
    countryCode: 'INT'
  },
  {
    name: '4-Ingredient Chocolate Milkshake (No Banana)',
    description: 'Simple dairy-free chocolate shake with minimal ingredients.',
    ingredients: [
      '1 cup ice cubes',
      '1/2 cup unsweetened almond milk',
      '1-2 tablespoons maple syrup',
      '2 tablespoons unsweetened cocoa powder'
    ],
    instructions: [
      'Add all ingredients to a blender.',
      'Blend until smooth.',
      'Pour into a glass and enjoy.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'chocolate', 'no-banana'],
    countryCode: 'INT'
  },
  {
    name: 'Vanilla Milkshake Variation',
    description: 'Creamy vanilla shake with optional yogurt for richness.',
    ingredients: [
      '1 cup ice cubes',
      '1/2 cup unsweetened almond milk',
      '1-2 tablespoons maple syrup',
      '1 teaspoon vanilla extract',
      '1-2 tablespoons Greek yogurt (optional)'
    ],
    instructions: [
      'Add all ingredients to a blender.',
      'Blend until smooth.',
      'Pour into a glass and enjoy.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'vanilla', 'creamy'],
    countryCode: 'INT'
  },
  {
    name: 'Strawberry Milkshake Variation',
    description: 'Bright strawberry shake with lemon for zing.',
    ingredients: [
      '1 cup ice cubes',
      '1/2 cup unsweetened almond milk',
      '1-2 tablespoons maple syrup',
      '1/2 cup frozen strawberries',
      'Squeeze of lemon (optional)'
    ],
    instructions: [
      'Add all ingredients to a blender.',
      'Blend until smooth.',
      'Pour into a glass and enjoy.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'strawberry', 'zesty'],
    countryCode: 'INT'
  },
  {
    name: 'Vanilla Milkshakes without Ice Cream',
    description: 'Quick vanilla milkshake using ice for chill.',
    ingredients: [
      '12 ice cubes',
      '2 cups milk',
      '¾ cup white sugar',
      '1 dash vanilla extract'
    ],
    instructions: [
      'Place all ingredients in a blender.',
      'Blend until smooth.',
      'Pour into glasses and serve.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'vanilla', 'quick'],
    countryCode: 'INT'
  },
  {
    name: 'Basic Milkshake',
    description: 'Simple no-ice-cream milkshake base, customizable.',
    ingredients: [
      '10 ice cubes',
      '2 cups milk',
      '3/4 cup granulated sugar or 2 tbsp honey',
      'Dash vanilla extract'
    ],
    instructions: [
      'Combine all in blender.',
      'Blend until smooth.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'basic', 'customizable'],
    countryCode: 'INT'
  },
  {
    name: 'Chocolate Milkshake (No Ice Cream)',
    description: 'Cocoa-enhanced basic milkshake for chocolate lovers.',
    ingredients: [
      '10 ice cubes',
      '2 cups milk',
      '3/4 cup granulated sugar or 2 tbsp honey',
      '2 tablespoons cocoa powder'
    ],
    instructions: [
      'Combine all in blender.',
      'Blend until smooth.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'chocolate', 'simple'],
    countryCode: 'INT'
  },
  {
    name: 'Frozen Banana Nice Cream Milkshake',
    description: 'Creamy banana-based shake for natural sweetness.',
    ingredients: [
      '2 frozen bananas',
      '2 cups milk',
      '3/4 cup granulated sugar or 2 tbsp honey'
    ],
    instructions: [
      'Combine all in blender.',
      'Blend until smooth.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'banana', 'nice-cream'],
    countryCode: 'INT'
  },
  {
    name: 'Frozen Fruit Milkshake',
    description: 'Versatile berry or mixed fruit shake.',
    ingredients: [
      '2 cups frozen fruit (berries)',
      '2 cups milk',
      '3/4 cup granulated sugar or 2 tbsp honey'
    ],
    instructions: [
      'Combine all in blender.',
      'Blend until smooth.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'fruit', 'frozen'],
    countryCode: 'INT'
  },
  {
    name: 'Avocado Milkshake',
    description: 'Silky smooth avocado for satisfying creaminess.',
    ingredients: [
      '5 ice cubes',
      '2 cups milk',
      '1 peeled and cubed avocado',
      '2 tablespoons honey'
    ],
    instructions: [
      'Combine all in blender.',
      'Blend until smooth.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'avocado', 'silky'],
    countryCode: 'INT'
  },
  {
    name: 'Greek Yogurt Milkshake',
    description: 'Tangy yogurt shake with optional fruit or cocoa.',
    ingredients: [
      '10 ice cubes',
      '1 cup Greek yogurt',
      '1 cup milk',
      '2 tablespoons honey'
    ],
    instructions: [
      'Combine all in blender.',
      'Blend until smooth.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'yogurt', 'tangy'],
    countryCode: 'INT'
  },
  {
    name: 'Sorbet Slushie Milkshake',
    description: 'Dairy-free sorbet-based refreshing slushie.',
    ingredients: [
      '2 scoops sorbet (fruit flavor)',
      '1/2 cup sparkling water'
    ],
    instructions: [
      'Combine in blender.',
      'Blend until smooth.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'dairy-free', 'slushie'],
    countryCode: 'INT'
  },
  {
    name: 'Strawberry Milkshake Without Ice Cream or Milk',
    description: 'Vegan strawberry shake using banana for thickness.',
    ingredients: [
      '2 cups frozen strawberries',
      '1 cup frozen bananas',
      '½ cup coconut water',
      '1 teaspoon lime juice',
      '1 teaspoon vanilla extract'
    ],
    instructions: [
      'Add all to blender.',
      'Blend until combined.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'vegan', 'strawberry'],
    countryCode: 'INT'
  },
  {
    name: 'Banana Milkshake Without Ice Cream',
    description: 'Sweet and creamy banana shake with pantry staples.',
    ingredients: [
      '1 frozen banana',
      '1 cup ice cubes',
      '1 cup milk',
      '1 tablespoon granulated sugar',
      '1 teaspoon vanilla extract',
      'Pinch cinnamon'
    ],
    instructions: [
      'Combine all in blender.',
      'Blend until frosty.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'banana', 'pantry'],
    countryCode: 'INT'
  },
  {
    name: 'Strawberry Milkshake without Ice Cream',
    description: 'Delicious strawberry shake with heavy cream base.',
    ingredients: [
      '1 3/4 cup frozen strawberries',
      '1/2 cup heavy cream',
      '1/2 cup whole milk',
      '1/4 teaspoon vanilla extract',
      'Pinch salt',
      '1-2 tablespoons strawberry jam'
    ],
    instructions: [
      'Blend all until smooth.',
      'Serve in tall glass.'
    ],
    category: 'milkshake',
    tags: ['healthy', 'strawberry', 'cream'],
    countryCode: 'INT'
  }
];

// Utility Functions
async function safeFetch(url, retries = 3) {  // Reduced retries to 3 to speed up
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      // Removed console.warn to clear logs; silently fail and retry
      if (i === retries) return null;
      // Exponential backoff with cap
      const delay = Math.min(1000 * Math.pow(2, i), 5000);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  return null;
}

function mapMealDB(meal, category = 'main', countryCode = 'INT', extraTags = []) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${meas?.trim() || ''} ${ing.trim()}`.trim());
    }
  }
  const instructions = meal.strInstructions
    ? meal.strInstructions.split('.').map(s => s.trim()).filter(Boolean)
    : [];

  // Filter out empty arrays
  const filteredIngredients = ingredients.filter(Boolean);
  const filteredInstructions = instructions.filter(Boolean);

  return {
    name: meal.strMeal,
    description: meal.strArea ? `${meal.strArea} cuisine` : 'Professional recipe from TheMealDB',
    ingredients: filteredIngredients.length ? filteredIngredients : ['No ingredients listed.'],
    instructions: filteredInstructions.length ? filteredInstructions : ['No instructions available.'],
    category,
    tags: [...['mealdb', 'professional'], ...extraTags],
    countryCode
  };
}

function mapDrinkDB(drink, category = 'beverage', countryCode = 'INT') {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ing = drink[`strIngredient${i}`];
    const meas = drink[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${meas?.trim() || ''} ${ing.trim()}`.trim());
    }
  }
  const instructions = drink.strInstructions
    ? drink.strInstructions.split('.').map(s => s.trim()).filter(Boolean)
    : [];

  // Filter out empty arrays
  const filteredIngredients = ingredients.filter(Boolean);
  const filteredInstructions = instructions.filter(Boolean);

  return {
    name: drink.strDrink,
    description: 'Professional non-alcoholic beverage from TheCocktailDB',
    ingredients: filteredIngredients.length ? filteredIngredients : ['No ingredients listed.'],
    instructions: filteredInstructions.length ? filteredInstructions : ['No instructions available.'],
    category,
    tags: ['cocktaildb', 'non-alcoholic', 'professional', category],
    countryCode
  };
}

// Fetch Functions
async function fetchIndianRecipes() {
  console.log('🇮🇳 Fetching professional Indian recipes...');
  const recipes = [];
  const indianList = await safeFetch(`${MEALDB_BASE}/filter.php?a=Indian`);
  if (indianList?.meals) {
    for (const meal of indianList.meals.slice(0, 20)) {  // Limit to 20 to avoid overload
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'main', 'IN');
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchVegetarianRecipes() {
  console.log('🥬 Fetching professional vegetarian recipes...');
  const recipes = [];
  const vegList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Vegetarian`);
  if (vegList?.meals) {
    for (const meal of vegList.meals.slice(0, 20)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'vegetarian', 'INT');
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchJuices() {
  console.log('🍹 Fetching professional juices...');
  const recipes = [];
  // Reverted to search.php; even if null, hardcoded will fill
  const juiceList = await safeFetch(`${COCKTAILDB_BASE}/search.php?s=juice`);
  if (juiceList?.drinks) {
    for (const drink of juiceList.drinks.slice(0, 10)) {
      const recipe = mapDrinkDB(drink, 'juice', 'INT');
      if (recipe) recipes.push(recipe);
    }
  }
  return recipes;
}

async function fetchMilkshakes() {
  console.log('🥤 Fetching professional milkshakes...');
  const recipes = [];
  const milkshakeList = await safeFetch(`${COCKTAILDB_BASE}/search.php?s=milkshake`);
  if (milkshakeList?.drinks) {
    for (const drink of milkshakeList.drinks.slice(0, 10)) {
      const recipe = mapDrinkDB(drink, 'milkshake', 'INT');
      if (recipe) recipes.push(recipe);
    }
  }
  return recipes;
}

async function fetchTeas() {
  console.log('🍵 Fetching professional teas...');
  const recipes = [];
  const teaList = await safeFetch(`${COCKTAILDB_BASE}/search.php?s=tea`);
  if (teaList?.drinks) {
    // Filter for non-alcoholic teas if possible
    const nonAlcoholicTeas = teaList.drinks.filter(d => d.strAlcoholic === 'Non alcoholic').slice(0, 10);
    for (const drink of nonAlcoholicTeas) {
      const recipe = mapDrinkDB(drink, 'tea', 'INT');
      if (recipe) recipes.push(recipe);
    }
  }
  return recipes;
}

async function fetchCoffees() {
  console.log('☕ Fetching professional coffees...');
  const recipes = [];
  const coffeeList = await safeFetch(`${COCKTAILDB_BASE}/search.php?s=coffee`);
  if (coffeeList?.drinks) {
    // Filter for non-alcoholic coffees
    const nonAlcoholicCoffees = coffeeList.drinks.filter(d => d.strAlcoholic === 'Non alcoholic').slice(0, 10);
    for (const drink of nonAlcoholicCoffees) {
      const recipe = mapDrinkDB(drink, 'coffee', 'INT');
      if (recipe) recipes.push(recipe);
    }
  }
  return recipes;
}

async function fetchDesserts() {
  console.log('🍰 Fetching professional desserts...');
  const recipes = [];
  const dessertList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Dessert`);
  if (dessertList?.meals) {
    for (const meal of dessertList.meals.slice(0, 20)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'dessert', 'INT');
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchCakes() {
  console.log('🎂 Fetching professional cakes...');
  const recipes = [];
  const cakeList = await safeFetch(`${MEALDB_BASE}/search.php?s=cake`);
  if (cakeList?.meals) {
    for (const basic of cakeList.meals.slice(0, 10)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${basic.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'dessert', 'INT', ['cake']);
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchAppetizers() {
  console.log('🍢 Fetching professional appetizers...');
  const recipes = [];

  const starterList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Starter`);
  if (starterList?.meals) {
    for (const meal of starterList.meals.slice(0, 10)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'appetizer', 'INT');
        if (recipe) recipes.push(recipe);
      }
    }
  }

  const sideList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Side`);
  if (sideList?.meals) {
    for (const meal of sideList.meals.slice(0, 10)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'appetizer', 'INT');
        if (recipe) recipes.push(recipe);
      }
    }
  }

  return recipes;
}

async function fetchChickenRecipes() {
  console.log('🍗 Fetching professional chicken recipes...');
  const recipes = [];
  const chickenList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Chicken`);
  if (chickenList?.meals) {
    for (const meal of chickenList.meals.slice(0, 20)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'main', 'INT', ['non-veg', 'chicken']);
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchLambRecipes() {
  console.log('🐑 Fetching professional lamb recipes...');
  const recipes = [];
  const lambList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Lamb`);
  if (lambList?.meals) {
    for (const meal of lambList.meals.slice(0, 20)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'main', 'INT', ['non-veg', 'lamb']);
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchGoatRecipes() {
  console.log('🐐 Fetching professional goat recipes...');
  const recipes = [];
  const goatList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Goat`);
  if (goatList?.meals) {
    for (const meal of goatList.meals.slice(0, 20)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'main', 'INT', ['non-veg', 'goat']);
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchSeafoodRecipes() {
  console.log('🦐 Fetching professional seafood recipes...');
  const recipes = [];
  const seafoodList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Seafood`);
  if (seafoodList?.meals) {
    for (const meal of seafoodList.meals.slice(0, 20)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const recipe = mapMealDB(details.meals[0], 'main', 'INT', ['non-veg', 'seafood']);
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchMiscellaneousRecipes() {
  console.log('🔀 Fetching professional miscellaneous recipes...');
  const recipes = [];
  const miscList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Miscellaneous`);
  if (miscList?.meals) {
    for (const meal of miscList.meals.slice(0, 20)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const extraTags = meal.strMeal.toLowerCase().includes('chicken') || meal.strMeal.toLowerCase().includes('lamb') || meal.strMeal.toLowerCase().includes('fish') ? ['non-veg'] : [];
        const recipe = mapMealDB(details.meals[0], 'main', 'INT', extraTags);
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

async function fetchPastaRecipes() {
  console.log('🍝 Fetching professional pasta recipes...');
  const recipes = [];
  const pastaList = await safeFetch(`${MEALDB_BASE}/filter.php?c=Pasta`);
  if (pastaList?.meals) {
    for (const meal of pastaList.meals.slice(0, 20)) {
      const details = await safeFetch(`${MEALDB_BASE}/lookup.php?i=${meal.idMeal}`);
      if (details?.meals?.length) {
        const extraTags = meal.strMeal.toLowerCase().includes('chicken') || meal.strMeal.toLowerCase().includes('shrimp') ? ['non-veg'] : [];
        const recipe = mapMealDB(details.meals[0], 'main', 'INT', extraTags);
        if (recipe) recipes.push(recipe);
      }
    }
  }
  return recipes;
}

// Main Seeder Function
async function runSeeder() {
  let connection;
  try {
    connection = await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB: ${MONGO_URI}`);

    // Clear existing data
    await Recipe.deleteMany({});
    await Country.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Seed countries
    await Country.insertMany(countries);
    console.log('🌍 Inserted countries');

    // Fetch API recipes (with small delays between fetches to avoid rate limits)
    const indian = await fetchIndianRecipes();
    await new Promise(r => setTimeout(r, 500));
    const vegetarian = await fetchVegetarianRecipes();
    await new Promise(r => setTimeout(r, 500));
    const juices = await fetchJuices();
    await new Promise(r => setTimeout(r, 500));
    const milkshakes = await fetchMilkshakes();
    await new Promise(r => setTimeout(r, 500));
    const teas = await fetchTeas();
    await new Promise(r => setTimeout(r, 500));
    const coffees = await fetchCoffees();
    await new Promise(r => setTimeout(r, 500));
    const desserts = await fetchDesserts();
    await new Promise(r => setTimeout(r, 500));
    const apiCakes = await fetchCakes();
    await new Promise(r => setTimeout(r, 500));
    const appetizers = await fetchAppetizers();
    await new Promise(r => setTimeout(r, 500));
    const chicken = await fetchChickenRecipes();
    await new Promise(r => setTimeout(r, 500));
    const lamb = await fetchLambRecipes();
    await new Promise(r => setTimeout(r, 500));
    const goat = await fetchGoatRecipes();
    await new Promise(r => setTimeout(r, 500));
    const seafood = await fetchSeafoodRecipes();
    await new Promise(r => setTimeout(r, 500));
    const miscellaneous = await fetchMiscellaneousRecipes();
    await new Promise(r => setTimeout(r, 500));
    const pasta = await fetchPastaRecipes();

    // Combine all - Separate arrays for juices, milkshakes, desserts
    let allRecipes = [
      ...indian,
      ...vegetarian,
      ...juices,
      ...healthyJuices,  // Dedicated juice array - mandatory
      ...milkshakes,
      ...healthyMilkshakes,  // Dedicated milkshake array - mandatory
      ...teas,
      ...coffees,
      ...desserts,
      ...apiCakes,
      ...appetizers,
      ...chicken,
      ...lamb,
      ...goat,
      ...seafood,
      ...miscellaneous,
      ...pasta
    ];

    // Deduplicate by name (case-insensitive) to avoid overlaps between API fetches and hardcoded
    allRecipes = allRecipes.filter((recipe, index, self) =>
      index === self.findIndex(r => r.name.toLowerCase() === recipe.name.toLowerCase())
    );

    // Log collection summary
    console.log(`📦 Collected unique recipes:
      - Indian: ${indian.length}
      - Vegetarian: ${vegetarian.length}
      - Juices (API + Curated): ${juices.length + healthyJuices.length}
      - Milkshakes (API + Curated): ${milkshakes.length + healthyMilkshakes.length}
      - Teas: ${teas.length}
      - Coffees: ${coffees.length}
      - Desserts: ${desserts.length}
      - Cakes (API): ${apiCakes.length}
      - Appetizers: ${appetizers.length}
      - Chicken: ${chicken.length}
      - Lamb: ${lamb.length}
      - Goat: ${goat.length}
      - Seafood: ${seafood.length}
      - Miscellaneous: ${miscellaneous.length}
      - Pasta: ${pasta.length}
      - Total Unique: ${allRecipes.length}
    `);

    // Insert recipes
    await Recipe.insertMany(allRecipes);
    console.log(`✅ Inserted ${allRecipes.length} unique professional recipes`);

    await mongoose.disconnect();
    console.log('🌿 Seeding complete. Database ready for use.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    if (connection) await mongoose.disconnect();
    process.exit(1);
  }
}

runSeeder();