import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    quantity: { type: Number, default: 1 },
    price:    Number,
    image:    String,
  }],
  shippingAddress: {
    address: String, city: String, postalCode: String, country: String,
  },
  paymentMethod: { type: String, default: 'Card' },
  totalPrice:    { type: Number, required: true },
  isPaid:        { type: Boolean, default: false },
  paidAt:        Date,
  isDelivered:   { type: Boolean, default: false },
  deliveredAt:   Date,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);