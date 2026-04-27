import Order from '../models/Order.js';
import Interaction from '../models/Interaction.js';

// @POST /api/orders
export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice } = req.body;
  if (!items || items.length === 0)
    return res.status(400).json({ message: 'No order items' });

  const order = await Order.create({
    user: req.user._id, items, shippingAddress, paymentMethod, totalPrice,
  });

  // Track purchase interactions for ML
  const interactions = items.map((item) => ({
    updateOne: {
      filter: { user: req.user._id, product: item.product, type: 'purchase' },
      update: { $set: { createdAt: new Date() } },
      upsert: true,
    },
  }));
  await Interaction.bulkWrite(interactions);

  res.status(201).json(order);
};

// @GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @GET /api/orders/:id
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
};

// @PUT /api/orders/:id/pay
export const updateOrderToPaid = async (req, res) => {
  const order   = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isPaid  = true;
  order.paidAt  = new Date();
  order.status  = 'processing';
  await order.save();
  res.json(order);
};

// @GET /api/orders (admin) — with pagination
export const getAllOrders = async (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 15;
  const skip  = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
  ]);

  res.json({ orders, page, pages: Math.ceil(total / limit), total });
};

// @PUT /api/orders/:id/status (admin)
export const updateOrderStatus = async (req, res) => {
  const order  = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status;
  if (req.body.status === 'delivered') {
    order.isDelivered  = true;
    order.deliveredAt  = new Date();
  }
  await order.save();
  res.json(order);
};

// @GET /api/orders/admin/stats (admin)
export const getAdminStats = async (req, res) => {
  const [totalOrders, totalRevenue, pendingOrders, users] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.countDocuments({ status: 'pending' }),
    (await import('../models/User.js')).default.countDocuments(),
  ]);

  const revenueByMonth = await Order.aggregate([
    { $group: {
      _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
      revenue: { $sum: '$totalPrice' }, count: { $sum: 1 },
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  res.json({
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    pendingOrders,
    totalUsers: users,
    revenueByMonth,
  });
};