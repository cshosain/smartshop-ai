import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  brand:       { type: String, default: '' },
  images:      [{ type: String }],
  stock:       { type: Number, default: 0 },
  ratings:     { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  tags:        [{ type: String }],
  isFeatured:  { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);