import Product from '../models/Product.js';
import Interaction from '../models/Interaction.js';
import axios from 'axios';

// @GET /api/products
export const getProducts = async (req, res) => {
  const page     = Number(req.query.page)  || 1;
  const limit    = Number(req.query.limit) || 12;
  const skip     = (page - 1) * limit;
  const keyword  = req.query.keyword || '';
  const category = req.query.category || '';
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || 999999;
  const sortBy   = req.query.sortBy   || 'createdAt';
  const order    = req.query.order    || 'desc';

  const filter = {
    price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    ...(keyword  && { $text: { $search: keyword } }),
    ...(category && { category }),
  };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ products, page, pages: Math.ceil(total / limit), total });
};

// @GET /api/products/:id
export const getProductById = async (req, res) => {
  // // Handle irrelevent value as params.id, e.g. dfjdfdffidfifi, which would cause Mongoose to throw CastError
  // if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
  //   return res.status(404).json({ message: 'Product not found' });
  // }
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Track view interaction if user is logged in
  if (req.user) {
    await Interaction.findOneAndUpdate(
      { user: req.user._id, product: product._id, type: 'view' },
      { $set: { createdAt: new Date() } },
      { upsert: true, new: true }
    );
  }

  res.json(product);
};

// @GET /api/products/categories/all
export const getCategories = async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
};

// @POST /api/products (admin)
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// @PUT /api/products/:id (admin)
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @DELETE /api/products/:id (admin)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
};

// @GET /api/products/:id/similar  (calls ML service)
export const getSimilarProducts = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${process.env.ML_SERVICE_URL}/recommend/similar/${req.params.id}`
    );
    const products = await Product.find({ _id: { $in: data.product_ids } });
    res.json(products);
  } catch {
    // Fallback: return same category products
    const product  = await Product.findById(req.params.id);
    const fallback = await Product.find({
      category: product?.category,
      _id: { $ne: req.params.id },
    }).limit(6);
    res.json(fallback);
  }
};

// @POST /api/products/:id/reviews
export const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Get sentiment from ML service
  let sentiment = 'neutral', sentimentScore = 0;
  try {
    const { data } = await axios.post(
      `${process.env.ML_SERVICE_URL}/sentiment/analyze`,
      { text: comment }
    );
    sentiment      = data.sentiment;
    sentimentScore = data.score;
  } catch { /* ML service not ready yet — skip */ }

  const Review = (await import('../models/Review.js')).default;
  const review = await Review.create({
    user: req.user._id, product: product._id,
    rating, comment, sentiment, sentimentScore,
  });

  // Update product rating
  const allReviews = await Review.find({ product: product._id });
  product.numReviews = allReviews.length;
  product.ratings    = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length;
  await product.save();

  // Track interaction
  await Interaction.findOneAndUpdate(
    { user: req.user._id, product: product._id, type: 'review' },
    { rating },
    { upsert: true, new: true }
  );

  res.status(201).json(review);
};

// @GET /api/products/:id/reviews
export const getProductReviews = async (req, res) => {
  // // Handle irrelevent value as params.id, e.g. dfjdfdffidfifi, which would cause Mongoose to throw CastError
  // if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
  //   return res.status(404).json({ message: 'Product not found' });
  // }
  const Review   = (await import('../models/Review.js')).default;
  const reviews  = await Review.find({ product: req.params.id }).populate('user', 'name avatar');
  res.json(reviews);
};