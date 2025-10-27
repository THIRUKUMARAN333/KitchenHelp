import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  cookingTime: { type: Number, default: 30 },
  servings: { type: Number, default: 4 },
  category: { type: String, default: 'main' },
  countryCode: { type: String, index: true }, // e.g., 'IN', 'IT'
  country: { type: String, default: '' },
  ingredients: [{ type: String }],
  instructions: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Recipe', RecipeSchema);
