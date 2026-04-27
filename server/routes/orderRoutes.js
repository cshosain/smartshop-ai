import express from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  updateOrderToPaid, getAllOrders, updateOrderStatus, getAdminStats,
} from '../controllers/orderController.js';
import { protect, adminOnly, customerOnly } from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.post('/',               protect, customerOnly,               createOrder);
router.get('/myorders',        protect, customerOnly,             getMyOrders);
router.get('/admin/stats',     protect, adminOnly,    getAdminStats);
router.get('/:id',             validateObjectId('id'), protect,              getOrderById);
router.put('/:id/pay',         validateObjectId('id'), protect, customerOnly,              updateOrderToPaid);
router.get('/',                protect, adminOnly,    getAllOrders);
router.put('/:id/status',      validateObjectId('id'), protect, adminOnly,   updateOrderStatus);

export default router;