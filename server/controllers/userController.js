import User from '../models/User.js';
import Interaction from '../models/Interaction.js';
import axios from 'axios';

// @GET /api/users/profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name price images ratings');
  res.json(user);
};

// @PUT /api/users/profile
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name   = req.body.name   || user.name;
  user.avatar = req.body.avatar || user.avatar;
  if (req.body.password) user.password = req.body.password;
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

// @POST /api/users/wishlist/:productId
export const toggleWishlist = async (req, res) => {
  const user      = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index     = user.wishlist.indexOf(productId);

  if (index === -1) {
    user.wishlist.push(productId);
    await Interaction.findOneAndUpdate(
      { user: user._id, product: productId, type: 'wishlist' },
      { $set: { createdAt: new Date() } },
      { upsert: true }
    );
  } else {
    user.wishlist.splice(index, 1);
  }

  await user.save();
  res.json({ wishlist: user.wishlist });
};

// @GET /api/users/recommendations
export const getRecommendations = async (req, res) => {
  try {
    // Limit top_n to 30 to prevent abuse
    const topN = parseInt(req.query.top_n) > 30 ? 30 : parseInt(req.query.top_n) || 8;
    const { data } = await axios.get(
      `${process.env.ML_SERVICE_URL}/recommend/user/${req.user._id}/?top_n=${topN}`
    );
    const Product  = (await import('../models/Product.js')).default;
    const products = await Product.find({ _id: { $in: data.product_ids } });
    console.log(data.has_history);
    res.json(products);
  } catch {
    // Fallback: return featured products
    const Product  = (await import('../models/Product.js')).default;
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  }
};

// @GET /api/users  (admin)
export const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// @DELETE /api/users/:id  (admin)
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};