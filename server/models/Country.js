import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Country', CountrySchema);
