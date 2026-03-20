// Tracks user behavior — critical for ML recommendations
import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type:        { type: String, enum: ['view', 'cart', 'purchase', 'wishlist', 'review'], required: true },
  rating:      { type: Number, min: 1, max: 5 }, // only for 'review' type
  createdAt:   { type: Date, default: Date.now },
});

interactionSchema.index({ user: 1, product: 1 });

export default mongoose.model('Interaction', interactionSchema);